import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Login({ onSwitch, message }: { onSwitch: (page: string) => void, message?: string }) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try { await login(email, password) }
    catch { setError('Email ou mot de passe incorrect.') }
    finally { setLoading(false) }
  }

  const inp = {
    width: '100%', padding: '11px 14px',
    background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: 10, fontSize: 14, color: 'var(--text)',
    outline: 'none', boxSizing: 'border-box' as const,
    transition: 'border 0.2s',
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>💼</div>
          <h1 style={{ fontFamily: 'var(--font-title)', fontSize: 26, fontWeight: 700, color: 'var(--white)', marginBottom: 6 }}>FinanceApp</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Gérez votre budget avec précision</p>
        </div>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: '28px 24px' }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--white)', marginBottom: 20 }}>Connexion</h2>
          {message && <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>{message}</div>}
          {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>{error}</div>}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</label>
            <input style={inp} type="email" placeholder="vous@email.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Mot de passe</label>
            <input style={inp} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>
          <button onClick={handleSubmit} disabled={loading} style={{
            width: '100%', background: 'var(--blue)', color: '#fff',
            border: 'none', borderRadius: 10, padding: '12px',
            fontSize: 14, fontWeight: 600, opacity: loading ? 0.7 : 1,
            transition: 'opacity 0.2s',
          }}>{loading ? 'Connexion...' : 'Se connecter'}</button>
          <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--muted)' }}>
            Pas encore de compte ?{' '}
            <button onClick={() => onSwitch('register')} style={{ background: 'none', border: 'none', color: 'var(--blue)', fontWeight: 600, fontSize: 13 }}>Créer un compte</button>
          </p>
        </div>
      </div>
    </div>
  )
}
