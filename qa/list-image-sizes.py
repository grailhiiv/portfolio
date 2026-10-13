from pathlib import Path
import re
for f in Path('src/app').rglob('page.tsx'):
 print('\n',f)
 for m in re.finditer(r'<Image\b[\s\S]*?/>',f.read_text('utf-8')):
  img=m[0];src=re.search('src="([^"]+)"',img);size=re.search('sizes="([^"]+)"',img)
  if src and size and '/images/' in src[1] and (f.parent.name!='about' or 'hero' in src[1]):print(src[1],'=>',size[1])
