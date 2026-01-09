#!/usr/bin/env python3

import re
import urllib.request
from io import BytesIO
from PIL import Image
import base64
import os

# Detectar badges circulares pela URL ou padrões de nome
CIRCULAR_BADGE_PATTERNS = [
    '9c29d54c',  # Adobe
    '5a000e6e',  # Building Generative
    'c3e07b05',  # Generative AI Essentials
    '04ddc7e6',  # IBM
    'ae0a41ab',  # Python Project for AI
    '57510dbe',  # HTML CSS JavaScript
    '16a6768e',  # Python for Data Science
    '626d8785',  # AI Essentials V2
    '473d2ee0',  # Generative AI Essentials
    'fd5f30f4',  # Prompt Engineering
    '91d9c16c',  # GenAI Execs & Business
    '8e5af734',  # GenAI Executives Introduction
    '9cf0ae8f',  # Software Engineering Essentials
]

def is_circular_badge(src_url):
    for pattern in CIRCULAR_BADGE_PATTERNS:
        if pattern in src_url:
            return True
    return False

def remove_white_background(image_url):
    try:
        with urllib.request.urlopen(image_url) as response:
            img_data = response.read()
        
        img = Image.open(BytesIO(img_data)).convert('RGBA')
        data = img.getdata()
        new_data = []
        
        for pixel in data:
            if len(pixel) == 4:
                r, g, b, a = pixel
                if r > 240 and g > 240 and b > 240:
                    new_data.append((r, g, b, 0))
                else:
                    new_data.append(pixel)
            else:
                new_data.append(pixel)
        
        img.putdata(new_data)
        buffered = BytesIO()
        img.save(buffered, format='PNG')
        img_base64 = base64.b64encode(buffered.getvalue()).decode()
        
        return f'data:image/png;base64,{img_base64}'
    except Exception as e:
        print(f'Erro: {e}')
        return None

def process_readme():
    if not os.path.exists('README.md'):
        print('README.md nao encontrado')
        return
    
    with open('README.md', 'r', encoding='utf-8') as f:
        content = f.read()
    
    pattern = r'<img src="([^"]+)" alt="([^"]+)"[^>]*>'
    
    def replace_image(match):
        src = match.group(1)
        alt = match.group(2)
        
        if is_circular_badge(src) and 'credly.com' in src:
            print(f'Processando: {alt}')
            new_src = remove_white_background(src)
            if new_src:
                return f'<img src="{new_src}" alt="{alt}" width="80" height="80">'
        
        return match.group(0)
    
    new_content = re.sub(pattern, replace_image, content)
    
    with open('README.md', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print('README processado com sucesso!')

if __name__ == '__main__':
    process_readme()
