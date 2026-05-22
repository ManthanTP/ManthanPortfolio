const fs = require('fs');

const content = fs.readFileSync('c:/Users/dp862/OneDrive/Desktop/ManthanPortfolio/src/pages/Home.tsx', 'utf-8');

const lines = content.split('\n');

let depth = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // crude match for open <div
  const opens = (line.match(/<div(\s|>)/g) || []).length;
  // crude match for close </div
  const closes = (line.match(/<\/div>/g) || []).length;
  
  // self closing <div />
  const selfClosing = (line.match(/<div[^>]*\/>/g) || []).length;
  
  depth += (opens - selfClosing) - closes;
  
  console.log(`${i+1}: depth=${depth} opens=${opens} closes=${closes} selfClosing=${selfClosing} | ${line.trim()}`);
}
