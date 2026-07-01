const fs = require('fs');

const types = `export interface Transaction {
  id: number
  title: string
  amount: number
  date: string
  category?: string
  type?: string
}
`;
fs.writeFileSync('src/types/index.ts', types);

const transactions = `import { useEffect, useState } from 'react'
import api from '../api/axios'
import type { Transaction } from '../types'

const emptyForm = { title: '', amount: '', date: '', category: '', type: 'expense' }
const categories = ['Alimentation', 'Transport', 'Logement', 'Sante', 'Loisirs', 'Education', 'Autre']

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [filter, setFilter] = useState('all')

  const fetchTransactions = () => {
    setLoading(true)
    api.get('/expenses')
      .then(res => {
        const data = res.data['member'] ?? res.data['hydra:member'] ?? res.data
        setTransactions(Array.isArray(data) ? data : [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchTransactions() }, [])

  const handleSubmit = async () => {
    if (!form.title || !form.amount || !form.date) return
    setSubmitting(true)
    try {
      const payload = { title: form.title, amount: parseFloat(form.amount), date: new Date(form.date).toISOString(), category: form.category, type: form.type }
      if (editId) {
        await api.patch('/expenses/' + editId, payload, { headers: { 'Content-Type': 'application/merge-patch+json' } })
      } else {
        await api.post('/expenses', payload)
      }
      setShowForm(false)
      setForm(emptyForm)
      setEditId(null)
      fetchTransactions()
    } catch(e) { console.error(e) }
    finally { setSubmitting(false) }
  }

  const handleEdit = (t) => {
    setForm({ title: t.title, amount: String(t.amount), date: t.date.slice(0,10), category: t.category || '', type: t.type || 'expense' })
    setEditId(t.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette depense ?')) return
    await api.delete('/expenses/' + id)
    fetchTransactions()
  }

  const filtered = filter === 'all' ? transactions : transactions.filter(t => t.type === filter)

  const typeIcon = (t) => t.type === 'income' ? '📈' : '📉'
  const typeColor = (t) => t.type === 'income' ? '#2ECC71' : '#e74c3c'
  const typeSign = (t) => t.type === 'income' ? '+' : '-'

  return (
    <div style={{padding:'28px 24px',maxWidth:900,margin:'0 auto'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <h1 style={{fontSize:24,fontWeight:600,color:'#1a7a45',margin:0}}>Transactions</h1>
        <button style={{background:'#2ECC71',color:'#fff',border:'none',borderRadius:8,padding:'10px 20px',fontSize:14,fontWeight:600,cursor:'pointer'}}
          onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm) }}>+ Ajouter</button>
      </div>

      <div style={{display:'flex',gap:8,marginBottom:20}}>
        {['all','income','expense'].map(f => (
          <button key={f}
            style={{background:filter===f?'#f0fdf4':'#f5f5f5',border:filter===f?'1.5px solid #2ECC71':'1px solid #e0e0e0',borderRadius:20,padding:'6px 16px',fontSize:13,cursor:'pointer',color:filter===f?'#1a7a45':'#555',fontWeight:filter===f?600:400}}
            onClick={() => setFilter(f)}>
            {f==='all'?'Toutes':f==='income'?'Revenus':'Depenses'}
          </button>
        ))}
      </div>

      {showForm && (
        <div style={{background:'#fff',borderRadius:12,padding:24,border:'1px solid #d4f5e0',marginBottom:24}}>
          <h2 style={{fontSize:16,fontWeight:600,color:'#1a7a45',margin:'0 0 20px'}}>{editId?'Modifier':'Nouvelle transaction'}</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12}}>
            <div><label style={{display:'block',fontSize:12,fontWeight:600,color:'#555',marginBottom:4}}>Titre</label>
              <input style={{width:'100%',padding:'9px 12px',border:'1.5px solid #e0e0e0',borderRadius:8,fontSize:14,boxSizing:'border-box'}}
                placeholder="Ex: Courses Lidl" value={form.title} onChange={e => setForm({...form,title:e.target.value})} /></div>
            <div><label style={{display:'block',fontSize:12,fontWeight:600,color:'#555',marginBottom:4}}>Montant (euro)</label>
              <input style={{width:'100%',padding:'9px 12px',border:'1.5px solid #e0e0e0',borderRadius:8,fontSize:14,boxSizing:'border-box'}}
                type="number" placeholder="0.00" value={form.amount} onChange={e => setForm({...form,amount:e.target.value})} /></div>
            <div><label style={{display:'block',fontSize:12,fontWeight:600,color:'#555',marginBottom:4}}>Type</label>
              <select style={{width:'100%',padding:'9px 12px',border:'1.5px solid #e0e0e0',borderRadius:8,fontSize:14,boxSizing:'border-box'}}
                value={form.type} onChange={e => setForm({...form,type:e.target.value})}>
                <option value="expense">Depense</option>
                <option value="income">Revenu</option>
              </select></div>
            <div><label style={{display:'block',fontSize:12,fontWeight:600,color:'#555',marginBottom:4}}>Categorie</label>
              <select style={{width:'100%',padding:'9px 12px',border:'1.5px solid #e0e0e0',borderRadius:8,fontSize:14,boxSizing:'border-box'}}
                value={form.category} onChange={e => setForm({...form,category:e.target.value})}>
                <option value="">-- Choisir --</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select></div>
            <div><label style={{display:'block',fontSize:12,fontWeight:600,color:'#555',marginBottom:4}}>Date</label>
              <input style={{width:'100%',padding:'9px 12px',border:'1.5px solid #e0e0e0',borderRadius:8,fontSize:14,boxSizing:'border-box'}}
                type="date" value={form.date} onChange={e => setForm({...form,date:e.target.value})} /></div>
          </div>
          <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:20}}>
            <button style={{background:'none',border:'1.5px solid #e0e0e0',borderRadius:8,padding:'8px 18px',fontSize:13,cursor:'pointer',color:'#888'}}
              onClick={() => { setShowForm(false); setEditId(null) }}>Annuler</button>
            <button style={{background:'#2ECC71',color:'#fff',border:'none',borderRadius:8,padding:'8px 22px',fontSize:13,fontWeight:600,cursor:'pointer',opacity:submitting?0.7:1}}
              onClick={handleSubmit} disabled={submitting}>{submitting?'Enregistrement...':editId?'Mettre a jour':'Enregistrer'}</button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{textAlign:'center',color:'#888',padding:'40px 0'}}>Chargement...</div>
      ) : filtered.length === 0 ? (
        <div style={{textAlign:'center',color:'#bbb',padding:'40px 0',fontSize:14}}>Aucune transaction.</div>
      ) : (
        <div style={{background:'#fff',borderRadius:12,border:'1px solid #e8e8e8',overflow:'hidden'}}>
          {filtered.map(t => (
            <div key={t.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 20px',borderBottom:'1px solid #f5f5f5'}}>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <span style={{fontSize:22}}>{typeIcon(t)}</span>
                <div>
                  <div style={{fontSize:14,fontWeight:500,color:'#222'}}>{t.title}</div>
                  <div style={{display:'flex',gap:8,marginTop:2}}>
                    {t.category && <span style={{background:'#f0fdf4',color:'#1a7a45',fontSize:11,padding:'2px 8px',borderRadius:10,fontWeight:500}}>{t.category}</span>}
                    <span style={{fontSize:12,color:'#aaa'}}>{new Date(t.date).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <span style={{fontSize:15,fontWeight:700,color:typeColor(t)}}>{typeSign(t)}{t.amount.toFixed(2)} euro</span>
                <button style={{background:'#f5f5f5',border:'none',borderRadius:6,padding:'4px 8px',cursor:'pointer'}} onClick={() => handleEdit(t)}>✏️</button>
                <button style={{background:'#fff0f0',border:'none',borderRadius:6,padding:'4px 8px',cursor:'pointer'}} onClick={() => handleDelete(t.id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
`;
fs.writeFileSync('src/pages/Transactions.tsx', transactions);
console.log('OK');
