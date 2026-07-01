const fs = require('fs');
let c = fs.readFileSync('src/pages/Transactions.tsx', 'utf8');
c = c.replace(
  'const fetchTransactions = () => {\n    api.get(\'/expenses\')\n      .then(res => {\n        const data = res.data[\'hydra:member\'] ?? res.data\n        setTransactions(Array.isArray(data) ? data : [])\n      })\n      .catch(console.error)\n      .finally(() => setLoading(false))\n  }',
  'const fetchTransactions = () => {\n    setLoading(true)\n    api.get(\'/expenses\')\n      .then(res => {\n        const data = res.data[\'hydra:member\'] ?? res.data\n        setTransactions(Array.isArray(data) ? data : [])\n      })\n      .catch(console.error)\n      .finally(() => setLoading(false))\n  }'
);
fs.writeFileSync('src/pages/Transactions.tsx', c);
console.log('OK');
