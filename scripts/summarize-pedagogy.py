"""Summarize authored teaching units separately from generated/inherited views."""
from pathlib import Path
import collections,json
root=Path(__file__).resolve().parents[1];out=root/'reviews/pedagogy'
rows=json.loads((out/'chapter-coverage.json').read_text())['records'];groups=collections.defaultdict(list)
for row in rows:groups[row['course']].append(row)
# Waldorf primary topics have a source-keyed individual ledger. Its remaining
# routes are inherited grade views/support, not new authored lesson units.
def primary(row):return row['course']!='waldorf' or bool(row['source'].get('localDerivedRecord'))
lines=['# Per-course review checklist','', 'Counts distinguish authored teaching units from English lesson/support routes. Each authored lesson is counted once across languages; optional practice and orientation lessons are distinct units. Parallel courses can teach the same book, so these are not unique original book chapters or unique concepts. Waldorf has 62 primary topics and 36 inherited/support routes.','', 'Audited does not mean rewritten. Retained means an individual review found the current explanation adequate for its stated criterion; it does not certify fresh source fidelity. All original-source verification remains pending.','', '| Course | Authored units | EN routes | Audited | Revised | Retained | PT routes | Pending authored units |','| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |']
summary=[]
for name,rs in sorted(groups.items()):
 ps=[r for r in rs if primary(r)];a=sum(r['coverage']['pedagogicallyAudited'] for r in ps);w=sum(r['coverage']['rewritten'] for r in ps);pt=sum(r['pt'] is not None for r in rs)
 summary.append(dict(course=name,authoredUnits=len(ps),englishRoutes=len(rs),audited=a,rewritten=w,retained=a-w,portugueseRoutes=pt,pendingAuthoredUnits=len(ps)-a))
 lines.append(f'| {name} | {len(ps)} | {len(rs)} | {a} | {w} | {a-w} | {pt} | {len(ps)-a} |')
unit=sum(x['authoredUnits'] for x in summary);a=sum(x['audited'] for x in summary);w=sum(x['rewritten'] for x in summary)
lines+=['',f'Total: **{unit} authored units**, {len(rows)} English lesson/support routes and {sum(x["portugueseRoutes"] for x in summary)} Portuguese counterparts. **{a} scoped audits: {w} revised and {a-w} retained. {unit-a} authored units await individual audit**, plus 36 Waldorf inherited/support routes not counted as independent lessons.','', 'The earlier 108 primary-goal passes have narrower scope than the later conceptual reviews. See each ledger entry’s scope and criterion. Nutrition’s 18 full lessons still lack Portuguese. Threefold Society covers only its supplied opening; specialist limitations and missing source witnesses remain even where the current teaching unit is audited.','', 'Pending original-source verification is separate from pending teaching work. No unchanged Library network failure was retried in the subsequent conceptual batches.']
(out/'COURSE-CHECKLIST.md').write_text('\n'.join(lines)+'\n');(out/'course-counts.json').write_text(json.dumps(summary,indent=2)+'\n')
print(json.dumps(dict(authoredUnits=unit,englishRoutes=len(rows),audited=a,revised=w,retained=a-w,pendingAuthoredUnits=unit-a)))
