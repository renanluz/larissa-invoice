import { useEffect } from 'react'

const fmt = (n) => `$${Number(n || 0).toFixed(2)}`
const fmtDate = (d) => {
  if (!d) return ''
  const [y, m, day] = d.split('-')
  return `${m}/${day}/${y}`
}

const sanitize = (s) => (s || '').replace(/[^a-zA-Z0-9]+/g, '')

export default function InvoiceView({ invoice, profile, onBack, onEdit, onDelete, onMarkPaid }) {
  const subtotal = invoice.items?.reduce((s, it) => s + (parseFloat(it.qty) || 0) * (parseFloat(it.rate) || 0), 0) || 0
  const discount = parseFloat(invoice.discount) || 0
  const shipping = parseFloat(invoice.shipping) || 0
  const tax = 0
  const balanceDue = subtotal - discount + shipping + tax

  useEffect(() => {
    const prevTitle = document.title
    document.title = `INV${invoice.number}-${sanitize(invoice.clientName)}`
    return () => { document.title = prevTitle }
  }, [invoice.number, invoice.clientName])

  const handlePrint = () => window.print()

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Invoice #${invoice.number} – ${invoice.clientName}`,
          text: `Invoice #${invoice.number} – ${fmt(balanceDue)} – ${profile.name || 'Larissa'}`,
        })
      } catch {}
    } else {
      handlePrint()
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <div className="header no-print">
        <button className="back-btn" onClick={onBack}>←</button>
        <h1>Invoice #{invoice.number}</h1>
      </div>

      <div className="action-bar no-print">
        <button className="btn btn-sm btn-outline" onClick={() => onEdit(invoice)}>✏️ Editar</button>
        <button
          className={`btn btn-sm ${invoice.paid ? 'btn-outline' : 'btn-success'}`}
          onClick={() => onMarkPaid(invoice.id)}
        >
          {invoice.paid ? '↩ Pendente' : '✓ Marcar paga'}
        </button>
        <button className="btn btn-sm btn-outline" onClick={handlePrint}>🖨️ PDF</button>
        <button className="btn btn-sm btn-ghost" onClick={handleShare}>📤 Enviar</button>
      </div>

      <div className="content">
        <div className="invoice-preview">
          {/* Contact strip */}
          <div className="inv-contact-strip">
            <div className="inv-contact-block">
              <strong>Contact</strong>
              {profile.phone || '—'}<br />{profile.email || ''}
              {profile.abn && <><br />ABN {profile.abn}</>}
            </div>
          </div>

          {/* Dark band */}
          <div className="inv-dark-band">
            <div className="inv-dark-band-row">
              <div>
                <div className="inv-to-label">Invoice to</div>
                <div className="inv-to-name">{invoice.clientName}</div>
                <div className="inv-to-sub">
                  {invoice.clientAddress && <>{invoice.clientAddress}<br /></>}
                  {invoice.clientEmail}
                </div>
              </div>
              <div className="inv-red-tag">INVOICE</div>
            </div>

            <div className="inv-meta-row">
              <div className="inv-meta-left">
                <div>INVOICE NO <b>#{invoice.number}</b></div>
                <div>INVOICE DATE <b>{fmtDate(invoice.date)}</b></div>
                {invoice.dueDate && <div>DUE DATE <b>{fmtDate(invoice.dueDate)}</b></div>}
              </div>
              <div className="inv-meta-right">
                <div className="label">{invoice.paid ? 'PAID' : 'BALANCE DUE'}</div>
                <div className="value">{fmt(balanceDue)}</div>
              </div>
            </div>
          </div>

          {/* Items table */}
          <div className="inv-table-wrap">
            <table className="inv-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Tax</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items?.map((item, i) => (
                  <tr key={i}>
                    <td>{item.desc}</td>
                    <td style={{ textAlign: 'center' }}>{fmt(item.rate)}</td>
                    <td>{item.qty}</td>
                    <td>$0.00</td>
                    <td>{fmt((parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Payment + Totals */}
          <div className="inv-bottom-grid">
            <div className="inv-payment-box">
              <div className="inv-payment-title">Payment Method</div>
              <div className="inv-payment-text">
                Bank Details{'\n'}
                {profile.accountName || profile.name}{'\n'}
                BSB: {profile.bsb}{'\n'}
                Account: {profile.accountNumber}
                {invoice.notes && <>{'\n\n'}{invoice.notes}</>}
              </div>
            </div>
            <div className="inv-totals-box">
              <div className="inv-total-row"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
              <div className="inv-total-row"><span>Discount</span><span>{fmt(discount)}</span></div>
              <div className="inv-total-row"><span>Tax</span><span>{fmt(tax)}</span></div>
              <div className="inv-total-row"><span>Shipping</span><span>{fmt(shipping)}</span></div>
              <div className="inv-grand-band">
                <span>Balance Due</span>
                <span>{fmt(balanceDue)}</span>
              </div>
            </div>
          </div>

          <div style={{ height: 22 }} />
        </div>

        {/* Delete */}
        <div className="no-print" style={{ marginTop: 16, marginBottom: 40 }}>
          <button className="btn btn-danger" onClick={() => {
            if (confirm('Deletar esta invoice?')) onDelete(invoice.id)
          }}>
            🗑️ Deletar invoice
          </button>
        </div>
      </div>
    </div>
  )
}
