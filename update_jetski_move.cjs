const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

code = code.replace("z.x -= 2; // Move left towards player", "z.x -= 180 * (dt/1000); // Move left towards player");
code = code.replace("jetski.boss.x -= 1; // Boss moves slowly towards player if far", "jetski.boss.x -= 150 * (dt/1000); // Boss moves slowly towards player if far");
code = code.replace("jetski.boss.x += 1.5;", "jetski.boss.x += 180 * (dt/1000);");

fs.writeFileSync('index.html', code, 'utf8');
console.log('Fixed movement scaling');
