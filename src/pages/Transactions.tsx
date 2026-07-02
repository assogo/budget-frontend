import { useEffect, useState } from 'react'
import api from '../api/axios'

const emptyForm = { title: '', amount: '', date: '', category: '', type: 'expense' }
const categories = ['Alimentation', 'Transport', 'Logement', 'Santé', 'Loisirs', 'Education', 'Salaire', 'Autre']
const fmt = (n: number) => n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function Transactions() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [filter, setFilter] = useState('all')

  const fetch = () => {
    setLoading(true)
    api.get('/expenses')
      .then(res => {
        const data = res.data['member'] ?? res.data['hydra:member'] ?? res.data
        setTransactions(Array.isArray(data) ? data : [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [])

  const handleSubmit = async () => {
    if (!form.title || !form.amount || !form.date) return
    setSubmitting(true)
    try {
      const payload = { title: form.title, amount: parseFloat(form.amount), date: new Date(form.date).toISOString(), category: form.category, type: form.type }
      if (editId) await api.patch('/expenses/' + editId, payload, { headers: { 'Content-Type': 'application/merge-patch+json' } })
      else await api.post('/expenses', payload)
      setShowForm(false); setForm(emptyForm); setEditId(null); fetch()
    } catch(e) { console.error(e) }
    finally { setSubmitting(false) }
  }

  const handleEdit = (t: any) => {
    setForm({ title: t.title, amount: String(t.amount), date: t.date.slice(0, 10), category: t.category || '', type: t.type || 'expense' })
    setEditId(t.id); setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ?')) return
    await api.delete('/expenses/' + id); fetch()
  }

  const filtered = filter === 'all' ? transactions : transactions.filter(t => t.type === filter)

  const inp = {
    width: '100%', padding: '10px 12px',
    background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: 8, fontSize: 13, color: 'var(--text)',
    outline: 'none', boxSizing: 'border-box' as const,
  }

  return (
    <div style={{ padding: '24px 20px', maxWidth: 960, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-title)', fontSize: 22, fontWeight: 700, color: 'var(--white)', marginBottom: 4 }}>Transactions</h1>
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>{filtered.length} transaction{filtered.length > 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm) }} style={{
          background: 'var(--blue)', color: '#fff', border: 'none',
          borderRadius: 10, padding: '9px 18px', fontSize: 13, fontWeight: 600,
        }}>+ Nouvelle transaction</button>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {[['all','Toutes'],['income','Revenus'],['expense','Dépenses']].map(([f, l]) => (
          <button key={f} onClick={() => setFilter(f)} style={{
            background: filter === f ? 'var(--blue-dim)' : 'var(--bg2)',
            color: filter === f ? 'var(--blue)' : 'var(--muted)',
            border: filter === f ? '1px solid rgba(74,144,217,0.3)' : '1px solid var(--border)',
            borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: filter === f ? 600 : 400,
          }}>{l}</button>
        ))}
      </div>

      {showForm && (
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px', marginBottom: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--white)', marginBottom: 16 }}>{editId ? 'Modifier' : 'Nouvelle transaction'}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Titre</label>
              <input style={inp} placeholder="Ex: Courses" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Montant (€)</label>
              <input style={inp} type="number" placeholder="0.00" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Type</label>
              <select style={inp} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option value="expense">Dépense</option>
                <option value="income">Revenu</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Catégorie</label>
              <select style={inp} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option value="">-- Choisir --</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</label>
              <input style={inp} type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
            <button onClick={() => { setShowForm(false); setEditId(null) }} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: 8, padding: '8px 16px', fontSize: 13 }}>Annuler</button>
            <button onClick={handleSubmit} disabled={submitting} style={{ background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 600, opacity: submitting ? 0.7 : 1 }}>
              {submitting ? 'Enregistrement...' : editId ? 'Mettre à jour' : 'Enregistrer'}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px 0', fontSize: 14 }}>Chargement...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '60px 0' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
          <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>Aucune transaction</p>
          <p style={{ fontSize: 13 }}>Ajoutez votre première transaction pour commencer</p>
        </div>
      ) : (
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
          {filtered.map((t, i) => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none', flexWrap: 'wrap', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: t.type === 'income' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: t.type === 'income' ? 'var(--green)' : 'var(--red)', flexShrink: 0 }}>
                  {t.type === 'income' ? '↑' : '↓'}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>{t.title}</p>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                    {t.category && <span style={{ fontSize: 11, background: 'var(--blue-dim)', color: 'var(--blue)', padding: '1px 8px', borderRadius: 99, fontWeight: 500 }}>{t.category}</span>}
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>{new Date(t.date).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: t.type === 'income' ? 'var(--green)' : 'var(--red)', fontFamily: 'var(--font-title)' }}>
                  {t.type === 'income' ? '+' : '-'}{fmt(t.amount)} €
                </span>
                <button onClick={() => handleEdit(t)} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 7, padding: '5px 10px', color: 'var(--muted)', fontSize: 13 }}>✏️</button>
                <button onClick={() => handleDelete(t.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 7, padding: '5px 10px', color: 'var(--red)', fontSize: 13 }}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
