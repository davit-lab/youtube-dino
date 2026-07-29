
import sys

def check_braces(filename):
    with open(filename, 'r') as f:
        content = f.read()
    
    balance = 0
    for i, char in enumerate(content):
        if char == '{':
            balance += 1
        elif char == '}':
            balance -= 1
            if balance < 0:
                print(f"Negative balance at character {i}")
                # Get surrounding context
                start = max(0, i - 100)
                end = min(len(content), i + 100)
                print(f"Context: {content[start:end]}")
                return False
    
    if balance != 0:
        print(f"Final balance is {balance}")
        return False
    
    print("Braces are balanced")
    return True

check_braces('index.html')
