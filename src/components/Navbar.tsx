import { useAuth } from '../context/AuthContext'

interface NavbarProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { logout } = useAuth()

  const links = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'transactions', label: '💳 Transactions' },
  ]

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>💰 BudgetApp</div>
      <div style={styles.links}>
        {links.map(link => (
          <button key={link.id}
            style={currentPage === link.id ? { ...styles.link, ...styles.linkActive } : styles.link}
            onClick={() => onNavigate(link.id)}>
            {link.label}
          </button>
        ))}
      </div>
      <button style={styles.logout} onClick={logout}>Déconnexion</button>
    </nav>
  )
}

const styles: Record<string, React.CSSProperties> = {
  nav: { background: '#fff', borderBottom: '1.5px solid #d4f5e0', padding: '0 24px', display: 'flex', alignItems: 'center', height: 56, gap: 24, fontFamily: "'Open Sans', sans-serif", position: 'sticky', top: 0, zIndex: 100 },
  logo: { fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 18, color: '#2ECC71', marginRight: 16 },
  links: { display: 'flex', gap: 4, flex: 1 },
  link: { background: 'none', border: 'none', padding: '6px 14px', borderRadius: 8, fontSize: 14, color: '#555', cursor: 'pointer', fontFamily: "'Open Sans', sans-serif" },
  linkActive: { background: '#f0fdf4', color: '#1a7a45', fontWeight: 600 },
  logout: { background: 'none', border: '1.5px solid #e0e0e0', borderRadius: 8, padding: '6px 14px', fontSize: 13, color: '#888', cursor: 'pointer', fontFamily: "'Open Sans', sans-serif" },
}
