from pathlib import Path
from PIL import Image
import re
p=Path('src/app/page.tsx');text=p.read_text('utf-8')
def dimensions(m):
 tag=m[0]
 src=re.search(r'src="([^"]+)"',tag)
 if src and 'width={0}' in tag:
  w,h=Image.open('public'+src[1]).size
  tag=tag.replace('width={0}',f'width={{{w}}}').replace('height={0}',f'height={{{h}}}')
 return tag
text=re.sub(r'<Image\b[\s\S]*?/>',dimensions,text)
p.write_text(text,encoding='utf-8')
