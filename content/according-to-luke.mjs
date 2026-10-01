// Original bilingual reading companions. Source analysis and edition limits:
// according-to-luke-reading-review.md. Examples are teaching inventions.
const dates=['15','16','17','18','19','20','21','24','25','26'];
export const lukeSources=dates.map((day,i)=>({lecture:i+1,date:`1909-09-${day}`,url:`https://rsarchive.org/Lectures/GospLuke/190909${day}p01.html`}));
export const lukeLessons=[
{
  "id": 0,
  "lecture": null,
  "bridge": "lessons/00.html",
  "en": {
    "title": "McDermott’s introduction and how to read the lectures",
    "goal": "Understand the editorial introduction, the lectures’ premises and the source coverage.",
    "key": "Robert A. McDermott introduces lectures originally addressed to listeners familiar with anthroposophy. He explains why their background assumptions, spiritual vocabulary and account of the Gospel writers need attention before the ten lectures can be understood. His introduction is a later editorial contribution; the lectures themselves are Rudolf Steiner’s.",
    "context": "McDermott recommends sound judgment, humility and reverence, with room to leave a claim open. He also makes a positive case for spiritual Imagination and the Akashic record as sources of knowledge. Read both sides of his proposal: the disposition he recommends and the spiritual premises he defends. The supplied 21-capture PDF contains the complete introduction and the same Lecture 1 text reviewed earlier. Its copyright page identifies Catherine E. Creeger’s 2001 translation.",
    "example": "A study group records four statements: “Luke narrates the shepherds’ visit”; “Steiner interprets the narrative through spiritual research”; “McDermott explains how to approach that interpretation”; “I find it compelling.” Each statement has a different speaker or function. The group checks the relevant text before deciding which claims it can support.",
    "explanation": "Use a notebook entry with four labels: Gospel narrative, Steiner’s interpretation, McDermott’s explanation and your assessment. These voices can discuss the same event while making different claims about it. McDermott’s willingness to leave room for judgment belongs alongside his confidence in Steiner’s spiritual research.",
    "activity": "Read the introduction, PDF capture pages 5–13. Write one sentence each on its intended reader, recommended disposition, claimed source of knowledge and comparison with biblical scholarship. Attribute every sentence to McDermott and cite its capture page. Then compare a short Gospel passage with his account and record one question to carry into Lecture 1.",
    "checks": [
      [
        "Why does McDermott discuss the original lecture audiences?",
        "Steiner assumed familiarity with anthroposophical accounts of the human being, spiritual cosmos and history. McDermott supplies orientation for readers who lack that background; see PDF capture page 5."
      ],
      [
        "What are the two parts of McDermott’s recommended approach?",
        "He asks for sound judgment with humility and reverence, without assent based only on authority. He also defends the possibility of spiritual knowledge and the Akashic record. Explain his position before assessing it; see pages 6–9."
      ],
      [
        "Which portions of this uploaded book are available for detailed review?",
        "The cover, title, copyright page and contents, McDermott’s complete introduction (captures 5–13), and the supplied Lecture 1 text (14–21). Lectures 2–10, the Descriptive Outline, About This Edition and footnote bodies are absent. The final capture ends after the Akashic-record paragraph; it provides no following lecture boundary to confirm whether Lecture 1 is complete."
      ]
    ],
    "takeaway": "Identify the voice, its premises and its reasons before making your assessment.",
    "terms": "Editorial introduction: McDermott’s later guide to reading Steiner. Exoteric evidence: publicly accessible textual and historical material. Esoteric evidence: the spiritual access claimed in this account. Akashic record: the enduring spiritual record of past events proposed as a source of knowledge.",
    "reading": "McDermott, “Approaching Rudolf Steiner’s Lectures on the Gospel of Luke,” PDF capture pages 5–13. Capture positions are not printed book page numbers."
  },
  "pt": {
    "title": "A introdução de McDermott e a leitura das palestras",
    "goal": "Compreenda a introdução editorial, as premissas das palestras e a cobertura das fontes.",
    "key": "Robert A. McDermott apresenta palestras dirigidas originalmente a ouvintes familiarizados com a antroposofia. Explica por que suas premissas, seu vocabulário espiritual e sua descrição dos evangelistas precisam de atenção para que as dez palestras sejam compreendidas. Sua introdução é uma contribuição editorial posterior; as palestras são de Rudolf Steiner.",
    "context": "McDermott recomenda discernimento, humildade e reverência, com espaço para deixar uma afirmação em aberto. Também defende a Imaginação espiritual e o registro akáshico como fontes de conhecimento. Leia as duas partes de sua proposta: a disposição que recomenda e as premissas espirituais que defende. O PDF de 21 capturas contém a introdução completa e o mesmo texto da palestra 1 revisto anteriormente. A página de direitos autorais identifica a tradução de Catherine E. Creeger, de 2001.",
    "example": "Um grupo registra quatro afirmações: “Lucas narra a visita dos pastores”; “Steiner interpreta a narrativa pela pesquisa espiritual”; “McDermott explica como abordar essa interpretação”; “Eu a considero convincente.” Cada afirmação tem um autor ou uma função diferente. O grupo consulta o texto pertinente antes de decidir quais afirmações pode sustentar.",
    "explanation": "Use quatro rótulos no caderno: narrativa do Evangelho, interpretação de Steiner, explicação de McDermott e sua avaliação. Essas vozes podem tratar do mesmo acontecimento e fazer afirmações diferentes. A abertura de McDermott ao julgamento do leitor aparece junto de sua confiança na pesquisa espiritual de Steiner.",
    "activity": "Leia a introdução, capturas 5–13 do PDF. Escreva uma frase sobre cada ponto: o leitor a quem se dirige, a disposição recomendada, a fonte de conhecimento alegada e a comparação com a pesquisa bíblica. Atribua cada frase a McDermott e indique a captura. Depois compare uma passagem breve do Evangelho com sua explicação e registre uma pergunta para levar à palestra 1.",
    "checks": [
      [
        "Por que McDermott fala do público original das palestras?",
        "Steiner pressupunha familiaridade com as descrições antroposóficas do ser humano, do cosmos espiritual e da história. McDermott orienta quem não tem esse conhecimento prévio; veja a captura 5 do PDF."
      ],
      [
        "Quais são as duas partes da abordagem recomendada por McDermott?",
        "Ele pede discernimento com humildade e reverência, sem aceitação baseada apenas na autoridade. Também defende a possibilidade do conhecimento espiritual e o registro akáshico. Explique sua posição antes de avaliá-la; veja as capturas 6–9."
      ],
      [
        "Quais partes deste livro fornecido estão disponíveis para revisão detalhada?",
        "A capa, o título, a página de direitos autorais e o sumário, a introdução completa de McDermott (capturas 5–13) e o texto fornecido da palestra 1 (14–21). Faltam as palestras 2–10, o Esboço descritivo, Sobre esta edição e os textos das notas. A última captura termina após o parágrafo sobre o registro akáshico; não traz a passagem à palestra seguinte para confirmar se a palestra 1 está completa."
      ]
    ],
    "takeaway": "Identifique a voz, suas premissas e suas razões antes de fazer sua avaliação.",
    "terms": "Introdução editorial: orientação posterior de McDermott para a leitura de Steiner. Evidência exotérica: material textual e histórico publicamente acessível. Evidência esotérica: o acesso espiritual alegado nesta descrição. Registro akáshico: registro espiritual duradouro dos acontecimentos passados, proposto como fonte de conhecimento.",
    "reading": "McDermott, “Approaching Rudolf Steiner’s Lectures on the Gospel of Luke”, capturas 5–13 do PDF. As posições das capturas não são números de páginas impressas do livro."
  }
},
{
  "id": 1,
  "lecture": 1,
  "bridge": "higher-worlds/lessons/10.html",
  "en": {
    "title": "The four Gospels and three levels of spiritual cognition",
    "goal": "Explain how Steiner’s distinctions between spiritual capacities support his reading of Luke.",
    "key": "Steiner argues that Luke offers a perspective on the Christ event that John’s Gospel does not exhaust. He develops this claim through three levels of supersensible cognition: Imagination perceives spiritual images, Inspiration receives the beings’ inward expression, and Intuition enters their being. The lecture connects Intuition with a love that overcomes the separation between self and other.",
    "context": "“Clairvoyant” chiefly names access to imaginative perception here; “initiate” names access to Inspiration and Intuition. The capacities can coincide or, in his account of earlier mysteries, belong to different specialists. Steiner reads Luke’s “eyewitnesses” and “servants of the word” through this distinction. His method begins with claimed independent spiritual research and then compares its findings with the Gospel documents.",
    "example": "A friend looks quiet during a meeting. You picture tiredness, then ask and learn that she is concentrating. Observation, your interpretation and her explanation differ. Asking improved your ordinary understanding; it did not establish clairvoyance or give you complete access to her inner life.",
    "explanation": "The encounter illustrates Steiner’s comparison between seeing someone from outside and hearing their self-expression. It helps explain a relation between stages. An ordinary conversation supplies ordinary evidence; the technical spiritual capacities remain the lecture’s further claims. Likewise, its plant-colour image introduces Imagination, rather than giving a code for assigning personalities from visible colours.",
    "activity": "Read PDF capture pages 14–21. Make a three-row chart of Imagination, Inspiration and Intuition, with a sentence and page reference for each. Then explain the difference between a clairvoyant and an initiate, apply it to Steiner’s reading of Luke 1:1–2, and reconstruct the order “spiritual research → comparison with Gospel documents.” Finish by naming one premise your explanation depends on. The upload stops after the Akashic-record paragraph, with no following lecture boundary.",
    "checks": [
      [
        "How do the three levels differ in the supplied lecture text?",
        "Imagination perceives the spiritual beings’ outward images; Inspiration receives what they communicate from within; in Intuition, the knower becomes one with the beings through developed spiritual love. Steiner presents this as a progression beyond ordinary sensory knowledge; see captures 15–16."
      ],
      [
        "How does Steiner connect the capacities with Luke and John?",
        "He associates John especially with the initiate’s Inspiration and Intuition. For Luke he interprets “eyewitnesses” as independent imaginative seers and “servants of the word” as people drawing on inspired teachers to express their visions. This is Steiner’s reading of Luke 1:1–2; see captures 18–20."
      ],
      [
        "What comes first in the method Steiner describes?",
        "Independent spiritual research, attributed to access to the Akashic record, comes first. Gospel documents are compared with its results afterward. The documents therefore function as comparisons in this account, rather than as its originating source; see captures 19–21."
      ]
    ],
    "takeaway": "Follow the distinctions from spiritual capacities to Gospel interpretation and the claimed source of knowledge.",
    "terms": "Imagination: spiritual perception in images. Inspiration: receiving spiritual beings’ inward expression, also described as the inner word. Intuition: participation in their being. Clairvoyant: an imaginative seer in this lecture. Initiate: someone who reaches Inspiration and Intuition. Logos: the word, associated here with John’s standpoint.",
    "reading": "Lecture 1, “The Four Gospels in the Light of Anthroposophy”: supplied text, PDF captures 14–21, Anthroposophic Press, 2001, Catherine E. Creeger translation. Parallel lecture: 15 September 1909."
  },
  "pt": {
    "title": "Os quatro Evangelhos e três níveis de conhecimento espiritual",
    "goal": "Explique como as distinções entre capacidades espirituais sustentam a leitura de Lucas feita por Steiner.",
    "key": "Steiner argumenta que Lucas oferece uma perspectiva do acontecimento de Cristo que o Evangelho de João não esgota. Desenvolve essa afirmação por três níveis de conhecimento suprassensível: a Imaginação percebe imagens espirituais, a Inspiração recebe a expressão interior dos seres e a Intuição entra no ser deles. A palestra relaciona a Intuição a um amor que supera a separação entre o eu e o outro.",
    "context": "“Clarividente” designa principalmente o acesso à percepção imaginativa neste contexto; “iniciado” designa o acesso à Inspiração e à Intuição. As capacidades podem coincidir ou, na descrição dos antigos mistérios, pertencer a especialistas diferentes. Steiner lê as expressões “testemunhas oculares” e “servidores da palavra” de Lucas à luz dessa distinção. Seu método começa pela alegada pesquisa espiritual independente e depois compara os resultados com os documentos dos Evangelhos.",
    "example": "Uma amiga parece quieta durante uma reunião. Você imagina cansaço, pergunta e descobre que ela está concentrada. A observação, sua interpretação e a explicação dela diferem. Perguntar melhorou sua compreensão cotidiana; não comprovou clarividência nem lhe deu acesso completo à vida interior dela.",
    "explanation": "O encontro ilustra a comparação de Steiner entre ver alguém de fora e ouvir sua expressão interior. Ajuda a explicar uma relação entre etapas. Uma conversa cotidiana fornece evidências cotidianas; as capacidades espirituais técnicas continuam sendo afirmações adicionais da palestra. Da mesma forma, a imagem das cores de uma planta apresenta a Imaginação, em vez de fornecer um código para atribuir personalidades pelas cores visíveis.",
    "activity": "Leia as capturas 14–21 do PDF. Faça um quadro de três linhas: Imaginação, Inspiração e Intuição, com uma frase e uma referência de captura para cada uma. Depois explique a diferença entre clarividente e iniciado, aplique-a à leitura de Lucas 1:1–2 feita por Steiner e reconstrua a ordem “pesquisa espiritual → comparação com os documentos dos Evangelhos”. Termine indicando uma premissa da qual sua explicação depende. O arquivo termina após o parágrafo sobre o registro akáshico, sem trazer a passagem à palestra seguinte.",
    "checks": [
      [
        "Como se distinguem os três níveis no texto fornecido da palestra?",
        "A Imaginação percebe as imagens exteriores dos seres espirituais; a Inspiração recebe o que comunicam a partir de seu interior; na Intuição, quem conhece torna-se uno com os seres por meio do amor espiritual desenvolvido. Steiner apresenta isso como uma progressão além do conhecimento sensorial comum; veja as capturas 15–16."
      ],
      [
        "Como Steiner relaciona as capacidades a Lucas e João?",
        "Associa João especialmente à Inspiração e à Intuição do iniciado. Em Lucas, interpreta “testemunhas oculares” como videntes imaginativos independentes e “servidores da palavra” como pessoas que recorrem a mestres inspirados para expressar suas visões. Essa é a leitura de Lucas 1:1–2 feita por Steiner; veja as capturas 18–20."
      ],
      [
        "O que vem primeiro no método descrito por Steiner?",
        "A pesquisa espiritual independente, atribuída ao acesso ao registro akáshico, vem primeiro. Os documentos dos Evangelhos são comparados com seus resultados depois. Nessa descrição, os documentos funcionam como comparação, e não como fonte inicial; veja as capturas 19–21."
      ]
    ],
    "takeaway": "Acompanhe as distinções entre capacidades espirituais, interpretação dos Evangelhos e fonte de conhecimento alegada.",
    "terms": "Imaginação: percepção espiritual em imagens. Inspiração: recepção da expressão interior dos seres espirituais, também descrita como palavra interior. Intuição: participação no ser deles. Clarividente: vidente imaginativo nesta palestra. Iniciado: quem alcança Inspiração e Intuição. Logos: a palavra, associada aqui à perspectiva de João.",
    "reading": "Palestra 1, “Os quatro Evangelhos à luz da antroposofia”: texto fornecido, capturas 14–21 do PDF, Anthroposophic Press, 2001, tradução de Catherine E. Creeger. Palestra paralela: 15 de setembro de 1909."
  }
},
{
  "id": 2,
  "lecture": 2,
  "bridge": "higher-worlds/lessons/07.html",
  "en": {
    "title": "Bodhisattva, Buddha and the teaching of love and compassion",
    "goal": "Explain the relation between a spiritual teacher and a human capacity in Steiner’s account.",
    "key": "The selected passage describes Buddha’s earlier Bodhisattva role as a teacher of love and compassion. The lecture’s existing source summary places this teaching within an account of love and compassion becoming a capacity human beings can understand from within. Keep the teacher’s role, what is taught and the capacity being developed distinct.",
    "context": "Steiner’s connection between Buddha and Luke belongs to his spiritual interpretation of the Gospel. The retained selection supplies one part of that argument: the earlier teaching role. The fuller transition and the interpretation of the shepherds’ announcement need their surrounding lecture text. That text is absent from the supplied PDF captures of the 2001 edition, so this lesson offers a close reading of the available passage and a guide to the questions still open.",
    "example": "A volunteer repeats, “Always help.” When a newcomer struggles with a form, she completes it without asking. Another volunteer asks which part is difficult and offers to work through it together. The second response may support the newcomer’s independence; the first may remove a chance to learn.",
    "explanation": "The first volunteer acts on a general instruction; the second tries to understand how help could support this person. The example clarifies the distinction between receiving an instruction and exercising an understood capacity. It illustrates a relation in learning; it does not reproduce the Bodhisattva-to-Buddha transition described by Steiner.",
    "activity": "Begin with the selected passage. Mark the subject, the temporal word, the teaching role and the contents of the teaching. Paraphrase it without dropping either love or compassion, and cite the German paragraph reference. Then explain the difference between receiving a teaching and exercising an understood capacity, using the volunteer example as an analogy. Finish with two questions for the full lecture: how the Bodhisattva-to-Buddha transition occurs, and how Buddha’s continuing activity is related to the shepherds’ announcement.",
    "checks": [
      [
        "What does “previously” establish in the selected passage?",
        "Steiner presents Buddha as having previously been the Bodhisattva. The sentence follows the same teacher through an earlier designation and identifies that earlier teaching role; it does not explain how the transition occurred."
      ],
      [
        "What does the retained sentence say the Bodhisattva taught?",
        "Love, compassion and everything connected with them. Preserve both named subjects. The sentence does not enumerate the additional connected teachings."
      ],
      [
        "How do the earlier notes connect this teaching with human development and Luke? What remains unexplained here?",
        "The course’s earlier explanation describes love and compassion becoming humanly understood capacities, and connects Buddha’s continuing activity with the announcement to the shepherds. The retained sentence identifies an earlier teacher and the contents of his teaching. It does not explain either transition or the Gospel connection; those require the surrounding Lecture 2 text."
      ]
    ],
    "takeaway": "Trace the earlier teacher, the teaching and the capacity before reconstructing the wider Gospel interpretation.",
    "terms": "Bodhisattva: the Buddha’s earlier role as a spiritual teacher in this selection. Buddha: the figure whose earlier role the sentence describes; the full lecture is needed for the account of the transition. Teaching: communication of an ideal or understanding. Capacity: an ability that a person can exercise. Compassion: the concern for another’s suffering named in the source, considered alongside love.",
    "reading": "Lecture 2, 16 September 1909: retained German selection, § 24, with original English and Portuguese study translations. Consult the complete parallel lecture for the transition and shepherds’ announcement. Lecture 2 is absent from the supplied PDF captures of the 2001 Creeger edition."
  },
  "pt": {
    "title": "Bodhisattva, Buda e o ensino do amor e da compaixão",
    "goal": "Explique a relação entre um mestre espiritual e uma capacidade humana na descrição de Steiner.",
    "key": "O trecho selecionado descreve a função anterior de Buda como Bodhisattva que ensinava o amor e a compaixão. O resumo já existente da fonte situa esse ensino numa descrição do amor e da compaixão tornando-se capacidades que os seres humanos podem compreender interiormente. Distinga a função do mestre, aquilo que é ensinado e a capacidade em desenvolvimento.",
    "context": "A ligação entre Buda e Lucas pertence à interpretação espiritual do Evangelho feita por Steiner. O trecho mantido fornece uma parte do argumento: a função anterior de ensino. A transição completa e a interpretação do anúncio aos pastores exigem o texto ao redor. Essa palestra está ausente nas capturas fornecidas da edição de 2001; por isso, a lição apresenta uma leitura atenta do trecho disponível e orienta as perguntas ainda abertas.",
    "example": "Uma voluntária repete: “Ajude sempre.” Quando uma pessoa recém-chegada encontra dificuldade num formulário, ela o preenche sem perguntar. Outra voluntária pergunta qual parte é difícil e oferece ajuda para preencherem juntas. A segunda resposta pode favorecer a autonomia; a primeira pode retirar uma oportunidade de aprender.",
    "explanation": "A primeira voluntária age segundo uma instrução geral; a segunda procura compreender como a ajuda pode apoiar esta pessoa. O exemplo esclarece a diferença entre receber uma instrução e exercer uma capacidade compreendida. Ilustra uma relação na aprendizagem; não reproduz a transição de Bodhisattva a Buda descrita por Steiner.",
    "activity": "Comece pelo trecho selecionado. Marque o sujeito, a expressão temporal, a função de ensino e o conteúdo ensinado. Parafraseie a frase sem omitir o amor nem a compaixão e indique a referência do parágrafo alemão. Depois, explique a diferença entre receber um ensinamento e exercer uma capacidade compreendida, usando o exemplo das voluntárias como analogia. Termine com duas perguntas para a palestra completa: como ocorre a transição de Bodhisattva a Buda e como a atividade continuada de Buda se relaciona ao anúncio aos pastores.",
    "checks": [
      [
        "Que relação “havia sido” estabelece entre Buda e Bodhisattva?",
        "Steiner apresenta Buda como alguém que anteriormente havia sido o Bodhisattva. A frase acompanha o mesmo mestre numa designação anterior e identifica sua atividade de ensino; não explica como ocorreu a transição."
      ],
      [
        "Segundo a frase mantida, o que o Bodhisattva ensinava?",
        "O amor, a compaixão e tudo o que se relaciona com eles. Preserve os dois temas nomeados. A frase não enumera os demais ensinamentos relacionados."
      ],
      [
        "Como as notas anteriores relacionam esse ensino ao desenvolvimento humano e a Lucas? O que permanece sem explicação aqui?",
        "A explicação anterior do curso descreve o amor e a compaixão tornando-se capacidades compreendidas humanamente e relaciona a atividade continuada de Buda ao anúncio aos pastores. A frase mantida identifica um mestre anterior e o conteúdo de seu ensino. Não explica a transição nem a ligação com o Evangelho; essas partes exigem o texto ao redor na palestra 2."
      ]
    ],
    "takeaway": "Acompanhe o mestre anterior, o ensinamento e a capacidade antes de reconstruir a interpretação mais ampla do Evangelho.",
    "terms": "Bodhisattva (também grafado Bodisatva): a função anterior de Buda como mestre espiritual neste trecho. Buda: a figura cuja função anterior é descrita; a palestra completa é necessária para explicar a transição. Ensinamento: comunicação de um ideal ou compreensão. Capacidade: habilidade que alguém pode exercer. Compaixão: cuidado com o sofrimento alheio nomeado na fonte, considerado junto do amor.",
    "reading": "Palestra 2, 16 de setembro de 1909: trecho alemão mantido, § 24, com traduções de estudo originais em inglês e português. Consulte a palestra paralela completa para a transição e o anúncio aos pastores. A palestra 2 está ausente nas capturas fornecidas da edição de 2001 traduzida por Creeger."
  }
},
{id:3,lecture:3,bridge:'philosophy-of-freedom/lessons/16.html',
 en:{title:'Give care a practical form',goal:'Examine how thought, speech and action can support one another.',
 key:'Steiner connects his account of suffering with an exposition of the Eightfold Path, then relates Buddha’s Nirmanakaya to the Nathan Jesus. The ethical discussion and the spiritual narrative are different parts of his argument; accepting one does not establish the other.',
 context:'The lecture uses Buddhist terms within an anthroposophical explanation. Keep that context visible when comparing it with other teachings. For this lesson, test the coherence of an ordinary response rather than trying to reproduce the spiritual processes described.',
 example:'You hear that a colleague deliberately excluded someone. Before forwarding the accusation, you ask what happened. A missing email address turns out to be the problem. You help correct the list and invite the excluded person. Thought checked the assumption; speech sought clarification; action repaired something concrete.',
 explanation:'This is an original exercise in responsible communication. It does not assume that every conflict is a misunderstanding. If exclusion was deliberate, the facts would call for a different response. Careful inquiry can support accountability as well as kindness.',
 activity:'Draft a three-step response to a fictional unfair comment: what you need to know, what you would say and what you could do. Identify one fact that would make you change the response. Keep the exercise about communication, not judgments about someone’s karma.',
 checks:[['What was wrong with forwarding the accusation immediately?','It would spread an interpretation before checking the relevant facts.'],['Would silence necessarily be compassionate?','No. Silence could leave the exclusion uncorrected. The response needs both care and attention to consequences.'],['What makes your plan revisable?','A stated assumption and a clear description of the evidence that would change it.']],
 takeaway:'Let a caring intention become an informed, revisable action.',terms:'Nirmanakaya: a technical term in the lecture’s account of Buddha’s continuing activity. Revision: changing a judgment when reasons require it.',reading:'Lecture 3, 17 September 1909: suffering and the Eightfold Path; the concluding account of spiritual cooperation.'},
 pt:{title:'Dê uma forma prática ao cuidado',goal:'Examine como pensamento, fala e ação podem se apoiar mutuamente.',
 key:'Steiner liga sua explicação do sofrimento a uma exposição do Caminho Óctuplo e depois relaciona o Nirmanakaya de Buda ao Jesus natânico. A discussão ética e a narrativa espiritual são partes diferentes de seu argumento; aceitar uma não comprova a outra.',
 context:'A palestra usa termos budistas numa explicação antroposófica. Mantenha esse contexto visível ao compará-la com outros ensinamentos. Nesta lição, examine a coerência de uma resposta cotidiana, em vez de tentar reproduzir os processos espirituais descritos.',
 example:'Você ouve que um colega excluiu alguém deliberadamente. Antes de encaminhar a acusação, pergunta o que aconteceu. O problema era a falta de um endereço de e-mail. Você ajuda a corrigir a lista e convida a pessoa excluída. O pensamento examinou a suposição; a fala buscou esclarecimento; a ação reparou algo concreto.',
 explanation:'Este é um exercício original de comunicação responsável. Não presume que todo conflito seja um mal-entendido. Se a exclusão fosse deliberada, os fatos pediriam outra resposta. Uma investigação cuidadosa pode favorecer tanto a responsabilização quanto a gentileza.',
 activity:'Elabore uma resposta em três passos a um comentário injusto fictício: o que precisa saber, o que diria e o que poderia fazer. Identifique um fato que mudaria sua resposta. Mantenha a atividade no campo da comunicação, sem julgar o carma de alguém.',
 checks:[['Qual era o problema de encaminhar imediatamente a acusação?','Isso espalharia uma interpretação antes da verificação dos fatos relevantes.'],['O silêncio seria necessariamente compassivo?','Não. Poderia deixar a exclusão sem correção. A resposta precisa de cuidado e atenção às consequências.'],['O que torna seu plano revisável?','Uma suposição explícita e uma descrição clara da evidência que o faria mudar.']],
 takeaway:'Transforme a intenção cuidadosa numa ação informada e revisável.',terms:'Nirmanakaya: termo técnico da explicação da palestra sobre a atividade continuada de Buda. Revisão: mudança de um juízo quando as razões a exigem.',reading:'Palestra 3, 17 de setembro de 1909: sofrimento e Caminho Óctuplo; a explicação final da cooperação espiritual.'}},
{id:4,lecture:4,bridge:'lessons/08.html',
 en:{title:'Keep the two infancy narratives distinct',goal:'Map a difficult interpretation before judging it.',
 key:'Steiner proposes two Jesus children to reconcile Matthew and Luke: a Solomon-line child associated with Zarathustra, and a Nathan-line child bearing preserved, unfallen Adamic forces. This is his esoteric interpretation, not an explicit statement by the Gospel writers that there were two children.',
 context:'A map should make an interpretation easier to inspect. It should not make the proposed relationships look like independently established history. His cosmic account belongs to the lecture’s spiritual framework; use the source to examine its premises.',
 example:'Two biographies describe different childhood episodes. One reader assumes they describe one person; another proposes two people. A neat chart can display either account. To decide between them, we need reasons beyond the neatness of the chart: documents, chronology and the assumptions used to join the episodes.',
 explanation:'First ask what each text actually says. Then ask which additional explanation makes the differences intelligible, and at what cost in assumptions. An interpretation can remove one difficulty while creating questions elsewhere.',
 activity:'Draw two columns headed Matthew and Luke. Use the lecture to locate one infancy passage in each Gospel in your own Bible. Record the narrative detail separately from Steiner’s proposed explanation. Add a question that your diagram cannot answer.',
 checks:[['Does a contradiction automatically prove there are two subjects?','No. It raises a question; several explanations may be considered and compared.'],['What should the diagram’s caption say?','That it maps a particular interpretation, identifying whose interpretation it is.'],['How can you improve a diagram without adding more boxes?','Label the relationship precisely and state which reference supports it.']],
 takeaway:'A clear map makes an interpretation examinable; it does not prove it.',terms:'Genealogy: an account of ancestry. Hypothesis: a proposed explanation whose support must be examined.',reading:'Lecture 4, 18 September 1909: the concluding explanation of the two children and the preserved Adamic forces.'},
 pt:{title:'Distinga as duas narrativas da infância',goal:'Mapeie uma interpretação difícil antes de julgá-la.',
 key:'Steiner propõe dois meninos Jesus para conciliar Mateus e Lucas: o da linhagem salomônica, associado a Zaratustra, e o da linhagem natânica, portador de forças adâmicas preservadas da queda. Essa é sua interpretação esotérica, não uma declaração explícita dos evangelistas de que existiam dois meninos.',
 context:'Um mapa deve facilitar o exame de uma interpretação. Não deve fazer as relações propostas parecerem história comprovada de forma independente. A explicação cósmica pertence ao quadro espiritual da palestra; use a fonte para examinar suas premissas.',
 example:'Duas biografias descrevem episódios diferentes da infância. Um leitor supõe que tratam de uma pessoa; outro propõe duas. Um quadro organizado pode apresentar qualquer das explicações. Para decidir entre elas, precisamos de razões além da organização do quadro: documentos, cronologia e suposições usadas para ligar os episódios.',
 explanation:'Pergunte primeiro o que cada texto efetivamente diz. Depois, qual explicação adicional torna as diferenças compreensíveis e quantas suposições exige. Uma interpretação pode resolver uma dificuldade e criar perguntas em outro ponto.',
 activity:'Desenhe duas colunas, Mateus e Lucas. Use a palestra para localizar uma passagem da infância em cada Evangelho na sua Bíblia. Registre o detalhe narrativo separado da explicação proposta por Steiner. Acrescente uma pergunta que seu diagrama não consegue responder.',
 checks:[['Uma contradição prova automaticamente que existem dois sujeitos?','Não. Ela suscita uma pergunta; várias explicações podem ser consideradas e comparadas.'],['O que a legenda do diagrama deve dizer?','Que ele representa uma interpretação específica, identificando de quem é essa interpretação.'],['Como melhorar um diagrama sem acrescentar mais caixas?','Nomeie a relação com precisão e indique a referência que a sustenta.']],
 takeaway:'Um mapa claro permite examinar uma interpretação; não a comprova.',terms:'Genealogia: relato de ancestralidade. Hipótese: explicação proposta cujo apoio deve ser examinado.',reading:'Palestra 4, 18 de setembro de 1909: a explicação final dos dois meninos e das forças adâmicas preservadas.'}},
{id:5,lecture:5,bridge:'lessons/05.html',
 en:{title:'Influence is not the same as identity',goal:'Use precise verbs when tracing relationships.',
 key:'In Steiner’s narrative, Zarathustra’s Ego passes from the Solomon child into the Nathan Jesus at twelve; Buddha’s contribution has a different character. He describes a convergence of spiritual streams, not a simple equation of Buddha, Zarathustra and Christ.',
 context:'The body and Ego terminology matters to this account. “Influences,” “incarnates” and “passes into” do different work. Keep the unusual claims attributed; familiarity with the vocabulary alone is not evidence for them.',
 example:'A musician learns a technique from one teacher and plays an instrument built by another person. Saying “Both shaped her performance” is reasonable. Saying “All three are the same person” does not follow. A relationship of contribution does not establish personal identity.',
 explanation:'This everyday example is only a lesson in language. It does not model a spiritual transfer. When a source describes a relationship that has no ordinary counterpart, it is better to mark that limit than to supply an apparently familiar but misleading explanation.',
 activity:'Draw a small relationship map from the assigned passage. Give each arrow a verb and a source location. Then write a separate everyday example of two contributions to one result. State exactly where your analogy stops working.',
 checks:[['Why does “connected with” make a weak arrow label?','It leaves the relationship unspecified: influence, membership, chronology and identity could all be meant.'],['Does a shared result imply a shared identity?','No. Distinct contributors can help produce one result.'],['What should you do if the passage does not specify a detail?','Leave the detail open and mark the question. Do not fill the gap with a confident invention.']],
 takeaway:'A precise relationship is more useful than a vague claim of unity.',terms:'Identity: being the same individual. Contribution: playing a part in a result without thereby becoming identical with other contributors.',reading:'Lecture 5, 19 September 1909: the separate streams, the temple episode and their convergence.'},
 pt:{title:'Influência não é o mesmo que identidade',goal:'Use verbos precisos ao acompanhar relações.',
 key:'Na narrativa de Steiner, o Eu de Zaratustra passa do menino salomônico ao Jesus natânico aos doze anos; a contribuição de Buda tem outro caráter. Ele descreve a convergência de correntes espirituais, não uma simples equivalência entre Buda, Zaratustra e Cristo.',
 context:'A terminologia de corpos e Eu importa nessa explicação. “Influencia”, “encarna” e “passa para” expressam relações distintas. Mantenha as afirmações incomuns atribuídas ao autor; conhecer o vocabulário não constitui evidência delas.',
 example:'Uma musicista aprende uma técnica com uma professora e toca um instrumento construído por outra pessoa. Dizer “Ambas contribuíram para sua apresentação” é razoável. Dizer “As três são a mesma pessoa” não decorre disso. Uma relação de contribuição não estabelece identidade pessoal.',
 explanation:'Esse exemplo cotidiano ensina apenas uma distinção de linguagem. Não representa uma transferência espiritual. Quando uma fonte descreve uma relação sem correspondente cotidiano, é melhor indicar esse limite do que oferecer uma explicação aparentemente familiar, mas enganosa.',
 activity:'Desenhe um pequeno mapa de relações a partir da passagem indicada. Dê a cada seta um verbo e uma localização na fonte. Depois, escreva um exemplo cotidiano separado de duas contribuições para um resultado. Indique exatamente onde sua analogia deixa de funcionar.',
 checks:[['Por que “ligado a” é uma legenda fraca para uma seta?','Ela não especifica a relação: pode significar influência, pertencimento, cronologia ou identidade.'],['Um resultado compartilhado implica identidade compartilhada?','Não. Pessoas distintas podem contribuir para um resultado.'],['O que fazer se a passagem não especificar um detalhe?','Deixe o detalhe em aberto e registre a pergunta. Não preencha a lacuna com uma invenção apresentada como certeza.']],
 takeaway:'Uma relação precisa é mais útil que uma afirmação vaga de unidade.',terms:'Identidade: ser o mesmo indivíduo. Contribuição: participar de um resultado sem se tornar idêntico aos outros participantes.',reading:'Palestra 5, 19 de setembro de 1909: as correntes separadas, o episódio do templo e sua convergência.'}},
{id:6,lecture:6,bridge:'philosophy-of-freedom/lessons/20.html',
 en:{title:'Responsibility beyond inherited belonging',goal:'Consider conduct without reducing a person to ancestry.',
 key:'Steiner connects Moses, Elijah and John the Baptist within a spiritual history of moral development. He reads John’s call for changed conduct as exceeding inherited belonging. His account also ranks religious cultures by maturity; that hierarchy requires critical examination.',
 context:'Do not turn this scheme into judgments about Jewish people or any living community. A religious tradition cannot be reduced to a single developmental label. We can examine the ethical question about conduct while challenging the lecture’s generalizations.',
 example:'A club gives a leadership role to someone because her family has always belonged. Another candidate has listened carefully, resolved disagreements and fulfilled commitments. Family history may explain familiarity with the club; it does not decide who will act responsibly in this role.',
 explanation:'Compare actions and reasons without erasing people’s histories. Respecting a tradition and evaluating a particular decision can coexist. The same standard should apply to an outsider and a long-standing member.',
 activity:'Invent a decision about participation in a community project. List two relevant individual abilities and one irrelevant group stereotype. Replace the stereotype with a question the person can answer. Explain how this changes the decision.',
 checks:[['Must we ignore someone’s background?','No. Background can supply context, but it should not substitute for attention to the individual and the actual decision.'],['Can you learn from an ethical question while criticizing its framing?','Yes. Identify which point you retain and which claim you challenge, giving reasons for each.'],['What is unfair about applying different standards to insiders and outsiders?','The same evidence is being valued differently because of membership rather than its relevance to the task.']],
 takeaway:'Attend to individual conduct and examine the categories used to judge it.',terms:'Stereotype: a generalized expectation imposed on an individual. Criterion: a stated basis for making a judgment.',reading:'Lecture 6, 20 September 1909: law, prophecy and John’s appeal to conduct; examine the cultural hierarchy as well.'},
 pt:{title:'Responsabilidade além do pertencimento herdado',goal:'Considere a conduta sem reduzir alguém à ancestralidade.',
 key:'Steiner relaciona Moisés, Elias e João Batista numa história espiritual do desenvolvimento moral. Interpreta o chamado de João à mudança de conduta como algo que ultrapassa o pertencimento herdado. Sua explicação também classifica culturas religiosas por maturidade; essa hierarquia exige exame crítico.',
 context:'Não transforme esse esquema em juízos sobre pessoas judias ou qualquer comunidade atual. Uma tradição religiosa não pode ser reduzida a um único rótulo de desenvolvimento. Podemos examinar a pergunta ética sobre a conduta e questionar as generalizações da palestra.',
 example:'Um clube entrega uma função de liderança a alguém porque sua família sempre participou dele. Outra candidata ouviu com atenção, resolveu divergências e cumpriu compromissos. A história familiar pode explicar a familiaridade com o clube; não decide quem agirá com responsabilidade nessa função.',
 explanation:'Compare ações e razões sem apagar as histórias das pessoas. Respeitar uma tradição e avaliar uma decisão específica podem coexistir. O mesmo critério deve valer para quem vem de fora e para um membro antigo.',
 activity:'Invente uma decisão sobre a participação num projeto comunitário. Liste duas capacidades individuais relevantes e um estereótipo de grupo irrelevante. Substitua o estereótipo por uma pergunta que a pessoa possa responder. Explique como isso muda a decisão.',
 checks:[['Devemos ignorar a origem de alguém?','Não. A origem pode fornecer contexto, mas não deve substituir a atenção ao indivíduo e à decisão concreta.'],['É possível aprender com uma pergunta ética e criticar sua formulação?','Sim. Identifique o ponto que mantém e a afirmação que questiona, apresentando razões para ambos.'],['O que há de injusto em aplicar critérios diferentes a membros e pessoas de fora?','A mesma evidência recebe valores diferentes por causa do pertencimento, e não por sua relevância para a tarefa.']],
 takeaway:'Observe a conduta individual e examine as categorias usadas para julgá-la.',terms:'Estereótipo: expectativa generalizada imposta a um indivíduo. Critério: base explícita para formular um juízo.',reading:'Palestra 6, 20 de setembro de 1909: lei, profecia e o apelo de João à conduta; examine também a hierarquia cultural.'}},
{id:7,lecture:7,bridge:'lessons/06.html',
 en:{title:'Jesus and Christ: read the stages carefully',goal:'Follow a chronology without collapsing its distinct figures.',
 key:'Steiner places Zarathustra’s preparation of the Nathan Jesus before the baptism at thirty, when Christ enters and Zarathustra departs. Christ is a cosmic being in this account. The baptism marks a change, not simply another name for the same role.',
 context:'These distinctions belong to Steiner’s Christology. This course does not present them as definitions accepted by all Christian traditions. The lecture’s descriptions of ether and cosmic beings should also be read within that framework, not as physical science.',
 example:'An account of a theatre production mentions its founder, the person preparing the performance and the performer who later takes the stage. If you replace all three names with “the artist,” the account becomes easy to read but inaccurate. Important relationships disappear.',
 explanation:'The example concerns accurate reading only. Spiritual incarnation is not a theatre role. In a complex text, a helpful first step is to restore names, dates and verbs wherever an ambiguous pronoun makes the sequence hard to follow.',
 activity:'Make a timeline from the assigned lecture with three entries: before twelve, twelve to thirty, and the baptism. Identify the subject of each statement. Mark the whole timeline as Steiner’s account and list one question that would need a different kind of source.',
 checks:[['When is simplifying a text misleading?','When it removes a distinction needed to understand what the author is actually claiming.'],['What does chronology establish on its own?','The order an account gives to events. It does not independently establish that the events occurred.'],['Can a role analogy explain incarnation?','No. It can illustrate a reading error, but should not be treated as a model of the spiritual claim.']],
 takeaway:'Keep names, roles and stages distinct before interpreting the whole.',terms:'Christology: an account of the nature and significance of Christ. Chronology: the sequence assigned to events.',reading:'Lecture 7, 21 September 1909: preparation, baptism and the nature of the Christ being.'},
 pt:{title:'Jesus e Cristo: leia as etapas com atenção',goal:'Acompanhe uma cronologia sem fundir suas figuras distintas.',
 key:'Steiner situa a preparação do Jesus natânico por Zaratustra antes do batismo aos trinta anos, quando Cristo entra e Zaratustra se retira. Nessa explicação, Cristo é um ser cósmico. O batismo marca uma mudança, não apenas outro nome para a mesma função.',
 context:'Essas distinções pertencem à cristologia de Steiner. O curso não as apresenta como definições aceitas por todas as tradições cristãs. As descrições do éter e de seres cósmicos também devem ser lidas nesse quadro, não como ciência física.',
 example:'Um relato sobre uma produção teatral menciona sua fundadora, a pessoa que prepara a apresentação e a artista que depois entra em cena. Se você substituir os três nomes por “a artista”, o relato ficará fácil de ler, mas impreciso. Relações importantes desaparecerão.',
 explanation:'O exemplo trata apenas da leitura precisa. A encarnação espiritual não é um papel teatral. Num texto complexo, um primeiro passo útil é restaurar nomes, datas e verbos onde um pronome ambíguo dificulta acompanhar a sequência.',
 activity:'Faça uma linha do tempo da palestra com três entradas: antes dos doze, dos doze aos trinta e o batismo. Identifique o sujeito de cada afirmação. Marque a linha inteira como relato de Steiner e liste uma pergunta que exigiria outro tipo de fonte.',
 checks:[['Quando simplificar um texto se torna enganoso?','Quando a simplificação remove uma distinção necessária para compreender o que o autor afirma.'],['O que a cronologia estabelece por si só?','A ordem que um relato atribui aos acontecimentos. Não estabelece de forma independente que eles ocorreram.'],['Uma analogia de funções pode explicar a encarnação?','Não. Pode ilustrar um erro de leitura, mas não deve ser tratada como modelo da afirmação espiritual.']],
 takeaway:'Distinga nomes, funções e etapas antes de interpretar o conjunto.',terms:'Cristologia: explicação da natureza e do significado de Cristo. Cronologia: sequência atribuída aos acontecimentos.',reading:'Palestra 7, 21 de setembro de 1909: preparação, batismo e natureza do ser crístico.'}},
{id:8,lecture:8,bridge:'higher-worlds/lessons/08.html',
 en:{title:'Read healing narratives without turning them into a diagnosis',goal:'Distinguish spiritual interpretation from evidence about illness.',
 key:'Steiner interprets Luke’s healings through an evolving relationship between Ego, soul and body. He also reads the sower as an image of receiving spiritual understanding. His historical and healing claims extend beyond what a practical lesson in attentive reading can establish.',
 context:'The course does not adopt illness as evidence of moral failure or insufficient faith. Nor does a difficult reaction to a teaching establish that the teaching is beneficial. Keep claims about healing separate from our exercise in how to receive feedback.',
 example:'Two learners hear the same explanation. One can connect it with an example; the other needs a definition. Repeating the explanation more forcefully does not answer the second learner’s question. Asking where the difficulty begins gives the teacher something useful to revise.',
 explanation:'Being receptive does not mean agreeing with everything. A reader may understand a claim and still reject it for good reasons. A good study environment makes room for clarification, criticism and a slower pace without ranking learners by their willingness to assent.',
 activity:'Recall an ordinary learning difficulty, avoiding private health information. Write what was unclear, what explanation helped and what remained unresolved. Compare “I need a clearer explanation” with “I must believe more strongly.” Which produces a question someone can actually address?',
 checks:[['Does disagreement show that a learner is unreceptive?','No. Consider whether the learner understood the point and gave reasons. Assent is not the measure of comprehension.'],['Does feeling better after a conversation prove a medical claim?','No. The experience and the claimed explanation are separate matters.'],['What can the teacher revise in the example?','The definition, illustration or pace, guided by the learner’s specific question.']],
 takeaway:'Receive ideas attentively and assess their claims separately.',terms:'Receptivity: willingness to attend and consider. Evidence: support relevant to the particular claim being evaluated.',reading:'Lecture 8, 24 September 1909: evolution of consciousness, the sower and the three kinds of healing described.'},
 pt:{title:'Leia os relatos de cura sem transformá-los em diagnóstico',goal:'Distinga interpretação espiritual de evidência sobre doenças.',
 key:'Steiner interpreta as curas em Lucas por uma relação em evolução entre Eu, alma e corpo. Também lê o semeador como imagem da recepção do conhecimento espiritual. Suas afirmações históricas e de cura ultrapassam o que uma atividade de leitura atenta pode estabelecer.',
 context:'O curso não adota a doença como evidência de falha moral ou fé insuficiente. Uma reação difícil a um ensinamento tampouco comprova que ele seja benéfico. Separe as afirmações sobre cura de nosso exercício sobre como receber comentários.',
 example:'Duas pessoas ouvem a mesma explicação. Uma consegue relacioná-la com um exemplo; a outra precisa de uma definição. Repetir a explicação com mais insistência não responde à pergunta da segunda pessoa. Perguntar onde começa a dificuldade oferece ao professor algo útil para revisar.',
 explanation:'Ser receptivo não significa concordar com tudo. Um leitor pode compreender uma afirmação e rejeitá-la por boas razões. Um bom ambiente de estudo abre espaço para esclarecimento, crítica e um ritmo mais lento, sem classificar estudantes pela disposição de concordar.',
 activity:'Lembre uma dificuldade cotidiana de aprendizagem, sem usar informações privadas de saúde. Escreva o que estava pouco claro, qual explicação ajudou e o que permaneceu em aberto. Compare “Preciso de uma explicação mais clara” com “Preciso acreditar com mais força”. Qual produz uma pergunta que alguém pode responder?',
 checks:[['Discordar mostra falta de receptividade?','Não. Considere se a pessoa compreendeu a ideia e apresentou razões. Concordância não mede compreensão.'],['Sentir-se melhor depois de uma conversa comprova uma afirmação médica?','Não. A experiência e a explicação alegada são questões distintas.'],['O que o professor pode revisar no exemplo?','A definição, a ilustração ou o ritmo, orientado pela pergunta específica do estudante.']],
 takeaway:'Receba as ideias com atenção e avalie suas afirmações separadamente.',terms:'Receptividade: disposição para prestar atenção e considerar. Evidência: apoio relevante à afirmação específica em avaliação.',reading:'Palestra 8, 24 de setembro de 1909: evolução da consciência, o semeador e os três tipos de cura descritos.'}},
{id:9,lecture:9,bridge:'philosophy-of-freedom/lessons/12.html',
 en:{title:'Love that reaches beyond self-interest',goal:'Examine the difference between knowing an ideal and acting from it.',
 key:'Steiner distinguishes Buddha’s teaching of love from Christ’s gift of love as an active power. He describes faith as the Ego’s capacity to reach beyond itself. This is his theological distinction, not a claim that non-Christians lack compassion.',
 context:'The lecture argues strongly for anthroposophical interpretation. A reader can examine that argument without adopting its exclusive claims. In the exercise, evaluate the action and its motive without assigning spiritual status to the person.',
 example:'A student shares notes with a classmate. She might want praise, expect a favour or simply want the classmate to catch up. The visible action can look the same. To understand it ethically, we need to ask about the reason, the classmate’s needs and the effects.',
 explanation:'An action can have mixed motives. Recognizing this need not lead to suspicion of every generous deed. It gives us a more honest question: which reason do I endorse, and how can I make the help useful without demanding gratitude?',
 activity:'Write an invented act of generosity and three possible motives. Choose the motive you would endorse and explain why. Then name a boundary that keeps the help realistic, such as the time available or a request for permission.',
 checks:[['Can we read a person’s motive directly from the action?','Not with certainty. The outward description may fit different reasons.'],['Does generosity require unlimited availability?','No. A workable offer can be generous while respecting the people involved and their other commitments.'],['Why examine mixed motives?','So that you can clarify the reason you stand behind and improve the action, rather than merely give yourself a flattering label.']],
 takeaway:'Ask how a valued idea becomes useful to another person.',terms:'Motive: a reason moving someone to act. Reciprocity: an exchange in which something is expected in return.',reading:'Lecture 9, 25 September 1909: teaching and living power; faith, generosity and the overflowing heart.'},
 pt:{title:'O amor que ultrapassa o interesse próprio',goal:'Examine a diferença entre conhecer um ideal e agir a partir dele.',
 key:'Steiner distingue o ensinamento do amor por Buda da dádiva de Cristo do amor como força ativa. Descreve a fé como capacidade do Eu de ultrapassar a si mesmo. Essa é sua distinção teológica, não a afirmação de que pessoas não cristãs careçam de compaixão.',
 context:'A palestra argumenta enfaticamente a favor da interpretação antroposófica. Um leitor pode examinar esse argumento sem adotar suas pretensões de exclusividade. Na atividade, avalie a ação e seu motivo sem atribuir uma condição espiritual à pessoa.',
 example:'Uma estudante compartilha anotações com uma colega. Pode desejar elogios, esperar um favor ou simplesmente querer que a colega acompanhe a matéria. A ação visível pode ser igual. Para compreendê-la eticamente, precisamos perguntar pela razão, pelas necessidades da colega e pelos efeitos.',
 explanation:'Uma ação pode ter motivos mistos. Reconhecer isso não precisa levar à suspeita de todo gesto generoso. Oferece uma pergunta mais honesta: qual razão assumo e como posso tornar a ajuda útil sem exigir gratidão?',
 activity:'Escreva um ato de generosidade inventado e três motivos possíveis. Escolha o motivo que assumiria e explique por quê. Depois, indique um limite que torne a ajuda viável, como o tempo disponível ou um pedido de permissão.',
 checks:[['Podemos conhecer o motivo diretamente pela ação?','Não com certeza. A descrição exterior pode corresponder a razões diferentes.'],['A generosidade exige disponibilidade ilimitada?','Não. Uma oferta viável pode ser generosa e respeitar as pessoas envolvidas e seus outros compromissos.'],['Por que examinar motivos mistos?','Para esclarecer a razão que você assume e melhorar a ação, em vez de apenas atribuir a si mesmo um rótulo favorável.']],
 takeaway:'Pergunte como uma ideia valorizada se torna útil para outra pessoa.',terms:'Motivo: razão que move alguém a agir. Reciprocidade: troca em que se espera algo em retorno.',reading:'Palestra 9, 25 de setembro de 1909: ensinamento e força viva; fé, generosidade e o coração que transborda.'}},
{id:10,lecture:10,bridge:'higher-worlds/lessons/06.html',
 en:{title:'Golgotha and a hope that changes conduct',goal:'Follow the lecture’s conclusion and distinguish forgiveness from excusing harm.',
 key:'Steiner interprets Golgotha as initiation entering public world history. He reads the raising at Nain as preparation for a later spiritual mission and ends with faith, love and hope. These are the lecture’s spiritual interpretations of the Gospel narratives.',
 context:'Study what the conclusion means within the argument; it does not require reenacting any initiation or altered bodily state. For our everyday application, forgiveness must not be used to silence someone harmed or to demand renewed trust.',
 example:'A friend damages something you lent him. You decide not to humiliate him, ask for a repair and pause further lending. You can care about his future while taking the damage seriously. Reconciliation, if it happens, will also involve his response and rebuilt trust.',
 explanation:'The example is a limited ethical exploration, not an equivalent of Golgotha. It helps us ask what hope changes in the next action. Hope can make room for improvement without pretending the past did not happen or guaranteeing a happy outcome.',
 activity:'Use a mild fictional disagreement. Write a response containing acknowledgment of the harm, a realistic request and an opening for improvement. Keep the person harmed free to choose distance. Then identify which part of your response expresses hope.',
 checks:[['Does forgiveness erase responsibility?','It need not. A response can avoid humiliation while asking for repair and maintaining boundaries.'],['Is hope a prediction that everything will turn out well?','No. It can guide a constructive next step while the outcome remains uncertain.'],['What is the limit of the everyday example?','It explores a small ethical distinction; it neither explains the whole religious event nor demonstrates the lecture’s spiritual interpretation.']],
 takeaway:'Let hope inform a responsible next step without denying what happened.',terms:'Initiation: entry into spiritual knowledge in the lecture’s account. Reconciliation: rebuilding a relationship, requiring more than one person’s intention.',reading:'Lecture 10, 26 September 1909: Nain, initiation and the concluding interpretation of Golgotha.'},
 pt:{title:'Gólgota e uma esperança que transforma a conduta',goal:'Acompanhe a conclusão da palestra e distinga perdão de desculpar o dano.',
 key:'Steiner interpreta o Gólgota como iniciação que entra na história pública da humanidade. Lê o despertar do jovem de Naim como preparação para uma missão espiritual posterior e conclui com fé, amor e esperança. Essas são interpretações espirituais da palestra sobre as narrativas evangélicas.',
 context:'Estude o sentido da conclusão dentro do argumento; isso não exige reproduzir qualquer iniciação ou estado corporal alterado. Em nossa aplicação cotidiana, o perdão não deve servir para silenciar quem sofreu um dano nem para exigir a renovação da confiança.',
 example:'Um amigo danifica algo que você lhe emprestou. Você decide não humilhá-lo, pede um reparo e suspende novos empréstimos. Pode se importar com o futuro dele e levar o dano a sério. A reconciliação, se acontecer, envolverá também a resposta dele e a reconstrução da confiança.',
 explanation:'O exemplo é uma exploração ética limitada, não um equivalente do Gólgota. Ajuda a perguntar o que a esperança muda na próxima ação. Ela pode abrir espaço para a melhora sem fingir que o passado não aconteceu nem garantir um resultado feliz.',
 activity:'Use uma divergência fictícia leve. Escreva uma resposta que reconheça o dano, formule um pedido viável e abra espaço para melhora. Preserve a liberdade de quem sofreu o dano para escolher distância. Depois, identifique qual parte expressa esperança.',
 checks:[['O perdão apaga a responsabilidade?','Não precisa apagá-la. Uma resposta pode evitar a humilhação e, ao mesmo tempo, pedir reparação e manter limites.'],['A esperança é uma previsão de que tudo dará certo?','Não. Pode orientar um próximo passo construtivo mesmo com o resultado incerto.'],['Qual é o limite do exemplo cotidiano?','Ele explora uma pequena distinção ética; não explica o acontecimento religioso inteiro nem demonstra a interpretação espiritual da palestra.']],
 takeaway:'Deixe a esperança orientar um próximo passo responsável, sem negar o ocorrido.',terms:'Iniciação: entrada no conhecimento espiritual na explicação da palestra. Reconciliação: reconstrução de uma relação, exigindo mais que a intenção de uma pessoa.',reading:'Palestra 10, 26 de setembro de 1909: Naim, iniciação e a interpretação final do Gólgota.'}},
{
  "id": 11,
  "lecture": null,
  "bridge": "philosophy-of-freedom/lessons/16.html",
  "en": {
    "title": "Your synthesis: trace an argument and apply one idea",
    "goal": "Show what you understand from the sources you actually read, then propose a concrete application.",
    "key": "A synthesis should reconstruct an argument, not only report a moving passage. Identify its question, premises, distinctions and conclusion. Then make a separate assessment and practical proposal. This final activity is original course work; it is not an additional lecture by Steiner.",
    "context": "With the present upload, begin with an excerpt portfolio on McDermott’s introduction and the supplied Lecture 1 text. Label its coverage explicitly. A portfolio on the ten-lecture sequence requires the missing source material or complete parallel readings. The retained concluding passage above comes from its separately credited German source; it is a preview beyond the supplied excerpt.",
    "example": "A group plans to “welcome everyone” but holds its meetings at a time one member cannot attend. A learner proposes asking about availability and trying a different time for two meetings. The proposal gives the ideal a concrete form and includes a way to evaluate it.",
    "explanation": "Write a short account another learner could inspect: the situation, your reason, the proposed action, the people to consult and the result to review. Explain which reading prompted the question without claiming that the reading proves your proposed solution.",
    "activity": "Make an excerpt portfolio: explain McDermott’s reading stance with one capture reference; reconstruct Steiner’s supplied argument with two further references; define one technical distinction; record one unresolved question; and propose one feasible application with a condition for revision. When you have read the full source, extend the portfolio with an outline of all ten lectures and three dated references explaining how an opening claim, a middle stage and the conclusion connect. Keep every reference tied to its actual edition.",
    "checks": [
      [
        "What shows that the portfolio understands the text?",
        "It reconstructs the author’s question and the relations between premises, distinctions and conclusion, supported by identifiable passages. A useful everyday action alone does not demonstrate that understanding."
      ],
      [
        "How should you describe a portfolio based only on the upload?",
        "As a selective study of McDermott’s introduction and the supplied Lecture 1 text, using PDF captures 5–21. State what is missing. Extend its scope only after reading the additional sources."
      ],
      [
        "What should you review after trying your practical proposal?",
        "Compare the result with the purpose and listen to the people affected. Decide whether to continue, revise or stop. Keep this practical evaluation separate from establishing the lecture’s spiritual claims."
      ]
    ],
    "takeaway": "Make the scope of your reading and the connections in the argument visible.",
    "terms": "Synthesis: an organized account connecting what you have learned. Review: checking a result against the purpose and revising accordingly.",
    "reading": "For the excerpt portfolio: McDermott, PDF captures 5–13, and Steiner, Lecture 1 supplied text, captures 14–21. For the complete portfolio: all ten lectures, aligned by date and edition."
  },
  "pt": {
    "title": "Sua síntese: acompanhe um argumento e aplique uma ideia",
    "goal": "Mostre o que compreende das fontes que realmente leu e proponha uma aplicação concreta.",
    "key": "Uma síntese deve reconstruir um argumento, além de comentar uma passagem comovente. Identifique a pergunta, as premissas, as distinções e a conclusão. Depois apresente separadamente sua avaliação e proposta prática. Esta atividade final é um trabalho original do curso; não é uma palestra adicional de Steiner.",
    "context": "Com o arquivo atual, comece por um portfólio sobre a introdução de McDermott e o texto fornecido da palestra 1. Indique expressamente sua cobertura. Um portfólio sobre a sequência de dez palestras exige o material ausente ou as leituras paralelas completas. O trecho final mantido acima vem de sua fonte alemã indicada separadamente; antecipa conteúdo além do excerto fornecido.",
    "example": "Um grupo pretende “acolher todos”, mas realiza reuniões num horário em que uma pessoa não pode participar. Uma estudante propõe perguntar pela disponibilidade e experimentar outro horário em duas reuniões. A proposta dá forma concreta ao ideal e inclui uma maneira de avaliá-la.",
    "explanation": "Escreva um relato curto que outro estudante possa examinar: situação, razão, ação proposta, pessoas a consultar e resultado a rever. Explique qual leitura motivou a pergunta, sem afirmar que ela comprova a solução proposta.",
    "activity": "Faça um portfólio do excerto: explique a disposição de leitura proposta por McDermott com uma referência de captura; reconstrua o argumento de Steiner no texto fornecido com mais duas referências; defina uma distinção técnica; registre uma pergunta em aberto; e proponha uma aplicação viável com uma condição para revisão. Depois de ler a fonte completa, amplie o portfólio com um esboço das dez palestras e três referências datadas que expliquem a ligação entre uma afirmação inicial, uma etapa intermediária e a conclusão. Vincule cada referência à edição realmente consultada.",
    "checks": [
      [
        "O que demonstra compreensão do texto no portfólio?",
        "A reconstrução da pergunta do autor e das relações entre premissas, distinções e conclusão, apoiada em passagens identificáveis. Uma ação cotidiana útil, por si só, não demonstra essa compreensão."
      ],
      [
        "Como descrever um portfólio baseado somente no arquivo fornecido?",
        "Como estudo seletivo da introdução de McDermott e do texto fornecido da palestra 1, usando as capturas 5–21 do PDF. Indique o material ausente. Amplie a cobertura somente depois de ler as fontes adicionais."
      ],
      [
        "O que revisar depois de experimentar sua proposta prática?",
        "Compare o resultado com a finalidade e ouça as pessoas afetadas. Decida se deve continuar, revisar ou encerrar. Separe essa avaliação prática da comprovação das afirmações espirituais da palestra."
      ]
    ],
    "takeaway": "Torne visíveis a cobertura de sua leitura e as ligações do argumento.",
    "terms": "Síntese: apresentação organizada que relaciona o aprendido. Revisão: exame do resultado em relação ao propósito e ajuste correspondente.",
    "reading": "Para o portfólio do excerto: McDermott, capturas 5–13 do PDF, e Steiner, texto fornecido da palestra 1, capturas 14–21. Para o portfólio completo: as dez palestras, identificadas pela data e edição."
  }
}
];

