import { useEffect, useState } from 'react'
import api from '../api/axios'

const fmt = (n: number) => n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function Dashboard() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/expenses')
      .then(res => {
        const data = res.data['member'] ?? res.data['hydra:member'] ?? res.data
        setTransactions(Array.isArray(data) ? data : [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expense = transactions.filter(t => t.type !== 'income').reduce((s, t) => s + t.amount, 0)
  const balance = income - expense

  const byCategory = transactions.reduce((acc: any, t) => {
    const cat = t.category || 'Autre'
    acc[cat] = (acc[cat] || 0) + t.amount
    return acc
  }, {})
  const cats = (Object.entries(byCategory) as [string, number][]).sort((a, b) => b[1] - a[1])
  const maxVal = cats.length > 0 ? cats[0][1] : 1
  const colors = ['#4A90D9','#22c55e','#f59e0b','#ef4444','#a855f7','#06b6d4','#ec4899']

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--muted)', fontSize: 14 }}>
      Chargement...
    </div>
  )

  return (
    <div style={{ padding: '24px 20px', maxWidth: 960, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-title)', fontSize: 22, fontWeight: 700, color: 'var(--white)', marginBottom: 4 }}>Vue d'ensemble</h1>
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 24 }}>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 20px 16px', borderTop: '3px solid var(--blue)' }}>
          <p style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>Solde net</p>
          <p style={{ fontFamily: 'var(--font-title)', fontSize: 28, fontWeight: 700, color: balance >= 0 ? 'var(--green)' : 'var(--red)', lineHeight: 1 }}>{balance >= 0 ? '+' : ''}{fmt(balance)} €</p>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>{transactions.length} transaction{transactions.length > 1 ? 's' : ''}</p>
        </div>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 20px 16px', borderTop: '3px solid var(--green)' }}>
          <p style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>Revenus</p>
          <p style={{ fontFamily: 'var(--font-title)', fontSize: 28, fontWeight: 700, color: 'var(--green)', lineHeight: 1 }}>+{fmt(income)} €</p>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>{transactions.filter(t => t.type === 'income').length} entrée{transactions.filter(t => t.type === 'income').length > 1 ? 's' : ''}</p>
        </div>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 20px 16px', borderTop: '3px solid var(--red)' }}>
          <p style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>Dépenses</p>
          <p style={{ fontFamily: 'var(--font-title)', fontSize: 28, fontWeight: 700, color: 'var(--red)', lineHeight: 1 }}>-{fmt(expense)} €</p>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>{transactions.filter(t => t.type !== 'income').length} sortie{transactions.filter(t => t.type !== 'income').length > 1 ? 's' : ''}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--white)', marginBottom: 16 }}>Répartition par catégorie</h2>
          {cats.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>Aucune donnée</p>
          ) : cats.map(([cat, val], i) => (
            <div key={cat} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 13, color: 'var(--text)' }}>{cat}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: colors[i % colors.length] }}>{fmt(val)} €</span>
              </div>
              <div style={{ background: 'var(--bg3)', borderRadius: 99, height: 6 }}>
                <div style={{ width: (val / maxVal * 100) + '%', height: '100%', background: colors[i % colors.length], borderRadius: 99, transition: 'width 0.6s ease' }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--white)', marginBottom: 16 }}>Dernières transactions</h2>
          {transactions.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>Aucune transaction</p>
          ) : transactions.slice(0, 6).map(t => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: t.type === 'income' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                  {t.type === 'income' ? '↑' : '↓'}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 1 }}>{t.title}</p>
                  <p style={{ fontSize: 11, color: 'var(--muted)' }}>{t.category || 'Sans catégorie'} · {new Date(t.date).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: t.type === 'income' ? 'var(--green)' : 'var(--red)' }}>
                {t.type === 'income' ? '+' : '-'}{fmt(t.amount)} €
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
