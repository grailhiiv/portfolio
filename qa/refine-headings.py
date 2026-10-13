from pathlib import Path
import re
for name in ['src/app/page.tsx','src/app/work/page.tsx','src/app/about/page.tsx']:
 p=Path(name);text=p.read_text('utf-8')
 labels=(['UX Design','UI Design','Design System','Accessibility','4fett','Togevent','Explorations'] if name=='src/app/page.tsx' else ['4fett','Togevent','Bounty Hunters','Kiwi'] if '/work/' in name else ['Independent','Nebula','Sketchin','Tangity','The Wave'])
 pattern=r'<(?:p|h2)([^>]*)>\s*\{"('+ '|'.join(re.escape(x) for x in labels)+r')"\}\s*</(?:p|h2)>'
 def heading(m):return '<h3'+m[1]+'>{"'+m[2]+'"}</h3>'
 text=re.sub(pattern,heading,text)
 if name=='src/app/work/page.tsx':text=text.replace('className="hidden md:block text-lg','className="work-case-heading text-lg')
 p.write_text(text,encoding='utf-8')
p=Path('src/app/work/togevent/page.tsx');text=p.read_text('utf-8');text=re.sub(r'<p([^>]*)>\s*\{"The System"\}\s*</p>',r'<h2\1>{"The System"}</h2>',text);p.write_text(text,encoding='utf-8')
