const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const targetStr = "    // Jet propulsion particles";
const index = code.indexOf(targetStr);

const logicStr = `
    // Boss collision with jetski body
    if(jetski.boss && !jetski.boss.dead){
       if(overlap(jetski, jetski.boss)){
          jetski.hp -= 40 * (dt/16); // continuous damage if overlapping
          shake(5);
          if(Math.random() < 0.1) sfxHurt();
          
          // push jetski back
          jetski.x -= 20;
          jetski.vx = -5;

          if(jetski.hp <= 0 && !player.dead){
             hurtPlayer("🐻‍❄️ პოლარულმა დათვმა გაგანადგურა!", "enemy");
          }
       }
    }
`;

code = code.substring(0, index) + logicStr + code.substring(index);
fs.writeFileSync('index.html', code, 'utf8');
console.log('Added boss collision');
