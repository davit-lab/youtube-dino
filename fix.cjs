const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const target2 = "// ---------- Airplane Level System ----------";

const endIdx = code.indexOf(target2);

const match = code.match(/z\.hp -= \(b\.type === 'bazooka' \? 50 : 2\);\s+hit = true;\s+spawnParticles\(z\.x \+ z\.w\/2, z\.y \+ z\.h\/2, '#ef4444', 12, 1\.8\);\s+if\(z\.hp <= 0\)\s*\{\s*function drawJetski/);

if(match) {
  const startIdx = match.index + match[0].indexOf('if(z.hp <= 0)');
  
  const replacement = `if(z.hp <= 0) { 
             z.dead = true; state.score += 150; shake(4); 
             spawnParticles(z.x + z.w/2, z.y + z.h/2, '#ef4444', 30, 3);
          }
          break;
        }
      }

      // Boss collision
      if(!hit && jetski.boss && !jetski.boss.dead && overlap({x:b.x-5,y:b.y-5,w:10,h:10}, jetski.boss)){
        jetski.boss.hp -= (b.type === 'bazooka' ? 120 : 1);
        hit = true;
        spawnParticles(b.x, b.y, '#ffffff', 15, 2.5);
        if(b.type === 'bazooka'){
           spawnParticles(b.x, b.y, '#ef4444', 30, 4);
           shake(10);
           sfxZombieHit();
        }
        if(jetski.boss.hp <= 0) { 
           jetski.boss.dead = true; 
           state.score += 5000; 
           shake(25); 
           sfxBossDefeat();
           spawnParticles(jetski.boss.x + jetski.boss.w/2, jetski.boss.y + jetski.boss.h/2, '#ef4444', 150, 6);
        }
      }

      if(hit || b.life <= 0){
        if(b.type === 'bazooka' && hit){
           spawnParticles(b.x, b.y, '#fb923c', 40, 5); // Bazooka AoE explosion effect
        }
        jetski.bullets.splice(i, 1);
      }
    }

    // Boss logic
    if(jetski.boss && !jetski.boss.dead){
      jetski.boss.animT += dt * 0.005;
      if(jetski.boss.x - jetski.x < 1000){
        if(jetski.boss.attackCooldown > 0) jetski.boss.attackCooldown -= dt;
        if(jetski.boss.attackCooldown <= 0){
          jetski.boss.attackCooldown = 1200; // Throw ice boulder
          jetski.enemyBullets.push({
            x: jetski.boss.x, y: jetski.boss.y + 100,
            vx: -14 - Math.random()*3, vy: -6 - Math.random()*2,
            life: 250,
            gravity: 0.2
          });
          shake(6);
          sfxShoot();
        }
      }
    }

    // Enemy bullets logic
    for(let i = jetski.enemyBullets.length - 1; i >= 0; i--){
      const eb = jetski.enemyBullets[i];
      eb.x += eb.vx;
      eb.vy += eb.gravity;
      eb.y += eb.vy;
      eb.life -= dt/16;
      
      if(overlap({x:eb.x-15,y:eb.y-15,w:30,h:30}, {x:jetski.x, y:jetski.y, w:jetski.w, h:jetski.h})){
        jetski.hp -= 30;
        shake(15);
        sfxHurt();
        spawnParticles(eb.x, eb.y, '#93c5fd', 25, 3.5);
        jetski.enemyBullets.splice(i, 1);
        if(jetski.hp <= 0 && !player.dead){
          hurtPlayer("🐻‍❄️ პოლარული დათვის ყინულის ლოდმა გაგანადგურა!", "spike");
        }
        continue;
      }
      if(eb.y > GROUND_Y || eb.life <= 0){
        jetski.enemyBullets.splice(i, 1);
        if(eb.y > GROUND_Y) spawnParticles(eb.x, GROUND_Y, '#93c5fd', 10, 2);
      }
    }

    // Jet propulsion particles
    if(jetski.vx > 2 && Math.random() < 0.6){
       spawnParticles(jetski.x, jetski.y + jetski.h, '#ffffff', 5, 2);
       spawnParticles(jetski.x, jetski.y + jetski.h, '#93c5fd', 3, 1.5);
    }
  }
}

function drawJetski(){
  if(!level || !level.isJetskiLevel) return;

  // Draw jetski if parked
  if(!jetski.active){
    ctx.save();
    ctx.translate(jetski.x - camX, jetski.y);
    ctx.fillStyle = '#0f172a'; // black base
    ctx.fillRect(0, 24, 120, 24);
    ctx.fillStyle = '#1d4ed8'; // blue body
    ctx.beginPath();
    ctx.moveTo(10, 24); ctx.lineTo(100, 24); ctx.lineTo(120, 48); ctx.lineTo(0, 48); ctx.fill();
    ctx.fillStyle = '#94a3b8'; // seat
    ctx.fillRect(40, 16, 40, 8); 
    ctx.fillStyle = '#1e293b'; // handles
    ctx.fillRect(80, 0, 10, 24);
    ctx.fillStyle = '#facc15'; // headlight
    ctx.fillRect(115, 30, 8, 10);
    ctx.restore();
  } else {
    // Active Jetski
    ctx.save();
    ctx.translate(jetski.x - camX, jetski.y);
    const bob = Math.sin(Date.now()*0.02)*2.5;
    
    ctx.fillStyle = '#0f172a'; 
    ctx.fillRect(0, 24 + bob, 120, 24);
    ctx.fillStyle = '#1d4ed8'; 
    ctx.beginPath();
    ctx.moveTo(10, 24 + bob); ctx.lineTo(100, 24 + bob); ctx.lineTo(120, 48 + bob); ctx.lineTo(0, 48 + bob); ctx.fill();
    ctx.fillStyle = '#94a3b8'; 
    ctx.fillRect(40, 16 + bob, 40, 8);
    ctx.fillStyle = '#1e293b'; 
    ctx.fillRect(80, bob, 10, 24);
    
    // Headlight beam
    ctx.fillStyle = 'rgba(250, 204, 21, 0.2)';
    ctx.beginPath();
    ctx.moveTo(120, 30 + bob);
    ctx.lineTo(400, -20 + bob);
    ctx.lineTo(400, 120 + bob);
    ctx.fill();
    ctx.fillStyle = '#facc15'; 
    ctx.fillRect(115, 30 + bob, 8, 10);
    
    // Bazooka on back
    ctx.fillStyle = '#064e3b';
    ctx.fillRect(10, 10 + bob, 30, 12);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(40, 10 + bob, 6, 12);
    ctx.restore();
  }

  // Draw Jetski Bullets
  for(const b of jetski.bullets){
    const bx = b.x - camX;
    if(b.type === 'minigun'){
      ctx.fillStyle = '#facc15';
      ctx.fillRect(bx, b.y, 18, 5);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(bx+10, b.y+1, 8, 3);
    } else {
      // Bazooka rocket
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(bx, b.y - 6, 20, 12);
      ctx.fillStyle = '#ef4444';
      ctx.beginPath(); ctx.arc(bx + 20, b.y, 6, 0, Math.PI*2); ctx.fill();
      // Rocket fire
      ctx.fillStyle = '#fb923c';
      ctx.beginPath(); ctx.arc(bx - 5, b.y, 8 + Math.random()*4, 0, Math.PI*2); ctx.fill();
    }
  }

  // Draw Zombies
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
  }

  // Draw Polar Bear Boss
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
    ctx.restore();

    // Huge Boss Health Bar
    const hbW = 600, hbH = 24;
    const hbX = W/2 - hbW/2;
    const hbY = camY + H - 60;
    
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillRect(hbX, hbY, hbW, hbH);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(hbX, hbY, hbW * Math.max(0, boss.hp/boss.maxHp), hbH);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.strokeRect(hbX, hbY, hbW, hbH);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText("🐻‍❄️ CYBER POLAR BEAR (BOSS)", hbX + hbW/2, hbY - 12);
  }

  // Draw Enemy Bullets (Ice boulders)
  for(const eb of jetski.enemyBullets){
    const ebx = eb.x - camX;
    ctx.fillStyle = '#93c5fd';
    ctx.beginPath(); ctx.arc(ebx, eb.y, 22, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#eff6ff';
    ctx.beginPath(); ctx.arc(ebx-8, eb.y-8, 8, 0, Math.PI*2); ctx.fill();
  }

  // Jetski Player HUD
  if(jetski.active) {
    const hudX = 20;
    const hudY = camY + 80;
    
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fillRect(hudX, hudY, 220, 90);
    ctx.strokeStyle = '#38c6ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(hudX, hudY, 220, 90);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(\`🛵 Jetski HP: \${Math.ceil(jetski.hp)}\`, hudX + 10, hudY + 25);
    ctx.fillStyle = '#facc15';
    ctx.fillText(\`🔫 Minigun: \${jetski.minigunAmmo} / 300 [SPACE]\`, hudX + 10, hudY + 50);
    ctx.fillStyle = '#ef4444';
    ctx.fillText(\`🚀 Bazooka: \${jetski.bazookaAmmo} / 10 [F / RCLICK]\`, hudX + 10, hudY + 75);
  }
}
\n`;
  const newCode = code.substring(0, startIdx) + replacement + code.substring(endIdx);
  fs.writeFileSync('index.html', newCode, 'utf8');
  console.log('Fixed file via match');
} else {
  console.log('No match found');
}
