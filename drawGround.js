function drawGround(theme){
  if(!theme || theme === 'pink' || theme === 'blue'){
    if(level && level.theme) theme = level.theme;
    else theme = 'dusk_suburbs';
  }

  const plats = (level.plats || []);
  for(let idx=0; idx<plats.length; idx++){
    const p = plats[idx];
    const sx = p.x - camX;
    if(sx + p.w < -20 || sx > W + 20) continue;

    // Check for neighbor to right to eliminate seams
    let extraW = 0;
    const nextP = plats.find(o => Math.abs(o.x - (p.x + p.w)) < 2 && Math.abs(o.y - p.y) < 1);
    if(nextP) extraW = 2; // Overlap slightly to kill the 1px anti-alias line

    switch(theme){
      case 'dusk_suburbs':
      case 'prehistoric_jungle': {
        const g = ctx.createLinearGradient(0, p.y, 0, p.y + p.h);
        g.addColorStop(0, '#4fd67b');
        g.addColorStop(0.12, '#2ea24f');
        g.addColorStop(0.15, '#7b5a3a');
        g.addColorStop(1, '#422e1d');
        ctx.fillStyle = g;
        ctx.fillRect(sx, p.y, p.w + extraW, p.h);

        // Grass blades
        ctx.fillStyle = '#6ee693';
        for(let i = 4; i < p.w - 2; i += 18){
          ctx.beginPath();
          ctx.moveTo(sx + i, p.y);
          ctx.lineTo(sx + i + 4, p.y - 7);
          ctx.lineTo(sx + i + 8, p.y);
          ctx.fill();
        }
        break;
      }

      case 'cyberpunk_alley':
      case 'glitch_cyberverse': {
        const g = ctx.createLinearGradient(0, p.y, 0, p.y + p.h);
        g.addColorStop(0, '#1e293b');
        g.addColorStop(0.2, '#0f172a');
        g.addColorStop(1, '#020617');
        ctx.fillStyle = g;
        ctx.fillRect(sx, p.y, p.w + extraW, p.h);

        ctx.fillStyle = '#00f0ff';
        ctx.fillRect(sx, p.y, p.w + extraW, 3);

        ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
        ctx.lineWidth = 1;
        for(let i = 10; i < p.w; i += 24){
          ctx.beginPath(); ctx.moveTo(sx + i, p.y); ctx.lineTo(sx + i, p.y + p.h); ctx.stroke();
        }
        break;
      }

      case 'horror_ruins':
      case 'gothic_cemetery': {
        const g = ctx.createLinearGradient(0, p.y, 0, p.y + p.h);
        g.addColorStop(0, '#2e382e');
        g.addColorStop(0.15, '#1a241a');
        g.addColorStop(1, '#0a100a');
        ctx.fillStyle = g;
        ctx.fillRect(sx, p.y, p.w + extraW, p.h);

        ctx.fillStyle = '#22c55e';
        ctx.fillRect(sx, p.y, p.w + extraW, 4);
        for(let i = 6; i < p.w - 6; i += 12){
          ctx.beginPath(); ctx.arc(sx + i, p.y + 4, 3, 0, Math.PI*2); ctx.fill();
        }
        break;
      }

      case 'desert_canyon': {
        const g = ctx.createLinearGradient(0, p.y, 0, p.y + p.h);
        g.addColorStop(0, '#f59e0b');
        g.addColorStop(0.15, '#d97706');
        g.addColorStop(1, '#78350f');
        ctx.fillStyle = g;
        ctx.fillRect(sx, p.y, p.w + extraW, p.h);

        ctx.fillStyle = '#fef08a';
        ctx.fillRect(sx, p.y, p.w + extraW, 3);
        break;
      }

      case 'volcanic_inferno':
      case 'infernal_volcano': {
        const g = ctx.createLinearGradient(0, p.y, 0, p.y + p.h);
        g.addColorStop(0, '#18181b');
        g.addColorStop(0.2, '#09090b');
        g.addColorStop(1, '#000000');
        ctx.fillStyle = g;
        ctx.fillRect(sx, p.y, p.w + extraW, p.h);

        ctx.fillStyle = '#ef4444';
        ctx.fillRect(sx, p.y, p.w + extraW, 3);
        ctx.fillStyle = '#f59e0b';
        for(let i = 8; i < p.w - 8; i += 20){
          ctx.fillRect(sx + i, p.y, 6, 4);
        }
        break;
      }

      case 'nuclear_lab':
      case 'industrial_foundry': {
        const g = ctx.createLinearGradient(0, p.y, 0, p.y + p.h);
        g.addColorStop(0, '#334155');
        g.addColorStop(0.2, '#1e293b');
        g.addColorStop(1, '#0f172a');
        ctx.fillStyle = g;
        ctx.fillRect(sx, p.y, p.w + extraW, p.h);

        for(let i = 0; i < p.w + extraW; i += 16){
          ctx.fillStyle = (i / 16) % 2 === 0 ? '#eab308' : '#18181b';
          ctx.fillRect(sx + i, p.y, Math.min(16, (p.w + extraW) - i), 5);
        }
        break;
      }

      case 'frozen_tundra': {
        const g = ctx.createLinearGradient(0, p.y, 0, p.y + p.h);
        g.addColorStop(0, '#38c6ff');
        g.addColorStop(0.2, '#0284c7');
        g.addColorStop(1, '#0369a1');
        ctx.fillStyle = g;
        ctx.fillRect(sx, p.y, p.w, p.h);

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(sx, p.y, p.w, 5);

        for(let i = 12; i < p.w - 12; i += 24){
          ctx.beginPath();
          ctx.moveTo(sx + i, p.y + p.h);
          ctx.lineTo(sx + i + 4, p.y + p.h + 8);
          ctx.lineTo(sx + i + 8, p.y + p.h);
          ctx.fill();
        }
        break;
      }

      case 'cosmic_void':
      case 'alien_hive':
      case 'neon_synthwave':
      case 'ultimate_cosmos': {
        const g = ctx.createLinearGradient(0, p.y, 0, p.y + p.h);
        g.addColorStop(0, '#2e1065');
        g.addColorStop(0.2, '#1e1b4b');
        g.addColorStop(1, '#0f172a');
        ctx.fillStyle = g;
        ctx.fillRect(sx, p.y, p.w, p.h);

        ctx.fillStyle = '#d946ef';
        ctx.fillRect(sx, p.y, p.w, 3);
        break;
      }

      case 'airplane_sky': {
        const g = ctx.createLinearGradient(0, p.y, 0, p.y + p.h);
        g.addColorStop(0, '#38c6ff');
        g.addColorStop(1, '#0284c7');
        ctx.fillStyle = g;
        ctx.fillRect(sx, p.y, p.w, p.h);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(sx, p.y, p.w, 4);
        break;
      }

      case 'parkour_rooftops':
      case 'pro_rooftop_sunset': {
        const g = ctx.createLinearGradient(0, p.y, 0, p.y + p.h);
        g.addColorStop(0, '#1e293b');
        g.addColorStop(0.2, '#0f172a');
        g.addColorStop(1, '#020617');
        ctx.fillStyle = g;
        ctx.fillRect(sx, p.y, p.w, p.h);

        ctx.fillStyle = '#ef4444';
        ctx.fillRect(sx, p.y, p.w, 4);
        break;
      }

      case 'final_challenge':
      case 'pro_codezero_hall': {
        const g = ctx.createLinearGradient(0, p.y, 0, p.y + p.h);
        g.addColorStop(0, '#1c1917');
        g.addColorStop(0.2, '#0c0a09');
        g.addColorStop(1, '#000000');
        ctx.fillStyle = g;
        ctx.fillRect(sx, p.y, p.w, p.h);

        ctx.fillStyle = '#ffd23f';
        ctx.fillRect(sx, p.y, p.w, 4);
        ctx.fillStyle = '#38c6ff';
        ctx.fillRect(sx, p.y + 4, p.w, 1.5);
        break;
      }

      case 'sky_temple':
      case 'pro_golden_god_realm': {
        const g = ctx.createLinearGradient(0, p.y, 0, p.y + p.h);
        g.addColorStop(0, '#1c1917');
        g.addColorStop(0.2, '#0c0a09');
        g.addColorStop(1, '#000000');
        ctx.fillStyle = g;
        ctx.fillRect(sx, p.y, p.w, p.h);

        ctx.fillStyle = '#ffd23f';
        ctx.fillRect(sx, p.y, p.w, 4);
        ctx.fillStyle = '#38c6ff';
        ctx.fillRect(sx, p.y + 4, p.w, 1.5);
        break;
      }

      case 'pro_cyber_matrix':
      case 'pro_plasma_storm':
      case 'pro_laser_fortress':
      case 'pro_hyperspeed_void':
      case 'pro_void_multiverse': {
        const g = ctx.createLinearGradient(0, p.y, 0, p.y + p.h);
        g.addColorStop(0, '#0f172a');
        g.addColorStop(0.3, '#020617');
        g.addColorStop(1, '#000000');
        ctx.fillStyle = g;
        ctx.fillRect(sx, p.y, p.w, p.h);

        ctx.fillStyle = '#00f0ff';
        ctx.fillRect(sx, p.y, p.w, 3);
        ctx.fillStyle = '#d946ef';
        ctx.fillRect(sx, p.y + 3, p.w, 1);
        break;
      }

      case 'pro_infernal_abyss':
      case 'pro_volcano_magma': {
        const g = ctx.createLinearGradient(0, p.y, 0, p.y + p.h);
        g.addColorStop(0, '#2a0808');
        g.addColorStop(0.3, '#120202');
        g.addColorStop(1, '#000000');
        ctx.fillStyle = g;
        ctx.fillRect(sx, p.y, p.w, p.h);

        ctx.fillStyle = '#ff3d6e';
        ctx.fillRect(sx, p.y, p.w, 4);
        ctx.fillStyle = '#ffcc00';
        for(let i = 6; i < p.w - 6; i += 18){
          ctx.fillRect(sx + i, p.y, 8, 2);
        }
        break;
      }

      case 'pro_toxic_wasteland':
      case 'pro_acid_sewers':
      case 'pro_atomic_reactor': {
        const g = ctx.createLinearGradient(0, p.y, 0, p.y + p.h);
        g.addColorStop(0, '#022e1f');
        g.addColorStop(0.3, '#01170f');
        g.addColorStop(1, '#000000');
        ctx.fillStyle = g;
        ctx.fillRect(sx, p.y, p.w, p.h);

        ctx.fillStyle = '#10b981';
        ctx.fillRect(sx, p.y, p.w, 4);
        for(let i = 10; i < p.w - 10; i += 20){
          ctx.beginPath(); ctx.arc(sx + i, p.y + 4, 2.5, 0, Math.PI*2); ctx.fill();
        }
        break;
      }

      case 'doomsday_city':
      case 'godzilla_ruins':
      case 'haunted_mansion':
      default: {
        const g = ctx.createLinearGradient(0, p.y, 0, p.y + p.h);
        g.addColorStop(0, '#27272a');
        g.addColorStop(0.2, '#18181b');
        g.addColorStop(1, '#09090b');
        ctx.fillStyle = g;
        ctx.fillRect(sx, p.y, p.w, p.h);

        ctx.fillStyle = theme === 'godzilla_ruins' ? '#00f0ff' : '#ff3d6e';
        ctx.fillRect(sx, p.y, p.w, 3);
        break;
      }
    }

    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(sx, p.y, p.w, p.h);
  }
}
