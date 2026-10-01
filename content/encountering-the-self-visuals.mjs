const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const maps={
  "0": {
    "en": {
      "title": "Three layers of reading",
      "heads": [
        "Layer",
        "Question"
      ],
      "rows": [
        [
          "Scene",
          "What was described?"
        ],
        [
          "Interpretation",
          "What meaning does Koepke propose?"
        ],
        [
          "Response",
          "What might we ask or try?"
        ]
      ],
      "caption": "Original course reading aid. Separate the constructed scene, its attributed interpretation and a response that can be reviewed."
    },
    "pt": {
      "title": "Três camadas da leitura",
      "heads": [
        "Camada",
        "Pergunta"
      ],
      "rows": [
        [
          "Cena",
          "O que foi descrito?"
        ],
        [
          "Interpretação",
          "Que significado Koepke propõe?"
        ],
        [
          "Resposta",
          "O que podemos perguntar ou experimentar?"
        ]
      ],
      "caption": "Recurso de leitura original do curso. Separe a cena construída, sua interpretação atribuída e uma resposta que possa ser examinada."
    }
  },
  "5": {
    "en": {
      "title": "Three phases within a cooperating whole",
      "heads": [
        "Phase in Koepke’s account",
        "Emphasis / named maturity",
        "Cooperating systems"
      ],
      "rows": [
        [
          "7 → 9⅓ · imitation",
          "Head · teeth-maturity",
          "Rhythmic and metabolic-limb organization support the head"
        ],
        [
          "9⅓ → 11⅔ · factual age",
          "Heart and lungs · breath-maturity",
          "Head and metabolic-limb organization support rhythm"
        ],
        [
          "11⅔ → 14 · adolescent years",
          "Metabolism and limbs · earth-maturity",
          "Head and rhythmic organization support metabolism and limbs"
        ]
      ],
      "caption": "Original teaching table based on Koepke’s prose and Diagram 1, PDF captures 45–46. The fractional ages reproduce the figure’s labels; the prose also describes transitions around nine and twelve. Arrows mean cooperation, shading means emphasis. This reading map does not assess a learner’s readiness."
    },
    "pt": {
      "title": "Três fases num conjunto em cooperação",
      "heads": [
        "Fase na explicação de Koepke",
        "Ênfase / maturidade nomeada",
        "Sistemas cooperantes"
      ],
      "rows": [
        [
          "7 → 9⅓ · imitação",
          "Cabeça · maturidade dentária",
          "Organizações rítmica e metabólico-motora apoiam a cabeça"
        ],
        [
          "9⅓ → 11⅔ · idade dos fatos",
          "Coração e pulmões · maturidade respiratória",
          "Cabeça e organização metabólico-motora apoiam o ritmo"
        ],
        [
          "11⅔ → 14 · adolescência",
          "Metabolismo e membros · maturidade terrena",
          "Cabeça e organização rítmica apoiam metabolismo e membros"
        ]
      ],
      "caption": "Tabela didática original baseada na prosa de Koepke e no Diagrama 1, capturas 45–46 do PDF. As frações reproduzem os números da figura; a prosa também descreve transições por volta dos nove e doze. As setas indicam cooperação; o sombreado, ênfase. Este mapa de leitura não avalia a prontidão de um estudante."
    }
  },
  "6": {
    "en": {
      "title": "Map of the author’s comparison",
      "heads": [
        "Focus",
        "Emphasis at seven",
        "Emphasis at twelve"
      ],
      "rows": [
        [
          "Limbs",
          "Discover through action",
          "Act from an imagined form"
        ],
        [
          "Head",
          "Listen imaginatively",
          "Observe, recall, interpret"
        ],
        [
          "Feeling",
          "Impressions from surroundings",
          "Experience inwardness"
        ]
      ],
      "caption": "Original teaching summary of Koepke’s comparisons, captures 47–52, including the table on 52, middle column. The source also names head/trunk/limb spiritual states asleep/dreaming/awake. Both ages form themselves and their materials (48); the contrasts concern emphasis, not exclusive capacities."
    },
    "pt": {
      "title": "Mapa da comparação do autor",
      "heads": [
        "Foco",
        "Ênfase aos sete",
        "Ênfase aos doze"
      ],
      "rows": [
        [
          "Membros",
          "Descobrir pela ação",
          "Agir a partir de uma imagem"
        ],
        [
          "Cabeça",
          "Escutar imaginativamente",
          "Observar, recordar, interpretar"
        ],
        [
          "Sentir",
          "Impressões do ambiente",
          "Experiência de interioridade"
        ]
      ],
      "caption": "Resumo didático original das comparações de Koepke, capturas 47–52, incluindo a tabela de 52, coluna central. A fonte também nomeia estados espirituais de cabeça/tronco/membros como adormecidos/sonhando/despertos. Ambas as idades formam a si mesmas e os materiais (48); os contrastes tratam de ênfase, não de capacidades exclusivas."
    }
  },
  "7": {
    "en": {
      "title": "The crossings in the house metaphor",
      "heads": [
        "Relationship",
        "Younger emphasis",
        "Older emphasis"
      ],
      "rows": [
        [
          "Head toward limbs",
          "Inner imaginative life in the head",
          "An inner image can guide purposeful work through limbs"
        ],
        [
          "Limbs toward head",
          "Awake contact with surrounding things through doing",
          "Awake sensory observation and the formation of thoughts"
        ],
        [
          "Rhythmic middle",
          "Feelings and impressions elicited from surroundings",
          "Inner feelings can be perceived and brought toward the world"
        ]
      ],
      "caption": "Original explanatory table of captures 53–55. Koepke’s figures use line, crescent and circle, ascending and descending crossings, and inward/outward arrows. Capture 54 explicitly calls this a soul-spiritual process that cannot be observed on the physical level. The table explains the proposed metamorphosis; it does not turn the figure into bodily measurements."
    },
    "pt": {
      "title": "Os cruzamentos na metáfora da casa",
      "heads": [
        "Relação",
        "Ênfase mais jovem",
        "Ênfase mais velha"
      ],
      "rows": [
        [
          "Da cabeça aos membros",
          "Vida imaginativa interior na cabeça",
          "Uma imagem interior pode orientar trabalho intencional pelos membros"
        ],
        [
          "Dos membros à cabeça",
          "Contato desperto com o entorno pelo fazer",
          "Observação sensorial desperta e formação de pensamentos"
        ],
        [
          "Centro rítmico",
          "Sentimentos e impressões suscitados pelo entorno",
          "Sentimentos interiores podem ser percebidos e levados ao mundo"
        ]
      ],
      "caption": "Tabela explicativa original das capturas 53–55. As figuras de Koepke usam linha, crescente e círculo, cruzamentos ascendentes e descendentes e setas de fora e de dentro. A captura 54 chama expressamente isso de processo anímico-espiritual que não pode ser observado no plano físico. A tabela explica a metamorfose proposta; não transforma a figura em medidas corporais."
    }
  },
  "14": {
    "en": {
      "title": "The three grades in the form-drawing proposal",
      "heads": [
        "Grade",
        "Form relationship in the source"
      ],
      "rows": [
        [
          "First",
          "Movement from the sides toward a middle; one vertical mirror axis"
        ],
        [
          "Second",
          "Above/below and right/left relationships; cruciform symmetry"
        ],
        [
          "Third",
          "A freer relation to the middle; strict symmetry is broken and cursive writing introduced"
        ]
      ],
      "caption": "Original teaching table based on captures 68–69. The native dental chart on 68 is readable: Arabic numerals mark permanent teeth and Roman numerals milk teeth. Koepke links the grade forms to formative forces in changing teeth. This table makes the geometric sequence clear; understanding it does not establish the proposed bodily effect."
    },
    "pt": {
      "title": "Os três anos escolares na proposta de desenho de formas",
      "heads": [
        "Ano escolar",
        "Relação formal na fonte"
      ],
      "rows": [
        [
          "Primeiro",
          "Movimento dos lados para um centro; um eixo vertical de reflexão"
        ],
        [
          "Segundo",
          "Relações acima/abaixo e direita/esquerda; simetria em cruz"
        ],
        [
          "Terceiro",
          "Relação mais livre com o centro; rompe-se a simetria estrita e introduz-se a escrita cursiva"
        ]
      ],
      "caption": "Tabela didática original baseada nas capturas 68–69. A tabela dentária original em 68 está legível: números arábicos marcam dentes permanentes e romanos dentes de leite. Koepke liga as formas escolares às forças formativas da troca de dentes. Esta tabela esclarece a sequência geométrica; compreendê-la não estabelece o efeito corporal proposto."
    }
  },
  "15": {
    "en": {
      "title": "From completing a form to moving relationships",
      "heads": [
        "Exercise family",
        "What changes",
        "Supplied position"
      ],
      "rows": [
        [
          "Completion",
          "Imagine the part needed to finish an incomplete curve",
          "70, left column"
        ],
        [
          "Reflection",
          "Relate an object to its imagined reflection in water",
          "70, middle column"
        ],
        [
          "Inner and outer forms",
          "An outward projection calls for an inward response in the inner line",
          "70, right column →71, left column"
        ],
        [
          "Opening contours",
          "Move from closed contours toward separated forms that stream outward",
          "71, middle and right columns"
        ]
      ],
      "caption": "Original summary of the six readable source illustrations and mediated Steiner selections. Completion is sourced in the volume’s note 1 to A Modern Art of Education; the later examples are notes 2–3 to Kingdom of Childhood (76). The small reflection diagram below is an original course example of one principle, rather than a reproduction of these figures."
    },
    "pt": {
      "title": "Da conclusão de uma forma às relações em movimento",
      "heads": [
        "Família de exercícios",
        "O que muda",
        "Posição fornecida"
      ],
      "rows": [
        [
          "Conclusão",
          "Imagine a parte necessária para terminar uma curva incompleta",
          "70, coluna esquerda"
        ],
        [
          "Reflexão",
          "Relacione um objeto ao seu reflexo imaginado na água",
          "70, coluna central"
        ],
        [
          "Formas interiores e exteriores",
          "Uma projeção para fora pede resposta para dentro na linha interna",
          "70, coluna direita →71, coluna esquerda"
        ],
        [
          "Abertura de contornos",
          "Passe de contornos fechados a formas separadas que se estendem para fora",
          "71, colunas central e direita"
        ]
      ],
      "caption": "Resumo original das seis ilustrações legíveis e das seleções mediadas de Steiner. A conclusão remete, pela nota 1 do volume, a A Modern Art of Education; os exemplos seguintes, pelas notas 2–3, a Kingdom of Childhood (76). O pequeno diagrama de reflexão abaixo é exemplo original do curso de um princípio, em vez de reprodução dessas figuras."
    }
  }
};
const mapIds={"0": "self-reading-layers", "5": "self-developmental-phases", "6": "self-seven-twelve-map", "7": "self-house-crossings", "14": "self-grade-form-map", "15": "self-form-drawing-map"};
function table(id,lang){
 const v=maps[id][lang],name=mapIds[id];
 return `<section class="temperaments-map" id="${name}"><h2>${esc(v.title)}</h2><div role="region" aria-label="${esc(v.title)}" tabindex="0"><table><caption>${esc(v.caption)}</caption><thead><tr>${v.heads.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${v.rows.map(row=>`<tr><th scope="row">${esc(row[0])}</th>${row.slice(1).map(cell=>`<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></section>`;
}
export function selfVisual(id,lang){
 const pt=lang==='pt';
 if(maps[id]&&id!==15)return table(id,lang);
 if(id===2)return `<aside class="source-note"><h2>${pt?'Contexto atual de cuidado':'Current care context'}</h2><p>${pt?'O NIMH recomenda procurar um profissional quando dificuldades emocionais ou comportamentais duram semanas ou meses e interferem na vida cotidiana.':'NIMH recommends contacting a health professional when emotional or behavioural difficulties last weeks or months and interfere with daily life.'} <a href="https://www.nimh.nih.gov/health/topics/child-and-adolescent-mental-health">${pt?'Saúde mental infantil — NIMH (em inglês)':'Child and adolescent mental health — NIMH'}</a>.</p></aside>`;
 if(id===11)return `<aside class="source-note"><h2>${pt?'Contexto atual sobre ferro':'Current context on iron'}</h2><p>${pt?'Ferro em excesso pode causar danos. Não use as preparações históricas deste capítulo como orientação para suplementar uma criança.':'Too much iron can be harmful. Do not use this chapter’s historical preparations as guidance for supplementing a child.'} <a href="https://ods.od.nih.gov/factsheets/iron-consumer/">${pt?'Informações sobre ferro — NIH (em inglês)':'Iron fact sheet — NIH'}</a>.</p></aside>`;
 if(id===13)return `<aside class="source-note"><h2>${pt?'Verificação astronômica':'Astronomical cross-check'}</h2><p>${pt?'A NASA descreve a rotação dos nodos em aproximadamente 18,6 anos. A ligação com o desenvolvimento infantil é uma interpretação adicional de Koepke.':'NASA describes the nodes’ rotation over approximately 18.6 years. The childhood-development connection is an additional interpretation by Koepke.'} <a href="https://eclipse.gsfc.nasa.gov/SEhelp/moonorbit.html">${pt?'Órbita lunar — NASA (em inglês)':'The Moon’s orbit — NASA'}</a>.</p></aside>`;
 if(id===15)return table(id,lang)+`<figure class="temperaments-map"><svg viewBox="0 0 420 200" role="img" aria-labelledby="reflection-title reflection-desc" style="display:block;width:100%;max-width:560px"><title id="reflection-title">${pt?'Uma curva e sua reflexão':'A curve and its reflection'}</title><desc id="reflection-desc">${pt?'Uma linha vertical central separa duas curvas refletidas. Pontos ligados horizontalmente ficam à mesma distância do eixo.':'A central vertical line separates two reflected curves. Horizontally joined points lie equally far from the axis.'}</desc><path d="M210 10V190" stroke="#555" stroke-dasharray="5 5" fill="none"/><path d="M140 30C55 55 65 125 155 170 M280 30C365 55 355 125 265 170" stroke="#2e6554" stroke-width="4" fill="none"/><path d="M140 30H280 M155 170H265" stroke="#93704e" stroke-width="2"/><g fill="#93704e"><circle cx="140" cy="30" r="4"/><circle cx="280" cy="30" r="4"/><circle cx="155" cy="170" r="4"/><circle cx="265" cy="170" r="4"/></g></svg><figcaption>${pt?'Diagrama original do curso: distâncias iguais em lados opostos do eixo. Não é cópia de uma figura da fonte. Alternativa verbal: descreva pares de pontos com a mesma altura e distância do eixo.':'Original course diagram: equal distances on opposite sides of the axis. This is not a copy of a source figure. Verbal alternative: describe pairs of points at the same height and distance from the axis.'}</figcaption></figure>`;
 return '';
}
