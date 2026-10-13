from pathlib import Path
import re
for f in Path('reference/assets').glob('*.js'):
 text=f.read_text('utf-8')
 hits=[]
 for p in ['requestAnimationFrame','IntersectionObserver','animate(','lenis','ScrollTrigger','useScroll','spring','duration:','Hero','ScrollReveal','stagger','marquee','scrollY','SplitText']:
  for m in list(re.finditer(re.escape(p),text))[:3]:
   hits.append(text[max(0,m.start()-90):m.start()+170])
 if hits:
  print('\nFILE',f.name)
  for h in hits: print(h)
