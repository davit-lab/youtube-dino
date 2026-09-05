import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Define the start and end of the block to replace
start_marker = r"// LEVEL 6: Cybernetic Facility \(Ep\.6\)"
end_marker = r"// LEVEL 7: Snow Jetski & Boss Fight"

with open('new_level6.js', 'r', encoding='utf-8') as f:
    new_level_code = f.read()

# Build the regex pattern to match everything between start and end (exclusive of end)
pattern = re.compile(f"\\s+{start_marker}.*?(?=\\s+{end_marker})", re.DOTALL)

# Replace the matched block with the new code
new_content = pattern.sub(f"\n  {new_level_code}\n", content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Replacement successful.")
