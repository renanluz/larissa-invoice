import { useState } from 'react'

export default function ItemTemplatesManager({ templates, onSave, onDelete }) {
  const [form, setForm] = useState(null)

  const startNew = () => setForm({ description: '', rate: '', hasDate: false })
  const startEdit = (t) => setForm({ ...t })
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
        <div className="card-title" style={{ marginBottom: 0 }}>Itens salvos</div>
        {!form && <button type="button" className="btn btn-sm btn-ghost" onClick={startNew}>+ Novo</button>}
      </div>

      {form && (
        <form onSubmit={handleSubmit} style={{ marginBottom: 14, marginTop: 12 }}>
          <div className="form-group">
            <label className="form-label">Descrição *</label>
            <input className="form-input" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Ex: Cleaning Service - Hope Island" required />
          </div>
          <div className="form-group">
            <label className="form-label">Valor padrão ($)</label>
            <input className="form-input" type="number" min="0" step="0.01" value={form.rate} onChange={e => set('rate', e.target.value)} placeholder="150.00" />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--text-2)', marginBottom: 10 }}>
            <input type="checkbox" checked={form.hasDate} onChange={e => set('hasDate', e.target.checked)} />
            Pedir uma data ao usar este item (ex: "– 16 Mar 2026")
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="btn btn-primary btn-sm" style={{ flex: 1 }}>Salvar</button>
            <button type="button" className="btn btn-outline btn-sm" onClick={cancel} style={{ flex: 1 }}>Cancelar</button>
          </div>
        </form>
      )}

      {templates.length === 0 && !form && (
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 4 }}>Nenhum item salvo ainda.</div>
      )}

      {templates.map(t => (
        <div key={t.id} className="list-row">
          <div>
            <div className="list-row-title">{t.description}{t.hasDate ? ' + data' : ''}</div>
            {t.rate ? <div className="list-row-sub">${Number(t.rate).toFixed(2)}</div> : null}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button type="button" className="icon-btn" onClick={() => startEdit(t)}>✏️</button>
            <button type="button" className="icon-btn danger" onClick={() => { if (confirm('Remover este item?')) onDelete(t.id) }}>🗑️</button>
          </div>
        </div>
      ))}
    </div>
  )
}
