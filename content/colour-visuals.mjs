const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function colourVisual(id,lang){
 const pt=lang==='pt';
 const table=(id,heading,caption,headers,rows)=>`<section class="colour-study" id="${id}"><h2 id="${id}-title">${esc(heading)}</h2><div class="colour-table-scroll" role="region" aria-labelledby="${id}-title" tabindex="0"><table><caption>${esc(caption)}</caption><thead><tr>${headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((v,i)=>i===0?`<th scope="row">${esc(v)}</th>`:`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></section>`;
 if(id===1)return table('image-colour-relations',pt?'Como se forma a relação de imagem':'How the image relation is formed',pt?'Classificação de Steiner nas capturas 22–24. As colunas de sombra e iluminação retomam a tabela da palestra 2, captura 24; a última coluna explica a fórmula da palestra 1.':'Steiner’s classification in captures 22–24. Shadow and illumination columns follow Lecture 2’s table at capture 24; the final column explains Lecture 1’s formula.',pt?['Cor-imagem','O que projeta a sombra','O que ilumina','Relação descrita']:['Image colour','Shadow-thrower','Illuminant','Relation described'],pt?[
 ['Preto','Espírito','O sem vida','Imagem espiritual do que não tem vida'],
 ['Verde','O sem vida','O vivo','Imagem sem vida do vivo'],
 ['Flor de pessegueiro','O vivo','Alma','Imagem viva da alma'],
 ['Branco / luz','Alma','Espírito','Imagem anímica do espírito']
 ]:[
 ['Black','Spirit','Lifeless','Spiritual image of the lifeless'],
 ['Green','Lifeless','Living','Lifeless image of the living'],
 ['Peach-blossom','Living','Soul','Living image of the soul'],
 ['White / light','Soul','Spirit','Soul’s image of spirit']
 ]);
 if(id===3)return table('matter-colour-relations',pt?'Imagem e brilho no processo de pintura':'Image and lustre in the painting process',pt?'As duas primeiras colunas retomam a tabela da captura 42. As descrições do processo são sínteses originais das capturas 37–42.':'The first two columns follow the source table at capture 42. Process descriptions are original summaries of captures 37–42.',pt?['Tema na descrição de Steiner','Modo na fonte','Processo descrito']:['Subject in Steiner’s account','Mode in the source','Process described'],pt?[
 ['Mineral / sem vida','Brilho','Evocar uma irradiação interior por trás da superfície.'],
 ['Planta / viva','Brilho-imagem','Pintar a imagem mais escura e depois velá-la com uma luminosidade branco-amarelada.'],
 ['Animal / dotado de alma','Imagem-brilho','Pintar mais levemente e introduzir um brilho azulado claro, em transição para a vegetação ao redor.'],
 ['Ser humano / espiritual','Imagem','Transformar a tendência de brilho em imagem, preservando a transparência do meio.']
 ]:[
 ['Mineral / lifeless','Lustre','Evoke an inner radiance behind the surface.'],
 ['Plant / living','Lustre-image','Paint the image darker, then veil it with yellowish-white light.'],
 ['Animal / ensouled','Image-lustre','Paint more lightly and introduce a pale bluish shimmer, with transition to the surrounding vegetation.'],
 ['Human / spiritual','Image','Transform the usual lustre tendency into image, while preserving the medium’s transparency.']
 ]);
 if(id===8)return `<aside class="source-note"><h2>${pt?'Contexto científico complementar':'Supplementary scientific context'}</h2><p><a href="https://spaceplace.nasa.gov/blue-sky/en/">NASA: ${pt?'por que o céu é azul':'why the sky is blue'}</a> · <a href="https://www.nei.nih.gov/eye-health-information/healthy-vision/how-eyes-work">National Eye Institute: ${pt?'como os olhos funcionam':'how the eyes work'}</a></p></aside>`;
 if(id===12)return table('hierarchy-colour-relations',pt?'Hierarquias, manifestações e elementos':'Hierarchies, manifestations and elements',pt?'Tabela explicativa original do relato de Steiner, capturas 137–143. Os desenhos do livro são esquemas monocromáticos; as relações e cores são indicadas pelo texto e pelas legendas.':'Original explanatory table of Steiner’s account, captures 137–143. The book’s drawings are monochrome schemes; the text and labels supply the relations and colours.',pt?['Hierarquia','Manifestação','Relação com o elemento','Etapa']:['Hierarchy','Manifestation','Relation to the element','Stage'],pt?[
 ['Primeira: Serafins, Querubins, Tronos','Calor','O calor expressa sua cooperação; o esquema situa os Tronos no centro, os Querubins ao redor e os Serafins externamente.','Antigo Saturno · 137–138'],
 ['Segunda: Kyriotetes, Dynamis, Exusiai','Luz','O ar é descrito como sombra da luz; raios brancos e traços verdes distinguem os dois no esquema.','Antigo Sol · 139–140'],
 ['Terceira: Archai, Arcanjos, Anjos','Cor, pela mediação entre luz e escuridão','A água é apresentada como reflexo ou criação da cor cósmica.','Antiga Lua · 140–142'],
 ['Quarta: humanidade original, antes da Queda','Vida no entrelaçamento das cores','A vida forma contornos e faz surgir o cristal sólido.','Terra · 142–143']
 ]:[
 ['First: Seraphim, Cherubim, Thrones','Warmth','Warmth expresses their cooperation; the scheme places Thrones at the centre, Cherubim around them and Seraphim outside.','Old Saturn · 137–138'],
 ['Second: Kyriotetes, Dynamis, Exusiai','Light','Air is described as the shadow of light; white rays and green marks distinguish the two in the scheme.','Old Sun · 139–140'],
 ['Third: Archai, Archangels, Angels','Colour through mediation of light and darkness','Water is presented as cosmic colour’s reflection or creation.','Old Moon · 140–142'],
 ['Fourth: original humanity before the Fall','Life within the interplay of colour','Life forms contours and brings solid crystal into being.','Earth · 142–143']
 ]);
 let explanation='';
 if(id===11)explanation=table('colour-and-measure',pt?'Três comparações na palestra':'Three comparisons in the lecture',pt?'Tabela explicativa original das capturas 124–126. A comparação de cinco vezes é um exemplo na descrição espiritual de Steiner; não é uma proporção medida nem uma receita de mistura de cores. O estudo de posição abaixo é uma aplicação artística original.':'Original explanatory table from captures 124–126. The five-times comparison is an example in Steiner’s spiritual account, rather than a measured ratio or a colour-mixing recipe. The position study below is an original artistic application.',pt?['Termo','Comparação física descrita','Comparação espiritual de Steiner']:['Term','Physical comparison described','Steiner’s spiritual comparison'],pt?[
 ['Peso','Corpos sólidos tendem ao centro da Terra.','Qualidades sensíveis livres tendem para fora, em direção ao espaço cósmico.'],
 ['Medida','Uma régua fornece uma quantidade externa.','Uma pequena nuvem avermelhada compara-se a uma formação amarela maior pela expansão possível; o exemplo diz “cinco vezes”.'],
 ['Número','Partes contadas podem ser consideradas indiferentes umas às outras.','Um ser de certa natureza pede uma companhia relacionada; o texto dá “três ou cinco” como exemplos.']
 ]:[
 ['Weight','Solid bodies tend toward the Earth’s centre.','Free sense qualities tend outward into world spaces.'],
 ['Measure','A measuring stick supplies an external quantity.','A small reddish cloud compares itself with a larger yellow formation through possible expansion; the example says “five times”.'],
 ['Number','Counted parts can be treated as indifferent to one another.','A being of a particular kind calls for a related company of others; the text gives “three or five” as examples.']
 ]);
 let studies=[];
 if(id===2)studies=pt?[['yellow','Amarelo: centro forte → borda clara'],['blue','Azul: borda forte → centro claro'],['red','Vermelho: distribuição uniforme']]:[['yellow','Yellow: strong centre → pale edge'],['blue','Blue: strong edge → pale centre'],['red','Red: even distribution']];
 if(id===4||id===9)studies=pt?[['pair-a','A: vermelho à esquerda, azul à direita'],['pair-b','B: azul à esquerda, vermelho à direita']]:[['pair-a','A: red on the left, blue on the right'],['pair-b','B: blue on the left, red on the right']];
 if(id===11)studies=pt?[['weight-a','A: pequena área escura junto à borda'],['weight-b','B: a mesma área escura junto ao centro']]:[['weight-a','A: small dark area near the edge'],['weight-b','B: the same dark area near the centre']];
 if(!studies.length)return explanation;
 return explanation+`<section class="colour-study"><h2>${pt?'Compare as disposições':'Compare the arrangements'}</h2><div class="colour-studies">${studies.map(([cls,caption])=>`<figure><div class="colour-swatch ${cls}" role="img" aria-label="${esc(caption)}"><i aria-hidden="true"></i><b aria-hidden="true"></b></div><figcaption>${esc(caption)}</figcaption></figure>`).join('')}</div><p>${pt?'Estudos digitais originais, não reproduções dos desenhos do livro. As legendas descrevem a disposição; você pode realizar a atividade pela descrição. Telas, materiais e percepção individual alteram a aparência. Registre também diferenças em relação à experiência proposta.':'Original digital studies, not reproductions of the book’s drawings. Captions describe each arrangement; you can use the descriptions for the activity. Screens, materials and individual perception affect appearance. Record differences from the proposed experience too.'}</p></section>`;
}
