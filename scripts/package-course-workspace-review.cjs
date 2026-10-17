const fs = require('node:fs');
const path = require('node:path');
const {PDFDocument, StandardFonts, rgb} = require('pdf-lib');
const {chromium} = require('playwright');
const out = process.env.REVIEW_OUTPUT || '/workspace/course-ui-rollout';
const coverage = JSON.parse(fs.readFileSync('reviews/ux/course-workspace-coverage.json'));

(async () => {
  // Capture the separate Theosophy implementation from the same final build.
  fs.mkdirSync(path.join(out,'theosophy'),{recursive:true});
  const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
  try {
    const context=await browser.newContext();
    await context.route('**/*',async route=>{
      const u=new URL(route.request().url());
      if(u.hostname!=='course.test')return route.abort();
      const root=path.resolve('docs'),file=path.resolve(root,'.'+u.pathname);
      if(!file.startsWith(root+path.sep)||!fs.existsSync(file))throw Error('Missing '+u.pathname);
      return route.fulfill({contentType:({'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream',body:fs.readFileSync(file)});
    });
    const p=await context.newPage();
    for(const route of ['theosophy/lessons/body-soul-spirit','pt/theosophy/lessons/whole-picture']) {
      for(const width of [390,1440]) {
        await p.setViewportSize({width,height:width===390?844:1000});
        await p.goto('https://course.test/'+route+'.html');
        await p.waitForSelector('body.tw-ready');
        await p.screenshot({path:path.join(out,'theosophy',route.replaceAll('/','--')+'-'+width+'.png')});
      }
    }
  } finally {await browser.close();}
  const pdf = await PDFDocument.create();
  pdf.setTitle('Anthroposophy course layout review');
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const ink = rgb(.16,.23,.20);
  let page = pdf.addPage([842,595]);
  page.drawText('Anthroposophy course layout review', {x:36,y:530,size:28,font:bold,color:ink});
  const lines = [
    'Review branch: redesign/course-learning-workspace',
    'Local browser screenshots; this document does not certify deployment.',
    '',
    '23 course families use the shared layout; Theosophy retains its preview.',
    'Each family page pairs mobile (390px) and desktop (1440px) reading.',
    'Zoom into the PDF to inspect the desktop text.',
    '',
    'The short teaching, optional explanations and source context are preserved.',
    'Chapters move to a drawer on mobile and a curriculum sidebar on desktop.',
    'Course overviews and the catalogue put lesson selection near the top.',
    '',
    'Chapter audits and source gaps: reviews/pedagogy/COURSE-CHECKLIST.md',
    'Implementation and test evidence: reviews/ux/COURSE-WORKSPACE-REVIEW.md',
  ];
  lines.forEach((line,i)=>page.drawText(line,{x:36,y:475-i*27,size:14,font,color:ink}));
  async function pair(title, mobile, desktop) {
    page=pdf.addPage([1100,900]);
    page.drawText(title,{x:28,y:860,size:19,font:bold,color:ink});
    for(const [file,x,w,h] of [[mobile,28,350,760],[desktop,402,670,760]]) {
      const img=await pdf.embedPng(fs.readFileSync(path.join(out,file)));
      const scale=Math.min(w/img.width,h/img.height);
      page.drawImage(img,{x,y:825-img.height*scale,width:img.width*scale,height:img.height*scale});
    }
    page.drawText('Local Chromium render | mobile 390px | desktop 1440px',{x:28,y:22,size:11,font,color:ink});
  }
  for(const c of coverage.courses) {
    const lesson=coverage.pages.find(p=>p.course===c.id&&p.role==='lesson'&&!p.page.startsWith('pt/'));
    const stem=lesson.page.replaceAll('/','--');
    await pair(c.id,stem+'-390.png',stem+'-1440.png');
  }
  for(const route of ['learn/index.html','pt/learn/index.html','books/index.html','nutrition/index.html','pt/nutrition/index.html','pt/learn/waldorf/index.html']) {
    const stem=route.replaceAll('/','--');
    await pair(route,stem+'-390.png',stem+'-1440.png');
  }
  for(const stem of ['theosophy--lessons--body-soul-spirit','pt--theosophy--lessons--whole-picture']) {
    await pair(stem.replaceAll('--',' / '),'theosophy/'+stem+'-390.png','theosophy/'+stem+'-1440.png');
  }
  fs.writeFileSync(path.join(out,'Anthroposophy-course-layout-review.pdf'),await pdf.save());
  console.log('Created '+pdf.getPageCount()+' review pages.');
})();
