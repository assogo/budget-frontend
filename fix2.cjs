const fs = require('fs');
const content = `import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Dashboard() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/expenses')
      .then(res => {
        const data = res.data['hydra:member'] ?? res.data
        setTransactions(Array.isArray(data) ? data : [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const total = transactions.reduce((sum, t) => sum + t.amount, 0)

  if (loading) return <div style={{padding:40,textAlign:'center',color:'#888'}}>Chargement...</div>

  return (
    <div style={{padding:'28px 24px',maxWidth:900,margin:'0 auto'}}>
      <h1 style={{fontSize:24,fontWeight:600,color:'#1a7a45',margin:'0 0 24px'}}>Dashboard</h1>
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:16,marginBottom:24}}>
        <div style={{background:'#fff',borderRadius:12,padding:20,border:'1px solid #e8e8e8',borderTop:'4px solid #e74c3c'}}>
          <span style={{display:'block',fontSize:12,color:'#888',marginBottom:8}}>Total depenses</span>
          <span style={{fontSize:26,fontWeight:700,color:'#e74c3c'}}>-{total.toFixed(2)} euro</span>
        </div>
        <div style={{background:'#fff',borderRadius:12,padding:20,border:'1px solid #e8e8e8',borderTop:'4px solid #2ECC71'}}>
          <span style={{display:'block',fontSize:12,color:'#888',marginBottom:8}}>Nombre de depenses</span>
          <span style={{fontSize:26,fontWeight:700,color:'#2ECC71'}}>{transactions.length}</span>
        </div>
      </div>
      <div style={{background:'#fff',borderRadius:12,padding:20,border:'1px solid #e8e8e8'}}>
        <h2 style={{fontSize:16,fontWeight:600,color:'#222',margin:'0 0 16px'}}>Depenses recentes</h2>
        {transactions.length===0 ? (
          <div style={{textAlign:'center',color:'#bbb',fontSize:14,padding:'20px 0'}}>Aucune depense. Ajoutez-en une !</div>
        ) : (
          transactions.slice(0,5).map(t => (
            <div key={t.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid #f5f5f5'}}>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <span style={{fontSize:22}}>💸</span>
                <div>
                  <div style={{fontSize:14,fontWeight:500}}>{t.title}</div>
                  <div style={{fontSize:12,color:'#aaa'}}>{new Date(t.date).toLocaleDateString('fr-FR')}</div>
                </div>
              </div>
              <span style={{fontSize:15,fontWeight:600,color:'#e74c3c'}}>-{t.amount.toFixed(2)} euro</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
`;
fs.writeFileSync('src/pages/Dashboard.tsx', content);
console.log('OK');
