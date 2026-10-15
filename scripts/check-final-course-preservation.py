"""Check the bounded content changes against the preceding review commit."""
import copy,json,subprocess
from pathlib import Path
baseline='8069072f4b60b51db50a69178f26a9dbd674a858'
allowed={'content/agriculture.json':('example',{3,5,9,14,15,17}),'content/foodwise/course.json':('connection',{8,10,12,24,30,37,39}),'content/theosophy-guided-chapter-1.json':('example',{24}),'content/theosophy-guided-chapter-3.json':('example',{13}),'content/theosophy-guided-chapter-4.json':('example',{20})}
results=[]
for file,(field,ids) in allowed.items():
 before=json.loads(subprocess.check_output(['git','show',baseline+':'+file],text=True));after=json.loads(Path(file).read_text());normalized=copy.deepcopy(after);changes=[]
 old={l['id']:l for l in before['lessons']}
 for row in normalized['lessons']:
  if row['id'] not in ids:continue
  for lang in ['en','pt']:
   if 'foodwise' in file:
    assert row[field][lang]!=old[row['id']][field][lang];row[field][lang]=old[row['id']][field][lang]
   else:
    assert row[lang][field]!=old[row['id']][lang][field];row[lang][field]=old[row['id']][lang][field]
  changes.append(row['id'])
 assert normalized==before,file+' unexpected change outside approved conceptual field'
 results.append(dict(file=file,lessonIds=changes,field=field,languages=['en','pt'],otherFieldsPreserved=True))
for file in ['content/nutrition/course.json',*[str(p) for p in Path('content').glob('biodynamic-part-*.json')]]:
 assert Path(file).read_bytes()==subprocess.check_output(['git','show',baseline+':'+file]),file
results.append(dict(unchanged='English Nutrition source data and all six Biodynamic Agriculture parts',sourceReverified=False))
Path('reviews/pedagogy/final-course-preservation.json').write_text(json.dumps({'baseline':baseline,'checks':results,'status':'passed'},indent=2)+'\n')
print('Passed: 16 bilingual teaching changes only; source quotations, metadata, locators and English Nutrition content unchanged.')
