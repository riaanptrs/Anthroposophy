import fs from 'node:fs';
import {wholeElement} from './learning-html.mjs';

// Keep the historical source records, anchors and notebooks intact. The main
// teaching sequence is self-contained; close reading is a separate optional task.
export function buildTeachingApproach() {
 const report={approach:'Explain → work through an example → explain and apply → use feedback → optional close reading',sourcePolicy:'Reproduce only previously reviewed excerpts. References without excerpts are optional further reading, never substitute reading activities.',pages:[],unfinishedWaldorf:'Supplied outlines and unverified quotations remain explicitly unfinished; this pass does not turn them into completed lessons.'};
 for(const name of fs.readdirSync('docs',{recursive:true}).filter(name=>name.endsWith('.html'))) {
  const file='docs/'+name;
  if(!/(?:\/lessons\/\d+\.html$|^(?:pt\/)?(?:meditation|nutrition)\/\d+\.html$)/.test(name))continue;
  let html=fs.readFileSync(file,'utf8');
  if(html.includes('data-teaching-approach="concept-first"'))continue;
  const pt=name.startsWith('pt/'),t=(en,br)=>pt?br:en;
  const sourceTag=/<section\b[^>]*(?:class="(?:book-passage|learning-source|theosophy-source|thought-source|nutrition-excerpt)[^"]*"|id="(?:source|read-steiner)")[^>]*>/g;
  const matches=[...html.matchAll(sourceTag)].map(m=>m[0]);
  let excerpts=0,references=0;
  for(const marker of matches) {
   const source=wholeElement(html,marker);if(!source)throw Error('Unclosed teaching source '+file);
   const quoted=source.includes('<blockquote');quoted?excerpts++:references++;
   const revised=source
    .replaceAll('Read this identified section in the source alongside the explanation below.','This reference is optional further reading. The lesson’s explanation and checks can be studied here; no excerpt from this section is reproduced.')
    .replaceAll('Leia esta seção identificada na fonte junto com a explicação abaixo.','Esta referência é uma leitura complementar opcional. A explicação e as perguntas da lição podem ser estudadas aqui; esta seção não reproduz um trecho da fonte.')
    .replace('Begin with the book','Read the supporting excerpt').replace('Comece pelo livro','Leia o trecho de apoio');
   const summary=quoted?t('Optional close reading · excerpt included','Leitura atenta opcional · trecho incluído'):t('Optional further reading · source references','Aprofundamento opcional · referências das fontes');
   html=html.replace(source,`<details class="course-source-study" data-optional-source><summary>${summary}</summary>${revised}</details>`);
  }
  // Agricultural students first need the explained model, rather than being
  // asked to formulate it before instruction. Retain the existing note control.
  if(html.includes('class="bio-proposal"')) {
   const attempt=wholeElement(html,'<section class="study-attempt">');
   const example=wholeElement(html,'<section class="bio-example">');
   if(attempt&&example){html=html.replace(attempt,'').replace(example,example+attempt);}
  }
  const sourceTask=wholeElement(html,'<section class="study-return">');
  if(sourceTask) html=html.replace(sourceTask,`<details class="course-source-study" data-optional-source-task><summary>${t('Optional: connect the included excerpt with your explanation','Opcional: relacione o trecho incluído à sua explicação')}</summary>${sourceTask}</details>`);
  html=html.replace(/(<main\b)/,'$1 data-teaching-approach="concept-first"');
  html=html.replaceAll('What the author means','Understand the idea').replaceAll('O que o autor quer dizer','Entenda a ideia');
  fs.writeFileSync(file,html);
  report.pages.push({path:name,language:pt?'pt-BR':'en',includedExcerptSections:excerpts,referenceOnlySections:references});
 }
 fs.writeFileSync('content/course-teaching-review.json',JSON.stringify(report,null,2)+'\n');
 console.log(`Teaching approach: ${report.pages.length} lesson pages; source study optional, existing excerpts and notes preserved.`);
}
