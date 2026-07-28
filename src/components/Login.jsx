import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('Email ou senha incorretos.')
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'linear-gradient(160deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
    }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{
          width: 72, height: 72,
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2rem',
          margin: '0 auto 16px',
          border: '1px solid rgba(255,255,255,0.2)',
        }}>🧹</div>
        <div style={{ color: 'white', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
          Larissa Invoices
        </div>
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', marginTop: 4 }}>
          Área restrita
        </div>
      </div>

      {/* Card */}
      <div style={{
        background: 'white',
        borderRadius: 20,
        padding: '28px 24px',
        width: '100%',
        maxWidth: 360,
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              autoComplete="email"
              required
            />
          </div>
          <div className="form-group" style={{ marginBottom: error ? 12 : 20 }}>
            <label className="form-label">Senha</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div style={{
              background: '#fee2e2', color: '#dc2626',
              padding: '10px 14px', borderRadius: 8,
              fontSize: '0.85rem', fontWeight: 500,
              marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
