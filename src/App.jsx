import { useState, useCallback, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Login from './components/Login'
import InvoiceList from './components/InvoiceList'
import InvoiceForm from './components/InvoiceForm'
import InvoiceView from './components/InvoiceView'
import ProfileSettings from './components/ProfileSettings'
import Registrations from './components/Registrations'
import QuickStart from './components/QuickStart'

const defaultProfile = {
  name: '', abn: '', email: '', phone: '',
  bsb: '', accountNumber: '', accountName: '', bankName: '',
}

const mapTemplate = (t) => ({ id: t.id, description: t.description, rate: t.rate, hasDate: t.has_date })

export default function App() {
  const [session, setSession] = useState(undefined) // undefined = loading
  const [tab, setTab] = useState('invoices')
  const [invoices, setInvoices] = useState([])
  const [profile, setProfile] = useState(defaultProfile)
  const [clients, setClients] = useState([])
  const [itemTemplates, setItemTemplates] = useState([])
  const [view, setView] = useState(null)
  const [toast, setToast] = useState(null)
  const [loadingData, setLoadingData] = useState(false)

  // Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  // Load data when logged in
  useEffect(() => {
    if (session) fetchAll()
  }, [session])

  const fetchAll = async () => {
    setLoadingData(true)
    const [{ data: invData }, { data: profData }, { data: clientsData }, { data: templatesData }] = await Promise.all([
      supabase.from('invoices').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').single(),
      supabase.from('clients').select('*').order('name'),
      supabase.from('item_templates').select('*').order('created_at'),
    ])
    if (invData) setInvoices(invData)
    if (profData) {
      setProfile({
        ...defaultProfile,
        name: profData.name || '',
        abn: profData.abn || '',
        email: profData.email || '',
        phone: profData.phone || '',
        bsb: profData.bsb || '',
        accountNumber: profData.account_number || '',
        accountName: profData.account_name || '',
        bankName: profData.bank_name || '',
      })
    }
    if (clientsData) setClients(clientsData)
    if (templatesData) setItemTemplates(templatesData.map(mapTemplate))
    setLoadingData(false)
  }

  const showToast = useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }, [])

  const saveProfile = async (p) => {
    const { error } = await supabase.from('profiles').upsert({
      id: session.user.id,
      name: p.name, abn: p.abn, email: p.email, phone: p.phone,
      bsb: p.bsb, account_number: p.accountNumber,
      account_name: p.accountName, bank_name: p.bankName,
    })
    if (!error) { setProfile(p); showToast('Perfil salvo!') }
  }

  // Clients CRUD
  const saveClient = async (client) => {
    const payload = { user_id: session.user.id, name: client.name, address: client.address || null, email: client.email || null }
    if (client.id) {
      const { error } = await supabase.from('clients').update(payload).eq('id', client.id)
      if (!error) {
        setClients(prev => prev.map(c => c.id === client.id ? { ...c, ...payload } : c).sort((a, b) => a.name.localeCompare(b.name)))
        showToast('Cliente atualizado!')
      }
    } else {
      const { data, error } = await supabase.from('clients').insert(payload).select().single()
      if (!error) {
        setClients(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
        showToast('Cliente salvo!')
      }
    }
  }

  const deleteClient = async (id) => {
    const { error } = await supabase.from('clients').delete().eq('id', id)
    if (!error) {
      setClients(prev => prev.filter(c => c.id !== id))
      showToast('Cliente removido')
    }
  }

  const ensureClientSaved = async (invoice) => {
    const name = invoice.clientName?.trim()
    if (!name) return
    const exists = clients.some(c => c.name.trim().toLowerCase() === name.toLowerCase())
    if (exists) return
    const payload = { user_id: session.user.id, name, address: invoice.clientAddress || null, email: invoice.clientEmail || null }
    const { data, error } = await supabase.from('clients').insert(payload).select().single()
    if (!error && data) setClients(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
  }

  // Item templates CRUD
  const saveItemTemplate = async (tpl) => {
    const payload = { user_id: session.user.id, description: tpl.description, rate: tpl.rate || null, has_date: !!tpl.hasDate }
    if (tpl.id) {
      const { error } = await supabase.from('item_templates').update(payload).eq('id', tpl.id)
      if (!error) {
        setItemTemplates(prev => prev.map(t => t.id === tpl.id ? mapTemplate({ id: tpl.id, ...payload }) : t))
        showToast('Item atualizado!')
      }
    } else {
      const { data, error } = await supabase.from('item_templates').insert(payload).select().single()
      if (!error) {
        setItemTemplates(prev => [...prev, mapTemplate(data)])
        showToast('Item salvo!')
      }
    }
  }

  const deleteItemTemplate = async (id) => {
    const { error } = await supabase.from('item_templates').delete().eq('id', id)
    if (!error) {
      setItemTemplates(prev => prev.filter(t => t.id !== id))
      showToast('Item removido')
    }
  }

  const saveInvoice = async (invoice) => {
    const payload = {
      user_id: session.user.id,
      number: invoice.number,
      date: invoice.date,
      due_date: invoice.dueDate || null,
      client_name: invoice.clientName,
      client_address: invoice.clientAddress,
      client_email: invoice.clientEmail,
      notes: invoice.notes,
      items: invoice.items,
      discount: invoice.discount || 0,
      shipping: invoice.shipping || 0,
      paid: invoice.paid,
    }

    if (invoice.id) {
      const { error } = await supabase.from('invoices').update(payload).eq('id', invoice.id)
      if (!error) {
        setInvoices(prev => prev.map(i => i.id === invoice.id ? { ...i, ...payload } : i))
        showToast('Invoice atualizada!')
      }
    } else {
      const { data, error } = await supabase.from('invoices').insert(payload).select().single()
      if (!error) {
        setInvoices(prev => [data, ...prev])
        showToast('Invoice criada!')
      }
    }
    await ensureClientSaved(invoice)
    setView(null)
  }

  const deleteInvoice = async (id) => {
    const { error } = await supabase.from('invoices').delete().eq('id', id)
    if (!error) {
      setInvoices(prev => prev.filter(i => i.id !== id))
      setView(null)
      showToast('Invoice deletada')
    }
  }

  const markPaid = async (id) => {
    const inv = invoices.find(i => i.id === id)
    const newPaid = !inv.paid
    const { error } = await supabase.from('invoices').update({ paid: newPaid }).eq('id', id)
    if (!error) {
      setInvoices(prev => prev.map(i => i.id === id ? { ...i, paid: newPaid } : i))
      showToast(newPaid ? 'Marcada como paga!' : 'Marcada como pendente')
    }
  }

  const nextInvoiceNumber = () => {
    const nums = invoices.map(i => parseInt(i.number || '0')).filter(Boolean)
    return String((nums.length ? Math.max(...nums) : 0) + 1).padStart(3, '0')
  }

  // Map DB row to app format
  const mapInvoice = (i) => ({
    id: i.id,
    number: i.number,
    date: i.date,
    dueDate: i.due_date,
    clientName: i.client_name,
    clientAddress: i.client_address,
    clientEmail: i.client_email,
    notes: i.notes,
    items: i.items,
    discount: i.discount,
    shipping: i.shipping,
    paid: i.paid,
  })

  // Loading auth
  if (session === undefined) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg, #6366f1, #a855f7)' }}>
        <div style={{ color: 'white', fontSize: '1.5rem' }}>🧹</div>
      </div>
    )
  }

  // Not logged in
  if (!session) return <Login />

  const mappedInvoices = invoices.map(mapInvoice)

  if (view === 'quickstart') return (
    <>
      <QuickStart
        invoices={mappedInvoices}
        clients={clients}
        nextInvoiceNumber={nextInvoiceNumber()}
        onSelect={(data) => {
          if (!data) setView('new')
          else if (data.editing) setView(data)
          else setView({ prefill: true, ...data })
        }}
        onBack={() => setView(null)}
      />
      {toast && <div className="toast">{toast}</div>}
    </>
  )

  if (view === 'new') return (
    <>
      <InvoiceForm profile={profile} invoiceNumber={nextInvoiceNumber()} clients={clients} itemTemplates={itemTemplates} onSave={saveInvoice} onBack={() => setView(null)} />
      {toast && <div className="toast">{toast}</div>}
    </>
  )

  if (view?.prefill) return (
    <>
      <InvoiceForm profile={profile} invoice={view} clients={clients} itemTemplates={itemTemplates} onSave={saveInvoice} onBack={() => setView(null)} />
      {toast && <div className="toast">{toast}</div>}
    </>
  )

  if (view?.editing) return (
    <>
      <InvoiceForm profile={profile} invoice={view} clients={clients} itemTemplates={itemTemplates} onSave={saveInvoice} onBack={() => setView(null)} />
      {toast && <div className="toast">{toast}</div>}
    </>
  )

  if (view?.id) return (
    <>
      <InvoiceView
        invoice={view}
        profile={profile}
        onBack={() => setView(null)}
        onEdit={(inv) => setView({ ...inv, editing: true })}
        onDelete={deleteInvoice}
        onMarkPaid={markPaid}
      />
      {toast && <div className="toast">{toast}</div>}
    </>
  )

  const pending = mappedInvoices.filter(i => !i.paid)
  const paid = mappedInvoices.filter(i => i.paid)
  const totalPending = pending.reduce((s, i) => s + (i.items?.reduce((a, it) => a + (parseFloat(it.qty)||0)*(parseFloat(it.rate)||0), 0) || 0), 0)
  const totalPaid = paid.reduce((s, i) => s + (i.items?.reduce((a, it) => a + (parseFloat(it.qty)||0)*(parseFloat(it.rate)||0), 0) || 0), 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      {/* Hero */}
      <div className="hero">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="hero-greeting">Olá 👋</div>
            <div className="hero-name">{profile.name || 'Larissa'}</div>
          </div>
          <button
            onClick={() => supabase.auth.signOut()}
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: 10, padding: '7px 12px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Sair
          </button>
        </div>
        <div className="hero-stats" style={{ marginTop: 20 }}>
          <div className="hero-stat">
            <div className="hero-stat-label">Pendente</div>
            <div className="hero-stat-value">${totalPending.toFixed(2)}</div>
            <div className="hero-stat-sub">{pending.length} invoice{pending.length !== 1 ? 's' : ''}</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-label">Recebido</div>
            <div className="hero-stat-value">${totalPaid.toFixed(2)}</div>
            <div className="hero-stat-sub">{paid.length} paga{paid.length !== 1 ? 's' : ''}</div>
          </div>
        </div>
      </div>

      <div className="content" style={{ flex: 1 }}>
        {loadingData ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>Carregando…</div>
        ) : tab === 'invoices' ? (
          <InvoiceList invoices={mappedInvoices} onSelect={(inv) => setView(inv)} />
        ) : tab === 'cadastros' ? (
          <Registrations
            clients={clients}
            itemTemplates={itemTemplates}
            onSaveClient={saveClient}
            onDeleteClient={deleteClient}
            onSaveTemplate={saveItemTemplate}
            onDeleteTemplate={deleteItemTemplate}
          />
        ) : (
          <ProfileSettings profile={profile} onSave={saveProfile} />
        )}
      </div>

      {tab === 'invoices' && (
        <button className="fab no-print" onClick={() => setView('quickstart')} aria-label="Nova invoice">+</button>
      )}

      <div className="bottom-nav no-print">
        <button className={`bottom-tab ${tab === 'invoices' ? 'active' : ''}`} onClick={() => setTab('invoices')}>
          <span className="bottom-tab-icon">📄</span>
          Invoices
        </button>
        <button className={`bottom-tab ${tab === 'cadastros' ? 'active' : ''}`} onClick={() => setTab('cadastros')}>
          <span className="bottom-tab-icon">📇</span>
          Cadastros
        </button>
        <button className={`bottom-tab ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>
          <span className="bottom-tab-icon">👤</span>
          Perfil
        </button>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
