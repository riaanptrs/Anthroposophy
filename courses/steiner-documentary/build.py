from pathlib import Path
import re,json,shutil
import mistune
root=Path(__file__).parent
md=mistune.create_markdown(escape=True,plugins=['table'])
course=(root/'content/course.md').read_text();script=(root/'content/transcript.md').read_text()
def html(text):
 out=md(text)
 out=re.sub(r'<p><strong>Answer guide:</strong>(.*?)</p>',r'<details class="answer-guide"><summary>Explore the answer guide</summary><div>\1</div></details>',out,flags=re.S)
 out=re.sub(r'<strong>Read:</strong> Script sections? ([^<]+)',lambda m:'<strong>Read:</strong> Script sections '+re.sub(r'\d+',lambda n:'<a class="source-link" href="#/source/'+n[0]+'">'+n[0]+'</a>',m[1]),out)
 out=out.replace('/workspace/output/The%20Challenge%20of%20Rudolf%20Steiner%20-%20Consolidated%20Corrected%20Script.md','#/source/1').replace('/workspace/output/The Challenge of Rudolf Steiner - Consolidated Corrected Script.md','#/source/1')
 return out.replace('href="transcript.md"', 'href="#/source/1"')
matches=list(re.finditer(r'^# Lesson (\d+)\n\n## ([^\n]+)\n([\s\S]*?)(?=^# Lesson |^# The voices|\Z)',course,re.M))
themes=['Foundations','Foundations','Waldorf education','Waldorf education','Biodynamics','Biodynamics','Care and community','Anthroposophy','Social life','Medicine and care','The filmmaker','Independent inquiry']
lessons=[]
for m in matches:
 text=m[3];num=int(m[1]);objective=re.search(r'\*\*Learning outcome:\*\* (.*)',text)[1]
 lessons.append({'number':num,'title':m[2],'theme':themes[num-1],'objective':objective,'html':html(text),'text':text})
assert len(lessons)==12
sources=[]
for m in re.finditer(r'^### (\d+)\. ([^\n]+)\n([\s\S]*?)(?=^### \d+\.|^## Source and reconstruction notes|\Z)',script,re.M):
 sources.append({'number':int(m[1]),'title':m[2],'html':html(re.sub(r'^## Part II\s*','',m[3],flags=re.M))})
assert len(sources)==43
intro=course.split('# Lesson 1\n')[0]
voices=course.split('# The voices and what their comments contribute\n',1)[1].split('# Learner workbook',1)[0]
workbook=course.split('# Learner workbook\n',1)[1].split('# Assessment and facilitation',1)[0]
facilitation=course.split('# Assessment and facilitation\n',1)[1]
method=intro.split('## A method for reading every interview\n',1)[1]
notes=script.split('## Source and reconstruction notes\n',1)[1]
(root/'site/data.js').write_text('window.COURSE='+json.dumps({'lessons':lessons,'sources':sources,'voices':html(voices),'workbook':html(workbook),'facilitation':html(facilitation),'method':html(method),'sourceNotes':html(notes)},ensure_ascii=False)+';\n')
shutil.copy2(root/'content/course.md',root/'site/course.md');shutil.copy2(root/'content/transcript.md',root/'site/transcript.md')
print('Built all 12 lessons and 43 transcript sections with complete supplementary material.')
