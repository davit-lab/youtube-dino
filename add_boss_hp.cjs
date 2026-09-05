const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const targetStr = "    ctx.restore();";
const index = code.lastIndexOf("ctx.restore();", code.indexOf("function drawParticles()"));

const hpBar = `
    ctx.restore();
    
    // Boss HP Bar
    const bx = boss.x - camX;
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(bx, boss.y - 30, boss.w, 15);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(bx, boss.y - 30, boss.w * Math.max(0, boss.hp/boss.maxHp), 15);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MECHA-BEAR', bx + boss.w/2, boss.y - 18);
    ctx.textAlign = 'left';
`;

code = code.substring(0, index) + hpBar + code.substring(index + "    ctx.restore();".length);
fs.writeFileSync('index.html', code, 'utf8');
console.log('Added boss HP bar');
