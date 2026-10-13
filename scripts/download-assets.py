import requests,re,json,concurrent.futures
from bs4 import BeautifulSoup
from pathlib import Path
from urllib.parse import urlparse,parse_qs
base='https://www.arturospatino.com'
assets=set()
for f in Path('reference').glob('*.html'):
 soup=BeautifulSoup(f.read_text('utf-8'),'html.parser')
 for img in soup.select('img'):
  src=img.get('src','')
  if src.startswith('/_next/image'): src=parse_qs(urlparse(src).query)['url'][0]
  if src.startswith('/'):assets.add(src)
# Fonts and assets which appear only after opening a lightbox.
css=Path('reference/assets/0h8hoyqlcq14w.css').read_text('utf-8')
for font in re.findall(r'url\(\.\./media/([^\)]+)\)',css):assets.add('/_next/static/media/'+font)
for f in Path('reference/assets').glob('*.js'):
 assets.update(re.findall(r'["\'](/images/[^"\']+)["\']',f.read_text('utf-8')))
assets.add('/icon.png')
def fetch(src):
 target=Path('public') / ('fonts/'+src.rsplit('/',1)[-1] if src.startswith('/_next/static/media/') else src.lstrip('/'))
 target.parent.mkdir(parents=True,exist_ok=True)
 if not target.exists():
  r=requests.get(base+src,timeout=60);r.raise_for_status();target.write_bytes(r.content)
 return {'source':base+src,'local':str(target).replace('\\','/'),'bytes':target.stat().st_size}
with concurrent.futures.ThreadPoolExecutor(max_workers=10) as ex:
 result=list(ex.map(fetch,sorted(assets)))
Path('public/asset-manifest.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
print('Saved',len(result),'local image and font assets;',sum(x['bytes'] for x in result),'bytes')
for name in ['12w~so1ly9wxf.js','14yunjhhn59rl.js']:
 r=requests.get(base+'/_next/static/chunks/'+name);r.raise_for_status();Path('reference/assets/'+name).write_bytes(r.content)
# Preserve exact Lottie animation data passed to the original client components.
soup=BeautifulSoup(Path('reference/home.html').read_text('utf-8'),'html.parser')
flight=''
for script in soup.select('script'):
 text=script.string or ''
 if text.startswith('self.__next_f.push('):
  arr=json.loads(text[len('self.__next_f.push('):-1])
  if len(arr)>1 and isinstance(arr[1],str):flight+=arr[1]
animations=[]
for m in re.finditer(r'"animationData":',flight):
 animation,end=json.JSONDecoder().raw_decode(flight[m.end():])
 animations.append(animation)
Path('src/data').mkdir(parents=True,exist_ok=True)
for i,a in enumerate(animations):Path('src/data/service-'+str(i)+'.json').write_text(json.dumps(a,separators=(',',':')),encoding='utf-8')
print('Lottie animations',len(animations))
