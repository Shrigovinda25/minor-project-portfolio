const fs = require('fs');
const content = fs.readFileSync('..\\UGV_Review_Paper.tex', 'utf8');

const bibitems = [];
const bibitemRegex = /\\bibitem\{([^}]+)\}/g;
let match;
while ((match = bibitemRegex.exec(content)) !== null) {
  bibitems.push(match[1]);
}

const cited = new Set();
const citeRegex = /\\cite\{([^}]+)\}/g;
while ((match = citeRegex.exec(content)) !== null) {
  match[1].split(',').map(s => s.trim()).forEach(key => cited.add(key));
}

console.log('Total bibitems found:', bibitems.length);
console.log('Total unique keys cited:', cited.size);
const uncited = bibitems.filter(item => !cited.has(item));
console.log('Uncited keys:', uncited);

const notInBib = [...cited].filter(key => !bibitems.includes(key));
console.log('Cited keys not in bibliography:', notInBib);
