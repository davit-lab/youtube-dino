import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove the banana collision logic
content = re.sub(
    r"\s*// Bananas\s*for\(const b of \(level\.bananas \|\| \[\]\)\)\{\s*if\(overlap\(player,b\) && player\.slipping<=0 && !b\.used\)\{\s*player\.slipping = 40;\s*sfxSlip\(\);\s*toast\(\".*?\", 1200\);\s*\}\s*\}",
    "", content, flags=re.DOTALL
)

# 2. Remove drawBanana function
content = re.sub(
    r"function drawBanana\(b\)\{[\s\S]*?\}\s*function drawCoin",
    "function drawCoin", content
)

# 3. Remove draw loop call
content = re.sub(
    r"\s*if\(level\.bananas\) level\.bananas\.forEach\(drawBanana\);",
    "", content
)

# 4. Remove reset logic
content = re.sub(
    r"\s*\(level\.bananas \|\| \[\]\)\.forEach\(b=>b\.used=false\);",
    "", content
)

# 5. Remove array init logic
content = re.sub(
    r"\s*if\(!lvl\.bananas\) lvl\.bananas = \[\];",
    "", content
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Removed bananas logic.")
