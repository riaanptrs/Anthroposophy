const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const {chromium}=require('playwright');
const root=path.resolve('docs'),out=path.resolve('reviews/pedagogy/teacher-library/freedom-main');
(async()=>{
 const rows=JSON.parse(fs.readFileSync('content/philosophy-of-freedom-clear-lessons.json'));
 const cases=rows.map(r=>({route:`philosophy-of-freedom/lessons/${String(r.id).padStart(2,'0')}.html`,values:lang=>({...r[lang],question:r[lang].checks[2][0],answer:r[lang].checks[2][1]})}));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});const results=[],errors=[];
 try{for(const javaScriptEnabled of [false,true])for(const width of [320,1280]){
  const ctx=await browser.newContext({viewport:{width,height:1000},javaScriptEnabled});
  await ctx.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname!=='teacher.test')return r.abort();const file=path.resolve(root,'.'+decodeURIComponent(u.pathname.replace(/^\/Anthroposophy/,'')));if(!file.startsWith(root+path.sep)||!fs.existsSync(file))return r.fulfill({status:404,body:'Missing'});return r.fulfill({body:fs.readFileSync(file),contentType:({'.html':'text/html','.js':'text/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.png':'image/png','.jpg':'image/jpeg'})[path.extname(file)]||'application/octet-stream'});});
  const p=await ctx.newPage();p.on('pageerror',e=>errors.push(e.message));
  for(const lang of ['en','pt']){
   for(const c of cases){const route=(lang==='pt'?'pt/':'')+c.route,v=c.values(lang);await p.goto('https://teacher.test/Anthroposophy/'+route);assert.ok(await p.getByText(v.question,{exact:true}).first().isVisible(),route+' visible applied question');const answer=p.getByText(v.answer,{exact:true}).first();assert.equal(await answer.isVisible(),false,route+' feedback initially closed');const disclosure=answer.locator('xpath=ancestor::details[1]');await disclosure.locator('summary').first().click();assert.ok(await answer.isVisible(),route+' explained answer opens');assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route+' overflow');results.push({route,width,javaScriptEnabled,status:'passed'});}



  }
  await ctx.close();console.log('Passed',width,javaScriptEnabled?'interactive':'without JavaScript');
 }
 assert.deepEqual(errors,[]);fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'browser.json'),JSON.stringify({status:'passed',lessonCases:results.length,units:cases.length,viewports:[320,1280],languages:['en','pt'],javascript:[false,true],progression:'Main course questions and answer disclosures tested; core and optional route order verified separately.',results},null,2)+'\n');console.log('Passed '+results.length+' bilingual question/feedback and responsive-display cases.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
