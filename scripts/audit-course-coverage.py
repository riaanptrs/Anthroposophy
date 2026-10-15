"""Reproducible evidence inventory, not an automatic pedagogical sign-off."""
from pathlib import Path
from html.parser import HTMLParser
import json,re,hashlib,subprocess
ROOT=Path(__file__).resolve().parents[1]
DOCS=ROOT/'docs'
OUT=ROOT/'reviews/pedagogy'
class Page(HTMLParser):
    def __init__(self,text):
        super().__init__();self.stack=[];self.blocks=[];self.links=[];self.lang='';self.feed(text)
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if tag=='html':self.lang=attrs.get('lang','')
        if tag=='a':self.links.append((attrs.get('href',''),len(self.stack)))
        if tag not in ['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']:
            self.stack.append([tag,attrs,[],any(x[0]=='main' for x in self.stack) or tag=='main'])
    def handle_data(self,data):
        for x in self.stack:x[2].append(data)
    def handle_endtag(self,tag):
        match=next((i for i in range(len(self.stack)-1,-1,-1) if self.stack[i][0]==tag),None)
        if match is None:return
        for t,a,parts,inside in self.stack[match:]:
            if inside and t in ['h1','h2','h3','p','dt','dd','summary']:
                text=' '.join(''.join(parts).split())
                if text:self.blocks.append({'tag':t,'class':a.get('class',''),'text':text})
        del self.stack[match:]
def read(p):return json.loads(p.read_text())
def evidence(path):
    text=path.read_text();p=Page(text);b=p.blocks
    first=lambda tags,classes='':next((x['text'] for x in b if x['tag'] in tags and (not classes or any(c in x['class'] for c in classes.split('|')))),None)
    return {'title':first(['h1']),'language':p.lang,'objectiveOrOpeningQuestion':first(['p'],'lead|question|goal'), 'headings':[x['text'] for x in b if x['tag'] in ['h2','h3']], 'terms':[x['text'] for x in b if x['tag']=='dt'], 'explanationEvidence':[x['text'] for x in b if x['tag']=='p' and len(x['text'])>140][:3], 'optionalAnswers':text.count('<details'), 'sha256':hashlib.sha256(text.encode()).hexdigest()}
# Every standalone lesson, including reading companions and orientation/synthesis.
paths=set(DOCS.glob('**/lessons/*.html'))
paths={p for p in paths if 'pt' not in p.relative_to(DOCS).parts}
for route in ['meditation','nutrition']:paths.update((DOCS/route).glob('[0-9]*.html'))
waldorf=read(ROOT/'content/waldorf-teaching-manifest.json')
for route in waldorf['pages']:
    # Include parent routes and grade views as explicitly separate teaching/support pages.
    if not route.startswith('pt/'):paths.add(DOCS/route)
catalogue=read(ROOT/'content/learning-system-catalogue.json')['courses']
by_path={}
for c in catalogue:
    for lesson in c['lessons']:
        groups=[{'id':g['id'],'title':g['titleEn'],'kind':g.get('kind'),'question':g.get('questionEn')} for part in c['parts'] for g in part['groups'] if lesson['id'] in g['lessonIds']]
        by_path[lesson['pathEn']]={'sourceGrouping':groups,'sourceScope':c.get('sourceScope'),'sourceSection':lesson.get('originalSection'),'sourceSpan':lesson.get('sourceSpan'),'objective':lesson.get('goalEn')}
concept={}
for f in ['constitution','destiny-knowledge','worlds']:
    for l in read(ROOT/f'content/theosophy-concept-{f}.json')['lessons']:concept[l['id']]=l
