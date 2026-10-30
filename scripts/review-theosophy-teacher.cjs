const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const {chromium}=require('playwright');
const root=path.resolve('docs'),out=path.resolve('reviews/pedagogy/teacher-library/theosophy');
(async()=>{
 const rows=JSON.parse(fs.readFileSync('content/theosophy-clear-lessons.json'));
 const cases=rows.map(r=>({route:`theosophy/lessons/${r.id}.html`,values:lang=>({...r[lang],question:r[lang].checks[1][0],answer:r[lang].checks[1][1]})}));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});const results=[],errors=[];
 try{for(const javaScriptEnabled of [false,true])for(const width of [320,1280]){
  const ctx=await browser.newContext({viewport:{width,height:1000},javaScriptEnabled});
  await ctx.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname!=='teacher.test')return r.abort();const file=path.resolve(root,'.'+decodeURIComponent(u.pathname.replace(/^\/Anthroposophy/,'')));if(!file.startsWith(root+path.sep)||!fs.existsSync(file))return r.fulfill({status:404,body:'Missing'});return r.fulfill({body:fs.readFileSync(file),contentType:({'.html':'text/html','.js':'text/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.png':'image/png','.jpg':'image/jpeg'})[path.extname(file)]||'application/octet-stream'});});
  const p=await ctx.newPage();p.on('pageerror',e=>errors.push(e.message));
  for(const lang of ['en','pt']){
   for(const c of cases){const route=(lang==='pt'?'pt/':'')+c.route,v=c.values(lang);await p.goto('https://teacher.test/Anthroposophy/'+route);const first=p.locator('[data-clarity-first]');assert.deepEqual((await first.locator(':scope > p').allInnerTexts()).map(s=>s.replace(/\s+/g,' ').trim()),v.paragraphs.map(s=>s.replace(/\s+/g,' ').trim()),route+' complete explanation');if(v.roleMap){const map=first.locator('.cp-reading-role-map');assert.ok(await map.isVisible(),route+' visible reading map');for(const text of v.roleMap.entries.flat())assert.ok(await map.getByText(text,{exact:true}).isVisible(),route+' complete map');}assert.ok(await p.getByText(v.question,{exact:true}).first().isVisible(),route+' visible applied question');const answer=p.getByText(v.answer,{exact:true}).first();assert.equal(await answer.isVisible(),false,route+' feedback initially closed');const disclosure=answer.locator('xpath=ancestor::details[1]');await disclosure.locator('summary').first().click();assert.ok(await answer.isVisible(),route+' explained answer opens');assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route+' overflow');results.push({route,width,javaScriptEnabled,status:'passed'});}
   if(javaScriptEnabled){const prefix=lang==='pt'?'pt/':'';await p.goto('https://teacher.test/Anthroposophy/'+prefix+'theosophy/lessons/body-soul-spirit.html');assert.equal(await p.locator('.tw-position').innerText(),lang==='pt'?'Lição 1 de 24':'Lesson 1 of 24');await p.goto('https://teacher.test/Anthroposophy/'+prefix+'theosophy/lessons/whole-picture.html');assert.equal(await p.locator('.tw-position').innerText(),lang==='pt'?'Lição 24 de 24':'Lesson 24 of 24');}


  }
  await ctx.close();console.log('Passed',width,javaScriptEnabled?'interactive':'without JavaScript');
 }
 assert.deepEqual(errors,[]);fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'browser.json'),JSON.stringify({status:'passed',lessonCases:results.length,units:cases.length,viewports:[320,1280],languages:['en','pt'],javascript:[false,true],progression:'Theosophy first and last positions are 1 and 24; all main explanations and reading maps remain visible.',results},null,2)+'\n');console.log('Passed '+results.length+' bilingual question/feedback cases and Theosophy progression/reading-map checks.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
