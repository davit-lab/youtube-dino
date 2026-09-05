const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// Improve Zombie Design
const zombieDrawTarget = `  // Draw Zombies
  for(const z of jetski.zombies){
    if(z.dead) continue;
    const zx = z.x - camX;
    // Cyber-zombie look
    ctx.fillStyle = '#166534'; // dark green
    ctx.fillRect(zx, z.y, z.w, z.h);
    ctx.fillStyle = '#ef4444'; // glowing red eye
    ctx.fillRect(zx+25, z.y+10, 8, 8);
    ctx.fillStyle = '#1e293b'; // armor
    ctx.fillRect(zx-5, z.y+20, z.w+10, 25);
    
    // health
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(zx, z.y-12, z.w, 6);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(zx, z.y-12, z.w * Math.max(0, z.hp/z.maxHp), 6);
  }`;

const newZombieDraw = `  // Draw Zombies
  for(const z of jetski.zombies){
    if(z.dead) continue;
    const zx = z.x - camX;
    ctx.save();
    ctx.translate(zx + z.w/2, z.y + z.h/2);
    const walkBob = Math.sin(Date.now() * 0.005 + z.x) * 4;
    
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath(); ctx.ellipse(0, z.h/2, 20, 5, 0, 0, Math.PI*2); ctx.fill();

    ctx.translate(0, walkBob);

    // Zombie Body - Frostbitten blueish green
    ctx.fillStyle = '#0f766e';
    if(ctx.roundRect) {
       ctx.beginPath(); ctx.roundRect(-20, -15, 40, 45, 10); ctx.fill();
    } else {
       ctx.fillRect(-20, -15, 40, 45);
    }
    
    // Zombie Head
    ctx.fillStyle = '#115e59';
    ctx.beginPath(); ctx.arc(0, -25, 18, 0, Math.PI*2); ctx.fill();
    
    // Cyber Visor / Eye
    ctx.fillStyle = '#020617';
    ctx.fillRect(-5, -30, 22, 10);
    ctx.fillStyle = '#ef4444'; // glowing red eye
    ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.arc(10, -25, 4, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;

    // Cybernetic Arm / Weapon
    ctx.fillStyle = '#475569';
    ctx.fillRect(-5, -5, 35, 12);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(25, -3, 6, 8);

    // Armor Plates
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-25, 0, 15, 20);
    ctx.fillRect(10, 0, 15, 20);

    ctx.restore();
    
    // health
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(zx, z.y-15, z.w, 6);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(zx, z.y-15, z.w * Math.max(0, z.hp/z.maxHp), 6);
  }`;
code = code.replace(zombieDrawTarget, newZombieDraw);

// Improve Polar Bear Boss Design
const bossDrawTarget = `  // Draw Polar Bear Boss
  const boss = jetski.boss;
  if(boss && !boss.dead){
    const bob = Math.sin(boss.animT)*12;
    ctx.save();
    ctx.translate(boss.x - camX, boss.y + bob);
    
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath(); ctx.ellipse(boss.w/2, boss.h - bob, boss.w/2.5, 15, 0, 0, Math.PI*2); ctx.fill();

    // Bear Body (Thick Fur)
    ctx.fillStyle = '#f8fafc'; 
    if(ctx.roundRect){
       ctx.beginPath(); ctx.roundRect(0, 0, boss.w, boss.h, 40); ctx.fill();
    } else {
       ctx.fillRect(0, 0, boss.w, boss.h);
    }
    
    // Cyber Armor plates
    ctx.fillStyle = '#334155';
    ctx.fillRect(20, 20, 60, 40);
    ctx.fillRect(80, 20, 60, 40);
    ctx.fillStyle = '#38c6ff';
    ctx.fillRect(40, 30, 20, 10);
    ctx.fillRect(100, 30, 20, 10);

    // Huge Claws
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath(); ctx.moveTo(-20, 120); ctx.lineTo(40, 160); ctx.lineTo(0, 180); ctx.fill();
    
    // Vicious Face
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath(); ctx.arc(boss.w - 30, 60, 45, 0, Math.PI*2); ctx.fill();
    // Glowing red robotic eye
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 15;
    ctx.beginPath(); ctx.arc(boss.w - 15, 45, 12, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;
    
    // Snout
    ctx.fillStyle = '#0f172a';
    ctx.beginPath(); ctx.arc(boss.w + 10, 70, 18, 0, Math.PI*2); ctx.fill();
    // Jaws
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(boss.w - 30, 85, 40, 15);
    ctx.fillStyle = '#fef08a'; // Sharp teeth
    ctx.beginPath(); ctx.moveTo(boss.w - 30, 85); ctx.lineTo(boss.w - 20, 105); ctx.lineTo(boss.w - 10, 85); ctx.fill();
    ctx.beginPath(); ctx.moveTo(boss.w - 10, 85); ctx.lineTo(boss.w, 105); ctx.lineTo(boss.w + 10, 85); ctx.fill();
    ctx.restore();`;

