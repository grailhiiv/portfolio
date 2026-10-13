from pathlib import Path
from bs4 import BeautifulSoup
import json,re
s=BeautifulSoup(Path('reference/home.html').read_text('utf-8'),'html.parser');flight=''
for script in s.select('script'):
 text=script.string or ''
 if text.startswith('self.__next_f.push('):
  a=json.loads(text[len('self.__next_f.push('):-1])
  if len(a)>1 and isinstance(a[1],str):flight+=a[1]
m=re.search(r'22:T([0-9a-f]+),',flight)
if m:
 value=flight[m.end():m.end()+int(m[1],16)]
 a=json.loads(Path('src/data/service-1.json').read_text('utf-8'))
 def resolve(o):
  if isinstance(o,str):return value if o=='$22' else o
  if isinstance(o,dict):return {k:resolve(v) for k,v in o.items()}
  if isinstance(o,list):return [resolve(v) for v in o]
  return o
 Path('src/data/service-1.json').write_text(json.dumps(resolve(a),separators=(',',':')),encoding='utf-8')
 print('Resolved embedded icon raster:',len(value),'characters')
p=Path('src/components/service-icon.tsx');p.write_text(p.read_text('utf-8').replace('className="w-10 h-10"','className="w-20 h-20 md:w-25 md:h-25 mt-6"'),encoding='utf-8')
