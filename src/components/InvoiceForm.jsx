import { useState } from 'react'

const today = () => new Date().toISOString().split('T')[0]
const newItem = () => ({ id: Date.now(), desc: '', qty: '1', rate: '' })

export default function InvoiceForm({ profile, invoiceNumber, invoice, clients = [], onSave, onBack }) {
  const editing = !!invoice?.id
  const [form, setForm] = useState({
    number: invoice?.number || invoiceNumber || '001',
    date: invoice?.date || today(),
    dueDate: invoice?.dueDate || '',
    clientName: invoice?.clientName || '',
    clientAddress: invoice?.clientAddress || '',
    clientEmail: invoice?.clientEmail || '',
    notes: invoice?.notes || '',
    items: invoice?.items || [newItem()],
    discount: invoice?.discount || '',
    shipping: invoice?.shipping || '',
    paid: invoice?.paid || false,
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const setItem = (id, k, v) => setForm(f => ({ ...f, items: f.items.map(it => it.id === id ? { ...it, [k]: v } : it) }))
  const addItem = () => setForm(f => ({ ...f, items: [...f.items, newItem()] }))
  const removeItem = (id) => setForm(f => ({ ...f, items: f.items.filter(it => it.id !== id) }))

  const applyClient = (c) => {
    set('clientName', c.name)
    set('clientAddress', c.address || '')
    set('clientEmail', c.email || '')
  }

  const subtotal = form.items.reduce((s, it) => s + (parseFloat(it.qty) || 0) * (parseFloat(it.rate) || 0), 0)
  const discount = parseFloat(form.discount) || 0
  const shipping = parseFloat(form.shipping) || 0
  const balanceDue = subtotal - discount + shipping

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ ...form, ...(editing ? { id: invoice.id } : {}) })
  }

  return (
    <div className="subscreen" style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <div className="header">
        <button className="back-btn" onClick={onBack}>←</button>
        <h1>{editing ? 'Editar Invoice' : 'Nova Invoice'}</h1>
      </div>

      <form className="content" onSubmit={handleSubmit}>
        {/* Invoice details */}
        <div className="card">
          <div className="card-title">Detalhes</div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Número</label>
              <input className="form-input" value={form.number} onChange={e => set('number', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Emissão</label>
              <input className="form-input" type="date" value={form.date} onChange={e => set('date', e.target.value)} required />
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Vencimento</label>
            <input className="form-input" type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} />
          </div>
        </div>

        {/* Saved clients */}
        {clients.length > 0 && (
          <div className="card">
            <div className="card-title">Cliente salvo</div>
            <div className="chip-list">
              {clients.map(c => (
                <button key={c.id} type="button" className="chip-btn" onClick={() => applyClient(c)}>
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Client */}
        <div className="card">
          <div className="card-title">Cliente / Empregador</div>
          <div className="form-group">
            <label className="form-label">Nome *</label>
            <input className="form-input" value={form.clientName} onChange={e => set('clientName', e.target.value)} placeholder="Ex: Neptune Oceanic" required />
          </div>
          <div className="form-group">
            <label className="form-label">Endereço</label>
            <input className="form-input" value={form.clientAddress} onChange={e => set('clientAddress', e.target.value)} placeholder="17 Mariner Ave, Hope Island QLD 4212" />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Email</label>
            <input className="form-input" type="email" value={form.clientEmail} onChange={e => set('clientEmail', e.target.value)} placeholder="accounts@empresa.com.au" />
          </div>
        </div>

        {/* Line items */}
        <div className="card">
          <div className="card-title">Serviços</div>

          {form.items.map((item, idx) => (
            <div key={item.id} className="line-item-box">
              <div className="line-item-header">
                <span className="line-item-num">Item {idx + 1}</span>
                {form.items.length > 1 && (
                  <button type="button" className="remove-btn" onClick={() => removeItem(item.id)}>✕</button>
                )}
              </div>
              <div className="form-group" style={{ marginBottom: 8 }}>
                <input
                  className="form-input"
                  placeholder="Ex: Cleaning Service - Hope Island - 16 Mar 2026"
                  value={item.desc}
                  onChange={e => setItem(item.id, 'desc', e.target.value)}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Qtd</label>
                  <input className="form-input" type="number" min="0" step="0.5" value={item.qty} onChange={e => setItem(item.id, 'qty', e.target.value)} required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Preço ($)</label>
                  <input className="form-input" type="number" min="0" step="0.01" value={item.rate} onChange={e => setItem(item.id, 'rate', e.target.value)} placeholder="0.00" required />
                </div>
              </div>
              {item.qty && item.rate && (
                <div className="line-subtotal">
                  = ${((parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0)).toFixed(2)}
                </div>
              )}
            </div>
          ))}

          <button type="button" className="add-item-btn" onClick={addItem}>
            + Adicionar item
          </button>

          <div className="total-section">
            <div className="total-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Discount / Shipping */}
        <div className="card">
          <div className="card-title">Ajustes (opcional)</div>
          <div className="form-row">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Discount ($)</label>
              <input className="form-input" type="number" min="0" step="0.01" value={form.discount} onChange={e => set('discount', e.target.value)} placeholder="0.00" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Shipping ($)</label>
              <input className="form-input" type="number" min="0" step="0.01" value={form.shipping} onChange={e => set('shipping', e.target.value)} placeholder="0.00" />
            </div>
          </div>
          <div className="total-section">
            <div className="total-row grand">
              <span>Balance Due</span>
              <span>${balanceDue.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="card">
          <div className="card-title">Observações (opcional)</div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <textarea
              className="form-input"
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              rows={3}
              placeholder="Os dados bancários já aparecem automaticamente na invoice. Use aqui para instruções extras, se precisar."
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginBottom: 40 }}>
          {editing ? 'Salvar alterações' : 'Criar Invoice'}
        </button>
      </form>
    </div>
  )
}
