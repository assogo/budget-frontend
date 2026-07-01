import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Navbar from './components/Navbar'

function AppContent() {
  const { isAuthenticated } = useAuth()
  const [page, setPage] = useState('dashboard')
  const [authPage, setAuthPage] = useState('login')
  const [authMessage, setAuthMessage] = useState('')

  const handleSwitch = (p: string, msg?: string) => {
    setAuthPage(p)
    setAuthMessage(msg || '')
  }

  if (isAuthenticated === false) {
    if (authPage === 'register') return <Register onSwitch={handleSwitch} />
    return <Login onSwitch={handleSwitch} message={authMessage} />
  }

  return (
    <div style={{minHeight:'100vh',background:'#f8fffe'}}>
      <Navbar currentPage={page} onNavigate={setPage} />
      {page === 'dashboard' && <Dashboard />}
      {page === 'transactions' && <Transactions />}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
