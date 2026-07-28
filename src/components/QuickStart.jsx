import { useState } from 'react'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const toISO = (d) => d.toISOString().split('T')[0]

const formatShort = (isoDate) => {
  const [y, m, d] = isoDate.split('-')
  return `${parseInt(d)} ${MONTHS[parseInt(m) - 1]} ${y}`
}

const formatShortNoYear = (isoDate) => {
  const [, m, d] = isoDate.split('-')
  return `${parseInt(d)} ${MONTHS[parseInt(m) - 1]}`
}

const getWeekDays = () => {
  const today = new Date()
  const day = today.getDay() // 0=Sun, 1=Mon
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(today)
  monday.setDate(today.getDate() + diff)
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return toISO(d)
  })
}

const ENRICO_PATTERN = [
  { location: 'Hope Island', rate: '150' },
  { location: 'Burleigh Heads', rate: '145' },
  { location: 'Hope Island', rate: '150' },
  { location: 'Burleigh Heads', rate: '145' },
  { location: 'Hope Island', rate: '150' },
]

const buildEnricoItems = (weekDays) =>
  weekDays.map((date, i) => ({
    id: Date.now() + i,
    desc: `Cleaning Service - ${ENRICO_PATTERN[i].location} - ${formatShort(date)}`,
    qty: '1',
    rate: ENRICO_PATTERN[i].rate,
  }))

export default function QuickStart({ invoices, clients, nextInvoiceNumber, onSelect, onBack }) {
  const [enricoConflict, setEnricoConflict] = useState(null)

  const weekDays = getWeekDays()
  const monday = weekDays[0]
  const friday = weekDays[4]
  const weekLabel = `${formatShortNoYear(monday)} – ${formatShort(friday)}`

  const getClient = (name) =>
    clients.find(c => c.name.toLowerCase().includes(name.toLowerCase()))

  const findEnricoThisWeek = () =>
    invoices.find(inv =>
      inv.clientName?.toLowerCase().includes('enrico') &&
      inv.date >= monday && inv.date <= friday
    )

  const handleEnrico = () => {
    const existing = findEnricoThisWeek()
    if (existing) { setEnricoConflict(existing); return }
    const client = getClient('enrico')
    onSelect({
      number: nextInvoiceNumber,
      date: monday,
      dueDate: '',
      clientName: client?.name || 'Enrico Biga',
      clientAddress: client?.address || '',
      clientEmail: client?.email || '',
      notes: '',
      items: buildEnricoItems(weekDays),
      discount: '',
      shipping: '',
      paid: false,
    })
  }

  const handleNeptune = () => {
    const client = getClient('neptune')
    onSelect({
      number: nextInvoiceNumber,
      date: toISO(new Date()),
      dueDate: '',
      clientName: client?.name || 'Neptune Oceanic',
      clientAddress: client?.address || '',
      clientEmail: client?.email || '',
      notes: '',
      items: [
        { id: Date.now(), desc: 'Stewarding duties - Week 1', qty: '1', rate: '' },
        { id: Date.now() + 1, desc: 'Stewarding duties - Week 2', qty: '1', rate: '' },
      ],
      discount: '',
      shipping: '',
      paid: false,
    })
  }

  if (enricoConflict) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
        <div className="header">
          <button className="back-btn" onClick={() => setEnricoConflict(null)}>←</button>
          <h1>Atenção</h1>
        </div>
        <div className="content">
          <div className="card" style={{ textAlign: 'center', padding: '28px 20px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📋</div>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 6 }}>
              Já existe uma invoice do Enrico para essa semana
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.83rem', marginBottom: 24 }}>
              Invoice #{enricoConflict.number} · {formatShort(enricoConflict.date)}
            </div>
            <button
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: 10 }}
              onClick={() => onSelect({ ...enricoConflict, editing: true })}
            >
              ✏️ Abrir e editar
            </button>
            <button
              className="btn btn-outline"
              style={{ width: '100%' }}
              onClick={() => setEnricoConflict(null)}
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    )
  }

  const dayLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <div className="header">
        <button className="back-btn" onClick={onBack}>←</button>
        <h1>Nova Invoice</h1>
      </div>
      <div className="content">
        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 14 }}>
          Para qual cliente?
        </div>

        <div
          className="card"
          onClick={handleEnrico}
          style={{ cursor: 'pointer', marginBottom: 12, borderLeft: '3px solid var(--primary)' }}
        >
          <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>Enrico Biga</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 10 }}>
            Cleaning Service · {weekLabel}
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {weekDays.map((d, i) => (
              <span key={d} style={{
                background: 'var(--surface-2, rgba(0,0,0,0.06))',
                borderRadius: 6,
                padding: '3px 8px',
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
              }}>
                {dayLabels[i]} · ${ENRICO_PATTERN[i].rate}
              </span>
            ))}
          </div>
        </div>

        <div
          className="card"
          onClick={handleNeptune}
          style={{ cursor: 'pointer', marginBottom: 12, borderLeft: '3px solid var(--primary)' }}
        >
          <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>Neptune Oceanic</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 10 }}>
            Stewarding duties · quinzenal
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['Week 1', 'Week 2'].map(w => (
              <span key={w} style={{
                background: 'var(--surface-2, rgba(0,0,0,0.06))',
                borderRadius: 6,
                padding: '3px 8px',
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
              }}>
                {w}
              </span>
            ))}
          </div>
        </div>

        <div
          className="card"
          onClick={() => onSelect(null)}
          style={{ cursor: 'pointer' }}
        >
          <div style={{ fontWeight: 600, fontSize: '1rem' }}>+ Outro cliente</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>
            Preencher manualmente
          </div>
        </div>
      </div>
    </div>
  )
}
