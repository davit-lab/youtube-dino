
import re
import sys

def check_syntax(filename):
    with open(filename, 'r') as f:
        content = f.read()
    
    # Extract script content
    scripts = re.findall(r'<script>(.*?)</script>', content, re.DOTALL)
    if not scripts:
        print("No script tags found")
        return

    full_script = scripts[0] # Assuming one main script tag
    
    # Write to a temp file to check syntax
    with open('temp_script.js', 'w') as f:
        f.write(full_script)
    
    import subprocess
    result = subprocess.run(['node', '-c', 'temp_script.js'], capture_output=True, text=True)
    if result.returncode != 0:
        print("Syntax Error found:")
        print(result.stderr)
        # Try to find the line in index.html
        # The line number in result.stderr will be relative to temp_script.js
        # We need to find the line number in index.html
        m = re.search(r'temp_script.js:(\d+)', result.stderr)
        if m:
            rel_line = int(m.group(1))
            # Find start of script tag in index.html
            script_start_line = content.count('\n', 0, content.find('<script>')) + 1
            print(f"Error at index.html line: {script_start_line + rel_line}")
    else:
        print("Syntax is correct")

check_syntax('index.html')
