const {chromium}=require('playwright'),fs=require('fs'),path=require('path'),assert=require('assert/strict');
const root=path.resolve('docs'),out=path.resolve('reviews/ux/learning-experience');fs.mkdirSync(out,{recursive:true});
const report=JSON.parse(fs.readFileSync('reviews/ux/course-workspace-coverage.json'));
const representatives=[...new Set(['index.html','learn/index.html','books/index.html','read/index.html','theosophy/index.html','theosophy/lessons/whole-picture.html','philosophy-of-freedom/index.html','philosophy-of-freedom/studies/26.html','learn/phases/index.html',...report.courses.flatMap(c=>[c.home,report.pages.find(p=>p.course===c.id&&p.role==='lesson'&&!p.page.startsWith('pt/'))?.page]).filter(Boolean)])];
const results=[],errors=[],failures=[];
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 async function context(options){const ctx=await browser.newContext(options);await ctx.route('**/*',async r=>{const u=new URL(r.request().url());if(u.hostname!=='learning.test')return r.abort();let f=path.resolve(root,'.'+decodeURIComponent(u.pathname.replace(/^\/Anthroposophy/,'')));if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');if(!f.startsWith(root+path.sep)||!fs.existsSync(f)){errors.push('Missing '+u.pathname);return r.fulfill({status:404,body:'Missing'});}await r.fulfill({body:fs.readFileSync(f),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png'})[path.extname(f)]||'application/octet-stream'});});return ctx;}
 try{
  for(const width of [320,390,768,1440]){
   const ctx=await context({viewport:{width,height:950}}),p=await ctx.newPage();p.on('pageerror',e=>errors.push(e.message));
   for(const lang of ['en','pt'])for(const r of representatives){const route=(lang==='pt'?'pt/':'')+r;try{await p.goto('https://learning.test/Anthroposophy/'+route);await p.evaluate(()=>document.fonts.ready);
    assert.equal(await p.locator('h1').count(),1,route+' one h1');assert.ok(await p.locator('h1').isVisible(),route+' visible title');
    assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route+' overflow '+width);
    const ids=await p.locator('[id]').evaluateAll(es=>es.map(e=>e.id));assert.equal(new Set(ids).size,ids.length,route+' duplicate IDs');
    assert.ok((await p.locator('h1').evaluate(e=>getComputedStyle(e).fontFamily)).includes('Unfolding Display'),route+' display heading');
    assert.ok(await p.evaluate(()=>document.fonts.check('24px "Unfolding Display"','Compreensão e liberdade')),route+' font accents available');
    if(['index.html','learn/index.html','philosophy-of-freedom/lessons/12.html'].includes(r)&&[390,1440].includes(width)&&lang==='en')await p.screenshot({path:path.join(out,r.replaceAll('/','--')+'-'+width+'.png')});
    if(r==='learn/index.html'||r==='books/index.html'){
     const search=p.locator('.cw-catalogue-filters input'),subject=p.locator('.cw-subject-label select');assert.equal(await subject.count(),1);
     await subject.selectOption('thinking');assert.ok(await p.locator('.cw-course-card:visible').count()>0);assert.ok(await p.locator('.cw-course-card:visible').evaluateAll(es=>es.every(e=>e.dataset.courseSubject==='thinking')));
     await search.fill('zzzz-nothing');assert.equal(await p.locator('.cw-course-card:visible').count(),0);assert.ok(await p.locator('.cw-reset-search').isVisible());
     await p.locator('.cw-reset-search').click();assert.equal(await subject.inputValue(),'all');assert.equal(await search.inputValue(),'');
     await search.fill('nutri');if(r==='learn/index.html'){assert.equal(await p.locator('.cw-course-card:visible').count(),1);assert.ok((await p.locator('.cw-course-card:visible').innerText()).includes('18'));}
     await p.locator('.cw-reset-search').click();await search.fill(lang==='pt'?'meditacao':'meditation');assert.equal(await p.locator('.cw-course-card:visible').count(),2,'Both Start Now and Meditation match this subject');await p.locator('.cw-reset-search').click();
     await p.locator('.cw-catalogue-pages button').last().click();assert.ok((await p.locator('.cw-results').innerText()).includes(lang==='pt'?'página 2':'page 2'));await p.locator('.cw-catalogue-pages button').first().click();
    }
    if(r==='philosophy-of-freedom/studies/26.html'||r==='theosophy/lessons/whole-picture.html'){
     const tools=p.locator('.reader-tools');assert.ok(await tools.isVisible(),route+' reading tools');
     await tools.locator('summary').click();await tools.getByRole('button',{name:lang==='pt'?'Texto maior':'Larger text',exact:true}).click();
     assert.equal(await p.locator('body').getAttribute('data-reader-size'),'large');assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route+' large text overflow');
     const focus=p.locator('.reader-focus-toggle');await focus.click();assert.equal(await focus.getAttribute('aria-pressed'),'true');assert.ok(await focus.isVisible());assert.equal(await p.locator('body > header').isVisible(),false);
     await p.keyboard.press('Escape');assert.equal(await focus.getAttribute('aria-pressed'),'false');assert.ok(await p.locator('body > header').isVisible());
     await tools.getByRole('button',{name:lang==='pt'?'Texto padrão':'Standard text',exact:true}).click();
    }
    results.push({route,width,status:'passed'});
    }catch(e){failures.push({route,width,error:e.message});console.log('FAIL',route,width,e.message);}
   }
   await ctx.close();console.log('Responsive cases:',results.length);
  }
  // All representative courses retain a usable narrow-screen fallback without JS.
  const fallback=await context({viewport:{width:320,height:950},javaScriptEnabled:false}),p=await fallback.newPage();for(const route of representatives){await p.goto('https://learning.test/Anthroposophy/'+route);assert.ok(await p.locator('h1').isVisible(),route+' no JS');assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route+' fallback overflow');}await fallback.close();
  // Preferences remain usable when browser storage is unavailable.
  const blocked=await context({viewport:{width:390,height:950}});await blocked.addInitScript(()=>{for(const key of ['localStorage','sessionStorage'])Object.defineProperty(window,key,{get(){throw new DOMException('Blocked','SecurityError');}});});const q=await blocked.newPage();await q.goto('https://learning.test/Anthroposophy/philosophy-of-freedom/studies/26.html');await q.locator('.reader-focus-toggle').click();assert.ok(await q.locator('.reader-focus-toggle').isVisible());await q.keyboard.press('Escape');await blocked.close();
  assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);
  fs.writeFileSync(path.join(out,'browser.json'),JSON.stringify({status:'passed',responsiveCases:results.length,viewports:[320,390,768,1440],languages:['en','pt'],representativeRoutes:representatives,noJavascriptCases:representatives.length,checks:['display font loads and Portuguese accents supported','visible unique titles','no horizontal document overflow','unique IDs','search plus subject filters, empty state, clear action and pagination','Nutrition is discoverable with verified count','accent-insensitive Portuguese search','focus mode exits by keyboard','large reading text','blocked storage fallback','GitHub Pages repository path prefix'],results},null,2)+'\n');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