// One check per lecture tests the source distinction; the others test application.
const sourceChecks={
 3:{en:['Does accepting the ethical discussion establish the spiritual narrative?','No. The two require separate assessment.'],pt:['Aceitar a discussão ética comprova a narrativa espiritual?','Não. As duas exigem avaliações separadas.']},
 4:{en:['Whose explanation is the two-child account?','Steiner’s. Do not attribute it directly to the Gospel writers.'],pt:['De quem é a explicação dos dois meninos?','De Steiner. Não a atribua diretamente aos evangelistas.']},
 5:{en:['Why not replace every relationship with “is the same as”?','That would erase the distinctions the account depends on.'],pt:['Por que não substituir toda relação por “é o mesmo que”?','Isso apagaria as distinções das quais a explicação depende.']},
 6:{en:['What needs critical attention in this lecture’s cultural account?','Its hierarchy of maturity, not merely its vocabulary.'],pt:['O que exige atenção crítica na explicação cultural da palestra?','Sua hierarquia de maturidade, não apenas seu vocabulário.']},
 7:{en:['What marks the change at thirty in this account?','The baptism; it is a distinct stage in Steiner’s chronology.'],pt:['O que marca a mudança aos trinta nessa explicação?','O batismo; é uma etapa distinta na cronologia de Steiner.']},
 8:{en:['Does the lecture supply a diagnosis for a learner?','No. Its spiritual interpretation is not an assessment of your health.'],pt:['A palestra fornece um diagnóstico para o estudante?','Não. Sua interpretação espiritual não é uma avaliação da sua saúde.']},
 9:{en:['What distinction organizes the lecture’s comparison?','Teaching an ideal and giving it active power. Attribute the comparison to Steiner.'],pt:['Que distinção organiza a comparação da palestra?','Ensinar um ideal e dar-lhe força ativa. Atribua a comparação a Steiner.']},
 10:{en:['How does Steiner interpret Golgotha here?','As initiation entering world history. This identifies his interpretation, not its proof.'],pt:['Como Steiner interpreta o Gólgota aqui?','Como iniciação que entra na história da humanidade. Isso identifica sua interpretação, não sua prova.']}
};
for(const lesson of lukeLessons)if(sourceChecks[lesson.id])for(const lang of ['en','pt'])lesson[lang].checks[0]=sourceChecks[lesson.id][lang];
