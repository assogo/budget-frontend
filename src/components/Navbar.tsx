import { useAuth } from '../context/AuthContext'

interface NavbarProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { logout } = useAuth()

  return (
    <nav style={{
      background: 'var(--bg2)',
      borderBottom: '1px solid var(--border)',
      padding: '0 20px',
      height: 58,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ fontFamily: 'var(--font-title)', fontSize: 18, fontWeight: 700, color: 'var(--blue)', letterSpacing: '-0.3px' }}>
        💼 FinanceApp
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        {[{id:'dashboard',label:'Dashboard'},{id:'transactions',label:'Transactions'}].map(l => (
          <button key={l.id} onClick={() => onNavigate(l.id)} style={{
            background: currentPage === l.id ? 'var(--blue-dim)' : 'transparent',
            color: currentPage === l.id ? 'var(--blue)' : 'var(--muted)',
            border: currentPage === l.id ? '1px solid rgba(74,144,217,0.3)' : '1px solid transparent',
            borderRadius: 8,
            padding: '6px 14px',
            fontSize: 13,
            fontWeight: currentPage === l.id ? 600 : 400,
            transition: 'all 0.15s',
          }}>{l.label}</button>
        ))}
      </div>
      <button onClick={logout} style={{
        background: 'transparent',
        border: '1px solid var(--border)',
        color: 'var(--muted)',
        borderRadius: 8,
        padding: '6px 14px',
        fontSize: 13,
        transition: 'all 0.15s',
      }}>Déconnexion</button>
    </nav>
  )
}
