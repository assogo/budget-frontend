import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Dashboard() {
  const [transactions, setTransactions] = useState([])
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

  const income = transactions.filter(t => t.type === 'income').reduce((s,t) => s + t.amount, 0)
  const expense = transactions.filter(t => t.type !== 'income').reduce((s,t) => s + t.amount, 0)
  const balance = income - expense

  const byCategory = transactions.reduce((acc, t) => {
    const cat = t.category || 'Autre'
    acc[cat] = (acc[cat] || 0) + t.amount
    return acc
  }, {})

  const colors = ['#2ECC71','#3498db','#e74c3c','#f39c12','#9b59b6','#1abc9c','#e67e22']
  const cats = Object.entries(byCategory).sort((a,b) => b[1]-a[1])
  const maxVal = cats.length > 0 ? cats[0][1] : 1

  if (loading) return <div style={{padding:40,textAlign:'center',color:'#888'}}>Chargement...</div>

  return (
    <div style={{padding:'28px 24px',maxWidth:900,margin:'0 auto'}}>
      <h1 style={{fontSize:24,fontWeight:600,color:'#1a7a45',margin:'0 0 24px'}}>Dashboard</h1>

      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:24}}>
        <div style={{background:'#fff',borderRadius:12,padding:20,border:'1px solid #e8e8e8',borderTop:'4px solid #2ECC71'}}>
          <span style={{display:'block',fontSize:12,color:'#888',marginBottom:8,textTransform:'uppercase',letterSpacing:'0.5px'}}>Solde</span>
          <span style={{fontSize:26,fontWeight:700,color:balance>=0?'#2ECC71':'#e74c3c'}}>{balance>=0?'+':''}{balance.toFixed(2)} euro</span>
        </div>
        <div style={{background:'#fff',borderRadius:12,padding:20,border:'1px solid #e8e8e8',borderTop:'4px solid #3498db'}}>
          <span style={{display:'block',fontSize:12,color:'#888',marginBottom:8,textTransform:'uppercase',letterSpacing:'0.5px'}}>Revenus</span>
          <span style={{fontSize:26,fontWeight:700,color:'#3498db'}}>+{income.toFixed(2)} euro</span>
        </div>
        <div style={{background:'#fff',borderRadius:12,padding:20,border:'1px solid #e8e8e8',borderTop:'4px solid #e74c3c'}}>
          <span style={{display:'block',fontSize:12,color:'#888',marginBottom:8,textTransform:'uppercase',letterSpacing:'0.5px'}}>Depenses</span>
          <span style={{fontSize:26,fontWeight:700,color:'#e74c3c'}}>-{expense.toFixed(2)} euro</span>
        </div>
      </div>

      {cats.length > 0 && (
        <div style={{background:'#fff',borderRadius:12,padding:24,border:'1px solid #e8e8e8',marginBottom:24}}>
          <h2 style={{fontSize:16,fontWeight:600,color:'#222',margin:'0 0 20px'}}>Repartition par categorie</h2>
          {cats.map(([cat, val], i) => (
            <div key={cat} style={{marginBottom:14}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                <span style={{fontSize:13,fontWeight:500,color:'#444'}}>{cat}</span>
                <span style={{fontSize:13,fontWeight:600,color:colors[i%colors.length]}}>{val.toFixed(2)} euro</span>
              </div>
              <div style={{background:'#f0f0f0',borderRadius:99,height:8,overflow:'hidden'}}>
                <div style={{width:(val/maxVal*100)+'%',height:'100%',background:colors[i%colors.length],borderRadius:99,transition:'width 0.5s'}} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{background:'#fff',borderRadius:12,padding:20,border:'1px solid #e8e8e8'}}>
        <h2 style={{fontSize:16,fontWeight:600,color:'#222',margin:'0 0 16px'}}>Transactions recentes</h2>
        {transactions.length===0 ? (
          <div style={{textAlign:'center',color:'#bbb',fontSize:14,padding:'20px 0'}}>Aucune transaction. Ajoutez-en une !</div>
        ) : (
          transactions.slice(0,5).map(t => (
            <div key={t.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid #f5f5f5'}}>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <span style={{fontSize:22}}>{t.type==='income'?'📈':'📉'}</span>
                <div>
                  <div style={{fontSize:14,fontWeight:500}}>{t.title}</div>
                  <div style={{display:'flex',gap:6,marginTop:2}}>
                    {t.category && <span style={{background:'#f0fdf4',color:'#1a7a45',fontSize:11,padding:'1px 6px',borderRadius:8}}>{t.category}</span>}
                    <span style={{fontSize:12,color:'#aaa'}}>{new Date(t.date).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </div>
              <span style={{fontSize:15,fontWeight:600,color:t.type==='income'?'#2ECC71':'#e74c3c'}}>
                {t.type==='income'?'+':'-'}{t.amount.toFixed(2)} euro
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
