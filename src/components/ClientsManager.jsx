import { useState } from 'react'

export default function ClientsManager({ clients, onSave, onDelete }) {
  const [form, setForm] = useState(null)

  const startNew = () => setForm({ name: '', address: '', email: '' })
  const startEdit = (c) => setForm({ ...c })
  const cancel = () => setForm(null)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(form)
    setForm(null)
  }

  return (
    <div className="card">
      <div className="section-header">
        <div className="card-title" style={{ marginBottom: 0 }}>Clientes</div>
        {!form && <button type="button" className="btn btn-sm btn-ghost" onClick={startNew}>+ Novo</button>}
      </div>

      {form && (
        <form onSubmit={handleSubmit} style={{ marginBottom: 14, marginTop: 12 }}>
          <div className="form-group">
            <label className="form-label">Nome *</label>
            <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ex: Neptune Oceanic" required />
          </div>
          <div className="form-group">
            <label className="form-label">Endereço</label>
            <input className="form-input" value={form.address || ''} onChange={e => set('address', e.target.value)} placeholder="17 Mariner Ave, Hope Island QLD 4212" />
          </div>
          <div className="form-group" style={{ marginBottom: 10 }}>
            <label className="form-label">Email</label>
            <input className="form-input" type="email" value={form.email || ''} onChange={e => set('email', e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="btn btn-primary btn-sm" style={{ flex: 1 }}>Salvar</button>
            <button type="button" className="btn btn-outline btn-sm" onClick={cancel} style={{ flex: 1 }}>Cancelar</button>
          </div>
        </form>
      )}

      {clients.length === 0 && !form && (
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 4 }}>Nenhum cliente salvo ainda.</div>
      )}

      {clients.map(c => (
        <div key={c.id} className="list-row">
          <div>
            <div className="list-row-title">{c.name}</div>
            {c.address && <div className="list-row-sub">{c.address}</div>}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button type="button" className="icon-btn" onClick={() => startEdit(c)}>✏️</button>
            <button type="button" className="icon-btn danger" onClick={() => { if (confirm(`Remover ${c.name}?`)) onDelete(c.id) }}>🗑️</button>
          </div>
        </div>
      ))}
    </div>
  )
}