const newBossDraw = `  // Draw Polar Bear Boss
  const boss = jetski.boss;
  if(boss && !boss.dead){
    const bob = Math.sin(boss.animT)*12;
    ctx.save();
    ctx.translate(boss.x - camX, boss.y + bob);
    
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath(); ctx.ellipse(boss.w/2, boss.h - bob, boss.w/2.2, 18, 0, 0, Math.PI*2); ctx.fill();

    // --- High-Quality Mecha Polar Bear Design ---
    
    // 1. Back Legs / Propulsion
    ctx.fillStyle = '#64748b'; // dark metal
    ctx.beginPath(); ctx.arc(40, boss.h - 20, 30, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#38bdf8'; // glowing jet
    ctx.beginPath(); ctx.ellipse(40, boss.h, 20, 10, 0, 0, Math.PI*2); ctx.fill();

    // 2. Main Cybernetic Body
    ctx.fillStyle = '#e2e8f0'; // bright white metal
    ctx.beginPath(); 
    ctx.moveTo(30, 40);
    ctx.lineTo(boss.w - 40, 20);
    ctx.lineTo(boss.w - 10, boss.h - 50);
    ctx.lineTo(20, boss.h - 20);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#94a3b8';
    ctx.stroke();
    
    // 3. Thick Fur / Mane around neck
    ctx.fillStyle = '#ffffff';
    for(let i=0; i<5; i++) {
        ctx.beginPath(); ctx.arc(boss.w - 70 + i*15, 30 + Math.sin(i)*10, 25, 0, Math.PI*2); ctx.fill();
    }

    // 4. Heavy Armor Plates
    ctx.fillStyle = '#1e293b'; // dark steel
    ctx.fillRect(40, 30, 70, 45);
    ctx.fillStyle = '#3b82f6'; // glowing core lines
    ctx.fillRect(50, 40, 50, 6);
    ctx.fillRect(50, 55, 50, 6);
    
    // 5. Huge Cyber Claws (Front)
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath(); ctx.arc(boss.w - 40, boss.h - 30, 35, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ef4444'; // laser blades
    ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 15;
    ctx.beginPath(); ctx.moveTo(boss.w - 30, boss.h - 40); ctx.lineTo(boss.w + 40, boss.h + 10); ctx.lineTo(boss.w - 20, boss.h - 10); ctx.fill();
    ctx.beginPath(); ctx.moveTo(boss.w - 50, boss.h - 20); ctx.lineTo(boss.w + 30, boss.h + 30); ctx.lineTo(boss.w - 40, boss.h + 10); ctx.fill();
    ctx.shadowBlur = 0;

    // 6. Vicious Mecha Bear Head
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath(); ctx.ellipse(boss.w - 20, 60, 55, 45, -0.2, 0, Math.PI*2); ctx.fill();
    
    // Cyborg Eye (Scanner)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(boss.w - 40, 40, 35, 20);
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 20;
    ctx.beginPath(); ctx.arc(boss.w - 20, 50, 8, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;
    
    // Snout & Jaws
    ctx.fillStyle = '#020617';
    ctx.beginPath(); ctx.arc(boss.w + 30, 70, 12, 0, Math.PI*2); ctx.fill(); // Nose
    
    ctx.fillStyle = '#dc2626'; // open mouth
    ctx.beginPath(); ctx.moveTo(boss.w - 10, 85); ctx.lineTo(boss.w + 20, 80); ctx.lineTo(boss.w + 15, 105); ctx.fill();
    
    // Titanium Teeth
    ctx.fillStyle = '#e2e8f0'; 
    ctx.beginPath(); ctx.moveTo(boss.w - 5, 85); ctx.lineTo(boss.w + 5, 95); ctx.lineTo(boss.w + 10, 82); ctx.fill();
    ctx.beginPath(); ctx.moveTo(boss.w + 5, 100); ctx.lineTo(boss.w + 12, 90); ctx.lineTo(boss.w + 15, 102); ctx.fill();

    // Metallic Ear
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath(); ctx.arc(boss.w - 50, 25, 15, 0, Math.PI*2); ctx.fill();

    ctx.restore();`;
code = code.replace(bossDrawTarget, newBossDraw);

fs.writeFileSync('index.html', code, 'utf8');
console.log('Fixed zombie and boss design');
