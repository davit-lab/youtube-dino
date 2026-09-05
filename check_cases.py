
import sys

def check_cases(filename):
    with open(filename, 'r') as f:
        lines = f.readlines()
    
    balance = 0
    in_switch = False
    for i, line in enumerate(lines):
        line_num = i + 1
        
        # Update balance
        for char in line:
            if char == '{':
                balance += 1
            elif char == '}':
                balance -= 1
        
        if 'switch' in line:
            in_switch = True
            # Note: simplified, assumes switch starts on this line
        
        if 'case \'' in line or 'default:' in line:
            print(f"Line {line_num}: balance {balance}, content: {line.strip()}")
            if balance <= 0:
                print(f"ERROR: case found at line {line_num} with balance {balance}")

check_cases('index.html')
