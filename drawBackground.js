function drawBackground(theme){
  if(!theme || theme === 'pink' || theme === 'blue'){
    if(level && level.theme) theme = level.theme;
    else theme = 'dusk_suburbs';
  }

  switch(theme){
    case 'dusk_suburbs': {
      // 1. Sunset Suburbs
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0, '#1c0a2a');
      g.addColorStop(0.35, '#5c1d47');
      g.addColorStop(0.7, '#d94f38');
      g.addColorStop(1, '#f39c12');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);

      // Giant Setting Sun
      ctx.save();
      const sunX = W * 0.72 - (camX * 0.03) % W;
      const sunGrad = ctx.createRadialGradient(sunX, 160, 20, sunX, 160, 110);
      sunGrad.addColorStop(0, '#ffffff');
      sunGrad.addColorStop(0.4, '#ffd23f');
      sunGrad.addColorStop(1, 'rgba(243, 156, 18, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath(); ctx.arc(sunX, 160, 110, 0, Math.PI*2); ctx.fill();
      ctx.restore();

      // Suburb Hills Parallax (Seamless)
      for(let layer=0; layer<3; layer++){
        const speed = 0.08 + layer*0.08;
        const color = layer===0 ? 'rgba(74, 21, 56, 0.45)' : layer===1 ? 'rgba(110, 35, 60, 0.55)' : 'rgba(145, 45, 55, 0.65)';
        ctx.fillStyle = color;
        const spacing = 480;
        const offset = (camX * speed) % spacing;
        for(let x = -spacing; x < W + spacing; x += spacing){
          const bx = x - offset;
          ctx.beginPath();
          ctx.ellipse(bx + spacing/2, GROUND_Y+40+layer*15, spacing*0.7, 120-layer*20, 0, Math.PI, Math.PI*2);
          ctx.fill();
        }
      }
      break;
    }

    case 'cyberpunk_alley': {
      // 2. Neon Cyberpunk Alleyway
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0, '#040612');
      g.addColorStop(0.5, '#0d1733');
      g.addColorStop(1, '#1e0a38');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);

      // Neon Ringed Cyber Orb
      ctx.save();
      const orbX = W * 0.8 - (camX * 0.04) % W;
      ctx.fillStyle = 'rgba(0, 240, 255, 0.22)';
      ctx.beginPath(); ctx.arc(orbX, 110, 65, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = '#38c6ff'; ctx.lineWidth = 3; ctx.stroke();
      ctx.strokeStyle = '#ff00aa'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.ellipse(orbX, 110, 95, 22, -0.2, 0, Math.PI*2); ctx.stroke();
      ctx.restore();

      // Cyber Skyscrapers (Seamless)
      const spacing = 320;
      const speed = 0.15;
      const offset = (camX * speed) % (spacing * 10);
      for(let i=-2; i<12; i++){
        const bx = i*spacing - offset;
        if(bx < -spacing || bx > W + spacing) continue;
        const bh = 180 + ((Math.abs(i)*37)%140);
        ctx.fillStyle = '#0a0d1a';
        ctx.fillRect(bx, GROUND_Y-bh, 160, bh+200);
        
        // Neon windows
        ctx.fillStyle = i % 2 === 0 ? '#ff00aa' : '#00f0ff';
        if((i % 3) !== 0) {
          for(let wy=GROUND_Y-bh+20; wy < GROUND_Y-20; wy += 40) {
             ctx.fillRect(bx+20, wy, 4, 15);
             ctx.fillRect(bx+136, wy, 4, 15);
          }
        }
      }
      break;
    }
    case 'horror_ruins': {
      // 3. CodeZero Horror Library Ruins
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0, '#0a0105');
      g.addColorStop(0.5, '#2e0416');
      g.addColorStop(1, '#520829');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);

      // Blood Red Moon
      ctx.save();
      const moonX = W * 0.7 - (camX * 0.03) % W;
      ctx.fillStyle = '#dc2626';
      ctx.shadowColor = '#dc2626'; ctx.shadowBlur = 35;
      ctx.beginPath(); ctx.arc(moonX, 100, 60, 0, Math.PI*2); ctx.fill();
      ctx.restore();

      // Gothic Pillars & Red Eyes
      for(let i=-1; i<10; i++){
        const px = (i*280 - camX*0.18) % (280*10);
        ctx.fillStyle = '#18030e';
        ctx.fillRect(px, GROUND_Y-220, 45, 240);
        ctx.fillRect(px-10, GROUND_Y-230, 65, 15);
        ctx.fillRect(px-10, GROUND_Y-10, 65, 15);

        const blink = Math.sin(state.time*0.005 + i) > 0.1;
        if(blink){
          ctx.fillStyle = '#ff0033';
          ctx.fillRect(px + 12, GROUND_Y - 140, 5, 4);
          ctx.fillRect(px + 24, GROUND_Y - 140, 5, 4);
        }
      }
      break;
    }

    case 'desert_canyon': {
      // 4. Golden Desert Canyon
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0, '#2b0d02');
      g.addColorStop(0.35, '#803303');
      g.addColorStop(0.7, '#d97706');
      g.addColorStop(1, '#fbbf24');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);

      // Blazing Sun
      ctx.save();
      const bSunX = W * 0.5 - (camX * 0.02) % W;
      ctx.fillStyle = '#ffffff'; ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 40;
      ctx.beginPath(); ctx.arc(bSunX, 120, 55, 0, Math.PI*2); ctx.fill();
      ctx.restore();

      // Red Rock Canyons (Seamless)
      for(let layer=0; layer<3; layer++){
        const speed = 0.07 + layer*0.07;
        ctx.fillStyle = layer===0 ? 'rgba(120, 40, 10, 0.4)' : layer===1 ? 'rgba(160, 55, 15, 0.55)' : 'rgba(200, 75, 20, 0.7)';
        const spacing = 420;
        const offset = (camX * speed) % spacing;
        for(let x = -spacing; x < W + spacing; x += spacing){
          const cx = x - offset;
          ctx.beginPath();
          ctx.moveTo(cx, GROUND_Y+50);
          ctx.lineTo(cx+spacing*0.2, GROUND_Y-90-layer*30);
          ctx.lineTo(cx+spacing*0.6, GROUND_Y-120-layer*20);
          ctx.lineTo(cx+spacing*0.8, GROUND_Y-70-layer*30);
          ctx.lineTo(cx+spacing, GROUND_Y+50);
          ctx.closePath();
          ctx.fill();
        }
      }
      break;
    }

    case 'volcanic_inferno':
    case 'infernal_volcano': {
      // 5 & 11. Infernal Volcanic Boss Arena
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0, '#1a0000');
      g.addColorStop(0.5, '#4d0000');
      g.addColorStop(1, '#800505');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);

      // Erupting Volcanoes (Seamless)
      const spacing = 500;
      const speed = 0.1;
      const offset = (camX * speed) % spacing;
      for(let x = -spacing; x < W + spacing; x += spacing){
        const vx = x - offset;
        ctx.fillStyle = '#220303';
        ctx.beginPath();
        ctx.moveTo(vx, GROUND_Y+50);
        ctx.lineTo(vx+140, GROUND_Y-180);
        ctx.lineTo(vx+190, GROUND_Y-180);
        ctx.lineTo(vx+330, GROUND_Y+50);
        ctx.fill();

        // Flowing Lava on Volcano
        const pulse = Math.sin(state.time*0.01 + x) > 0 ? '#ff3d6e' : '#f59e0b';
        ctx.fillStyle = pulse;
        ctx.beginPath();
        ctx.arc(vx+165, GROUND_Y-180, 25, 0, Math.PI*2);
        ctx.fill();
      }

      // Floating Lava Sparks
      ctx.fillStyle = '#ffaa00';
      for(let i=0; i<35; i++){
        const px = (i*137 + state.time*0.15) % W;
        const py = (GROUND_Y - (i*43 + state.time*0.2) % (GROUND_Y - 20));
        ctx.fillRect(px, py, 3, 3);
      }
      break;
    }

    case 'night_forest': {
      // 10. Moonlit Forest
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0, '#020a10');
      g.addColorStop(0.5, '#051622');
      g.addColorStop(1, '#0b2434');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);

      // Silver Moon
      ctx.save();
      const nMoonX = W * 0.82 - (camX * 0.025) % W;
      ctx.fillStyle = '#f8fafc'; ctx.shadowColor = '#94a3b8'; ctx.shadowBlur = 30;
      ctx.beginPath(); ctx.arc(nMoonX, 90, 45, 0, Math.PI*2); ctx.fill();
      ctx.restore();

      // Pine Trees Parallax
      for(let layer=0; layer<3; layer++){
        const speed = 0.08 + layer*0.08;
        ctx.fillStyle = layer===0 ? 'rgba(5, 25, 20, 0.4)' : layer===1 ? 'rgba(8, 35, 25, 0.55)' : 'rgba(12, 45, 30, 0.7)';
        for(let i=-1; i<8; i++){
          const tx = (i*260 - camX*speed) % (260*8);
          ctx.beginPath();
          ctx.moveTo(tx, GROUND_Y+50);
          ctx.lineTo(tx+60, GROUND_Y-120-layer*40);
          ctx.lineTo(tx+120, GROUND_Y+50);
          ctx.fill();
        }
      }
      break;
    }

    case 'industrial_sector':
    case 'nuclear_lab': {
      // 6. Nuclear Power Plant / Laser Matrix
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0, '#02120a');
      g.addColorStop(0.5, '#082c1b');
      g.addColorStop(1, '#0f4a2d');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);

      // Cooling Towers
      for(let i=-1; i<6; i++){
        const tx = (i*350 - camX*0.12) % (350*6);
        ctx.fillStyle = '#061e13';
        ctx.beginPath();
        ctx.moveTo(tx, GROUND_Y+50);
        ctx.lineTo(tx+40, GROUND_Y-160);
        ctx.lineTo(tx+160, GROUND_Y-160);
        ctx.lineTo(tx+200, GROUND_Y+50);
        ctx.fill();

        ctx.fillStyle = 'rgba(34, 197, 94, 0.25)';
        ctx.beginPath();
        ctx.arc(tx+100, GROUND_Y-190, 45 + Math.sin(state.time*0.005 + i)*10, 0, Math.PI*2);
        ctx.fill();
      }
      break;
    }

    case 'frozen_tundra': {
      // 7. Frozen Tundra & Aurora Borealis
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0, '#03101e');
      g.addColorStop(0.5, '#0a2542');
      g.addColorStop(1, '#133d6b');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);

      // Aurora Borealis
      ctx.save();
      const waveT = state.time * 0.002;
      ctx.fillStyle = 'rgba(0, 240, 255, 0.18)';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      for(let x=0; x<=W; x+=40){
        ctx.lineTo(x, 70 + Math.sin(x*0.01 + waveT)*35);
      }
      ctx.lineTo(W, 0);
      ctx.fill();

      ctx.fillStyle = 'rgba(168, 85, 247, 0.15)';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      for(let x=0; x<=W; x+=40){
        ctx.lineTo(x, 110 + Math.cos(x*0.012 - waveT)*40);
      }
      ctx.lineTo(W, 0);
      ctx.fill();
      ctx.restore();

      // Ice Mountains (Seamless)
      const spacing = 400;
      const speed = 0.1;
      const offset = (camX * speed) % spacing;
      for(let x = -spacing; x < W + spacing; x += spacing){
        const ix = x - offset;
        ctx.fillStyle = '#062038';
        ctx.beginPath();
        ctx.moveTo(ix, GROUND_Y+50);
        ctx.lineTo(ix+spacing*0.3, GROUND_Y-150);
        ctx.lineTo(ix+spacing*0.6, GROUND_Y+50);
        ctx.fill();

        ctx.fillStyle = '#e0f2fe';
        ctx.beginPath();
        ctx.moveTo(ix+spacing*0.2, GROUND_Y-100);
        ctx.lineTo(ix+spacing*0.3, GROUND_Y-150);
        ctx.lineTo(ix+spacing*0.4, GROUND_Y-100);
        ctx.fill();
      }

      // Snow
      ctx.fillStyle = '#ffffff';
      for(let i=0; i<40; i++){
        const sx = (i*97 + state.time*0.1) % W;
        const sy = (i*61 + state.time*0.15) % H;
        ctx.beginPath(); ctx.arc(sx, sy, 1.8, 0, Math.PI*2); ctx.fill();
      }
      break;
    }

    case 'cosmic_void': {
      // 8. Cosmic Deep Space Void
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0, '#020108');
      g.addColorStop(0.5, '#0e0624');
      g.addColorStop(1, '#1e0a40');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);

      // Ringed Cosmic Planet
      ctx.save();
      const px = W * 0.75 - (camX * 0.02) % W;
      ctx.fillStyle = '#a855f7';
      ctx.beginPath(); ctx.arc(px, 110, 60, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = '#f43f5e'; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.ellipse(px, 110, 100, 20, -0.3, 0, Math.PI*2); ctx.stroke();
      ctx.restore();

      // Twinkling Starlight
      ctx.fillStyle = '#ffffff';
      for(let i=0; i<60; i++){
        const sx = (i*137 - camX*0.05) % W;
        const sy = (i*53) % H;
        const tw = Math.sin(state.time*0.005 + i)*0.4 + 0.6;
        ctx.globalAlpha = tw;
        ctx.fillRect(((sx%W)+W)%W, sy, 2, 2);
      }
      ctx.globalAlpha = 1;
      break;
    }

    case 'doomsday_city':
    case 'godzilla_ruins': {
      // 9 & 20. Doomsday City / Godzilla Ruins
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0, '#0a0208');
      g.addColorStop(0.5, '#1f0515');
      g.addColorStop(1, '#380a26');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);

      // Searchlight beams
      ctx.save();
      const beamAngle = Math.sin(state.time * 0.0015) * 0.4;
      ctx.fillStyle = 'rgba(0, 240, 255, 0.08)';
      ctx.beginPath();
      ctx.moveTo(W * 0.3, H);
      ctx.lineTo(W * 0.3 - 150 + Math.tan(beamAngle)*300, 0);
      ctx.lineTo(W * 0.3 + 150 + Math.tan(beamAngle)*300, 0);
      ctx.fill();
      ctx.restore();
      break;
    }

    case 'glitch_cyberverse': {
      // 10. Matrix Digital Glitch
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = 'rgba(34, 197, 94, 0.6)';
      ctx.font = 'bold 12px monospace';
      for(let i=0; i<40; i++){
        const mx = (i * 32) % W;
        const my = (i * 83 + state.time * 0.25) % H;
        ctx.fillText(i % 2 === 0 ? '10110' : '01001', mx, my);
      }
      break;
    }

    case 'toxic_sewers': {
      // 12. Toxic Sewers
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0, '#021812');
      g.addColorStop(0.5, '#063326');
      g.addColorStop(1, '#0a4d39');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);

      const spacing = 300;
      const speed = 0.1;
      const offset = (camX * speed) % spacing;
      for(let x = -spacing; x < W + spacing; x += spacing){
        const px = x - offset;
        ctx.fillStyle = '#022118';
        ctx.fillRect(px, GROUND_Y - 200, 70, 220);
        ctx.fillStyle = '#10b981';
        ctx.fillRect(px + 20, GROUND_Y - 80, 30, 100);
      }
      break;
    }

    case 'prehistoric_jungle': {
      // 13. Prehistoric Dinosaur Jungle
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0, '#031c0e');
      g.addColorStop(0.5, '#0d4726');
      g.addColorStop(1, '#18733e');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);

      ctx.save();
      const aMoonX = W * 0.8 - (camX * 0.03) % W;
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath(); ctx.arc(aMoonX, 90, 50, 0, Math.PI*2); ctx.fill();
      ctx.restore();

      // Seamless Trees
      const spacing = 260;
      const speed = 0.12;
      const offset = (camX * speed) % spacing;
      for(let x = -spacing; x < W + spacing; x += spacing){
        const tx = x - offset;
        ctx.fillStyle = '#022d17';
        ctx.beginPath();
        ctx.arc(tx + spacing/2, GROUND_Y - 120, 90, 0, Math.PI*2);
        ctx.fill();
        ctx.fillRect(tx + spacing/2 - 20, GROUND_Y - 120, 40, 180);
      }
      break;
    }

    case 'gothic_cemetery': {
      // 14. Gothic Graveyard
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0, '#090514');
      g.addColorStop(0.5, '#180b2d');
      g.addColorStop(1, '#2d124d');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);

      ctx.fillStyle = '#fef08a';
      const moonX = (W * 0.7 - (camX * 0.02) % W);
      ctx.beginPath(); ctx.arc(moonX, 100, 55, 0, Math.PI*2); ctx.fill();

      // Seamless Gravestones / Pillars
      const spacing = 280;
      const speed = 0.18;
      const offset = (camX * speed) % spacing;
      for(let x = -spacing; x < W + spacing; x += spacing){
        const px = x - offset;
        ctx.fillStyle = '#0f051a';
        ctx.fillRect(px, GROUND_Y - 180, 50, 180);
        ctx.fillRect(px - 10, GROUND_Y - 190, 70, 15);
      }
      break;
    }
    case 'neon_synthwave': {
      // 15. Synthwave Retro Sun
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0, '#1e0038');
      g.addColorStop(0.5, '#500057');
      g.addColorStop(1, '#8c005f');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);

      ctx.save();
      const sX = W * 0.5 - (camX * 0.02) % W;
      const sunG = ctx.createLinearGradient(0, 60, 0, 200);
      sunG.addColorStop(0, '#ff00aa');
      sunG.addColorStop(1, '#ffcc00');
      ctx.fillStyle = sunG;
      ctx.beginPath(); ctx.arc(sX, 130, 70, 0, Math.PI*2); ctx.fill();

      ctx.fillStyle = '#500057';
      for(let y = 110; y <= 190; y += 12){
        ctx.fillRect(sX - 75, y, 150, 4);
      }
      ctx.restore();
      break;
    }

    case 'alien_hive': {
      // 16. Alien Hive Mothership
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0, '#100224');
      g.addColorStop(0.5, '#230545');
      g.addColorStop(1, '#3b086e');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);

      for(let i=-1; i<8; i++){
        const ax = (i*240 - camX*0.12) % (240*8);
        ctx.fillStyle = '#1a0136';
        ctx.beginPath(); ctx.ellipse(ax, GROUND_Y - 110, 35, 60, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#ec4899';
        ctx.beginPath(); ctx.ellipse(ax, GROUND_Y - 110, 15, 30, 0, 0, Math.PI*2); ctx.fill();
      }
      break;
    }

    case 'haunted_mansion': {
      // 17. Haunted Mansion
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0, '#120320');
      g.addColorStop(0.5, '#250740');
      g.addColorStop(1, '#400d66');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);

      for(let i=-1; i<6; i++){
        const wx = (i*320 - camX*0.15) % (320*6);
        ctx.fillStyle = '#ff0055';
        ctx.fillRect(wx, GROUND_Y - 210, 50, 110);
        ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 2;
        ctx.strokeRect(wx, GROUND_Y - 210, 50, 110);
      }
      break;
    }

    case 'industrial_foundry': {
      // 18. Molten Industrial Foundry
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0, '#180802');
      g.addColorStop(0.5, '#3b1404');
      g.addColorStop(1, '#662205');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);

      for(let i=-1; i<5; i++){
        const fx = (i*380 - camX*0.15) % (380*5);
        ctx.fillStyle = '#271005';
        ctx.fillRect(fx, GROUND_Y - 240, 30, 260);
        ctx.fillRect(fx - 40, GROUND_Y - 240, 120, 20);
      }
      break;
    }

    case 'sky_temple': {
      // 19. Heavenly Sky Temple
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0, '#0c192c');
      g.addColorStop(0.5, '#1a365d');
      g.addColorStop(1, '#2b5288');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);

      ctx.fillStyle = 'rgba(251, 191, 36, 0.25)';
      for(let i=-1; i<8; i++){
        const cx = (i*260 - camX*0.1) % (260*8);
        ctx.beginPath(); ctx.arc(cx, GROUND_Y - 40, 70, 0, Math.PI*2); ctx.fill();
      }
      break;
    }

    // ---------- PRO OBBY EXCLUSIVE THEMES (Ep 25 - 44) ----------
    case 'pro_cyber_matrix': {
      // PRO 1. Neon Matrix & Cyber Perspectives
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0, '#02000a');
      g.addColorStop(0.5, '#0c0226');
      g.addColorStop(1, '#1b004d');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);

      // Glowing Wireframe Horizon Grid
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
      ctx.lineWidth = 1;
      const horizY = 220;
      for(let x = 0; x <= W; x += 30){
        ctx.beginPath();
        ctx.moveTo(W/2, horizY);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for(let y = horizY; y <= H; y += 18){
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Digital Matrix Code Columns
      ctx.fillStyle = 'rgba(0, 240, 255, 0.7)';
      ctx.font = 'bold 10px monospace';
      for(let i = 0; i < 25; i++){
        const mx = (i * 40 - camX * 0.1) % W;
        const my = (i * 97 + state.time * 0.3) % (H - 100);
        ctx.fillText('PRO_OBBY_2026', ((mx % W) + W) % W, my);
      }
      break;
    }

    case 'pro_plasma_storm': {
      // PRO 2. Violent Violet Plasma Storm
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0, '#0c001c');
      g.addColorStop(0.5, '#280054');
      g.addColorStop(1, '#4a008c');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);

      // Electric Lightning Arcs in Sky
      if(Math.random() < 0.35){
        ctx.strokeStyle = '#d946ef';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        let lx = (state.time * 0.1) % W;
        let ly = 20;
        ctx.moveTo(lx, ly);
        for(let j=0; j<6; j++){
          lx += (Math.random() - 0.5) * 60;
          ly += 30 + Math.random() * 20;
          ctx.lineTo(lx, ly);
        }
        ctx.stroke();
      }

      // Plasma Vortex Orb
      ctx.save();
      const pvX = W * 0.7 - (camX * 0.02) % W;
      const pvGrad = ctx.createRadialGradient(pvX, 120, 10, pvX, 120, 90);
      pvGrad.addColorStop(0, '#ffffff');
      pvGrad.addColorStop(0.4, '#e879f9');
      pvGrad.addColorStop(1, 'rgba(168, 85, 247, 0)');
      ctx.fillStyle = pvGrad;
      ctx.beginPath(); ctx.arc(pvX, 120, 90, 0, Math.PI*2); ctx.fill();
      ctx.restore();
      break;
    }

    case 'pro_infernal_abyss': {
      // PRO 3. Deep Obsidian Infernal Abyss
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0, '#050000');
      g.addColorStop(0.5, '#2e0000');
      g.addColorStop(1, '#660000');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);

      // Glowing Pentagram / Lava Eye Ring
      ctx.save();
      const eyeX = W * 0.5 - (camX * 0.015) % W;
      ctx.strokeStyle = '#ff3d6e';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#ff3d6e'; ctx.shadowBlur = 25;
      ctx.beginPath(); ctx.arc(eyeX, 130, 75, 0, Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.arc(eyeX, 130, 20 + Math.sin(state.time*0.005)*8, 0, Math.PI*2); ctx.fillStyle='#ff0033'; ctx.fill();
      ctx.restore();

      // Lava Ember Sparks
      ctx.fillStyle = '#ffcc00';
      for(let i=0; i<40; i++){
        const ex = (i*113 + state.time*0.2) % W;
        const ey = (GROUND_Y - (i*37 + state.time*0.3) % (GROUND_Y - 10));
        ctx.fillRect(ex, ey, 2.5, 2.5);
      }
      break;
    }

    case 'pro_toxic_wasteland': {
      // PRO 4. Radioactive Acid Wasteland
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0, '#011207');
      g.addColorStop(0.5, '#053d1b');
      g.addColorStop(1, '#096e30');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);

      // Biohazard Symbols & Toxic Clouds
      ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
      for(let i=-1; i<7; i++){
        const tx = (i*280 - camX*0.08) % (280*7);
        ctx.beginPath();
        ctx.arc(tx + 100, 140, 60 + Math.sin(state.time*0.003 + i)*15, 0, Math.PI*2);
        ctx.fill();
      }

      ctx.fillStyle = '#22c55e';
      for(let i=0; i<30; i++){
        const bx = (i*149 + state.time*0.1) % W;
        const by = (i*83 + Math.sin(state.time*0.005 + i)*15) % (H - 80);
        ctx.fillRect(bx, by, 3, 3);
      }
      break;
    }

    case 'pro_golden_god_realm': {
      // PRO 5. Divine Onyx & Gold Sanctum
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0, '#0a0a0c');
      g.addColorStop(0.5, '#221d0a');
      g.addColorStop(1, '#42360f');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);

      // Golden Rays from Heaven
      ctx.save();
      ctx.fillStyle = 'rgba(255, 210, 63, 0.12)';
      for(let i = 0; i < 5; i++){
        const rayX = W * 0.2 + i * 160 - (camX * 0.02) % W;
        ctx.beginPath();
        ctx.moveTo(rayX, 0);
        ctx.lineTo(rayX - 40, H);
        ctx.lineTo(rayX + 60, H);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
      break;
    }

    case 'pro_laser_fortress': {
      // PRO 7. High-Tech Cyber Fortress & Lasers
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0, '#0a020d');
      g.addColorStop(0.5, '#26042b');
      g.addColorStop(1, '#4d0857');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);

      // Laser Surveillance Grid
      ctx.strokeStyle = 'rgba(255, 0, 85, 0.3)';
      ctx.lineWidth = 1.5;
      const scanY = (state.time * 0.15) % H;
      ctx.beginPath(); ctx.moveTo(0, scanY); ctx.lineTo(W, scanY); ctx.stroke();
      break;
    }

    case 'pro_void_multiverse': {
      // PRO 8. Multiverse Void & Cosmic Stars
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0, '#010008');
      g.addColorStop(0.5, '#0b0026');
      g.addColorStop(1, '#1b0054');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);

      // Twinkling Rainbow Star Clusters
      for(let i=0; i<70; i++){
        const sx = (i*127 - camX*0.04) % W;
        const sy = (i*67) % H;
        const hue = (i * 40 + state.time * 0.05) % 360;
        ctx.fillStyle = `hsl(${hue}, 100%, 75%)`;
        ctx.fillRect(((sx%W)+W)%W, sy, 2, 2);
      }
      break;
    }

    case 'pro_blood_moon': {
      // PRO 9. Eerie Blood Moon & Dark Clouds
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0, '#0d0101');
      g.addColorStop(0.5, '#330303');
      g.addColorStop(1, '#5e0606');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);

      // Massive Blood Moon
      ctx.save();
      const bmX = W * 0.7 - (camX * 0.02) % W;
      ctx.fillStyle = '#dc2626';
      ctx.shadowColor = '#dc2626'; ctx.shadowBlur = 45;
      ctx.beginPath(); ctx.arc(bmX, 110, 70, 0, Math.PI*2); ctx.fill();
      ctx.restore();
      break;
    }

    case 'pro_acid_sewers': {
      // PRO 10. Toxic Sewer Slime Tubes
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0, '#021812');
      g.addColorStop(0.5, '#063b2c');
      g.addColorStop(1, '#0c5c45');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);

      for(let i=-1; i<6; i++){
        const px = (i*320 - camX*0.12) % (320*6);
        ctx.fillStyle = '#022e22';
        ctx.fillRect(px, GROUND_Y - 220, 80, 240);
        ctx.fillStyle = '#10b981';
        ctx.fillRect(px + 25, GROUND_Y - 100, 30, 120);
      }
      break;
    }

    case 'pro_volcano_magma': {
      // PRO 11. Erupting Volcanic Lava
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0, '#1c0000');
      g.addColorStop(0.5, '#520000');
      g.addColorStop(1, '#8a0a0a');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);

      // Magma Eruption Ash
      ctx.fillStyle = '#ffaa00';
      for(let i=0; i<45; i++){
        const px = (i*131 + state.time*0.2) % W;
        const py = (GROUND_Y - (i*47 + state.time*0.25) % (GROUND_Y - 20));
        ctx.fillRect(px, py, 3, 3);
      }
      break;
    }

    case 'airplane_sky': {
      // Airplane Sky Theme
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0, '#0ea5e9');
      g.addColorStop(0.5, '#7dd3fc');
      g.addColorStop(1, '#bae6fd');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);

      // Clouds
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      for(let i=0; i<15; i++){
        const cx = (i*240 + state.time*0.05) % W;
        const cy = (i*67) % (H-100);
        ctx.beginPath();
        ctx.arc(cx, cy, 30, 0, Math.PI*2);
        ctx.arc(cx+25, cy-10, 25, 0, Math.PI*2);
        ctx.arc(cx+45, cy, 20, 0, Math.PI*2);
        ctx.fill();
      }
      break;
    }

    case 'parkour_rooftops':
    case 'pro_rooftop_sunset': {
      // 12. Apocalyptic Skyscraper Sunset
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0, '#150029');
      g.addColorStop(0.5, '#45003b');
      g.addColorStop(1, '#851d00');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);

      for(let i=-1; i<10; i++){
        const bx = (i*210 - camX*0.14) % (210*10);
        const bh = 210 + ((i*41)%120);
        ctx.fillStyle = '#0f001c';
        ctx.fillRect(bx, GROUND_Y-bh, 150, bh+100);
        
        // Windows
        ctx.fillStyle = 'rgba(255, 210, 63, 0.3)';
        for(let wy = GROUND_Y-bh+20; wy < GROUND_Y-20; wy += 40){
          ctx.fillRect(bx+20, wy, 15, 20);
          ctx.fillRect(bx+55, wy, 15, 20);
          ctx.fillRect(bx+90, wy, 15, 20);
          ctx.fillRect(bx+115, wy, 15, 20);
        }
      }
      break;
    }

    case 'pro_godzilla_arena': {
      // PRO 13. Godzilla Titan Arena
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0, '#050a14');
      g.addColorStop(0.5, '#0c1a33');
      g.addColorStop(1, '#17305c');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);

      // Atomic Breath Charging Aura
      ctx.save();
      const gzX = W * 0.8 - (camX * 0.02) % W;
      ctx.fillStyle = 'rgba(0, 240, 255, 0.2)';
      ctx.beginPath(); ctx.arc(gzX, 120, 85 + Math.sin(state.time*0.01)*15, 0, Math.PI*2); ctx.fill();
      ctx.restore();
      break;
    }

    case 'pro_demonic_realm': {
      // PRO 14. Spooky Demonic Phantom Void
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0, '#0a0012');
      g.addColorStop(0.5, '#24003d');
      g.addColorStop(1, '#42006e');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);

      // Glowing Spirit Eyes in Background
      for(let i=-1; i<8; i++){
        const ex = (i*260 - camX*0.12) % (260*8);
        if(Math.sin(state.time*0.004 + i) > 0){
          ctx.fillStyle = '#ff00aa';
          ctx.fillRect(ex + 20, GROUND_Y - 180, 6, 5);
          ctx.fillRect(ex + 34, GROUND_Y - 180, 6, 5);
        }
      }
      break;
    }

    case 'pro_hyperspeed_void': {
      // PRO 15. Speedrun Warp Tunnel
      ctx.fillStyle = '#000000';
      ctx.fillRect(0,0,W,H);

      ctx.strokeStyle = 'rgba(255, 210, 63, 0.4)';
      ctx.lineWidth = 2;
      for(let i=0; i<18; i++){
        const x = (i * 60 - state.time * 1.2) % W;
        ctx.beginPath(); ctx.moveTo(((x%W)+W)%W, 0); ctx.lineTo(((x%W)+W)%W, H); ctx.stroke();
      }
      break;
    }

    case 'pro_atomic_reactor': {
      // PRO 16. Atomic Reactor Core
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0, '#00140a');
      g.addColorStop(0.5, '#00381d');
      g.addColorStop(1, '#006133');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);

      // Pulsing Nuclear Rings
      ctx.save();
      const nrX = W * 0.5 - (camX * 0.01) % W;
      ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 4;
      ctx.shadowColor = '#22c55e'; ctx.shadowBlur = 25;
      ctx.beginPath(); ctx.arc(nrX, 130, 80 + Math.sin(state.time*0.008)*12, 0, Math.PI*2); ctx.stroke();
      ctx.restore();
      break;
    }

    case 'final_challenge':
    case 'pro_codezero_hall':
    case 'ultimate_cosmos':
    default: {
      // PRO 17 / Ep 44: CODEZERO Hall of Fame Finale
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0, '#030014');
      g.addColorStop(0.35, '#190042');
      g.addColorStop(0.7, '#3b0080');
      g.addColorStop(1, '#02000a');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);

      // Golden & Cyan Victory Monolith Pillars
      for(let i=-1; i<8; i++){
        const px = (i*260 - camX*0.12) % (260*8);
        ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 210, 63, 0.25)' : 'rgba(56, 198, 255, 0.25)';
        ctx.fillRect(px, GROUND_Y - 240, 40, 260);
        ctx.strokeStyle = i % 2 === 0 ? '#ffd23f' : '#38c6ff';
        ctx.lineWidth = 2;
        ctx.strokeRect(px, GROUND_Y - 240, 40, 260);
      }

      // Rainbow Victory Fireworks Sparks
      for(let i=0; i<50; i++){
        const fx = (i*137 + state.time*0.1) % W;
        const fy = (i*71 + Math.sin(state.time*0.005 + i)*20) % (H - 60);
        const hue = (i * 35 + state.time * 0.1) % 360;
        ctx.fillStyle = `hsl(${hue}, 100%, 70%)`;
        ctx.fillRect(fx, fy, 3, 3);
      }
      break;
    }
  }
}
