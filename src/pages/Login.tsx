import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      await login(email, password)
    } catch {
      setError('Email ou mot de passe incorrect.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{minHeight:'100vh',background:'#f0fdf4',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'#fff',borderRadius:16,padding:'40px 36px',width:'100%',maxWidth:400,boxShadow:'0 4px 24px rgba(46,204,113,0.10)',border:'1px solid #d4f5e0'}}>
        <div style={{fontSize:24,fontWeight:700,color:'#2ECC71',marginBottom:16}}>BudgetApp</div>
        <h1 style={{fontSize:22,fontWeight:600,color:'#1a7a45',margin:'0 0 4px'}}>Connexion</h1>
        <p style={{fontSize:13,color:'#888',margin:'0 0 24px'}}>Gerez votre budget en toute simplicite</p>
        {error && <div style={{background:'#fff0f0',border:'1px solid #fca5a5',color:'#dc2626',borderRadius:8,padding:'10px 14px',fontSize:13,marginBottom:16}}>{error}</div>}
        <div style={{marginBottom:16}}>
          <label style={{display:'block',fontSize:13,fontWeight:500,color:'#444',marginBottom:6}}>Email</label>
          <input style={{width:'100%',padding:'10px 14px',border:'1.5px solid #e0e0e0',borderRadius:8,fontSize:14,boxSizing:'border-box'}}
            type="email" placeholder="vous@email.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div style={{marginBottom:16}}>
          <label style={{display:'block',fontSize:13,fontWeight:500,color:'#444',marginBottom:6}}>Mot de passe</label>
          <input style={{width:'100%',padding:'10px 14px',border:'1.5px solid #e0e0e0',borderRadius:8,fontSize:14,boxSizing:'border-box'}}
            type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>
        <button style={{width:'100%',background:'#2ECC71',color:'#fff',border:'none',borderRadius:8,padding:'12px',fontSize:15,fontWeight:600,cursor:'pointer',opacity:loading?0.7:1}}
          onClick={handleSubmit} disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </div>
    </div>
  )
}
