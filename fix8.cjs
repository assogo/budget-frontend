const fs = require('fs');
let c = fs.readFileSync('src/pages/Transactions.tsx', 'utf8');
c = c.replace(
  "const data = res.data['hydra:member'] ?? res.data",
  "const data = res.data['member'] ?? res.data['hydra:member'] ?? res.data"
);
fs.writeFileSync('src/pages/Transactions.tsx', c);

let d = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');
d = d.replace(
  "const data = res.data['hydra:member'] ?? res.data",
  "const data = res.data['member'] ?? res.data['hydra:member'] ?? res.data"
);
fs.writeFileSync('src/pages/Dashboard.tsx', d);
console.log('OK');
