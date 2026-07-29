import { useState } from 'react'

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

const isOverdue = (inv) => {
  if (inv.paid || !inv.dueDate) return false
  return inv.dueDate < new Date().toISOString().split('T')[0]
}

export default function InvoiceList({ invoices, onSelect }) {
  const [filter, setFilter] = useState('all')

  const pendingInvoices = invoices.filter(i => !i.paid)
  const paidInvoices = invoices.filter(i => i.paid)

  const visible = filter === 'pending' ? pendingInvoices
    : filter === 'paid' ? paidInvoices
    : invoices

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
      <div className="filter-pills">
        <button
          className={`filter-pill ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Todas · {invoices.length}
        </button>
        <button
          className={`filter-pill ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pendentes · {pendingInvoices.length}
        </button>
        <button
          className={`filter-pill ${filter === 'paid' ? 'active' : ''}`}
          onClick={() => setFilter('paid')}
        >
          Pagas · {paidInvoices.length}
        </button>
      </div>

      {visible.length === 0 ? (
        <div className="empty-state" style={{ paddingTop: 40 }}>
          <div className="empty-sub">Nenhuma invoice nessa categoria</div>
        </div>
      ) : (
        visible.map(inv => <InvoiceRow key={inv.id} inv={inv} onClick={() => onSelect(inv)} />)
      )}
    </>
  )
}

function InvoiceRow({ inv, onClick }) {
  const total = totalAmount(inv)
  const overdue = isOverdue(inv)
  return (
    <div className={`invoice-item ${overdue ? 'overdue' : ''}`} onClick={onClick}>
      <div className={`invoice-avatar ${inv.paid ? 'paid' : overdue ? 'overdue' : ''}`}>
        {initials(inv.clientName)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="invoice-client">{inv.clientName || 'Sem nome'}</div>
        <div className={`invoice-meta ${overdue ? 'overdue' : ''}`}>
          #{inv.number} · {overdue ? `Venceu ${fmtDate(inv.dueDate)}` : fmtDate(inv.date)}
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div className="invoice-amount">{fmt(total)}</div>
        <div className="invoice-service-count">
          {inv.items?.length || 0} {(inv.items?.length || 0) === 1 ? 'item' : 'itens'}
        </div>
      </div>
    </div>
  )
}
