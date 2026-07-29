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
      background: '#14181F',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{
          width: 72, height: 72,
          background: '#D4462E',
          borderRadius: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2.2rem',
          margin: '0 auto 20px',
          fontFamily: 'Instrument Serif, serif',
          color: 'white',
          fontWeight: 400,
        }}>L</div>
        <div style={{
          color: '#F7F5F1',
          fontFamily: 'Instrument Serif, serif',
          fontSize: '1.9rem',
          letterSpacing: '-0.01em',
        }}>
          Larissa Invoices
        </div>
        <div style={{ color: '#8A857C', fontSize: '0.875rem', marginTop: 6, fontWeight: 600 }}>
          Área restrita
        </div>
      </div>

      <div style={{
        background: '#1E2330',
        borderRadius: 20,
        padding: '28px 24px',
        width: '100%',
        maxWidth: 360,
        border: '1px solid #2A3040',
      }}>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#8A857C', marginBottom: 6 }}>Email</label>
            <input
              style={{
                width: '100%', padding: '13px 14px',
                border: '1.5px solid #2A3040',
                borderRadius: 12, fontSize: 15,
                fontFamily: 'inherit',
                background: '#14181F', color: '#F7F5F1',
                outline: 'none',
              }}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              autoComplete="email"
              required
            />
          </div>
          <div className="form-group" style={{ marginBottom: error ? 12 : 20 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#8A857C', marginBottom: 6 }}>Senha</label>
            <input
              style={{
                width: '100%', padding: '13px 14px',
                border: '1.5px solid #2A3040',
                borderRadius: 12, fontSize: 15,
                fontFamily: 'inherit',
                background: '#14181F', color: '#F7F5F1',
                outline: 'none',
              }}
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
              background: '#FBE9E5', color: '#D4462E',
              padding: '10px 14px', borderRadius: 8,
              fontSize: '0.85rem', fontWeight: 600,
              marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              width: '100%', padding: '15px 20px',
              background: '#D4462E', color: 'white',
              border: 'none', borderRadius: 12,
              fontSize: '0.95rem', fontFamily: 'inherit',
              fontWeight: 700, cursor: 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 6px 18px rgba(212,70,46,0.4)',
            }}
            disabled={loading}
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
