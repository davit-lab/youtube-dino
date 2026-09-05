const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const functionsToClean = [
  'drawZombie',
  'drawGodzilla',
  'drawFinalBoss',
  'drawPlayer',
  'drawDetailedGun'
];

for(const funcName of functionsToClean){
  let regex = new RegExp('function ' + funcName + '[\\s\\S]*?(?=\\nfunction |$)', 'g');
  let matches = code.match(regex);
  if(matches){
    let funcCode = matches[0];
    funcCode = funcCode.replace(/ctx\.shadowColor\s*=\s*['"][^'"]+['"];?/g, '');
    funcCode = funcCode.replace(/ctx\.shadowBlur\s*=\s*\d+;?/g, '');
    code = code.replace(matches[0], funcCode);
  }
}

fs.writeFileSync('index.html', code, 'utf8');
console.log('Fixed all character shadows');
