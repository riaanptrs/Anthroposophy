import fs from 'node:fs';
import {freedomCore,freedomPractice,freedomConsolidated as lessons,freedomReadingSpans} from '../content/philosophy-of-freedom-consolidated.mjs';
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;'),n=i=>String(i).padStart(2,'0');
const aids=[
 [
  "Separate Barton’s foreword and Wilson’s translation notes from Steiner’s two prefaces. Reconstruct the two questions about knowing and free action before evaluating the answers.",
  "Separe o prefácio de Barton e as notas de Wilson dos dois prefácios de Steiner. Reconstrua as perguntas sobre conhecer e agir livremente antes de avaliar as respostas."
 ],
 [
  "Being aware of a wish, understanding its determining ground and carrying it out are different. Chapter 1 opens the question that the following chapters develop.",
  "Perceber um desejo, compreender seu fundamento determinante e executá-lo são coisas diferentes. O capítulo 1 abre a pergunta desenvolvida nos capítulos seguintes."
 ],
 [
  "Follow the criticism of both one-sided materialism and one-sided spiritualism. Explain how the separation of self and world becomes a question about their connection.",
  "Acompanhe a crítica ao materialismo e ao espiritualismo unilaterais. Explique como a separação entre eu e mundo se torna uma pergunta sobre sua ligação."
 ],
 [
  "Do a thinking task, then make the activity itself your object. Read the 1918 addition and distinguish producing a connection from receiving a passing thought-image.",
  "Realize uma tarefa de pensamento e depois tome a atividade como objeto. Leia o adendo de 1918 e distinga produzir uma ligação de receber uma imagem de pensamento passageira."
 ],
 [
  "Distinguish percept, concept and mental picture. Reconstruct each argument and its speaker before examining Steiner’s objections to its proof.",
  "Distinga percepto, conceito e representação. Reconstrua cada argumento e identifique quem o apresenta antes de examinar as objeções de Steiner à demonstração."
 ],
 [
  "Follow the critique of critical idealism as well as the positive percept–concept account. The 1918 addition asks you to examine what an objection presupposes in its own thinking.",
  "Acompanhe a crítica ao idealismo crítico e a descrição positiva de percepto e conceito. O adendo de 1918 pede que examine o que uma objeção pressupõe em seu próprio pensar."
 ],
 [
  "A mental picture is an individualized concept connected with an encounter. It may concern a sound or feeling as well as a visible object; personal feeling gives an encounter its significance.",
  "Uma representação é um conceito individualizado ligado a um encontro. Pode envolver som ou sentimento, além de um objeto visível; o sentimento pessoal dá significado ao encontro."
 ],
 [
  "Distinguish an unanswered research question from an absolute limit to knowledge. Keep the criticism of dualism and the scope of the 1918 addition explicit.",
  "Distinga uma pergunta de pesquisa sem resposta de um limite absoluto ao conhecimento. Preserve a crítica ao dualismo e o alcance do adendo de 1918."
 ],
 [
  "Feeling and willing are experiences to be understood. Read the positive account of living thinking in the 1918 addition alongside the criticism of one-sided philosophies.",
  "Sentir e querer são experiências a compreender. Leia a descrição positiva do pensar vivo no adendo de 1918 junto à crítica das filosofias unilaterais."
 ],
 [
  "Keep motive, driving force, love for the deed and practical ability distinct. Explain how ethical intuition depends on the account of thinking in the first half.",
  "Distinga motivo, força motriz, amor pela ação e capacidade prática. Explique como a intuição ética depende da descrição do pensar na primeira parte."
 ],
 [
  "Read both 1918 additions. Explain the difference between external determination, human development and an individually understood ethical aim.",
  "Leia os dois adendos de 1918. Explique a diferença entre determinação externa, desenvolvimento humano e finalidade ética compreendida individualmente."
 ],
 [
  "A represented aim works as a present idea; it differs from a future result acting backward. Preserve the 1918 qualification about the spiritual world.",
  "Uma finalidade representada atua como ideia presente; difere de um resultado futuro agindo para trás. Preserve a qualificação de 1918 sobre o mundo espiritual."
 ],
 [
  "Connect moral intuition, imagination and technique, then explain historical evolution versus logical deduction. The 1918 addition separates a free motive from the ability to execute it.",
  "Relacione intuição, imaginação e técnica morais; depois explique evolução histórica e dedução lógica. O adendo de 1918 separa motivo livre de capacidade de executá-lo."
 ],
 [
  "Separate the balance of pleasure and pain from satisfaction of a particular aim. Assess the complete Schopenhauer and Hartmann arguments as presented by Steiner, including their qualifications.",
  "Separe o balanço de prazer e dor da satisfação de uma finalidade específica. Examine os argumentos de Schopenhauer e Hartmann apresentados por Steiner, com suas qualificações."
 ],
 [
  "Explain individual understanding and critically examine the historical group generalizations. Include the 1918 note on individual vocational aims.",
  "Explique a compreensão individual e examine criticamente as generalizações históricas sobre grupos. Inclua a nota de 1918 sobre finalidades profissionais individuais."
 ],
 [
  "Read the conclusion, both 1918 additions and the appendix. Explain why the freedom argument depends on thinking, and why the book’s foundation does not deduce the specific contents of later spiritual writings.",
  "Leia a conclusão, os dois adendos de 1918 e o apêndice. Explique por que a liberdade depende do pensar e por que essa base não deduz os conteúdos específicos das obras espirituais posteriores."
 ]
];
for(const lang of ['en','pt']){
 const pt=lang==='pt',base=pt?'docs/pt':'docs',dir=base+'/philosophy-of-freedom',t=(a,b)=>pt?b:a;
 const chapter=l=>l.id===0?t('Orientation','Orientação'):l.id===21?t('Conclusion and synthesis','Conclusão e síntese'):t('Chapter ','Capítulo ')+l.chapter;
 const row=(id,i)=>{const l=lessons.find(l=>l.id===id);return `<div class="lesson-row" data-core-lesson="${id}"><span class="number">${n(i+1)}</span><div><h3><a href="lessons/${n(id)}.html">${esc(l[lang].title)}</a></h3><p>${chapter(l)} · ${esc(l[lang].goal)}</p></div><a href="lessons/${n(id)}.html" aria-label="${t('Open lesson ','Abrir lição ')}${i+1}">${t('Study','Estudar')} →</a></div>`;};
 let h=fs.readFileSync(dir+'/index.html','utf8');
 const index=`<main id="main" data-freedom-core><p class="breadcrumb"><a href="../index.html#courses">← ${t('All courses','Todos os cursos')}</a></p><section class="intro course-intro"><div class="eyebrow">Rudolf Steiner · GA 4 · ${t('16 core lessons','16 lições principais')}</div><h1>${t('The Philosophy of Freedom','A Filosofia da Liberdade')}</h1><p class="lead">${t('One course from understanding the world to acting from an understood ethical idea. Learn the argument through questions, examples and careful reading.','Um curso que vai de compreender o mundo a agir por uma ideia ética compreendida. Estude o argumento por perguntas, exemplos e leitura atenta.')}</p><a class="button" href="lessons/00.html">${t('Start the course','Começar o curso')} →</a><p>${t('Orientation, one lesson for each of the fourteen chapters, and a concluding synthesis. The supplied Wilson edition gives the chapter sequence, both prefaces, 1918 additions and appendix. Lecture guides compare Brian Gray’s explanations with the book; Amrine’s abridgment remains supplementary reading.','Orientação, uma lição para cada um dos quatorze capítulos e síntese conclusiva. A edição fornecida de Wilson dá a sequência dos capítulos, os dois prefácios, os adendos de 1918 e o apêndice. Orientações a partir das palestras comparam as explicações de Brian Gray com o livro; a versão abreviada de Amrine permanece leitura complementar.')}</p></section><section class="guide"><div><h2>${t('Two connected questions','Duas perguntas relacionadas')}</h2><p><strong>${t('Knowing','Conhecer')}:</strong> ${t('What do observation and thinking contribute to understanding?','O que observação e pensar oferecem à compreensão?')}</p><p><strong>${t('Acting','Agir')}:</strong> ${t('How can an ethical idea become my own ground of action?','Como uma ideia ética pode tornar-se meu próprio fundamento de ação?')}</p></div><aside><p>${t('Try first, examine the explanation, return to a passage and revise. You can divide a difficult chapter into several sittings. Full source reading takes additional time.','Tente primeiro, examine a explicação, retome um trecho e revise. Divida um capítulo difícil em várias sessões. A leitura integral da fonte exige tempo adicional.')}</p></aside></section><section id="lessons"><h2>${t('Your main learning path','Seu percurso principal')}</h2>${freedomCore.map(row).join('')}</section><details id="further-practice"><summary>${t('Optional further practice','Prática adicional opcional')}</summary><p>${t('These focused exercises support the main chapters. They are optional; existing links and notes remain available.','Estes exercícios específicos apoiam os capítulos principais. São opcionais; links e anotações existentes permanecem disponíveis.')}</p><ul>${Object.keys(freedomPractice).map(id=>`<li><a href="lessons/${n(id)}.html">${esc(lessons.find(l=>l.id===Number(id))[lang].title)}</a></li>`).join('')}</ul></details><aside class="source-note" id="sources"><h2>${t('About the reading','Sobre a leitura')}</h2><p><strong>${t('Reviewed book','Livro examinado')}:</strong> ${t('Rudolf Steiner, The Philosophy of Freedom (GA 4), translated by Michael Wilson, Rudolf Steiner Press, 2012, eighth English edition. All 166 PDF pages and the matching Markdown have been reviewed. Lesson references identify PDF positions; no printed folios are visible in this capture. Use chapter headings in another edition.','Rudolf Steiner, A Filosofia da Liberdade (GA 4), tradução inglesa de Michael Wilson, Rudolf Steiner Press, 2012, oitava edição inglesa. Todas as 166 páginas PDF e o Markdown correspondente foram examinados. As referências indicam posições no PDF; o arquivo não mostra numeração impressa. Use os títulos dos capítulos em outra edição.')}</p><p><strong>${t('Source voices','Autoria dos textos')}:</strong> ${t('Matthew Barton’s foreword and Wilson’s translation notes are editorial material. Steiner’s two prefaces, fourteen chapters, 1918 additions, conclusion and appendix supply the main argument. Selected quotations retain their own edition credits; Portuguese passages are study translations, and explanations and activities are original course material.','O prefácio de Matthew Barton e as notas de tradução de Wilson são material editorial. Os dois prefácios de Steiner, quatorze capítulos, adendos de 1918, conclusão e apêndice fornecem o argumento principal. Os trechos selecionados conservam os créditos de suas edições; o português é tradução de estudo, e explicações e atividades são material didático original.')}</p><p><strong>${t('Supplementary comparisons','Comparações complementares')}:</strong> ${t('Amrine’s 2022 abridgment remains supplementary reading. Brian Gray’s lecture guides are compared with the complete Wilson book and remain separately attributed. Later Steiner excerpts in the earlier commentary are contextual readings.','A versão abreviada de Amrine de 2022 permanece leitura complementar. As orientações a partir das palestras de Brian Gray são comparadas com o livro completo de Wilson e conservam sua autoria. Trechos posteriores de Steiner nos comentários anteriores são leituras contextuais.')}</p><p><a href="https://rsarchive.org/Books/GA004/English/RSP1964/index.html">${t('Consult the parallel online Wilson edition','Consultar a edição paralela de Wilson online')} →</a></p></aside></main>`;
 h=h.replace(/<main[\s\S]*?<\/main>/,index);fs.writeFileSync(dir+'/index.html',h);
 for(const l of lessons){
  const file=dir+'/lessons/'+n(l.id)+'.html';let page=fs.readFileSync(file,'utf8');const i=freedomCore.indexOf(l.id),core=i>=0;
  const parent=freedomPractice[l.id],previous=core&&i>0?freedomCore[i-1]:null,next=core?freedomCore[i+1]:parent;
  page=page.replace(/<div class="eyebrow">GA 4[\s\S]*?<\/div>/,`<div class="eyebrow">GA 4 · ${core?t('Core lesson ','Lição principal ')+(i+1)+' / 16':t('Optional practice','Prática opcional')} · ${chapter(l)}</div>`);
  const support=core?`<details class="guided-hint"><summary>${t('Reading focus and source comparison','Foco da leitura e comparação das fontes')}</summary><p>${aids[i][pt?1:0]}</p><p>${t('Full reading','Leitura completa')}: ${chapter(l)} · ${t('PDF pages','Páginas PDF')} ${freedomReadingSpans[l.chapter]}. <a href="../index.html#sources">${t('About the book and supplementary sources','Sobre o livro e as fontes complementares')}</a></p>${Object.entries(freedomPractice).filter(([,v])=>v===l.id).map(([id])=>`<p><a href="${n(id)}.html">${t('Optional focused exercise','Exercício específico opcional')}: ${esc(lessons.find(x=>x.id===Number(id))[lang].title)}</a></p>`).join('')}</details>`:`<aside class="source-note"><p>${t('This is an optional exercise. Continue the main course at','Este é um exercício opcional. Continue o curso principal em')} <a href="${n(parent)}.html">${esc(lessons.find(x=>x.id===parent)[lang].title)}</a>.</p><p>${t('Parent chapter reading','Leitura do capítulo principal')}: ${chapter(l)} · ${t('PDF pages','Páginas PDF')} ${freedomReadingSpans[l.chapter]}.</p></aside>`;
  page=page.replace('<section class="practice">',support+'<section class="practice">');
  const nav=`<nav class="lesson-navigation" aria-label="${t('Lesson navigation','Navegação das lições')}">${previous!==null?`<a href="${n(previous)}.html">← ${t('Previous core lesson','Lição principal anterior')}</a>`:`<a href="../index.html#lessons">← ${t('Course path','Percurso do curso')}</a>`}<a href="../index.html#lessons">${t('All 16 core lessons','As 16 lições principais')}</a>${next!==undefined?`<a data-core-next href="${n(next)}.html">${core?t('Next core lesson','Próxima lição principal'):t('Return to the main lesson','Voltar à lição principal')} →</a>`:`<a href="../index.html#sources">${t('Continue reading independently','Continuar a leitura independente')} →</a>`}</nav>`;
  page=page.replace(/<nav class="lesson-navigation"[\s\S]*?<\/nav>/,nav);
  page=page.replaceAll('Lesson 12 of this course, which covers Chapter 9 of the book','Chapter 9 of the book').replaceAll('lição 12 deste curso, que aborda o capítulo 9 do livro','capítulo 9 do livro');
  fs.writeFileSync(file,page);
 }
 const home=base+'/index.html';let homeHtml=fs.readFileSync(home,'utf8');homeHtml=homeHtml.replace(/(<!-- freedom-card:start -->[\s\S]*?<p>)[\s\S]*?(<\/p>[\s\S]*?<!-- freedom-card:end -->)/,`$1${t('Sixteen core lessons on knowing and free action, following the complete Wilson edition, with six optional practices.','Dezesseis lições principais sobre conhecer e agir livremente, seguindo a edição completa de Wilson, com seis práticas opcionais.')}$2`);fs.writeFileSync(home,homeHtml);
}
console.log('Consolidated Philosophy of Freedom: 16 core lessons, 6 optional practices, complete conclusion, both languages.');