course=read(ROOT/'content/theosophy-concept-course.json');concept['whole-picture']=course['synthesis']
meditation=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {meditationLessons as ls} from './content/meditation-course.mjs';import {meditationCases as cs} from './content/meditation-worked-cases.mjs';console.log(JSON.stringify(ls.map(l=>({...l,example:cs.find(c=>c.id===l.id)}))));"],cwd=ROOT,text=True))
validation=read(OUT/'validation.json') if (OUT/'validation.json').exists() else []
validated=bool(validation) and all(x['exitCode']==0 for x in validation)
practical_ledger=read(OUT/'practical-thinking-revision-ledger.json') if (OUT/'practical-thinking-revision-ledger.json').exists() else {}
waldorf_ledger=read(OUT/'waldorf-revision-ledger.json') if (OUT/'waldorf-revision-ledger.json').exists() else {}
conceptual_ledgers={}
for ledger_name in ['foundations-introduction-ledger.json','threefold-revision-ledger.json','four-course-revision-ledger.json','myths-revision-ledger.json']:
    if (OUT/ledger_name).exists():conceptual_ledgers.update(read(OUT/ledger_name))
waldorf_items=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {loadWaldorfContent} from './scripts/waldorf-content.mjs';console.log(JSON.stringify(loadWaldorfContent().map(({source,route})=>({source,route}))));"],cwd=ROOT,text=True))
waldorf_routes={item['route']:item['source'] for item in waldorf_items}
records=[]
for path in sorted(paths):
    rel=str(path.relative_to(DOCS));partner=DOCS/'pt'/rel
    route=rel.split('/lessons/')[0] if '/lessons/' in rel else rel.rsplit('/',1)[0]
    if rel.startswith('lessons/'):route='theosophy-reading'
    if rel.startswith('learn/waldorf/'):route='waldorf'
    if route=='learn':route='foundations'
    en=evidence(path);pt=evidence(partner) if partner.exists() else None
    authored=concept.get(path.stem) if route=='theosophy' else None
    row={'course':route,'path':'docs/'+rel,'partner':'docs/pt/'+rel if pt else None,'en':en,'pt':pt,'source':by_path.get('docs/'+rel,{}),'coverage':{'evidenceInventoried':True,'pedagogicallyAudited':bool(authored),'rewritten':bool(authored),'validated':validated,'sourceReverificationBlocked':True},'audit':{}}
    if authored:
        v=authored['en'];ids=course['lessonIds'];i=ids.index(authored['id'])
        row['audit']={'learningObjective':v['question'],'essentialConcepts':authored.get('termIds',[x['title'] for x in v['bigPicture']] if 'bigPicture' in v else []),'prerequisite':ids[i-1] if i else 'No specialist terminology; distinguish an event, a response and a judgment.','interestingConnections':authored.get('connections',v.get('bigPicture')),'misconception':v.get('distinction','An ordinary considerate action proves reincarnation or initiation.'),'missingExplanationAddressed':v['workedExample']['explanation'],'teachingMethod':{'case':v['workedExample']['title'],'changedSituation':v['workedExample']['question'],'explainedAnswer':v['workedExample']['answer']},'sourceLimit':'Existing source ledger and prose used. Native source not present; no new quotation or locator verified.'}
    else:
        row['audit']={'learningObjectiveEvidence':row['source'].get('objective') or en['objectiveOrOpeningQuestion'],'essentialConceptEvidence':en['terms'] or en['headings'],'prerequisites':'Not yet individually assessed; sequence alone is not proof of dependency.','interestingConnections':'Inspect explicit lesson links and the source grouping; substantive connection review pending.','missingExplanations':'Individual conceptual-gap review pending. Extracted paragraphs are evidence, not a finding that the lesson teaches enough.','misconceptions':'Individual misconception review pending; do not infer adequacy from presence of questions.','teachingMethodEvidence':en['explanationEvidence'],'nextAction':'Compare the opening question with the actual explanation and answer feedback; author a specific transfer case only where a reasoning step is missing.'}
    if route=='meditation':
        item=next(x for x in meditation if x['id']==int(path.stem));v=item['en'];case=item['example']['en']
        row['coverage'].update(pedagogicallyAudited=True,rewritten=True)
        row['audit']={'learningObjective':v['goal'],'essentialConcepts':v['explain'],'prerequisite':v['why'],'interestingConnections':item.get('links',[]),'misconceptionAndCorrection':case['answer'],'missingExplanationAddressed':case['explanation'],'teachingMethod':{'case':case['title'],'changedSituation':case['question'],'explainedAnswer':case['answer']},'sourceLimit':item.get('refs')}
    if route=='practical-thinking' and str(int(path.stem)) in practical_ledger:
        item=practical_ledger[str(int(path.stem))]
        row['coverage'].update(pedagogicallyAudited=True,rewritten=True)
        row['audit']={'scope':'Primary goal, existing explanation/application and new transfer feedback; no fresh primary-source verification.','learningObjective':item['objective'],'essentialConcepts':item['retainedExplanation'],'prerequisite':item['prerequisite'],'interestingConnections':item.get('connection','Forecasting tests an expectation; it differs from observing an unfamiliar process without prediction.'),'missingExplanationAddressed':item['change'],'misconceptionAndCorrection':item['en']['explanation'],'teachingMethod':{'case':item['workedApplication'],'changedSituation':item['en']['question'],'explainedAnswer':item['en']['explanation']}}
    if rel in waldorf_routes and waldorf_routes[rel] in waldorf_ledger:
        row['coverage'].update(pedagogicallyAudited=True,rewritten=True)
        row['audit']=waldorf_ledger[waldorf_routes[rel]]['audit']
        row['source']['localDerivedRecord']='waldorf-course/'+waldorf_routes[rel]
    elif route=='waldorf' and re.search(r'grades/grade-\d+/(child|curriculum|why-now)\.html$',rel):
        row['coverage']['inheritedRevisedExample']=True
        row['audit']['nextAction']='This view inherits a revised grade example; it is not counted as a separately audited primary lesson. The broader curriculum statements still need objective-level development.'
    if row['path'] in conceptual_ledgers:
        row['audit']=conceptual_ledgers[row['path']]
        row['coverage'].update(pedagogicallyAudited=True,rewritten=row['audit'].get('rewritten',True),conceptualExplanationReviewed=True,existingFeedbackReviewed=True)
    records.append(row)
