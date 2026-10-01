import fs from 'node:fs';
import {freedomLectureGuides,freedomLectureSources} from '../content/philosophy-of-freedom-lecture-guides.mjs';

const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const n=id=>String(id).padStart(2,'0');
let count=0;
for(const lang of ['en','pt']){
  const pt=lang==='pt',base=pt?'docs/pt':'docs',t=(en,br)=>pt?br:en;
  for(const guide of freedomLectureGuides){
    const file=`${base}/philosophy-of-freedom/lessons/${n(guide.id)}.html`;
    let html=fs.readFileSync(file,'utf8');
    if(html.includes('id="lecture-guide"'))throw Error('Rebuild the course before adding lecture guides: '+file);
    const v=guide[lang];
    const sources=guide.sourceKeys.map(key=>{
      const s=freedomLectureSources.find(s=>s.key===key);
      if(!s)throw Error('Unknown lecture source: '+key);
      return `${esc(s[lang])} (${esc(s.timestampStart)}–${esc(s.timestampEnd)})`;
    }).join('; ');
    const block=`<section class="source-note lecture-guide" id="lecture-guide" aria-labelledby="lecture-guide-title"><div class="eyebrow">${t('Study with the lecture','Estude com a palestra')}</div><h2 id="lecture-guide-title">${esc(v.title)}</h2><p class="passage-credit">Brian Gray · ${sources}. ${t('Course synthesis comparing the lecture with Steiner’s book.','Síntese didática que compara a palestra com o livro de Steiner.')}</p>${v.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}<div class="lecture-example"><h3>${t('Work through an example','Examine um exemplo')}</h3><p>${esc(v.example)}</p></div><p><strong>${t('Check the distinction','Confira a distinção')}:</strong> ${esc(v.question)}</p><details class="guided-answer"><summary>${t('Show an explained answer','Ver uma resposta comentada')}</summary><p>${esc(v.answer)}</p></details><p><a href="../index.html#lecture-sources">${t('About the lecture readings','Sobre as leituras das palestras')} →</a></p></section>`;
    if(!html.includes('<section class="practice">'))throw Error('Missing lesson practice: '+file);
    html=html.replace('<section class="practice">',block+'<section class="practice">');
    fs.writeFileSync(file,html);count++;
  }
  const file=`${base}/philosophy-of-freedom/index.html`;
  let html=fs.readFileSync(file,'utf8');
  const about=`<section class="source-note" id="lecture-sources"><h2>${t('Study with Brian Gray’s lectures','Estude com as palestras de Brian Gray')}</h2><p>${freedomLectureGuides.length} ${t('lessons include a lecture guide, a worked example and an explained question. These guides compare the supplied lecture transcripts with the complete Wilson book. Gray’s interpretations remain attributed, and the book supplies arguments or qualifications that a lecture passes over.','lições incluem orientação a partir da palestra, exemplo desenvolvido e pergunta com resposta comentada. Essas orientações comparam as transcrições fornecidas com o livro completo de Wilson. As interpretações de Gray conservam sua autoria, e o livro fornece argumentos ou qualificações que uma palestra não desenvolve.')}</p><p>${freedomLectureSources.length} ${t('supplied transcripts cover the overview, both prefaces and all fourteen chapters. Their timestamps identify positions within each supplied transcript. They do not identify book pages or establish the original lecture date. The concluding synthesis follows the complete book; a dedicated conclusion transcript has not been supplied.','transcrições fornecidas abrangem a visão geral, os dois prefácios e todos os quatorze capítulos. Os tempos indicam posições em cada transcrição fornecida. Não indicam páginas do livro nem estabelecem a data original da palestra. A síntese conclusiva segue o livro completo; não foi fornecida uma transcrição específica da conclusão.')}</p><p>${t('The earlier preface is labelled 1893 in the lecture material and 1894 in Wilson’s book. Follow the section heading when comparing editions; the lecturer’s printed pagination belongs to his teaching edition. Explanations and examples here are original course material, in English and Brazilian Portuguese.','O primeiro prefácio aparece como 1893 no material da palestra e 1894 no livro de Wilson. Use o título da seção ao comparar edições; a paginação impressa citada pelo palestrante pertence à edição que ele usa. As explicações e os exemplos aqui são material didático original, em inglês e português brasileiro.')}</p></section>`;
  if(html.includes('id="lecture-sources"'))throw Error('Rebuild the index before adding lecture sources');
  html=html.replace('</main>',about+'</main>');
  fs.writeFileSync(file,html);
}
console.log(`Added Brian Gray lecture guides, original examples and explained questions to ${count} bilingual lesson pages.`);
