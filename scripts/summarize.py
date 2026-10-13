from bs4 import BeautifulSoup
from pathlib import Path
import re
for name in ['home','about','work','work--4fett']:
 soup=BeautifulSoup(Path('reference/'+name+'.html').read_text('utf-8'),'html.parser')
 print('\n',name)
 for svg in soup.select('svg'):print('SVG',len(str(svg)),svg.attrs)
 main=soup.select_one('main')
 for sec in main.find_all('section',recursive=False):
  print('SECTION',sec.get('class'),'TEXT',sec.get_text(' ',strip=True)[:250])
 print('styles:',[(e.name,e.get('class'),e.get('style')) for e in main.select('[style]') if e.name!='span'][:30])
