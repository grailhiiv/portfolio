from bs4 import BeautifulSoup
from pathlib import Path
for f in Path('reference').glob('*.html'):
 soup=BeautifulSoup(f.read_text('utf-8'),'html.parser')
 for el in soup.select('script,svg,template'):el.decompose()
 Path('reference/'+f.stem+'-readable.txt').write_text(soup.prettify(),encoding='utf-8')
 print(f.stem, 'images:', len(soup.select('img')),'buttons:',[(b.get_text(),b.attrs) for b in soup.select('button')])
