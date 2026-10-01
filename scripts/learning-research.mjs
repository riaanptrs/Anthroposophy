import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const e = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cleanPrivatePaths = value => String(value ?? '')
  .replace(/sediment:\/\/[^\s`<>"')]+/g, '[private attachment]')
  .replace(/(?:\/workspace\/|\/tmp\/|\.sources\/)[^\s`<>"')]+/g, '[private working file]')
  .replace(/\.sources\//g, '[private working files]');
const slug = value => String(value).replace(/`([^`]+)`/g, '$1').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
  .replace(/[*_]/g, '').toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s/g, '-');
const relativeHref = (page, target) => path.posix.relative(path.posix.dirname(page), target) || path.posix.basename(target);
const noteRoute = doc => `research/notes/${doc.id}.html`;

const copy = {
  en: {
    research:'Research and source library', themes:'Themes and applications', home:'Home', learn:'Learn Anthroposophy', books:'Study the books',
    language:'Português', intro:'Read the authored source notes, page ledgers and comparisons behind the courses. These notes document the evidence and its limits; they are separate from the beginner learning path.',
    languageNote:'Research bodies are the original authored English, including any bilingual draft excerpts. The Portuguese index links the same original notes.',
    notes:'Research notes', sources:'Source works and reviewed scope', registered:'Registered private source witnesses',
    search:'Search authored notes', searchPlaceholder:'Title, concept, author or source detail', status:'Record status', current:'Current records', archive:'Historical archive', all:'All records',
    book:'Book or source', allBooks:'All books and sources', topic:'Theme', allTopics:'All themes', kind:'Document kind', allKinds:'All kinds',
    results:'notes in this library', open:'Read the original note', original:'Original English note', originalBody:'Original authored English; any bilingual material is retained as written.',
    record:'Record context', toc:'Contents of this note', related:'Related study', history:'Historical editorial record',
    archiveNotice:'This record is part of the historical archive. Its counts, draft routes and pending tasks describe the date of the note; use the current library and course pages for present coverage.',
    currentNotice:'Current source record. Any explicitly dated historical sections remain historical, as the note explains.',
    sourceIdentity:'Source identity', extent:'Reviewed scope', limits:'Evidence limits', study:'Open the existing study route', researchNote:'Open source research',
    fingerprints:'These filenames and fingerprints identify privately registered source witnesses. They are not downloads. Full uploaded books and transcripts remain private.',
    filename:'Registered filename', bytes:'Bytes', date:'Registered', hash:'SHA-256 fingerprint',
    themesIntro:'Choose a theme to find material already supported by this library. Each entry states its actual scope; bibliographic suggestions are clearly distinguished from reviewed study.',
    available:'Available study', limited:'Limited source coverage', bibliography:'Bibliographic starting point', uncovered:'Not yet covered',
    existing:'Existing study links', researchLinks:'Source notes', bibliographyHeading:'Bibliography only — not reviewed in this library',
    gap:'No reviewed lessons are available for this theme.', next:'A specific source is needed before adding teaching on this theme.',
    footer:'Source claims, later commentary and original course adaptations remain separately attributed.'
  },
  pt: {
    research:'Pesquisa e biblioteca de fontes', themes:'Temas e aplicações', home:'Início', learn:'Aprender Antroposofia', books:'Estudar os livros',
    language:'English', intro:'Leia as notas de fontes, registros de páginas e comparações que sustentam os cursos. Essas notas documentam as evidências e seus limites; constituem uma camada de estudo distinta do percurso inicial.',
    languageNote:'O corpo das notas mantém o inglês original de seus autores, incluindo os trechos bilíngues existentes. Este índice em português abre as mesmas notas originais.',
    notes:'Notas de pesquisa', sources:'Obras e alcance do estudo das fontes', registered:'Testemunhos de fontes privadas registrados',
    search:'Pesquisar nas notas', searchPlaceholder:'Título, conceito, autor ou detalhe da fonte', status:'Situação do registro', current:'Registros atuais', archive:'Arquivo histórico', all:'Todos os registros',
    book:'Livro ou fonte', allBooks:'Todos os livros e fontes', topic:'Tema', allTopics:'Todos os temas', kind:'Tipo de documento', allKinds:'Todos os tipos',
    results:'notas nesta biblioteca', open:'Ler a nota original', original:'Nota original em inglês', originalBody:'Inglês original do autor; os trechos bilíngues permanecem como foram escritos.',
    record:'Contexto do registro', toc:'Conteúdo desta nota', related:'Estudos relacionados', history:'Registro editorial histórico',
    archiveNotice:'Este registro pertence ao arquivo histórico. Suas contagens, rotas propostas e tarefas pendentes descrevem a data da nota; consulte a biblioteca e os cursos atuais para conhecer o alcance presente.',
    currentNotice:'Registro atual de fontes. As seções históricas explicitamente datadas mantêm esse caráter, conforme explicado na nota.',
    sourceIdentity:'Identidade da fonte', extent:'Alcance do estudo', limits:'Limites das evidências', study:'Abrir o percurso de estudo existente', researchNote:'Abrir a pesquisa da fonte',
    fingerprints:'Estes nomes e identificadores registram testemunhos de fontes mantidos em arquivos privados. Não são links de download. Livros e transcrições completos permanecem privados.',
    filename:'Nome do arquivo registrado', bytes:'Bytes', date:'Registro', hash:'Identificador SHA-256',
    themesIntro:'Escolha um tema para encontrar o material já sustentado pela biblioteca. Cada entrada declara seu alcance real; sugestões bibliográficas são diferenciadas dos estudos realizados.',
    available:'Estudo disponível', limited:'Estudo limitado de fontes', bibliography:'Ponto de partida bibliográfico', uncovered:'Ainda sem estudo',
    existing:'Percursos de estudo existentes', researchLinks:'Notas de fontes', bibliographyHeading:'Somente bibliografia — sem estudo nesta biblioteca',
    gap:'Ainda não há lições estudadas disponíveis sobre este tema.', next:'É necessário identificar uma fonte específica antes de acrescentar ensino sobre este tema.',
    footer:'Afirmações das fontes, comentários posteriores e adaptações originais do curso mantêm atribuições distintas.'
  }
};
const kindLabels = {
  'chronological-editorial-index':['Chronological editorial index','Índice editorial cronológico'],
  'cross-source-analysis':['Cross-source analysis','Análise entre fontes'],
  'edition-comparison':['Edition comparison','Comparação de edições'],
  'editorial-plan':['Editorial plan','Plano editorial'],
  'historical-lecture-draft':['Historical lecture draft','Rascunho histórico de palestra'],
  'implementation-record':['Implementation record','Registro de implementação'],
  'lecture-analysis':['Lecture analysis','Análise de palestra'],
  'page-ledger':['Page-by-page notes','Notas página por página'],
  'source-and-course-review':['Source and course review','Revisão da fonte e do curso'],
  'source-audit':['Source audit','Auditoria da fonte'],
  'visual-provenance':['Illustration provenance','Procedência da ilustração']
};
const kindLabel = (kind, lang) => kindLabels[kind]?.[lang === 'pt' ? 1 : 0] || kind;

function shell({page, lang='en', title, content, counterpart}) {
  const t=copy[lang], prefix=lang==='pt'?'pt/':'', opposite=counterpart || (lang==='pt'?page.replace(/^pt\//,''):`pt/${page}`);
  const link=(target,label) => `<a href="${e(relativeHref(page,target))}">${e(label)}</a>`;
  return `<!doctype html>\n<html lang="${lang==='pt'?'pt-BR':'en'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(title)}</title><link rel="alternate" hreflang="${lang==='pt'?'en':'pt-BR'}" href="${e(relativeHref(page,opposite))}"><link rel="stylesheet" href="${e(relativeHref(page,'learning-system.css'))}"><style>
    .research-shell{max-width:76rem;margin:auto;padding:1.2rem}.research-shell nav{display:flex;flex-wrap:wrap;gap:1rem}.research-shell main{margin-top:2rem}.research-shell p,.research-shell li{line-height:1.65}.research-shell .research-intro{max-width:52rem}.research-shell .research-filters{display:flex;flex-wrap:wrap;gap:1rem;padding:1rem 0}.research-shell label{display:grid;gap:.35rem}.research-shell input,.research-shell select{font:inherit;padding:.5rem}.research-shell .research-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,21rem),1fr));gap:1rem}.research-shell article.research-card{padding:1rem;border:1px solid #8e9c91;border-radius:.4rem}.research-shell .research-meta{font-size:.92rem}.research-shell .research-note{max-width:64rem}.research-shell .research-note p{max-width:54rem}.research-shell .table-scroll{overflow:auto}.research-shell table{border-collapse:collapse;width:100%;margin:1rem 0}.research-shell th,.research-shell td{padding:.55rem;border:1px solid #aab3ac;text-align:left;vertical-align:top;min-width:7rem}.research-shell code{overflow-wrap:anywhere}.research-shell pre{overflow:auto;padding:1rem;background:#eef2ed}.research-shell blockquote{border-left:3px solid #687d6d;margin-left:0;padding-left:1rem}.research-shell .research-notice{padding:1rem;border-left:4px solid #687d6d;background:#f2f4ef}.research-shell [hidden]{display:none!important}.research-shell details{margin:1rem 0}footer.research-shell{margin-top:3rem;border-top:1px solid #aab3ac;padding-top:1rem}.research-shell .research-illustration{max-width:100%;height:auto}.research-shell .fingerprint{font-size:.82rem;word-break:break-all}
  </style><script defer src="${e(relativeHref(page,'learning-system.js'))}"></script></head><body data-learning-owned="true"><a class="skip" href="#main">${lang==='pt'?'Pular para o conteúdo':'Skip to content'}</a><header class="research-shell"><a class="brand" href="${e(relativeHref(page,`${prefix}index.html`))}">${lang==='pt'?'Antroposofia':'Anthroposophy'}</a><nav aria-label="${lang==='pt'?'Idioma':'Language'}">${link(opposite,t.language)}</nav></header><main id="main" class="research-shell">${content}</main><footer class="research-shell"><p>${e(t.footer)}</p></footer></body></html>\n`;
}

function resolveLink(raw, context) {
  const url=String(raw).trim().replace(/^<|>$/g,'');
  if (/^(?:https?:|mailto:)/i.test(url)) return url;
  if (/^(?:javascript:|data:|file:|sediment:|\/workspace\/|\/tmp\/)/i.test(url) || /(?:^|\/)\.sources(?:\/|$)/.test(url)) return null;
  if (url.startsWith('#')) return url;
  const [target,fragment]=url.split('#'), abs=path.resolve(path.dirname(context.sourceFile),target);
  const md=context.documentsByPath.get(abs);
  if (md) return relativeHref(context.page,noteRoute(md))+(fragment?`#${fragment}`:'');
  if (path.basename(abs)==='source-register.json') return relativeHref(context.page,'research/index.html')+'#registered-sources';
  const docsRoot=path.join(root,'docs');
  if (abs.startsWith(docsRoot+path.sep)) return relativeHref(context.page,path.relative(docsRoot,abs).split(path.sep).join('/'))+(fragment?`#${fragment}`:'');
  if (abs===path.join(root,'content/illustrations/self-world-clear-v1.png')) return relativeHref(context.page,'research/illustrations/self-world-clear-v1.png');
  return null;
}

