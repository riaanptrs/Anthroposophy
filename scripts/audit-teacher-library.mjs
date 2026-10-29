/** Lesson census and traceable evidence. These checks do not make editorial judgments. */
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {workspaceCourses} from './course-workspace-data.mjs';
const out='reviews/pedagogy/teacher-library';fs.mkdirSync(out,{recursive:true});
const prior=JSON.parse(fs.readFileSync('reviews/pedagogy/chapter-coverage.json')).records;
const priorMap=new Map(prior.map(r=>[r.path.replace(/^docs\//,''),r]));
const courses=workspaceCourses(),routes=new Set(courses.flatMap(c=>c.lessons.map(l=>l.route)));
for(const id of ['theosophy','philosophy-of-freedom','learn/esoteric-social']){
 let c=courses.find(c=>c.id===id);if(!c){c={id,lessons:[]};courses.push(c);}
 for(const file of fs.readdirSync('docs/'+id+'/lessons').filter(f=>f.endsWith('.html'))){const route=id+'/lessons/'+file;if(!routes.has(route)){c.lessons.push({route});routes.add(route);}}
}
for(const file of fs.readdirSync('docs/philosophy-of-freedom/studies').filter(f=>f.endsWith('.html')))courses.find(c=>c.id==='philosophy-of-freedom').lessons.push({route:'philosophy-of-freedom/studies/'+file});
const plain=s=>s.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<[^>]*>/g,' ').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/\s+/g,' ').trim();
const changed=new Set(Array.from({length:13},(_,i)=>`practical-thinking/lessons/${String(i).padStart(2,'0')}.html`).concat(['learn/phases/lessons/01.html','learn/phases/lessons/04.html',...['choose-a-path','short-daily-sitting','review-in-reverse','rose-cross-and-variants'].map(id=>'start-now/lessons/'+id+'.html')]));
for(let id=1;id<=28;id++)changed.add('introduction-to-anthroposophy/lessons/'+String(id).padStart(2,'0')+'.html');
const theosophyRevised=new Set(["body-soul-spirit", "physical-body", "life-and-etheric-body", "sentience-and-astral-body", "human-i", "sentient-soul", "mind-soul", "spiritual-transformation", "memory-and-individuality", "reincarnation", "karma-and-action", "soul-affinities", "life-between-lives", "nature-and-spiritual-beings", "thinking-and-willing", "freedom-and-initiation", "whole-picture"]);
for(const id of theosophyRevised)changed.add(`theosophy/lessons/${id}.html`);
const rows=[];
for(const c of courses)for(const l of c.lessons){
 const html=fs.readFileSync('docs/'+l.route,'utf8'),main=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1]||'';
 const teaching=main.match(/<section class="batch-first-reading"[\s\S]*?(?=<details class="batch-retained-depth"|<\/main>|$)/)?.[0]||main;
 const paragraphs=[...teaching.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map(m=>plain(m[1])).filter(p=>p.length>90);
 const questions=[...teaching.matchAll(/<(?:p|legend)\b[^>]*>([\s\S]*?)<\/(?:p|legend)>/g)].map(m=>plain(m[1])).filter(p=>p.includes('?')&&p.length<450);
 const headings=[...teaching.matchAll(/<h[23]\b[^>]*>([\s\S]*?)<\/h[23]>/g)].map(m=>plain(m[1]));
 const old=priorMap.get(l.route),partner='pt/'+l.route,pt=fs.existsSync('docs/'+partner);
 const note=changed.has(l.route)?'Applied assessment revised; explanation and source material retained.':old?'Earlier individual editorial judgment retained as background; current delivery evidence recorded separately.':'Current goal/teaching/assessment alignment screening; no claim of a new source-fidelity audit.';
 rows.push({course:c.id,route:l.route,title:plain(main.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1]||''),languagePartner:pt?partner:null,headings,explanationEvidence:paragraphs.slice(0,3),questionEvidence:questions,priorIndividualAudit:old?{reference:'../chapter-coverage.json',scope:old.audit?.scope,learningObjective:old.audit?.learningObjective,learningCriterion:old.audit?.learningCriterion,retainedStrengths:old.audit?.retainedStrengths,coverage:old.coverage}:null,currentReview:note,...(c.id==='introduction-to-anthroposophy'?{currentCourseReview:{reference:'introduction/REVIEW.md',scope:'All 28 current main explanations and both checks read; detailed retained sources preserved, not freshly verified.'}}:c.id==='theosophy'?{currentCourseReview:{reference:'theosophy/REVIEW.md',scope:'All 24 English primary explanations and both checks read; bilingual revised checks and maps supplied; retained source depth not freshly verified.'}}:{}),sourceFidelity:'Not freshly certified by this review.',deliveryChecks:{hasMain:!!main,hasTitle:!!main.match(/<h1\b/),hasExplanatoryProse:paragraphs.length>0,hasAnswerDisclosure:/<details\b/.test(main),hasPortuguesePartner:pt},sha256:createHash('sha256').update(html).digest('hex')});
}
const md=fs.readFileSync('courses/steiner-documentary/content/course.md','utf8');
for(const m of md.matchAll(/^# Lesson (\d+)\n([\s\S]*?)(?=^# |(?![\s\S]))/gm)){
 const number=Number(m[1]),body=m[2];rows.push({course:'steiner-documentary',route:'learn/steiner-documentary/index.html#/lesson/'+number,title:body.match(/^## (.+)/m)?.[1],learningObjective:body.match(/\*\*Learning outcome:\*\* (.+)/)?.[1],currentReview:'Current outcome/activity/answer-guide alignment screened; documentary transcript is an attributed witness, not independently reverified film audio.',languagePartner:null,languageScope:'English course with Portuguese entry; no claim of twelve Portuguese lessons.'});
}
const summary={date:'2026-10-29',scope:'Main authored lessons, reading companions, optional lessons, detailed Freedom studies and twelve documentary lessons; support/index pages and research notes are not additional lessons.',method:'Current lesson census and delivery checks, current goal/assessment screening of newer units, and reuse of explicitly attributed earlier individual editorial audits. Automated evidence presence is not a semantic sign-off or proof of learning.',totalUnits:rows.length,courses:[...new Set(rows.map(r=>r.course))].map(course=>({course,units:rows.filter(r=>r.course===course).length,earlierIndividualAudits:rows.filter(r=>r.course===course&&r.priorIndividualAudit).length,revisedAssessments:rows.filter(r=>r.course===course&&changed.has(r.route)).length})),revisedAssessments:changed.size,records:rows};
fs.writeFileSync(out+'/lesson-evidence.json',JSON.stringify(summary,null,2)+'\n');
console.log(JSON.stringify({units:summary.totalUnits,courses:summary.courses.length,priorIndividualAudits:rows.filter(r=>r.priorIndividualAudit).length,revisedAssessments:changed.size,deliveryFailures:rows.filter(r=>r.deliveryChecks&&Object.values(r.deliveryChecks).some(v=>!v)).map(r=>({route:r.route,checks:r.deliveryChecks}))},null,2));
