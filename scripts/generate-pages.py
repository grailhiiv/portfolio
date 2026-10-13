from bs4 import BeautifulSoup,Comment,NavigableString,Tag
from pathlib import Path
from urllib.parse import urlparse,parse_qs
import json,re
root=Path('src'); (root/'components').mkdir(exist_ok=True); (root/'app').mkdir(exist_ok=True)
# Keep the exact reference CSS rules, with fonts served locally.
css=Path('reference/assets/0h8hoyqlcq14w.css').read_text('utf-8')
css=re.sub(r'\.\./media/', '/fonts/',css)
(root/'app/reference.css').write_text(css,encoding='utf-8')
VOID={'img','br','hr','input','meta','link','source','wbr','area','base','col','embed','param','track'}
ATTR={'class':'className','tabindex':'tabIndex','viewbox':'viewBox','fill-rule':'fillRule','clip-rule':'clipRule','stroke-width':'strokeWidth','stroke-linecap':'strokeLinecap','stroke-linejoin':'strokeLinejoin','crossorigin':'crossOrigin','fetchpriority':'fetchPriority','srcset':'srcSet'}
def j(x):return json.dumps(x,ensure_ascii=False)
def image_src(el):
 src=el.get('src','')
 return parse_qs(urlparse(src).query)['url'][0] if src.startswith('/_next/image') else src

def render(el, immediate=False, delay=0):
 if isinstance(el,Comment):return ''
 if isinstance(el,NavigableString):return '{'+j(str(el))+'}' if str(el) else ''
 if not isinstance(el,Tag) or el.name in ['script','template']:return ''
 tag=el.name
 if tag=='h1' and el.select('span[style*="opacity"]'):
  words=[]
  for word in el.find_all('span',recursive=False):
   chars=[]
   for span in word.find_all('span',recursive=False):
    chars.append({'text':span.get_text(),'className':' '.join(span.get('class',[]))})
   words.append(chars)
  return '<AnimatedHeading className='+j(' '.join(el.get('class',[])))+' words={'+j(words)+'} />'
 if tag=='div' and el.find_all('button',recursive=False):
  buttons=el.find_all('button',recursive=False)
  if all(b.select_one('img') for b in buttons):
   items=[{'src':image_src(b.select_one('img')),'alt':b.select_one('img').get('alt','Exploration')} for b in buttons]
   return '<Gallery compact={'+('true' if len(items)==4 else 'false')+'} images={'+j(items)+'} />'
 attrs=dict(el.attrs)
 if tag=='img':
  tag='Image'
  attrs={k:v for k,v in attrs.items() if k not in ['srcset','data-nimg','style','decoding','loading','fetchpriority']}
  attrs['src']=image_src(el)
  attrs['quality']=90
  if el.get('data-nimg')=='fill':
   attrs.pop('width',None);attrs.pop('height',None);attrs['fill']=True
  else:
   attrs['width']=int(attrs.get('width',0));attrs['height']=int(attrs.get('height',0))
  if el.get('loading')!='lazy':attrs['preload']=True
 if tag=='a' and attrs.get('href','').startswith('/') and not attrs.get('href','').startswith('//'):tag='Link'
 if attrs.get('style')=='opacity:0;transform:translateY(18px)':
  tag='Reveal'; attrs.pop('style');attrs['immediate']=immediate
  if delay:attrs['delay']=round(delay,2)
 attrstr=''
 for k,v in attrs.items():
  k=ATTR.get(k,k)
  if isinstance(v,list):v=' '.join(v)
  if k=='style':
   obj={}
   for kv in v.split(';'):
    if ':' in kv:
     key,val=kv.split(':',1);key=re.sub(r'-([a-z])',lambda m:m[1].upper(),key);obj[key]=val
   attrstr+=' style={'+j(obj)+'}'
  elif isinstance(v,bool):attrstr+=' '+k+'={'+str(v).lower()+'}'
  elif isinstance(v,(int,float)):attrstr+=' '+k+'={'+str(v)+'}'
  else:attrstr+=' '+k+'='+j(v)
 if el.name in VOID:return '<'+tag+attrstr+' />'
 children=[];reveal_index=0
 for child in el.children:
  childdelay=0
  if isinstance(child,Tag) and child.get('style')=='opacity:0;transform:translateY(18px)':
   childdelay=reveal_index*.12; reveal_index+=1
  children.append(render(child,immediate,childdelay))
 # These animation slots are client-only in the original markup.
 if el.name=='div' and 'gap-28' in el.get('class',[]):
  index=int(el.select_one('p').get_text())-1
  children[0]=children[0].replace('</div>','<ServiceIcon index={'+str(index)+'} /></div>')
 return '<'+tag+attrstr+'>'+''.join(children)+'</'+tag+'>'

for f in Path('reference').glob('*.html'):
 soup=BeautifulSoup(f.read_text('utf-8'),'html.parser')
 name=f.stem
 path=root/'app'/('' if name=='home' else name.replace('--','/'))
 path.mkdir(parents=True,exist_ok=True)
 main=soup.select_one('main')
 sections=main.find_all('section',recursive=False)
 content=''
 for child in main.children:
  content+=render(child,child is sections[0] if sections else False)
 imports='import type { Metadata } from "next";\nimport Image from "next/image";\nimport Link from "next/link";\nimport { Reveal, AnimatedHeading } from "@/components/animation";\nimport Gallery from "@/components/gallery";\nimport ServiceIcon from "@/components/service-icon";\n'
 title=soup.title.get_text()
 metadata={'title':title,'description':soup.select_one('meta[name=description]').get('content'),'robots':{'index':False,'follow':False}}
 page=imports+'\nexport const metadata: Metadata = '+j(metadata)+';\n\nexport default function Page() { return <main id="main-content">'+content+'</main>; }\n'
 (path/'page.tsx').write_text(page,encoding='utf-8')
 if name=='home':
  footer=soup.select_one('footer')
  (root/'components/footer.tsx').write_text('export default function Footer() { return '+render(footer)+'; }\n',encoding='utf-8')
print('Generated seven editable React pages and shared footer.')
