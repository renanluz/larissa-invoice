import { useState } from 'react'

export default function ProfileSettings({ profile, onSave, onSignOut }) {
  const [form, setForm] = useState({ ...profile })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(form)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="card">
        <div className="card-title">Seus Dados</div>
        <div className="form-group">
          <label className="form-label">Nome completo *</label>
          <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Larissa Silva" required />
        </div>
        <div className="form-group">
          <label className="form-label">ABN *</label>
          <input className="form-input" value={form.abn} onChange={e => set('abn', e.target.value)} placeholder="XX XXX XXX XXX" required />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="larissa@email.com" />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Telefone</label>
          <input className="form-input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="04XX XXX XXX" />
        </div>
      </div>

      <div className="card">
        <div className="card-title">Dados Bancários</div>
        <div className="form-group">
          <label className="form-label">Banco</label>
          <input className="form-input" value={form.bankName} onChange={e => set('bankName', e.target.value)} placeholder="Commonwealth Bank, ANZ, NAB…" />
        </div>
        <div className="form-group">
          <label className="form-label">Nome da conta</label>
          <input className="form-input" value={form.accountName} onChange={e => set('accountName', e.target.value)} placeholder="Larissa Silva" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">BSB</label>
            <input className="form-input" value={form.bsb} onChange={e => set('bsb', e.target.value)} placeholder="XXX-XXX" />
          </div>
          <div className="form-group">
            <label className="form-label">Account #</label>
            <input className="form-input" value={form.accountNumber} onChange={e => set('accountNumber', e.target.value)} placeholder="XXXXXXXX" />
          </div>
        </div>
      </div>

      <div className="info-box" style={{ marginBottom: 14 }}>
        <strong>💡 Dica:</strong> Como contratante ABN, você emite invoice para cada trabalho. Só precisa de GST se ganhar mais de $75.000/ano.
      </div>

      <button type="submit" className="btn btn-primary" style={{ marginBottom: 12 }}>
        Salvar perfil
      </button>

      <button
        type="button"
        className="btn btn-outline"
        style={{ marginBottom: 40, color: 'var(--text-muted)' }}
        onClick={onSignOut}
      >
        Sair da conta
      </button>
    </form>
  )
}
