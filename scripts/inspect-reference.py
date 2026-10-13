import requests,json
from pathlib import Path
from bs4 import BeautifulSoup
base='https://www.arturospatino.com'
s=requests.Session()
queue=['/']; seen=set(); assets=set()
while queue:
 path=queue.pop(0)
 if path in seen: continue
 seen.add(path)
 r=s.get(base+path); r.raise_for_status(); r.encoding='utf-8'
 name=path.strip('/').replace('/','--') or 'home'
 Path('reference/'+name+'.html').write_text(r.text,encoding='utf-8')
 soup=BeautifulSoup(r.text,'html.parser')
 links=sorted(set(a.get('href','') for a in soup.select('a[href]')))
 for href in links:
  if href.startswith('/') and not href.startswith('//') and not href.startswith('/_next') and not '.' in href and href.split('#')[0] not in seen:
   queue.append(href.split('#')[0])
 print(path,r.status_code,len(r.content),'links:',links)
 for el in soup.select('script[src],link[rel=stylesheet]'):
  url=el.get('src') or el.get('href')
  if url.startswith('/'):
   assets.add(url)
for url in sorted(assets):
 r=s.get(base+url); r.raise_for_status()
 target=Path('reference/assets') / url.split('/')[-1]
 target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(r.content)
print('Downloaded',len(assets),'bundles')
Path('reference/routes.json').write_text(json.dumps(sorted(seen),indent=2))
