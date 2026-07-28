const fmt = (n) => `$${Number(n).toFixed(2)}`

const fmtDate = (d) => {
  if (!d) return ''
  const [y, m, day] = d.split('-')
  return `${day}/${m}/${y}`
}

const totalAmount = (inv) =>
  inv.items?.reduce((s, it) => s + (parseFloat(it.qty) || 0) * (parseFloat(it.rate) || 0), 0) || 0

const initials = (name) => {
  if (!name) return '?'
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

export default function InvoiceList({ invoices, onSelect }) {
  const pending = invoices.filter(i => !i.paid)
  const paid = invoices.filter(i => i.paid)

  if (invoices.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📄</div>
        <div className="empty-title">Nenhuma invoice ainda</div>
        <div className="empty-sub">Toque no + para criar sua primeira invoice</div>
      </div>
    )
  }

  return (
    <>
      {pending.length > 0 && (
        <>
          <div className="section-header">
            <span className="section-label">Pendentes · {pending.length}</span>
          </div>
          {pending.map(inv => <InvoiceRow key={inv.id} inv={inv} onClick={() => onSelect(inv)} />)}
        </>
      )}

      {paid.length > 0 && (
        <div style={{ marginTop: pending.length ? 20 : 0 }}>
          <div className="section-header">
            <span className="section-label">Pagas · {paid.length}</span>
          </div>
          {paid.map(inv => <InvoiceRow key={inv.id} inv={inv} onClick={() => onSelect(inv)} />)}
        </div>
      )}
    </>
  )
}

function InvoiceRow({ inv, onClick }) {
  const total = totalAmount(inv)
  return (
    <div className="invoice-item" onClick={onClick}>
      <div className="invoice-item-left">
        <div className={`invoice-avatar ${inv.paid ? 'paid' : ''}`}>
          {initials(inv.clientName)}
        </div>
        <div style={{ minWidth: 0 }}>
          <div className="invoice-client">{inv.clientName || 'Sem nome'}</div>
          <div className="invoice-meta">#{inv.number} · {fmtDate(inv.date)}</div>
        </div>
      </div>
      <div className="invoice-right">
        <div className="invoice-amount">{fmt(total)}</div>
        <span className={`badge ${inv.paid ? 'badge-paid' : 'badge-pending'}`}>
          {inv.paid ? 'Paga' : 'Pendente'}
        </span>
      </div>
    </div>
  )
}
