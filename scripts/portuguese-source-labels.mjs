import fs from 'node:fs';

// Translation labels are separate from the byte-preserved historical passage bank.
const labels=JSON.parse(fs.readFileSync(new URL('../content/portuguese-source-labels.json',import.meta.url),'utf8'));
const identity=p=>p.course+':'+p.ids.join(',');
const byIdentity=new Map();
for(const entry of labels) {
 const key=identity(entry);
 if(byIdentity.has(key))throw Error('Duplicate Portuguese source labels: '+key);
 for(const field of Object.keys(entry)) {
  if(!['course','ids','titlePt','locatorPt','editionPt'].includes(field))throw Error('Unexpected Portuguese source-label field: '+field);
  if(field.endsWith('Pt')&&(typeof entry[field]!=='string'||!entry[field].trim()))throw Error('Empty Portuguese source label: '+key+'/'+field);
 }
 byIdentity.set(key,entry);
}
export function withPortugueseSourceLabels(passages) {
 const seen=new Set();
 const result=passages.map(p=>{
  const key=identity(p),entry=byIdentity.get(key);
  if(!entry)return p;
  seen.add(key);
  const {course,ids,...translated}=entry;
  for(const field of Object.keys(translated))if(p[field]!==undefined)throw Error('Portuguese source label would overwrite authored metadata: '+key+'/'+field);
  return {...p,...translated};
 });
 for(const key of byIdentity.keys())if(!seen.has(key))throw Error('Portuguese source label has no passage: '+key);
 return result;
}
