from pathlib import Path
import re
for p in Path('src/app').rglob('page.tsx'):
 text=p.read_text('utf-8')
 text='import { imageSizes } from "@/lib/image-sizes";\n'+text
 if p==Path('src/app/page.tsx'):
  text=text.replace('sizes="(min-width: 1024px) 512px, 50vw"','sizes={imageSizes.portrait}')
  text=text.replace('sizes="(min-width: 1024px) 330px, 33vw"','sizes={imageSizes.homeCard}')
 elif p==Path('src/app/about/page.tsx'):
  text=text.replace('sizes="(min-width: 1024px) 512px, 50vw"','sizes={imageSizes.full}')
  text=text.replace('sizes="(min-width: 1024px) 200px, 33vw"','sizes={imageSizes.clientLogo}')
  text=text.replace('<main id="main-content">','<main id="main-content">\n<h1 className="sr-only" data-audit-heading="true">About Arturo Spatino</h1>')
 elif p==Path('src/app/work/page.tsx'):
  text=text.replace('sizes="100vw"','sizes={imageSizes.workCard}')
  count=[0]
  def preload(m):
   count[0]+=1
   return m[0] if count[0]==1 else ''
  text=re.sub(r'\s+preload=\{true\}',preload,text)
 else:
  text=text.replace('sizes="(min-width: 1024px) 512px, 50vw"','sizes={imageSizes.paired}')
  text=text.replace('sizes="100vw"','sizes={imageSizes.portrait}')
  if p.parent.name=='bounty-hunters':
   text=re.sub(r'sizes=\{imageSizes.paired\}(\s+src="/images/bounty-hunters/bh-4.png")',r'sizes={imageSizes.full}\1',text)
 text=text.replace('sizes="(min-width: 1024px) 1024px, 100vw"','sizes={imageSizes.full}')
 def heading(m):return '<h2'+m[1]+'>{"'+m[2]+'"}</h2>'
 labels='Info|Services|Work|Work Experience|Clients|Case studies|Explorations|Design Goals|The Build|Design System|The Challenge|The Approach'
 text=re.sub(r'<p([^>]*)>\s*\{"('+labels+r')"\}\s*</p>',heading,text)
 if p!=Path('src/app/page.tsx'):text=text.replace('import ServiceIcon from "@/components/service-icon";\n','')
 if p!=Path('src/app/page.tsx') and p!=Path('src/app/work/page.tsx'):text=text.replace('import Gallery from "@/components/gallery";\n','')
 p.write_text(text,encoding='utf-8')
