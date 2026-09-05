const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// We want to remove all lines matching `ctx.shadowColor = ...` and `ctx.shadowBlur = ...`
// inside `drawDetailedGun` and `drawPlayer`.

// Let's do a regex replace in the block of drawDetailedGun and drawPlayer.
// First extract drawDetailedGun:
let gunMatch = code.match(/function drawDetailedGun[\s\S]*?(?=\nfunction |$)/);
if(gunMatch){
  let gunCode = gunMatch[0];
  gunCode = gunCode.replace(/ctx\.shadowColor\s*=\s*['"][^'"]+['"];?/g, '');
  gunCode = gunCode.replace(/ctx\.shadowBlur\s*=\s*\d+;?/g, '');
  code = code.replace(gunMatch[0], gunCode);
}

// Now extract drawPlayer
let playerMatch = code.match(/function drawPlayer[\s\S]*?(?=\nfunction |$)/);
if(playerMatch){
  let playerCode = playerMatch[0];
  playerCode = playerCode.replace(/ctx\.shadowColor\s*=\s*['"][^'"]+['"];?/g, '');
  playerCode = playerCode.replace(/ctx\.shadowBlur\s*=\s*\d+;?/g, '');
  code = code.replace(playerMatch[0], playerCode);
}

fs.writeFileSync('index.html', code, 'utf8');
console.log('Fixed shadows');
