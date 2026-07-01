import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Navbar from './components/Navbar'

function AppContent() {
  const { isAuthenticated } = useAuth()
  const [page, setPage] = useState('dashboard')

  if (!isAuthenticated) return <Login />

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