# Exact registered files, plus source filenames held only in later ledgers.
registered=read(ROOT/'content/source-register.json')
source_names={x['filename']:dict(x) for x in registered}
def collect_sources(value, ledger):
    if isinstance(value,list):
        for item in value:collect_sources(item,ledger)
    elif isinstance(value,dict):
        for key,item in value.items():
            if isinstance(item,str) and (key in ['filename','pdfFile','markdownFile','epubFile','sourceFile'] or item.lower().endswith(('.pdf','.epub','.docx'))) and re.search(r'\.(pdf|epub|docx|md)$',item,re.I):
                name=Path(item).name
                source_names.setdefault(name,{'filename':name,'ledger':ledger})
            elif isinstance(item,(list,dict)):collect_sources(item,ledger)
for path in (ROOT/'content').rglob('*.json'):
    collect_sources(read(path),str(path.relative_to(ROOT)))
for path in (ROOT/'content').rglob('*'):
    if path.suffix not in ['.json','.mjs','.md']:continue
    for name in re.findall(r'["\']([^"\'\n/]+\.(?:pdf|epub|docx))["\']',path.read_text()):
        if len(name)<500:source_names.setdefault(name,{'filename':name,'ledger':str(path.relative_to(ROOT))})
files={p.name:str(p) for folder in [ROOT,Path('/workspace/library-files'),Path('/workspace/shared/downloads')] for p in folder.rglob('*') if p.is_file() and '.git' not in p.parts}
for name,item in source_names.items():
    item['availablePath']=files.get(name);item['availability']='present' if item['availablePath'] else 'missing in selected workspace'
    lower=name.lower()
    if any(word in lower for word in ['codex-','course-design','knowledge-base']):
        item['role']='derived instructions/design dossier; not a canonical source book'
    elif 'intro to esoterci' in lower or item.get('lecturer') or 'lecture transcript' in str(item.get('type','')).lower():
        item['role']='lecture transcript witness; distinct from a canonical Steiner book'
    elif lower.endswith('.md'):
        item['role']='text capture/OCR or transcript witness; consult edition ledger, not an original print/PDF'
    else:
        item['role']='book/publication witness; edition and canonical/comparison role are course-specific'
    item['blocksIndependentTeaching']=False
