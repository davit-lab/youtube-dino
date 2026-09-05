const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// Level 2 Platforms Target
const targetStr = `      rect(1120, GROUND_Y - 40, 110, 24),
      rect(1250, GROUND_Y - 80, 110, 24),
      rect(1380, GROUND_Y - 120, 110, 24),
      rect(1510, GROUND_Y - 120, 140, 24),                                // Landing platform`;

const newStr = `      rect(1120, GROUND_Y - 40, 50, 24),
      rect(1250, GROUND_Y - 80, 50, 24),
      rect(1380, GROUND_Y - 120, 50, 24),
      rect(1510, GROUND_Y - 120, 140, 24),                                // Landing platform`;

code = code.replace(targetStr, newStr);

const targetStr2 = `      rect(3680, GROUND_Y - 50, 110, 24),
      rect(3810, GROUND_Y - 110, 110, 24),
      rect(3940, GROUND_Y - 170, 110, 24),
      rect(4070, GROUND_Y - 230, 110, 24),
      rect(4200, GROUND_Y - 290, 110, 24),
      rect(4330, GROUND_Y - 350, 110, 24),`;

const newStr2 = `      rect(3680, GROUND_Y - 50, 50, 24),
      rect(3810, GROUND_Y - 110, 50, 24),
      rect(3940, GROUND_Y - 170, 50, 24),
      rect(4070, GROUND_Y - 230, 50, 24),
      rect(4200, GROUND_Y - 290, 50, 24),
      rect(4330, GROUND_Y - 350, 50, 24),`;

code = code.replace(targetStr2, newStr2);

fs.writeFileSync('index.html', code, 'utf8');
console.log('Fixed stairs');
