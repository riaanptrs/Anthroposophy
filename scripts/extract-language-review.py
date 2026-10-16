"""Extract all published prose for local language QA; preserve quotes separately."""
import hashlib, json, re, sys
from pathlib import Path
from html.parser import HTMLParser
BLOCKS={'p','li','h1','h2','h3','h4','h5','h6','summary','button','label','caption','td','th','dt','dd','option'}
SKIP={'script','style','svg','code','pre'}
class Parser(HTMLParser):
 def __init__(self,path):
  super().__init__(convert_charrefs=True);self.path=path;self.stack=[];self.blocks=[];self.rootlang='';self.quotes=0
 def handle_starttag(self,tag,attrs):
  
  if tag in BLOCKS or tag in {'div','section','br','span'}:
   for f in self.stack:
    if f['capture']:f['text'].append(' ')
  a=dict(attrs);prev=self.stack[-1] if self.stack else {};lang=a.get('lang',prev.get('lang','en'));quote=prev.get('quote',False) or tag=='blockquote';skip=prev.get('skip',False) or tag in SKIP
  if tag=='html':self.rootlang=lang
  if tag=='blockquote':self.quotes+=1
  frame={'tag':tag,'lang':lang,'quote':quote,'skip':skip,'text':[],'capture':tag in BLOCKS or tag=='a' and not any(x['capture'] for x in self.stack)}
  for key in ['alt','aria-label','placeholder','title']:
   if a.get(key) and not skip:self.blocks.append({'text':a[key],'lang':lang,'quote':quote,'kind':key})
  if tag not in {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}:self.stack.append(frame)
 def handle_data(self,data):
  if self.stack and not self.stack[-1]['skip']:
   for f in self.stack:
    if f['capture'] and f['lang']==self.stack[-1]['lang']:
     f['text'].append(data)
     if self.stack[-1]['quote']:f['quote']=True
 def handle_endtag(self,tag):
  if not any(f['tag']==tag for f in self.stack):return
  i=max(i for i,f in enumerate(self.stack) if f['tag']==tag)
  for f in self.stack[i:]:
   s=re.sub(r'\s+',' ',''.join(f['text'])).strip()
   if s.startswith('PT:'):f['lang']='pt-BR'
   if f['capture'] and s and not f['skip']:self.blocks.append({'text':s,'lang':f['lang'],'quote':f['quote'],'kind':f['tag']})
  del self.stack[i:]
  if tag in BLOCKS or tag in {'div','section','span'}:
   for f in self.stack:
    if f['capture']:f['text'].append(' ')
records={};pages=[]
for p in sorted(Path('docs').rglob('*.html')):
 parser=Parser(str(p));parser.feed(p.read_text());pages.append({'path':str(p),'language':parser.rootlang,'blocks':len(parser.blocks),'quoteBlocks':parser.quotes})
 for b in parser.blocks:
  k=hashlib.sha256((b['lang']+'\0'+str(b['quote'])+'\0'+b['text']).encode()).hexdigest()
  if k not in records:records[k]={'id':k,**b,'pages':[]}
  if str(p) not in records[k]['pages']:records[k]['pages'].append(str(p))
out={'pages':pages,'uniqueBlocks':list(records.values()),'scope':'All published HTML including navigation, headings, explained answers, closed deeper content and support routes. Blockquotes are marked separately and never automatically edited.','limitations':['Language-tool findings require editorial decisions.','Quotation identity and source fidelity require source witnesses.','A clean automated scan cannot establish comprehension or perfect translation.']}
target=Path(sys.argv[1] if len(sys.argv)>1 else '/workspace/scratch/language-extract.json');target.write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print(f'{len(pages)} pages; {len(records)} unique prose blocks; {target}')