function inline(input,context) {
  const text=cleanPrivatePaths(input); let out='', i=0;
  while (i<text.length) {
    const tail=text.slice(i); let m;
    if ((m=tail.match(/^(`+)([\s\S]*?)\1/))) {out+=`<code>${e(m[2])}</code>`;i+=m[0].length;continue;}
    if ((m=tail.match(/^(!?)\[([^\]]+)\]\(([^\n]*?)\)/))) {
      const raw=m[3].replace(/\s+["'][^"']*["']\s*$/,''), href=resolveLink(raw,context), label=inline(m[2],context);
      if (href && m[1]) out+=`<img class="research-illustration" src="${e(href)}" alt="${e(m[2])}" loading="lazy">`;
      else if (href) out+=`<a href="${e(href)}">${label}</a>`;
      else out+=label;
      i+=m[0].length;continue;
    }
    if ((m=tail.match(/^https?:\/\/[^\s<>`]+/))) {
      const url=m[0].replace(/[.,;:!?]+$/,'');out+=`<a href="${e(url)}">${e(url)}</a>`;i+=url.length;continue;
    }
    if ((m=tail.match(/^(\*\*|__)([^\n]+?)\1/))) {out+=`<strong>${inline(m[2],context)}</strong>`;i+=m[0].length;continue;}
    if ((m=tail.match(/^(\*|_)([^\n]+?)\1/))) {out+=`<em>${inline(m[2],context)}</em>`;i+=m[0].length;continue;}
    if ((m=tail.match(/^\\([\\`*_{}\[\]()#+\-.!|])/))) {out+=e(m[1]);i+=m[0].length;continue;}
    out+=e(text[i]);i++;
  }
  return out;
}

const cells = line => line.trim().replace(/^\||\|$/g,'').split(/(?<!\\)\|/).map(s=>s.trim());
const tableSeparator = line => /^\s*\|?\s*:?-{3,}:?\s*(?:\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
const listItem = line => line.match(/^(\s*)([-*+]|\d+[.)])\s+(.*)$/);
const isBlockStart = line => /^\s*$|^#{1,6}\s|^```|^~~~|^>\s?|^\s*(?:[-*+] |\d+[.)] )|^\s*(?:---+|\*\*\*+|___+)\s*$/.test(line);

function renderMarkdown(markdown,context) {
  const lines=cleanPrivatePaths(markdown).replace(/\r\n?/g,'\n').split('\n'), headingCounts=new Map(), headings=[];
  let i=0; const blocks=[];
  function heading(text,level) {
    const base=slug(text)||'section', n=headingCounts.get(base)||0, id=n?`${base}-${n}`:base;headingCounts.set(base,n+1);
    headings.push({id,text:text.replace(/[*_`]/g,''),level});
    return `<h${Math.min(6,level+1)} id="${e(id)}">${inline(text,context)}</h${Math.min(6,level+1)}>`;
  }
  while(i<lines.length) {
    let line=lines[i], m;
    if (!line.trim()) {i++;continue;}
    if ((m=line.match(/^(#{1,6})\s+(.+?)\s*#*$/))) {blocks.push(heading(m[2],m[1].length));i++;continue;}
    if (i+1<lines.length && /^\s*(?:={3,}|-{3,})\s*$/.test(lines[i+1]) && !isBlockStart(line)) {blocks.push(heading(line.trim(),lines[i+1].trim()[0]==='='?1:2));i+=2;continue;}
    if ((m=line.match(/^\s*(```+|~~~+)\s*(\S*)/))) {
      const fence=m[1], language=m[2];i++;const code=[];
      while(i<lines.length && !lines[i].trim().startsWith(fence)) code.push(lines[i++]);
      if(i<lines.length)i++; blocks.push(`<pre><code${language?` class="language-${e(language)}"`:''}>${e(code.join('\n'))}</code></pre>`);continue;
    }
    if (/^\s*(?:---+|\*\*\*+|___+)\s*$/.test(line)) {blocks.push('<hr>');i++;continue;}
    if (i+1<lines.length && line.includes('|') && tableSeparator(lines[i+1])) {
      const head=cells(line), align=cells(lines[i+1]).map(s=>s.startsWith(':')&&s.endsWith(':')?'center':s.endsWith(':')?'right':'left');i+=2;const rows=[];
      while(i<lines.length && lines[i].trim() && lines[i].includes('|')) rows.push(cells(lines[i++]));
      const cell=(s,j,tag)=>`<${tag}${tag==='th'?' scope="col"':''} style="text-align:${align[j]||'left'}">${inline(s,context)}</${tag}>`;
      blocks.push(`<div class="table-scroll"><table><thead><tr>${head.map((s,j)=>cell(s,j,'th')).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${head.map((_,j)=>cell(row[j]||'',j,'td')).join('')}</tr>`).join('')}</tbody></table></div>`);continue;
    }
    if (/^>\s?/.test(line)) {
      const quote=[];while(i<lines.length && /^>\s?/.test(lines[i])) quote.push(lines[i++].replace(/^>\s?/,''));
      blocks.push(`<blockquote>${renderMarkdown(quote.join('\n'),context).html}</blockquote>`);continue;
    }
    if (listItem(line)) {
      const first=listItem(line), ordered=/^\d/.test(first[2]), tag=ordered?'ol':'ul', start=ordered?parseInt(first[2],10):1, items=[];
      while(i<lines.length) {
        const entry=listItem(lines[i]); if(!entry || /^\d/.test(entry[2])!==ordered) break;
        const parts=[entry[3]];i++;
        while(i<lines.length && lines[i].trim() && !isBlockStart(lines[i]) && !(i+1<lines.length&&tableSeparator(lines[i+1]))) parts.push(lines[i++].trim());
        items.push(`<li>${inline(parts.join(' '),context)}</li>`);
        if (!lines[i]?.trim() && listItem(lines[i+1]||'') && /^\d/.test(listItem(lines[i+1])[2])===ordered)i++;
      }
      blocks.push(`<${tag}${ordered&&start!==1?` start="${start}"`:''}>${items.join('')}</${tag}>`);continue;
    }
    const paragraph=[line];i++;
    while(i<lines.length && !isBlockStart(lines[i]) && !(i+1<lines.length&&tableSeparator(lines[i+1]))) paragraph.push(lines[i++]);
    blocks.push(`<p>${inline(paragraph.join('\n'),context).replace(/ {2}\n/g,'<br>\n').replace(/\n/g,' ')}</p>`);
  }
  return {html:blocks.join('\n'),headings};
}

function select(label,dimension,options) {
  return `<label>${e(label)}<select data-research-filter="${e(dimension)}">${options.map(([value,title])=>`<option value="${e(value)}">${e(title)}</option>`).join('')}</select></label>`;
}

function researchIndex(map,documentsText,lang) {
  const t=copy[lang], page=`${lang==='pt'?'pt/':''}research/index.html`, locale=lang==='pt'?'pt-BR':'en';
  const sourceLabels=new Map(map.sourceWorks.map(s=>[s.id,s.title]));
  const books=[...new Set(map.documents.map(d=>d.book).filter(Boolean))].sort((a,b)=>a.localeCompare(b,locale));
  const kinds=[...new Set(map.documents.map(d=>d.kind))].sort();
  const themes=map.researchTopics.map(theme=>[theme.id,theme.title[lang]]).sort((a,b)=>a[1].localeCompare(b[1],locale));
  const filters=`<div class="research-filters"><label>${e(t.search)}<input type="search" data-research-search placeholder="${e(t.searchPlaceholder)}"></label>${select(t.status,'status',[['current',t.current],['all',t.all],['archive',t.archive]])}${select(t.book,'book',[['all',t.allBooks],...books.map(id=>[id,sourceLabels.get(id)||id])])}${select(t.topic,'topic',[['all',t.allTopics],...themes])}${select(t.kind,'kind',[['all',t.allKinds],...kinds.map(kind=>[kind,kindLabel(kind,lang)])])}</div>`;
  const cards=map.documents.map(doc=>{
    const status=doc.publicationStatus, original=documentsText.get(doc.id), metadata=[doc.title,doc.summary,...doc.headings,doc.book,doc.kind,...doc.topics,original].join(' ');
    return `<article class="research-card" data-research-item data-status="${e(status)}" data-book="${e(doc.book||'')}" data-topic="${e(doc.topics.join(' '))}" data-kind="${e(doc.kind)}" data-language="en" data-search="${e(cleanPrivatePaths(metadata).replace(/\s+/g,' '))}"><h3><a href="${e(relativeHref(page,noteRoute(doc)))}">${e(doc.title)}</a></h3><p class="research-meta">${e(status==='archive'?t.archive:t.current)} · ${e(kindLabel(doc.kind,lang))} · ${e(t.original)}${doc.recordedDates.length?` · ${e(doc.recordedDates.join('; '))}`:''}</p><p lang="en">${inline(doc.summary,{page,sourceFile:path.join(root,doc.sourcePath),documentsByPath:new Map(map.documents.map(d=>[path.join(root,d.sourcePath),d]))})}</p><p>${e(t.open)} → <a href="${e(relativeHref(page,noteRoute(doc)))}">${e(t.original)}</a></p></article>`;
  }).join('\n');
  const workCards=map.sourceWorks.map(source=>`<article class="research-card" id="source-${e(source.id)}"><h3>${e(source.title)}</h3><p class="research-meta">${e(source.author)}${source.ga?` · GA ${e(Array.isArray(source.ga)?source.ga.join(', '):source.ga)}`:''}</p><p lang="en">${e(source.edition)}</p><p><strong>${e(t.extent)}:</strong> <span lang="en">${e(source.reviewedSourceExtent)}</span></p><details><summary>${e(t.limits)}</summary><ul lang="en">${source.limitations.map(s=>`<li>${e(s)}</li>`).join('')}</ul></details><p><a href="${e(relativeHref(page,(lang==='pt'?'pt/':'')+source.courseEntry))}">${e(t.study)}</a> · <a href="${e(relativeHref(page,noteRoute(map.documents.find(d=>d.sourcePath===source.researchEntry))))}">${e(t.researchNote)}</a></p></article>`).join('');
  const registered=`<details id="registered-sources"><summary>${e(t.registered)} (${map.registeredSourceEvidence.length})</summary><p>${e(t.fingerprints)}</p><div class="table-scroll"><table><thead><tr>${[t.filename,t.date,t.bytes,t.hash].map(title=>`<th scope="col">${e(title)}</th>`).join('')}</tr></thead><tbody>${map.registeredSourceEvidence.map(source=>`<tr><td>${e(source.filename)}</td><td>${e(source.registered)}</td><td>${e(source.bytes)}</td><td class="fingerprint">${e(source.sha256)}</td></tr>`).join('')}</tbody></table></div></details>`;
  return shell({page,lang,title:t.research,content:`<h1>${e(t.research)}</h1><div class="research-intro"><p>${e(t.intro)}</p><p>${e(t.languageNote)}</p></div><section aria-labelledby="research-notes"><h2 id="research-notes">${e(t.notes)}</h2>${filters}<p aria-live="polite"><span data-research-count>${map.documents.length}</span> / ${map.documents.length} ${e(t.results)}</p><div class="research-grid">${cards}</div><noscript><p>${e(lang==='pt'?'A pesquisa e os filtros exigem JavaScript. Todos os registros, incluindo o arquivo histórico identificado, estão acessíveis acima.':'Search and filters require JavaScript. All records, including the labelled historical archive, are accessible above.')}</p></noscript></section><section aria-labelledby="source-works"><h2 id="source-works">${e(t.sources)}</h2><p>${e(lang==='pt'?'As descrições de edições e limites abaixo são os registros originais em inglês.':'Edition details and evidence limits below retain the authored source record.')}</p><div class="research-grid">${workCards}</div>${registered}</section>`});
}

function themesIndex(map,lang) {
  const t=copy[lang], page=`${lang==='pt'?'pt/':''}themes/index.html`, documentsByPath=new Map(map.documents.map(d=>[d.sourcePath,d]));
  const statusLabel=status=>({available:t.available,limited:t.limited,'bibliography-only':t.bibliography,'not-covered':t.uncovered}[status]);
  const cards=map.themes.map(theme=>{
    const links=theme.links.map(link=>`<li><a href="${e(relativeHref(page,lang==='pt'?link.ptPath:link.path))}">${e(lang==='pt'?link.labelPt:link.label)}</a></li>`).join('');
    const research=theme.research.map(source=>documentsByPath.get(source)).filter(Boolean).map(doc=>`<li><a href="${e(relativeHref(page,noteRoute(doc)))}">${e(doc.title)}</a> <span class="research-meta">(${e(t.original)})</span></li>`).join('');
    const bibliography=(theme.bibliographyOnly||[]).map(book=>`<li><cite>${e(book.title)}</cite> — ${e(book.author)}${book.ga?`, GA ${e(book.ga)}`:''}${book.year?`, ${e(book.year)}`:''}. ${e(lang==='pt'?'Referência bibliográfica em inglês; esta obra não foi estudada na biblioteca.':'Bibliographic reference; this work has not been reviewed in the library.')}${book.description?` <span lang="en">${e(book.description)}</span>`:''}</li>`).join('');
    return `<article class="research-card" id="${e(theme.id)}"><h2>${e(theme.title[lang])}</h2><p class="research-meta">${e(statusLabel(theme.status))}</p><p>${e(lang==='pt'?theme.scopePt:theme.scope)}</p>${links?`<h3>${e(t.existing)}</h3><ul>${links}</ul>`:`<p>${e(t.gap)}</p>`}${research?`<details><summary>${e(t.researchLinks)}</summary><ul>${research}</ul></details>`:''}${bibliography?`<h3>${e(t.bibliographyHeading)}</h3><ul>${bibliography}</ul>`:''}${theme.status==='not-covered'?`<p>${e(t.next)}</p>`:''}</article>`;
  }).join('\n');
  return shell({page,lang,title:t.themes,content:`<h1>${e(t.themes)}</h1><p class="research-intro">${e(t.themesIntro)}</p><nav aria-label="${lang==='pt'?'Temas':'Themes'}"><ul>${map.themes.map(theme=>`<li><a href="#${e(theme.id)}">${e(theme.title[lang])}</a></li>`).join('')}</ul></nav><div class="research-grid">${cards}</div>`});
}

export async function buildResearch({docsDir=path.join(root,'docs')}={}) {
  const map=JSON.parse(await fs.readFile(path.join(root,'content/learning-system-research-map.json'),'utf8'));
  const documentsByPath=new Map(map.documents.map(doc=>[path.join(root,doc.sourcePath),doc]));
  const documentsText=new Map(await Promise.all(map.documents.map(async doc=>{
    if (!doc.publicNoteContent || doc.fullUploadedSource || !doc.sourcePath.startsWith('content/') || !doc.sourcePath.endsWith('.md')) throw new Error(`Research publication contract rejected ${doc.id}`);
    return [doc.id,await fs.readFile(path.join(root,doc.sourcePath),'utf8')];
  })));
  const write=async (page,html)=>{const dest=path.join(docsDir,page);await fs.mkdir(path.dirname(dest),{recursive:true});await fs.writeFile(dest,html);};
  for (const doc of map.documents) {
    const page=noteRoute(doc), context={page,sourceFile:path.join(root,doc.sourcePath),documentsByPath};
    const rendered=renderMarkdown(documentsText.get(doc.id),context), current=doc.publicationStatus==='current';
    const toc=doc.wordCount>=1800?`<details><summary>Contents of this note / Conteúdo desta nota</summary><ul>${rendered.headings.filter(h=>h.level<=3).map(h=>`<li><a href="#${e(h.id)}">${e(h.text)}</a></li>`).join('')}</ul></details>`:'';
    const contextBox=`<aside class="research-notice" aria-label="Record context"><p><strong>${e(current?copy.en.current:copy.en.archive)} / ${e(current?copy.pt.current:copy.pt.archive)}</strong></p><p>${e(current?copy.en.currentNotice:copy.en.archiveNotice)}</p><p lang="pt-BR">${e(current?copy.pt.currentNotice:copy.pt.archiveNotice)}</p><p>${e(doc.statusExplanation)}</p><p class="research-meta">${e(kindLabel(doc.kind,'en'))} · ${e(doc.language)}${doc.recordedDates.length?` · ${e(doc.recordedDates.join('; '))}`:''} · ${e(doc.wordCount)} words</p></aside>`;
    const illustration=doc.id==='illustration-self-world-clear-v1'?`<figure><img class="research-illustration" src="../illustrations/self-world-clear-v1.png" alt="Original course adaptation: overlapping self and world ovals, with outward arrows toward separate ovals." loading="lazy"><figcaption>Original simplified course adaptation of a supplied board drawing; not an exact facsimile or proof of two independent realities. / Adaptação simplificada original do curso; não é um fac-símile nem uma prova de duas realidades independentes.</figcaption></figure>`:'';
    await write(page,shell({page,title:doc.title,counterpart:'pt/research/index.html',content:`<article class="research-note"><h1>${e(doc.title)}</h1><p>${e(copy.en.originalBody)}</p><p lang="pt-BR">${e(copy.pt.originalBody)}</p>${contextBox}${toc}${illustration}<div lang="en" data-research-note-body>${rendered.html}</div></article>`}));
  }
  const imageDir=path.join(docsDir,'research/illustrations');await fs.mkdir(imageDir,{recursive:true});
  await fs.copyFile(path.join(root,'content/illustrations/self-world-clear-v1.png'),path.join(imageDir,'self-world-clear-v1.png'));
  for(const lang of ['en','pt']) {
    await write(`${lang==='pt'?'pt/':''}research/index.html`,researchIndex(map,documentsText,lang));
    await write(`${lang==='pt'?'pt/':''}themes/index.html`,themesIndex(map,lang));
  }
  return {notes:map.documents.length,indexPages:4,themes:map.themes.length,themeLinks:map.themes.reduce((n,t)=>n+t.links.length,0),registeredWitnesses:map.registeredSourceEvidence.length};
}

if (process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const result=await buildResearch({docsDir:process.argv[2]?path.resolve(process.argv[2]):undefined});
  console.log(JSON.stringify(result));
}
