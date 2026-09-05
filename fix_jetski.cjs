const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const targetStr = "    // Jet propulsion particles";
const index = code.indexOf(targetStr);

const logicStr = `
    // Zombie movement & collision with jetski
    for(const z of jetski.zombies){
      if(!z.dead){
        if(Math.abs(z.x - jetski.x) < 800) {
          z.x -= 2; // Move left towards player
        }
        if(overlap(jetski, z)){
          jetski.hp -= 20;
          z.dead = true;
          shake(10);
          sfxHurt();
          spawnParticles(z.x, z.y, '#ef4444', 30, 3);
          if(jetski.hp <= 0 && !player.dead){
            hurtPlayer("🧟 კიბერ-ზომბიმ გაგანადგურა!", "enemy");
          }
        }
      }
    }

    // Boss movement logic
    if(jetski.boss && !jetski.boss.dead){
       if(jetski.boss.x > jetski.x + 500) {
          jetski.boss.x -= 1; // Boss moves slowly towards player if far
       } else if (jetski.boss.x < jetski.x + 300) {
          jetski.boss.x += 1.5;
       }
    }

`;

code = code.substring(0, index) + logicStr + code.substring(index);
fs.writeFileSync('index.html', code, 'utf8');
console.log('Fixed jetski movement');
