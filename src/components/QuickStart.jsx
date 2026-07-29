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
  const day = today.getDay()
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

const DAY_LABELS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex']

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
      <div className="subscreen" style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
        <div className="header">
          <button className="back-btn" onClick={() => setEnricoConflict(null)}>←</button>
          <h1>Atenção</h1>
        </div>
        <div className="content">
          <div style={{
            background: 'white',
            borderRadius: 20,
            padding: '32px 20px',
            textAlign: 'center',
            border: '1px solid var(--border-soft)',
            boxShadow: 'var(--shadow)',
          }}>
            <div style={{
              width: 56, height: 56,
              background: 'var(--red-light)',
              borderRadius: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem',
              margin: '0 auto 16px',
            }}>⚠️</div>
            <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 8 }}>
              Já existe uma invoice do Enrico para essa semana
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.83rem', marginBottom: 28 }}>
              Invoice #{enricoConflict.number} · {formatShort(enricoConflict.date)}
            </div>
            <button
              className="btn btn-primary"
              style={{ marginBottom: 10 }}
              onClick={() => onSelect({ ...enricoConflict, editing: true })}
            >
              ✏️ Abrir e editar
            </button>
            <button
              className="btn btn-outline"
              onClick={() => setEnricoConflict(null)}
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <div className="header">
        <button className="back-btn" onClick={onBack}>←</button>
        <h1>Nova Invoice</h1>
      </div>
      <div className="content">
        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Para qual cliente?
        </div>

        {/* Enrico card — dark */}
        <div
          onClick={handleEnrico}
          style={{
            background: 'var(--dark)',
            borderRadius: 20,
            padding: '20px',
            marginBottom: 12,
            cursor: 'pointer',
            color: 'white',
            transition: 'transform 0.1s',
          }}
          onTouchStart={e => e.currentTarget.style.transform = 'scale(0.98)'}
          onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: '1.2rem' }}>Enrico Biga</div>
            <span style={{
              background: 'var(--red)',
              color: 'white',
              fontSize: '0.6rem',
              padding: '4px 10px',
              borderRadius: 999,
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>SEMANAL</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(247,245,241,0.55)', marginBottom: 14, fontWeight: 600 }}>
            Cleaning Service · {weekLabel}
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {weekDays.map((d, i) => (
              <div key={d} style={{
                background: 'rgba(247,245,241,0.08)',
                border: '1px solid rgba(247,245,241,0.12)',
                borderRadius: 10,
                padding: '6px 10px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '0.6rem', color: 'rgba(247,245,241,0.45)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>{DAY_LABELS[i]}</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'white' }}>${ENRICO_PATTERN[i].rate}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Neptune card — white */}
        <div
          onClick={handleNeptune}
          style={{
            background: 'white',
            borderRadius: 20,
            padding: '20px',
            marginBottom: 12,
            cursor: 'pointer',
            border: '1px solid var(--border-soft)',
            boxShadow: 'var(--shadow)',
            transition: 'transform 0.1s',
          }}
          onTouchStart={e => e.currentTarget.style.transform = 'scale(0.98)'}
          onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: '1.2rem', color: 'var(--text)' }}>Neptune Oceanic</div>
            <span style={{
              background: 'var(--green-light)',
              color: 'var(--green)',
              fontSize: '0.6rem',
              padding: '4px 10px',
              borderRadius: 999,
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>15 DIAS</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 14, fontWeight: 600 }}>
            Stewarding duties · quinzenal
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Week 1', 'Week 2'].map(w => (
              <div key={w} style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: '7px 14px',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--text-sub)',
              }}>
                {w}
              </div>
            ))}
          </div>
        </div>

        {/* Outro — dashed */}
        <div
          onClick={() => onSelect(null)}
          style={{
            borderRadius: 20,
            padding: '20px',
            cursor: 'pointer',
            border: '1.5px dashed var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <div style={{
            width: 42, height: 42,
            background: 'var(--bg-alt)',
            borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem',
            flexShrink: 0,
          }}>+</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', marginBottom: 3 }}>Outro cliente</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600 }}>Preencher manualmente</div>
          </div>
        </div>
      </div>
    </div>
  )
}
