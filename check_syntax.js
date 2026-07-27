import fs from 'fs';

const content = fs.readFileSync('index.html', 'utf8');
const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);

if (scriptMatch) {
  scriptMatch.forEach((script, index) => {
    const js = script.replace(/<script[^>]*>|<\/script>/gi, '');
    try {
      new Function(js);
      console.log(`Script ${index} is valid`);
    } catch (e) {
      console.log(`Script ${index} has error: ${e.message}`);
      // Try to find the line number
      const lines = js.split('\n');
      for (let i = 1; i <= lines.length; i++) {
        try {
          new Function(lines.slice(0, i).join('\n'));
        } catch (err) {
           console.log(`Error likely around line ${i} of script ${index}`);
           console.log(`Line content: ${lines[i-1]}`);
           break;
        }
      }
    }
  });
}