OUT.mkdir(exist_ok=True,parents=True)
(OUT/'chapter-coverage.json').write_text(json.dumps({'scope':'Evidence census of every generated course lesson plus all Waldorf teaching/support routes. Detailed editorial audit is explicitly separate.','records':records},ensure_ascii=False,indent=2)+'\n')
(OUT/'source-availability.json').write_text(json.dumps(list(source_names.values()),ensure_ascii=False,indent=2)+'\n')
lines=['# Course and chapter coverage','', 'Generated by `python scripts/audit-course-coverage.py`. This is a complete route-level evidence census, **not a completed editorial review of every lesson**. `A` means an individual scoped teaching audit, not full source or syllabus certification; `R` means substantive teaching revised on this branch. Read each entry’s scope: the earlier passes focus on primary goal/example/feedback; the Foundations, Introduction and Threefold passes review conceptual explanations and dependencies as well. An example alone is not a completion criterion. Validation is recorded separately in the validation report. All existing source locators are inherited, not freshly certified.','', 'Nutrition has an existing English-only full course. A Portuguese landing page is not lesson parity. Waldorf support/grade-view pages are listed separately from its 62 authored topics. Existing detailed reading companions are retained alongside the new conceptual course.','']
for c in sorted(set(r['course'] for r in records)):
    rows=[r for r in records if r['course']==c];lines+=['## '+c,'',f'{len(rows)} English routes; {sum(bool(r["pt"]) for r in rows)} Portuguese counterparts.','', '| Chapter / lesson | A | R | Checks | Portuguese |','| --- | --- | --- | --- | --- |']
    for r in rows:lines.append(f'| [{(r["en"]["title"] or r["path"]).replace("|","/")}](../../{r["path"]}) | {"yes" if r["coverage"]["pedagogicallyAudited"] else "pending"} | {"yes" if r["coverage"]["rewritten"] else "retained" if r["coverage"]["pedagogicallyAudited"] else "pending"} | {"pass" if r["coverage"]["validated"] else "pending"} | {"present" if r["pt"] else "MISSING"} |')
    lines.append('')
(OUT/'COVERAGE.md').write_text('\n'.join(lines)+'\n')
print(json.dumps({'routes':len(records),'courses':len(set(r['course'] for r in records)),'portuguese':sum(bool(r['pt']) for r in records),'primaryGoalCaseAudits':sum(r['coverage']['pedagogicallyAudited'] for r in records),'sourceFiles':len(source_names),'sourcesPresent':sum(bool(x['availablePath']) for x in source_names.values())}))

completed=['# Individual lesson audits: scoped teaching passes','', 'Each entry records its review scope. The conceptual batch examines core explanations, dependencies and misconceptions; earlier primary-goal passes emphasize supplied examples and feedback. Neither an example nor passing software checks alone establishes pedagogical completion. These audits do not certify an entire subject syllabus or fresh original-source fidelity. Grade-view copies are not counted as additional primary lessons.','']
for row in records:
    if not row['coverage']['pedagogicallyAudited']:continue
    a=row['audit'];completed+=['## '+row['en']['title'],'',f"[English](../../{row['path']}) · [Português](../../{row['partner']})",'']
    for key,label in [('scope','Scope'),('learningObjective','Learning objective'),('learningCriterion','Learning criterion'),('essentialConcepts','Essential concepts'),('prerequisite','Prerequisite'),('interestingConnections','Connections'),('misconception','Misconception'),('misconceptionAndCorrection','Misconception and feedback'),('identifiedGap','Identified conceptual gap'),('missingExplanationAddressed','Gap addressed'),('teachingMethod','Teaching method'),('remainingGap','Remaining gap'),('sourceLimit','Source limit')]:
        value=a.get(key)
        if value is None:continue
        completed+=['**'+label+':**','']
        if isinstance(value,str):completed+=[value,'']
        elif isinstance(value,dict):completed += ['- '+str(k)+': '+str(v) for k,v in value.items()]+['']
        else:completed += ['- '+(str(v.get('en') or v.get('relationship') or v) if isinstance(v,dict) else str(v)) for v in value]+['']
(OUT/'COMPLETED-LESSON-AUDIT.md').write_text('\n'.join(completed)+'\n')
