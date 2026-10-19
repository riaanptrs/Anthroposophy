// Original teaching based on the supplied 1998 Braatz translation.
// Source books stay private. Capture numbers identify the supplied 119-page PDF.
export const title = {en:'Bees in the View of Rudolf Steiner',pt:'As abelhas na visão de Rudolf Steiner'};
export const lessons=[];
function add(section,start,end,en,pt){
 const unpack=v=>{const [title,goal,teaching,example,question,options,feedback,exercise,context]=v;return {title,goal,teaching:teaching.split('\n\n'),example,check:{question,options:options.split('|'),answer:0,feedback:feedback.split('|')},exercise,context};};
 lessons.push({id:lessons.length+1,section,start,end,en:unpack(en),pt:unpack(pt)});
}
add('orientation',3,6,[
'Reading the hive as a living whole','Recognize the book’s voices and learn how to study its claims.',
'These talks began with questions from workers at the Goetheanum in Dornach. The experienced beekeeper Müller brings practical observations; Steiner interprets them through anthroposophy. Their disagreements belong to the argument. Read each exchange by asking what was observed, what explanation was proposed, and whether the observation settles that explanation.\n\nThe volume contains nine lecture contributions: a February prelude from GA 348 and eight November–December lectures from GA 351. Gunther Hauk’s 1998 introduction urges renewed responsibility toward bees. It interprets later bee losses through Steiner’s warnings; it is a later author’s assessment, rather than a statement made in 1923.',
'A beekeeper reports fewer colonies after a change in management. The decline is an observation; identifying its cause requires comparing food, disease, weather and management.',
'Who makes the retrospective assessment in the introduction?',
'Gunther Hauk in 1998|Steiner speaking in 1923|Müller describing a controlled trial',
'Yes. Hauk frames the historical lectures from a later perspective.|The main lectures date from 1923; the introduction is later.|Müller contributes experience and questions, not this introduction.',
'Draw three notebook columns: observation, Steiner’s interpretation, and my question. Use them throughout the course.',
'Understanding a spiritual explanation does not require accepting it. The course’s examples and exercises are original teaching adaptations.'
],[
'Ler a colmeia como um todo vivo','Reconheça as vozes do livro e aprenda a estudar suas afirmações.',
'Estas conversas nasceram de perguntas dos trabalhadores do Goetheanum em Dornach. O apicultor experiente Müller apresenta observações práticas; Steiner as interpreta pela antroposofia. As divergências fazem parte do argumento. Em cada troca, pergunte o que foi observado, qual explicação foi proposta e se a observação decide essa explicação.\n\nO volume reúne nove contribuições: um prelúdio de fevereiro da GA 348 e oito palestras de novembro e dezembro da GA 351. A introdução de Gunther Hauk, de 1998, pede responsabilidade renovada pelas abelhas. Ela interpreta perdas posteriores à luz dos alertas de Steiner; trata-se da avaliação de um autor posterior.',
'Um apicultor relata menos colônias após uma mudança de manejo. O declínio é uma observação; identificar a causa exige comparar alimento, doença, clima e manejo.',
'Quem faz a avaliação retrospectiva na introdução?',
'Gunther Hauk em 1998|Steiner falando em 1923|Müller descrevendo um ensaio controlado',
'Sim. Hauk apresenta as palestras históricas de uma perspectiva posterior.|As palestras principais são de 1923; a introdução é posterior.|Müller oferece experiências e perguntas, mas não escreveu esta introdução.',
'Crie três colunas no caderno: observação, interpretação de Steiner e minha pergunta. Use-as ao longo do curso.',
'Compreender uma explicação espiritual não exige aceitá-la. Os exemplos e exercícios do curso são adaptações didáticas originais.'
]);
add('prelude',7,9,[
'Love and cooperation in the colony','Explain why Steiner places the colony’s shared life at the center.',
'In the prelude of 3 February 1923, Steiner describes the hive as an atmosphere of love. He connects the concentration of reproduction in the queen with the workers’ shared activity: what is restricted in individual reproduction becomes, in his account, a force of cooperation throughout the colony. Love here names a proposed soul quality of the whole.\n\nHe extends the relationship outward. The flower’s reproductive region nourishes the bee; the bee carries its product into the hive; honey then connects the human being with this wider life. Venus supplies his spiritual correspondence. This is a continuous picture of flower, colony and human being, rather than a sequence of isolated products.',
'Watch bees visiting one flowering shrub. Describe the visits first. Then explain how Steiner would place that activity within a relationship of flower, hive and human life.',
'What does love chiefly describe in this prelude?',
'The shared soul quality Steiner attributes to the colony|A conscious ethical promise made by every worker|A measurement of the honey’s sugar content',
'Yes. Love characterizes the whole colony in his spiritual account.|His personification illustrates a claim; it does not establish conscious promises.|Sugar content is a chemical measurement, not his meaning of love.',
'Write two sentences describing cooperation without giving the bees human motives. Add one sentence beginning “Steiner interprets this as…”',
'Workers’ limited reproduction is a biological subject; a Venus influence and the transformation of sexuality into love are anthroposophical interpretations.'
],[
'Amor e cooperação na colônia','Explique por que Steiner coloca a vida compartilhada da colônia no centro.',
'No prelúdio de 3 de fevereiro de 1923, Steiner descreve a colmeia como uma atmosfera de amor. Relaciona a concentração da reprodução na rainha à atividade conjunta das operárias: o que se restringe na reprodução individual torna-se, segundo ele, força de cooperação na colônia. Amor designa aqui uma qualidade anímica atribuída ao todo.\n\nEle amplia essa relação. A região reprodutiva da flor nutre a abelha; a abelha leva seu produto à colmeia; o mel conecta o ser humano a essa vida mais ampla. Vênus oferece sua correspondência espiritual. Forma-se uma imagem contínua de flor, colônia e ser humano.',
'Observe abelhas visitando um arbusto florido. Descreva primeiro as visitas. Depois explique como Steiner situaria a atividade na relação entre flor, colmeia e vida humana.',
'O que amor descreve principalmente neste prelúdio?',
'A qualidade anímica compartilhada que Steiner atribui à colônia|Uma promessa ética consciente de cada operária|Uma medida do teor de açúcar do mel',
'Sim. Amor caracteriza a colônia inteira em seu relato espiritual.|A personificação ilustra uma afirmação; não demonstra promessas conscientes.|Teor de açúcar é uma medida química, não seu sentido de amor.',
'Escreva duas frases sobre cooperação sem atribuir motivos humanos às abelhas. Acrescente uma começando por “Steiner interpreta isso como…”',
'A reprodução limitada das operárias é assunto biológico; a influência de Vênus e a transformação da sexualidade em amor são interpretações antroposóficas.'
]);
add('lecture-1',9,12,[
'Wax cells and the formative environment','Distinguish the comb’s observable form from Steiner’s explanation of its formative power.',
'Lecture One, 26 November, begins with what bees gather and build. Nectar supplies material for honey; pollen has another role in nourishment; wax is produced through the bee’s bodily activity. The colony builds a dwelling that also contains its young and stores. Comb is part of the colony’s life, rather than merely packaging for a crop.\n\nSteiner accepts efficient use of space as one explanation of the hexagonal cell, then adds another: the cell’s form impresses formative forces into the developing larva, which later builds similar cells. The step from a visible shape to an invisible organizing force is the crucial move in his reasoning. Rounded queen cells give him a contrasting form.',
'Draw adjoining hexagons and a rounded queen cell. The contrast of shapes is visible; the claim that a larva internalizes geometry requires a further explanation.',
'Where does Steiner go beyond describing cell geometry?',
'When he says the larva takes in the cell’s formative forces|When he calls the cell six-sided|When he distinguishes a queen cell from a worker cell',
'Yes. He introduces a causal claim about formative forces.|Six-sidedness describes the observed shape.|Different cell forms can be described without accepting his causal theory.',
'Label your drawing with two colors: observable structure and proposed formative influence. Do not use color as evidence for the influence.',
'The course retains Steiner’s formative-force account as his interpretation; geometric resemblance alone cannot establish a biological mechanism.'
],[
'Células de cera e ambiente formador','Distinga a forma observável do favo da explicação de Steiner sobre sua força formadora.',
'A primeira palestra, de 26 de novembro, começa com o que as abelhas recolhem e constroem. O néctar fornece material para o mel; o pólen tem outra função nutritiva; a cera surge da atividade corporal da abelha. A colônia constrói uma morada que abriga crias e reservas. O favo integra sua vida.\n\nSteiner aceita o uso eficiente do espaço como explicação da célula hexagonal, mas acrescenta outra: a forma imprime forças formadoras na larva, que mais tarde constrói células semelhantes. A passagem da forma visível à força organizadora invisível é o movimento decisivo do argumento. As células arredondadas das rainhas oferecem um contraste.',
'Desenhe hexágonos unidos e uma célula arredondada de rainha. O contraste das formas é visível; afirmar que a larva interioriza a geometria exige uma explicação adicional.',
'Quando Steiner vai além da descrição da geometria?',
'Quando diz que a larva recebe as forças formadoras da célula|Quando chama a célula de hexagonal|Quando distingue a célula da rainha da célula da operária',
'Sim. Ele introduz uma afirmação causal sobre forças formadoras.|Ter seis lados descreve a forma observada.|É possível distinguir formas sem aceitar sua teoria causal.',
'Marque o desenho com duas cores: estrutura observável e influência formadora proposta. A cor não constitui evidência da influência.',
'O curso mantém a interpretação de Steiner; semelhança geométrica, por si só, não estabelece um mecanismo biológico.'
]);
add('lecture-1',11,14,[
'Queen workers and drones in cosmic time','Follow Steiner’s proposed connection between development time and Sun and Earth.',
'Steiner compares the queen’s approximately sixteen days of development, the worker’s twenty-one and the drone’s longer development. In his interpretation, a queen remains closest to solar forces; a worker completes a solar formative cycle; a drone comes more under earthly influence. Time is treated as a quality of becoming, not simply a duration.\n\nHe connects these differences with reproduction and the mating flight. Fertilized eggs can become females and unfertilized eggs males, but he explains that relationship through the polarity of Sun and Earth. The same polarity is then used to describe the bees’ affinity with the queen and their response to a new queen.',
'A timeline of 16, 21 and about 24 days summarizes developmental intervals. Adding “solar” and “earthly” creates a second, interpretive layer.',
'What is the status of the solar labels on this timeline?',
'They are Steiner’s interpretation of developmental differences|They are another name for measured days|They prove that diet has no role in caste development',
'Yes. Timing and cosmic interpretation must be read separately.|A duration does not itself establish a solar cause.|Steiner himself discusses special larval feeding later in the volume.',
'Make a two-row timeline: approximate development times above, Steiner’s proposed meanings below. Explain the difference to another learner.',
'These are egg-to-adult intervals, not ages of sexual maturity. Solar rotation varies with latitude; Steiner’s twenty-one-day correspondence is not an established astronomical or developmental explanation.'
],[
'Rainha operárias e zangões no tempo cósmico','Acompanhe a ligação proposta por Steiner entre desenvolvimento, Sol e Terra.',
'Steiner compara os cerca de dezesseis dias de desenvolvimento da rainha, os vinte e um da operária e o período maior do zangão. Em sua interpretação, a rainha permanece mais próxima das forças solares; a operária completa um ciclo formador solar; o zangão recebe maior influência terrestre. O tempo exprime uma qualidade do devir.\n\nEle relaciona as diferenças à reprodução e ao voo nupcial. Ovos fecundados podem originar fêmeas, e não fecundados, machos; Steiner explica essa relação pela polaridade entre Sol e Terra. Usa a mesma polaridade para descrever a afinidade com a rainha e a reação a uma nova rainha.',
'Uma linha de 16, 21 e cerca de 24 dias resume intervalos de desenvolvimento. Acrescentar “solar” e “terrestre” cria uma segunda camada, interpretativa.',
'Qual é o estatuto dos rótulos solares nessa linha?',
'São a interpretação de Steiner para diferenças de desenvolvimento|São outro nome para os dias medidos|Provam que a alimentação não influencia as castas',
'Sim. É preciso distinguir duração e interpretação cósmica.|A duração não estabelece uma causa solar.|O próprio Steiner aborda depois a alimentação especial das larvas.',
'Faça uma linha com duas faixas: os tempos aproximados acima e os sentidos propostos por Steiner abaixo. Explique a diferença a outra pessoa.',
'São intervalos do ovo ao adulto, não idades de maturidade sexual. A rotação solar varia conforme a latitude; a correspondência de vinte e um dias não é uma explicação astronômica ou biológica estabelecida.'
]);
add('lecture-1',15,18,[
'The hive and the human head','Explain the organism analogy and its connection to honey and husbandry.',
'Steiner compares queen, workers and drones with different activities in the human head. Blood, nerves and formative substances supply his image of a unity whose members perform different functions. Comb becomes analogous to the body that this activity constructs. His purpose is to see the hive as an organism distributed through space.\n\nHe then connects honey with maintaining human form and beeswax with older religious reverence. The closing warning about artificial queen breeding follows the same logic: replacing a member may change relationships within the whole, with effects appearing only later. He acknowledges practical advantages and explicitly resists turning his concern into a fanatical campaign.',
'A choir remains a choir as singers change, but its relationships matter. This illustrates continuity of a whole; it does not prove that a hive has a human head.',
'What makes Steiner’s breeding warning more qualified than a blanket ban?',
'He acknowledges practical advantages and delayed uncertainty|He says every intervention immediately kills a colony|He rejects all hive boxes',
'Yes. Preserve both his concern and his qualifications.|He emphasizes effects that may appear later.|He discusses practical improvements without rejecting every modern aid.',
'Write a fair summary of the warning that includes both the proposed long-term risk and the acknowledged practical benefit.',
'The head and hive comparison is an anthroposophical analogy. The source recommends honey even before age one; current guidance is to give no honey to children younger than 12 months because of infant botulism risk. Honey is not a treatment for rickets.'
],[
'A colmeia e a cabeça humana','Explique a analogia do organismo e sua relação com mel e manejo.',
'Steiner compara rainha, operárias e zangões a diferentes atividades da cabeça humana. Sangue, nervos e substâncias formadoras compõem sua imagem de uma unidade com funções distintas. O favo corresponde ao corpo construído por essa atividade. Ele procura perceber a colmeia como organismo distribuído no espaço.\n\nDepois relaciona o mel à manutenção da forma humana e a cera à reverência religiosa antiga. O alerta final sobre a criação artificial de rainhas segue a mesma lógica: substituir um membro pode alterar relações do todo, com efeitos tardios. Ele reconhece vantagens práticas e rejeita transformar a preocupação em campanha fanática.',
'Um coro continua sendo coro quando os cantores mudam, mas suas relações importam. Isso ilustra a continuidade de um todo; não prova que a colmeia tenha cabeça humana.',
'O que torna o alerta de Steiner mais ponderado que uma proibição geral?',
'Ele reconhece vantagens práticas e incerteza sobre efeitos tardios|Ele diz que toda intervenção mata a colônia imediatamente|Ele rejeita todas as caixas de colmeia',
'Sim. Preserve a preocupação e suas ressalvas.|Ele destaca efeitos que podem aparecer depois.|Ele admite melhorias práticas sem rejeitar toda ajuda moderna.',
'Resuma o alerta incluindo o risco de longo prazo proposto e o benefício prático reconhecido.',
'A comparação entre cabeça e colmeia é uma analogia antroposófica. A fonte recomenda mel antes de um ano; a orientação atual é não oferecer mel a menores de 12 meses, pelo risco de botulismo infantil. Mel não trata raquitismo.'
]);
add('lecture-2',19,22,[
'How can we know what a bee perceives','Examine the difference between a response and an explanation of perception.',
'Lecture Two, 28 November, challenges how experiments on ultraviolet light are interpreted. Steiner uses a light-reactive chemical and a mousetrap to argue that a response to a stimulus does not, by itself, tell us what an organism experiences. He asks the audience to avoid assuming that an animal perceives exactly as a human does.\n\nHe proposes a strong role for chemical sensitivity, warmth and an intermediate sense of smell and taste. This is a positive explanation as well as a criticism. Apply the same scrutiny to both: showing a weakness in one interpretation does not establish an alternative. His dismissal of the published vision experiments must be distinguished from the enduring methodological question.',
'A bee chooses between two targets. To investigate color, a researcher must distinguish color from scent, temperature and brightness rather than treating any choice as decisive.',
'What follows from finding an uncontrolled scent difference?',
'The experiment needs better controls before its result is interpreted|Bees cannot have color vision|Steiner’s alternative explanation is therefore proven',
'Yes. A confounding factor limits the inference.|A weakness in one experiment does not settle the species’ capacities.|An alternative needs independent supporting evidence.',
'Design a paper-only comparison of two colored targets. List what you would hold constant and what result would challenge your prediction.',
'Modern research establishes honeybee color vision, including ultraviolet sensitivity. Steiner’s specific denial does not describe the present scientific understanding.'
],[
'Como saber o que uma abelha percebe','Examine a diferença entre uma resposta e uma explicação da percepção.',
'A segunda palestra, de 28 de novembro, questiona a interpretação de experimentos com luz ultravioleta. Steiner usa uma substância que reage à luz e uma ratoeira para argumentar que responder a um estímulo não revela, por si só, a experiência do organismo. Pede que não se suponha uma percepção animal igual à humana.\n\nEle propõe forte participação da sensibilidade química, do calor e de um sentido intermediário entre olfato e paladar. Trata-se também de uma explicação positiva. Examine ambas com o mesmo rigor: mostrar uma fraqueza de uma interpretação não estabelece outra. A rejeição dos experimentos de visão é distinta da pergunta metodológica.',
'Uma abelha escolhe entre dois alvos. Para investigar cor, é preciso separá-la de cheiro, temperatura e luminosidade.',
'O que decorre de encontrar uma diferença de cheiro não controlada?',
'O experimento precisa de controles melhores antes da interpretação|As abelhas não podem enxergar cores|A explicação alternativa de Steiner está provada',
'Sim. Um fator de confusão limita a inferência.|A fraqueza de um experimento não decide as capacidades da espécie.|Uma alternativa precisa de evidências independentes.',
'Planeje no papel uma comparação entre dois alvos coloridos. Liste o que manteria constante e qual resultado questionaria sua previsão.',
'A pesquisa moderna estabelece a visão de cores das abelhas, incluindo sensibilidade ultravioleta. A negação específica de Steiner não corresponde ao entendimento científico atual.'
]);
add('lecture-2',23,26,[
'Listening to the beekeeper’s objections','Follow an objection through swarming and supplementary feeding.',
'Müller reports that the first swarm can leave before the new queen emerges. Steiner maintains his luminous-queen account by extending the proposed influence to the developing queen. This exchange shows why the timing of an observation matters: the same swarm can be described accurately while its proposed cause remains disputed.\n\nA second exchange concerns feeding when winter stores are insufficient. Müller describes a sugar mixture; Steiner interprets chamomile and salt through his view of inner transformation. The question is how much work the bee must do to assimilate a substitute. The tension between preserving a colony’s own food and responding to shortage remains visible.',
'“The swarm left nine days before emergence” challenges an explanation that requires an emerged queen. Moving the proposed cause earlier creates a new claim to investigate.',
'What does the revised explanation need?',
'Evidence for the claimed influence of the developing queen|Only the fact that swarming occurred|Agreement that Müller is inexperienced',
'Yes. Revising a hypothesis does not remove its need for evidence.|The event alone cannot distinguish competing causes.|Müller brings extensive practical experience to the exchange.',
'Write the initial claim, Müller’s objection and Steiner’s reply in three sentences. Add the question the reply leaves open.',
'The sugar-and-herb discussion is historical study, not a feed recipe. Decisions about colony shortage and disease require current local beekeeping guidance.'
],[
'Ouvir as objeções do apicultor','Acompanhe uma objeção sobre enxameação e alimentação suplementar.',
'Müller relata que o primeiro enxame pode partir antes de a nova rainha emergir. Steiner mantém sua explicação da rainha luminosa, estendendo a influência proposta à rainha em desenvolvimento. A troca mostra por que a data de uma observação importa: pode haver acordo sobre o enxame e divergência sobre sua causa.\n\nOutra troca trata da alimentação quando as reservas de inverno são insuficientes. Müller descreve uma mistura de açúcar; Steiner interpreta camomila e sal por sua visão de transformação interna. Pergunta quanto trabalho a abelha realiza para assimilar um substituto. Permanece a tensão entre conservar o próprio alimento da colônia e responder à escassez.',
'“O enxame partiu nove dias antes da emergência” questiona uma explicação que exige uma rainha já emergida. Antecipar a causa proposta cria uma nova afirmação a investigar.',
'De que precisa a explicação revista?',
'De evidências da influência atribuída à rainha em desenvolvimento|Apenas do fato de a enxameação ter ocorrido|De concordância em que Müller é inexperiente',
'Sim. Rever uma hipótese não elimina a necessidade de evidências.|O evento isolado não distingue causas concorrentes.|Müller oferece ampla experiência prática.',
'Registre a afirmação inicial, a objeção de Müller e a resposta de Steiner em três frases. Acrescente a pergunta que continua aberta.',
'A discussão de açúcar e ervas é estudo histórico, não receita de alimentação. Escassez e doença exigem orientação apícola local atualizada.'
]);
add('lecture-3',27,30,[
'Milk honey and the limits of a report','Separate reported improvement from a claim about its cause.',
'Lecture Three, 1 December, opens with a report by Dr Paula Emrich on undernourished children receiving honey in milk. Steiner emphasizes age and developmental stage. He uses the report to ask whether listing a food’s analyzed ingredients can explain its action in a living body.\n\nHis criticism of the word vitamin is that a label can conceal an unanswered question. That is a useful question about explanation, but he also rejects the emerging material explanation too strongly. The report’s improvements, its historical blood measurements and his proposed formative account are three different things. Neither a successful name nor an appealing interpretation substitutes for a comparison that tests causation.',
'If a child receives better meals, rest and honey during recovery, improvement does not tell us which change caused it. A comparison must account for the other changes.',
'What can the historical report establish by itself?',
'That improvement was reported during the treatment period|That honey alone caused every improvement|That vitamins do not exist',
'Yes. The report describes outcomes; it does not isolate every cause.|Other changes and comparisons matter.|Vitamins are identifiable nutrients; criticism of a name does not refute them.',
'List three things you would ask about the children’s care before attributing recovery specifically to honey.',
'The source’s percentages must not be treated as modern blood-count units. Honey and milk are not a replacement for assessment or treatment of anemia, malnutrition or rickets.'
],[
'Leite mel e os limites de um relato','Separe melhora relatada de uma afirmação sobre sua causa.',
'A terceira palestra, de 1º de dezembro, começa com um relato da médica Paula Emrich sobre crianças desnutridas que receberam mel com leite. Steiner destaca idade e fase de desenvolvimento. Pergunta se listar os ingredientes analisados de um alimento explica sua ação num corpo vivo.\n\nSua crítica à palavra vitamina é que um rótulo pode esconder uma pergunta sem resposta. A pergunta é útil, mas ele também rejeita com força excessiva a explicação material que surgia. As melhoras relatadas, as medidas sanguíneas históricas e sua interpretação formadora são coisas distintas. Um nome ou interpretação atraente não substitui uma comparação que teste a causalidade.',
'Se uma criança recebe refeições melhores, repouso e mel durante a recuperação, a melhora não identifica qual mudança a causou.',
'O que o relato histórico pode estabelecer por si só?',
'Que houve melhora relatada durante o tratamento|Que o mel sozinho causou todas as melhoras|Que vitaminas não existem',
'Sim. O relato descreve resultados sem isolar todas as causas.|As demais mudanças e comparações importam.|Vitaminas são nutrientes identificáveis; criticar o nome não as refuta.',
'Liste três perguntas sobre os cuidados recebidos antes de atribuir a recuperação especificamente ao mel.',
'As porcentagens da fonte não devem ser tomadas como unidades modernas de hemograma. Mel e leite não substituem avaliação ou tratamento de anemia, desnutrição ou raquitismo.'
]);
add('lecture-3',31,38,[
'The hexagonal force and the beekeeper’s presence','Trace the recurring formative analogy and its extension into relationships.',
'Steiner brings quartz, wax cells, milk and honey into one account of a six-sided formative tendency. The mineral displays a solid form; living processes, he says, hold such formation back while drawing on its powers. Honey becomes a mediator between plant life and the human capacity to maintain form. This explains the place of honey within his argument.\n\nThe discussion then turns to fear, anger, familiarity and announcing a beekeeper’s death. He proposes sensitivity to bodily emanations and, in a horse example, to unexpressed thought. Finally he interprets spring rain through solar and zodiacal influences. These are extensions of his larger claim that life must be understood through relationships beyond an isolated object.',
'A beekeeper changes after a death in the family. Changes in attention, scent, handling and care are possible observations; a spiritual bond is a further proposed explanation.',
'Why does the quartz comparison matter to Steiner?',
'It supplies a recurring image of formative activity across kingdoms|It shows that honey is made of quartz|It measures the colony’s grief',
'Yes. He relates mineral form, living formation and nourishment.|He compares forces and forms, not honey’s composition with a quartz rock.|The analogy does not measure an emotional state.',
'Choose quartz, wax or honey. Explain its role in Steiner’s argument, then state one question that resemblance alone cannot answer.',
'The proposed hexagonal physiology, thought-reading explanation and zodiacal causation are not established mechanisms. Do not use the source’s silica or honey prescriptions as medical instructions.'
],[
'A força hexagonal e a presença do apicultor','Acompanhe a analogia formadora e sua extensão às relações.',
'Steiner reúne quartzo, células de cera, leite e mel em uma descrição da tendência formadora de seis lados. O mineral exibe forma sólida; os processos vivos, segundo ele, contêm essa formação enquanto utilizam suas forças. O mel medeia a vida vegetal e a capacidade humana de manter a forma. Isso explica seu lugar no argumento.\n\nA conversa passa ao medo, à raiva, à familiaridade e ao anúncio da morte do apicultor. Ele propõe sensibilidade às emanações corporais e, no exemplo do cavalo, ao pensamento não expresso. Interpreta ainda a chuva primaveril por influências solares e zodiacais. Amplia assim sua ideia de compreender a vida por relações.',
'O apicultor muda após uma morte na família. Atenção, cheiro, manejo e cuidados podem mudar; o vínculo espiritual é outra explicação proposta.',
'Por que a comparação com o quartzo importa a Steiner?',
'Oferece uma imagem recorrente da atividade formadora entre reinos|Mostra que o mel é feito de quartzo|Mede o luto da colônia',
'Sim. Ele relaciona forma mineral, formação viva e nutrição.|Ele compara forças e formas, não a composição do mel à rocha.|A analogia não mede um estado emocional.',
'Escolha quartzo, cera ou mel. Explique seu papel no argumento e formule uma pergunta que a semelhança não responde.',
'A fisiologia hexagonal, a leitura de pensamentos e a causalidade zodiacal propostas não são mecanismos estabelecidos. As prescrições de sílica e mel não são instruções médicas.'
]);
add('lecture-4',39,44,[
'The identity of a colony over time','Understand why Steiner returns to the whole when its members change.',
'Lecture Four, 5 December, asks how a colony could retain a relationship with a beekeeper when individual bees are replaced. Steiner compares it with recognizing a person after many years. He locates continuity in the organized whole, rather than in an unchanged inventory of material parts.\n\nHe then considers the colony’s response to an intruding dead mouse. Enclosing what it cannot remove becomes an example of activity that protects the whole. He uses this capacity to support his organism picture. A related warning about intensified animal production introduces a second time scale: an intervention can increase present yield while, in his account, weakening later life.',
'A garden changes its leaves and flowers but retains an organized pattern across seasons. Continuity of organization is intelligible without assuming that every original part remains.',
'What is the central reply to the replacement objection?',
'The organized whole can persist as individual members change|Every original worker survives for the beekeeper’s lifetime|No relationship can persist through change',
'Yes. This is the point of the recognition analogy.|The objection explicitly concerns replacement of bees.|Continuity through change is precisely the possibility under discussion.',
'Describe one familiar whole whose parts change. Say what makes it continuous, then identify where comparison with a colony becomes uncertain.',
'Human tissues have different turnover rates; the claim that all bodily material is replaced within seven or eight years is inaccurate. Colony continuity does not prove a spiritual memory or the proposed cause of a colony loss.'
],[
'A identidade da colônia ao longo do tempo','Compreenda por que Steiner retorna ao todo quando os membros mudam.',
'A quarta palestra, de 5 de dezembro, pergunta como a colônia conservaria uma relação com o apicultor quando as abelhas individuais são substituídas. Steiner compara isso a reconhecer alguém muitos anos depois. Situa a continuidade no todo organizado, não num inventário material imutável.\n\nDepois considera a reação a um camundongo morto que entrou na colmeia. Envolver o que não consegue remover exemplifica uma atividade protetora do todo. Usa essa capacidade para sustentar sua imagem do organismo. Um alerta sobre a produção animal intensiva introduz outra escala temporal: a intervenção pode elevar o rendimento presente e, segundo ele, enfraquecer a vida posterior.',
'Um jardim muda folhas e flores, mas conserva uma organização entre as estações. É possível compreender continuidade sem supor a permanência de cada parte.',
'Qual é a resposta central à objeção da substituição?',
'O todo organizado pode persistir enquanto seus membros mudam|Toda operária original vive tanto quanto o apicultor|Nenhuma relação persiste quando há mudança',
'Sim. Esse é o sentido da analogia do reconhecimento.|A objeção trata justamente da substituição das abelhas.|A possibilidade em discussão é a continuidade na mudança.',
'Descreva um todo conhecido cujas partes mudam. Diga o que lhe dá continuidade e onde a comparação com uma colônia se torna incerta.',
'Os tecidos humanos têm ritmos diferentes de renovação; é incorreta a afirmação de que todo material corporal muda em sete ou oito anos. Continuidade não prova memória espiritual nem a causa de uma perda de colônia.'
]);
add('lecture-4',40,48,[
'Honey prices care and the long view','Connect the economic discussion with responsibility for the colony.',
'Müller explains that hives, labor, losses and winter feeding have costs. Erbsmehl objects to treating bees chiefly as sources of profit. Steiner places their disagreement within social organization: a farmer tending bees alongside other work and a wage-earner taking unpaid time cannot calculate honey in the same way.\n\nHis long-term breeding warning belongs to this economic tension. He asks for attention to consequences that a short accounting period might miss, while acknowledging that current social conditions constrain practice. Later questions about light, honey intolerance and zodiacal sowing show the breadth of the conversation, but they do not turn every offered explanation into a demonstrated result.',
'Two jars have equal honey content, but one price includes paid labor and winter reserves while the other depends on unpaid family work. The price difference does not by itself measure greed.',
'What makes a fair comparison of honey prices?',
'Considering labor costs reserves and the conditions of production|Comparing only jar size|Assuming every higher price proves exploitation',
'Yes. The discussion asks us to see the whole economic situation.|Jar size matters, but does not capture the costs described.|A judgment about motive needs more than the price alone.',
'Create an imaginary budget including labor, equipment, losses and stores left for bees. Identify a benefit that the budget cannot express as a jar of honey.',
'The historical prediction is not proof that queen breeding caused contemporary bee losses. The source’s diagnoses of honey intolerance and proposed phosphorus or sulfur treatments are not current medical guidance.'
],[
'Preço do mel cuidado e perspectiva longa','Relacione a discussão econômica à responsabilidade pela colônia.',
'Müller explica que colmeias, trabalho, perdas e alimentação de inverno têm custos. Erbsmehl contesta tratar as abelhas principalmente como fontes de lucro. Steiner situa a divergência na organização social: um agricultor que cuida de abelhas entre outras tarefas e um assalariado que tira licença sem remuneração calculam o mel de maneiras diferentes.\n\nO alerta sobre criação de rainhas integra essa tensão econômica. Ele pede atenção às consequências que um período contábil curto pode omitir, reconhecendo as limitações sociais da prática. Perguntas sobre luz, intolerância ao mel e semeadura zodiacal mostram a amplitude da conversa, sem demonstrar automaticamente as explicações oferecidas.',
'Dois potes contêm a mesma quantidade de mel, mas um preço inclui trabalho pago e reservas de inverno, enquanto o outro depende de trabalho familiar não remunerado. A diferença não mede, sozinha, a ganância.',
'O que permite comparar preços de mel de forma justa?',
'Considerar trabalho custos reservas e condições de produção|Comparar apenas o tamanho do pote|Supor que todo preço maior prova exploração',
'Sim. A discussão pede atenção à situação econômica inteira.|O tamanho importa, mas não reúne todos os custos.|Julgar o motivo exige mais que conhecer o preço.',
'Crie um orçamento imaginário com trabalho, equipamento, perdas e reservas das abelhas. Identifique um benefício que não cabe num pote de mel.',
'A previsão histórica não prova que a criação de rainhas causou perdas atuais. Os diagnósticos de intolerância e tratamentos com fósforo ou enxofre não são orientação médica atual.'
]);
add('lecture-5',48,52,[
'Habitat forage and the quality of care','Explain Steiner’s call to compensate for what modernization changes.',
'Lecture Five, 10 December, begins with questions about eating comb and increasing disease. Steiner explicitly limits what he can say about people eating large quantities of wax without observing them. That restraint is worth comparing with his stronger claims elsewhere. On disease, he considers housing, climate and the relationship of the colony to its surroundings.\n\nHe proposes providing flowers when seasonal forage is missing. His point is to identify what a change removes and deliberately restore it, rather than simply return to old equipment. He also argues for regional adaptation and warns against short-term stimulation. His specific blood-and-digestive-juice theory supplies the explanation in the lecture; the wider husbandry question is continuity of suitable food and conditions.',
'A neat apiary has flowers for two weeks and little afterward. Counting blossoms today misses the seasonal gap. A flowering calendar changes the unit of attention from a display to sustained nourishment.',
'Which plan best expresses the compensation principle?',
'Identify a missing seasonal resource and investigate how to restore it|Assume every old hive is always healthier|Choose any plant solely because it flowers abundantly',
'Yes. First identify what has been lost or interrupted.|Steiner explicitly says he is not campaigning for old straw hives.|Season, locality and suitability matter in the argument.',
'Make a local flowering calendar from available observations. Mark unknown months as questions; choose locally appropriate plants with local ecological guidance.',
'Forage and habitat matter, but the lecture’s internal-fluid theory and claims about particular foreign plants are historical interpretations. Planting flowers does not replace diagnosis and management of infectious bee disease.'
],[
'Habitat floradas e qualidade do cuidado','Explique o pedido de Steiner para compensar o que a modernização altera.',
'A quinta palestra, de 10 de dezembro, começa com perguntas sobre comer favos e o aumento de doenças. Steiner limita expressamente o que pode afirmar sobre grandes quantidades de cera sem observar quem as ingere. Vale comparar essa prudência com suas afirmações mais fortes. Sobre doenças, considera abrigo, clima e relações com o entorno.\n\nPropõe oferecer flores quando falta alimento sazonal. A ideia é identificar o que uma mudança retira e restaurá-lo deliberadamente. Também defende adaptação regional e alerta contra estímulos de curto prazo. Sua teoria dos fluidos digestivos e sanguíneos explica o processo na palestra; a questão mais ampla é a continuidade de alimento e condições adequadas.',
'Um apiário bem organizado tem flores por duas semanas e quase nenhuma depois. Contar flores hoje oculta a lacuna sazonal. Um calendário muda o foco para a nutrição contínua.',
'Qual plano expressa melhor o princípio de compensação?',
'Identificar um recurso sazonal ausente e investigar como restaurá-lo|Supor que toda colmeia antiga seja mais saudável|Escolher qualquer planta apenas pela quantidade de flores',
'Sim. Primeiro identifique o que foi perdido ou interrompido.|Steiner diz que não faz campanha pelas antigas colmeias de palha.|Estação, região e adequação importam no argumento.',
'Faça um calendário local de floradas com observações disponíveis. Marque meses desconhecidos como perguntas; escolha plantas adequadas com orientação ecológica local.',
'Alimento e habitat importam, mas a teoria dos fluidos e as afirmações sobre plantas estrangeiras são interpretações históricas. Plantar flores não substitui diagnóstico e manejo de doenças infecciosas.'
]);
add('lecture-5',53,55,[
'Gall wasps figs and a shared process','Understand how Steiner compares processes distributed across different living beings.',
'Steiner moves from honey’s proposed effects on human development to gall wasps. A gall is plant tissue whose growth has been altered in association with an insect. In his comparison, the wasp obtains from the plant an enclosing environment for development; the bee later produces an enclosing structure through its own body.\n\nHe then describes the cultivation of figs with wasps. He interprets the resulting sweetness as a honey-like process still occurring inside the plant. His method asks whether an activity seen openly in one organism can illuminate an activity distributed between other organisms. Following this comparison requires keeping the actual insect and plant processes distinct.',
'A nursery building and a nest both protect development. That functional resemblance does not make their materials, builders or causes identical.',
'What is being compared in the gall and comb discussion?',
'Different ways of providing an environment for development|Two structures made from identical substances|A proof that every plant swelling is a beehive',
'Yes. Steiner follows a formative relationship across different settings.|A gall is plant tissue; comb is bee-produced wax.|The comparison does not erase the distinct structures.',
'Draw a plant and insect relationship using arrows for shelter, nourishment and reproduction. Label any further spiritual explanation separately.',
'Caprification is understood through fig pollination by fig wasps; Steiner’s description of insects injecting sweetness is not the modern botanical account. The source’s prenatal honey claims do not establish prevention of rickets.'
],[
'Vespas galhas figos e um processo compartilhado','Compreenda como Steiner compara processos distribuídos entre seres vivos.',
'Steiner passa dos efeitos propostos do mel sobre o desenvolvimento humano às vespas das galhas. Uma galha é tecido vegetal cujo crescimento foi alterado em associação com um inseto. Em sua comparação, a vespa obtém da planta um ambiente protetor para o desenvolvimento; a abelha produz depois uma estrutura protetora pelo próprio corpo.\n\nEm seguida descreve o cultivo de figos com vespas. Interpreta a doçura resultante como processo semelhante ao mel que permanece na planta. Seu método pergunta se uma atividade visível num organismo esclarece outra distribuída entre organismos. Acompanhar a comparação exige conservar as diferenças dos processos reais.',
'Uma creche e um ninho protegem o desenvolvimento. A semelhança funcional não torna idênticos seus materiais, construtores e causas.',
'O que se compara na discussão de galha e favo?',
'Maneiras diferentes de oferecer um ambiente de desenvolvimento|Duas estruturas feitas de substâncias idênticas|Uma prova de que toda saliência vegetal é uma colmeia',
'Sim. Steiner acompanha uma relação formadora em contextos diferentes.|Galha é tecido vegetal; favo é cera produzida por abelhas.|A comparação não apaga a diferença entre estruturas.',
'Desenhe uma relação entre planta e inseto com setas para abrigo, nutrição e reprodução. Marque separadamente a explicação espiritual adicional.',
'A caprificação é compreendida pela polinização dos figos por vespas; a descrição de injeção de doçura não é a explicação botânica moderna. As afirmações sobre mel na gestação não demonstram prevenção do raquitismo.'
]);
add('lecture-5',56,58,[
'The tree image and the limits of a reported answer','Read metamorphosis without confusing it with demonstrated ancestry.',
'Steiner describes the comb as if the bee had brought a tree’s formative activity outside the tree. Honey and wax, shelter and nourishment, are reorganized into a new visible arrangement. Metamorphosis here means recognizing a proposed relationship of process through changes of form and location.\n\nHe also claims that bees were bred from wasps in an earlier age. A question-and-answer report attributed to R. Hahn places this in Atlantis, when forms were supposedly less fixed. The same report includes a tentative uric-acid explanation of foulbrood and Steiner’s statement that he would need to investigate. A reported answer, an explicit uncertainty and a main lecture are distinct source situations.',
'“This arrangement resembles a tree” is a comparison. “People transformed these wasps into bees in Atlantis” is a claim about historical origin. One does not establish the other.',
'How should Hahn’s account be identified?',
'As a reported exchange with its own attribution and qualifications|As a modern laboratory demonstration|As an independently written chapter by Steiner',
'Yes. Its reporting status affects how the wording should be used.|It contains no laboratory demonstration.|It is an attributed report following the lecture.',
'Write one sentence explaining metamorphosis and one stating the claimed origin. Identify what evidence each would need.',
'Bee evolution from wasp ancestors does not validate the claimed Atlantean breeding event. Foulbrood is infectious; the source’s tentative uric-acid suggestion is not an adequate disease explanation.'
],[
'A imagem da árvore e os limites de uma resposta relatada','Leia a metamorfose sem confundi-la com ancestralidade demonstrada.',
'Steiner descreve o favo como se a abelha tivesse levado para fora da árvore sua atividade formadora. Mel e cera, abrigo e nutrição reorganizam-se num novo arranjo visível. Metamorfose significa aqui reconhecer uma relação proposta de processo através de mudanças de forma e lugar.\n\nEle afirma ainda que abelhas foram criadas a partir de vespas numa época anterior. Um relato de perguntas e respostas atribuído a R. Hahn situa isso em Atlântida, quando as formas seriam menos fixas. O relato inclui uma explicação provisória da cria pútrida pelo ácido úrico e a afirmação de Steiner de que precisaria investigar. São situações de fonte distintas.',
'“Este arranjo lembra uma árvore” é comparação. “Pessoas transformaram vespas em abelhas em Atlântida” é afirmação sobre origem histórica. Uma não estabelece a outra.',
'Como identificar o relato de Hahn?',
'Como uma conversa relatada com atribuição e ressalvas próprias|Como uma demonstração moderna de laboratório|Como um capítulo escrito independentemente por Steiner',
'Sim. O caráter de relato afeta o uso das palavras.|Não há demonstração laboratorial.|É um relato atribuído após a palestra.',
'Explique metamorfose numa frase e a origem alegada em outra. Diga de quais evidências cada uma precisaria.',
'A evolução das abelhas a partir de ancestrais vespas não valida a criação atlante alegada. A cria pútrida é infecciosa; a hipótese provisória do ácido úrico não explica adequadamente a doença.'
]);
add('lecture-6',58,64,[
'Venom the I and individual differences','Understand the spiritual physiology while separating it from medical action.',
'Lecture Six, 12 December, returns to caste development before discussing stings. Steiner connects circulation with the I-organization and interprets venom as carrying a related activating power. His account of illness and treatment follows that picture: a substance may disturb one constitution while, in his view, stimulating another.\n\nThe exchange stresses that the person’s condition matters and that a substance cannot simply be labeled a cure for everyone. However, it also proposes inaccurate circulation mechanisms and unsafe assumptions about becoming immune through repeated stings. Study the logic of his constitutional account without turning the examples into a treatment exercise.',
'Two people experience different reactions to a sting. This shows that reactions differ; it cannot tell us that another sting will safely strengthen either person.',
'What is the appropriate course activity for this passage?',
'Explain Steiner’s I-organization account without testing it through stings|Acquire tolerance by arranging repeated stings|Diagnose heart disease from a previous mild reaction',
'Yes. The task is accurate interpretation of the text.|Repeated exposure can cause sensitization and severe allergy.|A previous reaction cannot establish such a diagnosis or future safety.',
'Draw Steiner’s proposed sequence from I-organization to circulation to venom action. Mark it as historical spiritual physiology.',
'Bee venom can cause life-threatening anaphylaxis. Do not seek stings or self-administer venom, acids or the source’s remedies. Repeated stings do not reliably confer safety. The heart’s pumping role is established physiology.'
],[
'Veneno Eu e diferenças individuais','Compreenda a fisiologia espiritual e separe-a de uma ação médica.',
'A sexta palestra, de 12 de dezembro, retoma o desenvolvimento das castas antes de discutir ferroadas. Steiner relaciona a circulação à organização do Eu e interpreta o veneno como portador de uma força ativadora afim. Sua descrição de doença e tratamento segue essa imagem: uma substância perturbaria uma constituição e estimularia outra.\n\nA conversa destaca que a condição da pessoa importa e que não se pode rotular uma substância como cura para todos. Também propõe mecanismos circulatórios incorretos e suposições inseguras sobre imunidade por ferroadas repetidas. Estude a lógica constitucional sem transformar os exemplos em tratamento.',
'Duas pessoas reagem de maneiras diferentes a uma ferroada. Isso mostra variação; não diz que outra ferroada fortalecerá qualquer uma delas com segurança.',
'Qual atividade é adequada para esta passagem?',
'Explicar a organização do Eu sem testá-la por ferroadas|Adquirir tolerância provocando ferroadas repetidas|Diagnosticar doença cardíaca por uma reação leve anterior',
'Sim. A tarefa é interpretar o texto com precisão.|Exposição repetida pode causar sensibilização e alergia grave.|Uma reação anterior não estabelece esse diagnóstico nem segurança futura.',
'Desenhe a sequência proposta por Steiner: organização do Eu, circulação e ação do veneno. Identifique-a como fisiologia espiritual histórica.',
'O veneno pode causar anafilaxia com risco de morte. Não provoque ferroadas nem use veneno, ácidos ou os remédios da fonte por conta própria. Ferroadas repetidas não garantem segurança. A função de bombeamento do coração é estabelecida.'
]);
add('lecture-6',64,66,[
'Bees wasps ants and their building materials','Compare nourishment and construction without making all insects alike.',
'Steiner arranges bees, wasps and ants along a sequence of materials. Bees produce wax cells; certain wasps make a paper-like nest from worked plant fibers; ants construct passages using soil and plant remains. He connects these differences with what the insects obtain from flowers and other animals.\n\nAphid honeydew becomes central to the comparison. Ants tending aphids resemble keepers of small herds. The lecture uses this vivid image to relate nourishment, material transformation and dwelling. The specific comparison is useful when the species and conditions remain visible; it becomes misleading if converted into a universal rule about every ant, wasp or bee.',
'A paper wasp’s nest and a honeycomb both contain cells, but the material reaches its form by different processes. Describe those processes before comparing their spiritual significance.',
'What must a careful comparison preserve?',
'The different materials and ways of transforming them|The assumption that all nests are wax|The claim that every ant eats only animal fluids',
'Yes. Similar organization can coexist with different processes.|Paper nests and wax combs are distinct.|Ant diets vary; the lecture’s broad sequence is not universal taxonomy.',
'Create a three-column chart of insect, building material and food relationship. Add a question where you lack species-specific information.',
'The lecture generalizes across diverse insects. Some honeybees collect honeydew, and ant diets and nesting systems are varied. Its suggestion that feeding can turn male drones into female workers conflicts with bee sex determination.'
],[
'Abelhas vespas formigas e materiais de construção','Compare alimentação e construção sem tornar todos os insetos iguais.',
'Steiner organiza abelhas, vespas e formigas numa sequência de materiais. Abelhas produzem células de cera; certas vespas fazem ninhos semelhantes a papel com fibras vegetais trabalhadas; formigas constroem passagens com solo e restos vegetais. Relaciona essas diferenças ao que obtêm das flores e de outros animais.\n\nO líquido açucarado dos pulgões ocupa lugar central. Formigas cuidando de pulgões lembram criadores de pequenos rebanhos. A imagem relaciona nutrição, transformação material e morada. A comparação é útil quando preserva espécies e condições; torna-se enganosa se transformada em regra universal.',
'Um ninho de vespa de papel e um favo têm células, mas seus materiais ganham forma por processos distintos. Descreva os processos antes de comparar sentidos espirituais.',
'O que uma comparação cuidadosa deve preservar?',
'Os diferentes materiais e suas transformações|A suposição de que todos os ninhos são de cera|A afirmação de que toda formiga só ingere fluidos animais',
'Sim. Organização semelhante pode coexistir com processos distintos.|Ninhos de papel e favos de cera são diferentes.|As dietas variam; a sequência da palestra não é uma taxonomia universal.',
'Faça uma tabela com inseto, material de construção e relação alimentar. Acrescente uma pergunta onde faltar informação da espécie.',
'A palestra generaliza sobre insetos diversos. Abelhas melíferas também recolhem melato; dietas e ninhos de formigas variam. A proposta de transformar zangões machos em operárias fêmeas pela alimentação contraria a determinação sexual das abelhas.'
]);
add('lecture-7',67,72,[
'Where does the colony’s wisdom reside','Examine adaptive activity and Steiner’s account of group intelligence.',
'Lecture Seven, 15 December, asks whether the word instinct adequately explains what insects do. Ants use a suitable stump or build with other materials, adapting to circumstances. Steiner directs attention to the organized activity of the colony and argues that wisdom belongs to the whole.\n\nHe develops the theme through historical accounts of agricultural ants and parasitoid wasps. He then places plant and animal relationships within his account of an earlier Moon condition of the Earth, when their forms were not yet fixed. This cosmological history explains the present relationship within his worldview; it is not a reconstruction derived from the ant observations alone.',
'An ant colony finds a route around an obstacle. The useful question is how interactions produce the route. Calling it wise names the impressive result, but leaves room to investigate its organization.',
'What does Steiner mean by locating wisdom in the colony?',
'The organized whole displays capacities not evident in an isolated member|Every ant individually plans the entire forest|The word instinct settles every question',
'Yes. The unit of attention changes from isolated insect to colony.|He explicitly questions locating the whole intelligence in one ant.|He argues that the label alone explains too little.',
'Write two explanations of a changing ant trail: one describing interactions and one giving Steiner’s interpretation. State what each explains.',
'Colony coordination can be studied through interactions and signals. That does not establish Steiner’s group consciousness. His account of agricultural ants is a historical report; the Old Moon is spiritual cosmology, not the present Moon’s geological history.'
],[
'Onde reside a sabedoria da colônia','Examine a atividade adaptativa e a inteligência coletiva na descrição de Steiner.',
'A sétima palestra, de 15 de dezembro, pergunta se instinto explica adequadamente o que os insetos fazem. Formigas usam um toco apropriado ou constroem com outros materiais, adaptando-se às circunstâncias. Steiner volta a atenção para a atividade organizada e atribui a sabedoria ao todo.\n\nDesenvolve o tema com relatos históricos sobre formigas agricultoras e vespas parasitoides. Situa depois as relações entre plantas e animais numa condição lunar anterior da Terra, quando suas formas ainda não seriam fixas. Essa história cósmica explica a relação em sua visão de mundo; não é uma reconstrução derivada apenas das observações das formigas.',
'Uma colônia encontra um caminho em torno de um obstáculo. Perguntar como as interações produzem o caminho permite investigar sua organização; chamá-lo sábio descreve o resultado impressionante.',
'O que significa situar a sabedoria na colônia?',
'O todo organizado exibe capacidades não evidentes num membro isolado|Cada formiga planeja individualmente a floresta inteira|A palavra instinto resolve toda pergunta',
'Sim. A unidade de atenção passa do inseto isolado à colônia.|Ele questiona localizar toda inteligência numa única formiga.|Ele argumenta que o rótulo isolado explica pouco.',
'Escreva duas explicações para uma trilha que muda: uma sobre interações e outra segundo Steiner. Diga o que cada uma explica.',
'A coordenação pode ser estudada por interações e sinais. Isso não estabelece a consciência coletiva de Steiner. As formigas agricultoras vêm de relato histórico; a Antiga Lua é cosmologia espiritual, não história geológica da Lua atual.'
]);
add('lecture-7',73,76,[
'From taking nectar to sustaining life','Explain the reciprocal picture that replaces the image of simple robbery.',
'Steiner asks the audience to change viewpoint. If we notice only nectar being removed, insects appear to rob plants. He proposes instead that they return something essential: venom and formic acid that, in his account, help maintain life. Ants extend the picture to dead wood and the forest floor.\n\nThe important structure of his argument is reciprocity: receiving and giving belong together. His specific chemical explanation is a further claim. Distinguish that proposed mechanism from the wider ecological question of how pollination, decomposition and food relationships connect organisms. The lecture asks learners to widen the system they consider when judging a seemingly small event.',
'Watching one flower visit shows nectar collection. Following pollen between flowers and attending to other organisms reveals relationships the single moment cannot show.',
'What is the main change of perspective?',
'From isolated removal to a proposed relationship of giving and receiving|From insects to honey prices alone|From observation to the conclusion that every interaction benefits both sides',
'Yes. Reciprocity organizes Steiner’s explanation.|Prices were central earlier, but this lecture asks about nature’s relationships.|Ecological relationships include costs and conflicts; universal mutual benefit does not follow.',
'Draw a web connecting a flowering plant, a pollinator, a bird and decomposing wood. Distinguish established relationships from Steiner’s proposed acid-mediated renewal.',
'Pollination and nutrient cycling are distinct processes. The claim that bees sustain flowers by routinely transferring venom while feeding is not an established account of pollination.'
],[
'Da coleta de néctar à sustentação da vida','Explique a reciprocidade que substitui a imagem do simples roubo.',
'Steiner pede uma mudança de perspectiva. Se vemos apenas a retirada do néctar, os insetos parecem roubar as plantas. Ele propõe que devolvem algo essencial: veneno e ácido fórmico que, segundo sua descrição, mantêm a vida. As formigas ampliam a imagem à madeira morta e ao chão da floresta.\n\nA estrutura decisiva do argumento é a reciprocidade: receber e dar pertencem um ao outro. Sua explicação química específica é uma afirmação adicional. Distinga esse mecanismo proposto da pergunta ecológica sobre polinização, decomposição e relações alimentares. A palestra pede ampliar o sistema considerado ao julgar um pequeno evento.',
'Uma visita à flor mostra coleta de néctar. Acompanhar o pólen entre flores e considerar outros organismos revela relações ausentes daquele instante isolado.',
'Qual é a mudança principal de perspectiva?',
'Da retirada isolada à relação proposta de dar e receber|Dos insetos apenas aos preços do mel|Da observação à conclusão de que toda interação beneficia ambos',
'Sim. A reciprocidade organiza a explicação.|Preços foram centrais antes; aqui o tema são relações na natureza.|Relações ecológicas incluem custos e conflitos; benefício mútuo universal não decorre disso.',
'Desenhe uma rede entre planta florida, polinizador, ave e madeira em decomposição. Distinga relações estabelecidas da renovação por ácidos proposta por Steiner.',
'Polinização e ciclagem de nutrientes são processos distintos. A transferência habitual de veneno pelas abelhas enquanto se alimentam não é uma explicação estabelecida da polinização.'
]);
add('lecture-8',77,83,[
'Transformation and the microcosm','Follow the movement from insect building to human and earthly processes.',
'Lecture Eight, 22 December, begins by honoring Fabre’s insect observations and describing a wood bee’s nest. Provisioned chambers and an emergence route illustrate what Steiner calls intelligence in nature. He turns from finished structures to the processes that make continued life possible.\n\nHis account links plant oxalic acid, insect formic acid and human metabolism. The human being becomes a microcosm: a smaller world whose transformations correspond to the larger world of plants and insects. He connects etheric activity with life and astral activity with sensation. A laboratory conversion supplies an image for this account, but the same reaction in glass does not demonstrate its proposed function inside organs.',
'A diagram can connect plants, insects and human beings by transformation arrows. Each arrow needs a label showing whether it represents the lecturer’s proposed correspondence or an established process.',
'What does microcosm mean in this lecture?',
'The human being as a smaller world corresponding to the wider world|An insect too small to see|A laboratory vessel that proves the entire spiritual account',
'Yes. Correspondence between human and earthly processes is the central idea.|Microcosm names a relationship of worlds, not a size category of insects.|An analogy with a laboratory process cannot prove the whole account.',
'Draw the microcosm and macrocosm side by side. Explain Steiner’s correspondence in your own words without turning it into a chemical experiment.',
'The proposed oxalic-to-formic pathway as the basis of consciousness and treatment is not established human physiology. Oxalic and formic acids are hazardous; no extraction, ingestion or heating exercise is part of this course.'
],[
'Transformação e microcosmo','Acompanhe a passagem da construção dos insetos aos processos humanos e terrestres.',
'A oitava palestra, de 22 de dezembro, homenageia as observações de Fabre e descreve o ninho de uma abelha carpinteira. Câmaras abastecidas e uma rota de saída ilustram o que Steiner chama de inteligência na natureza. Ele passa das estruturas prontas aos processos que tornariam possível a continuidade da vida.\n\nRelaciona ácido oxálico vegetal, ácido fórmico dos insetos e metabolismo humano. O ser humano torna-se microcosmo: um mundo menor cujas transformações correspondem ao mundo maior de plantas e insetos. Liga atividade etérica à vida e astral à sensação. Uma conversão de laboratório oferece uma imagem, mas não demonstra a função proposta nos órgãos.',
'Um diagrama conecta plantas, insetos e seres humanos por setas de transformação. Cada seta precisa dizer se representa uma correspondência do palestrante ou um processo estabelecido.',
'O que significa microcosmo nesta palestra?',
'O ser humano como mundo menor em correspondência com o mundo maior|Um inseto pequeno demais para ser visto|Um recipiente de laboratório que prova toda a descrição espiritual',
'Sim. A correspondência entre processos humanos e terrestres é central.|Microcosmo designa relação entre mundos, não tamanho de insetos.|A analogia laboratorial não prova a descrição inteira.',
'Desenhe microcosmo e macrocosmo lado a lado. Explique a correspondência de Steiner sem transformá-la em experimento químico.',
'A via oxálico-fórmica proposta como base da consciência e do tratamento não é fisiologia humana estabelecida. Esses ácidos são perigosos; o curso não inclui extração, ingestão ou aquecimento.'
]);
add('lecture-8',84,90,[
'Swarming renewal and the seasonal Earth','Read the closing spiritual images and use the drawings critically.',
'Steiner interprets the seasonal Earth as a being repeatedly renewed through the work of plants and insects. He then compares a swarm leaving its hive with a human soul leaving its body and entering a new embodiment. The correspondence gives swarming a spiritual meaning within his worldview. It is different from observing the biological process of colony reproduction.\n\nThe closing juniper and Christmas discussion connects natural renewal with moral and religious imagery. The blackboard plates preserve the lecture’s visual thinking: arrows, polarities and relationships. Use them to reconstruct an argument, while distinguishing a diagram’s explanatory role from evidence that its arrows describe an actual causal process.',
'A drawing of a swarm beside a human outline can communicate an analogy immediately. Its clarity as a picture cannot decide whether reincarnation occurs.',
'What can the swarming image establish on its own?',
'The comparison Steiner wants the audience to contemplate|That biological reproduction proves reincarnation|That a drawing verifies all chemical claims in the lecture',
'Yes. It makes the intended correspondence intelligible.|A spiritual interpretation requires more than the biological event.|An explanatory drawing is not an independent verification.',
'Choose one relationship in the blackboard plates and redraw it using your own labels. Explain which part is observation and which part is spiritual interpretation.',
'The plates were visually inspected as historical diagrams, not transcribed as verified German text. The lecture’s claims about telegraphy depending on ants and about universal formic-acid rejuvenation are not established science.'
],[
'Enxameação renovação e Terra sazonal','Leia as imagens espirituais finais e use os desenhos criticamente.',
'Steiner interpreta a Terra sazonal como um ser renovado pelo trabalho de plantas e insetos. Compara a saída de um enxame à alma humana deixando o corpo e entrando numa nova encarnação. A correspondência dá à enxameação um sentido espiritual em sua visão de mundo, distinto do processo biológico de reprodução da colônia.\n\nO encerramento sobre zimbro e Natal liga renovação natural a imagens morais e religiosas. As pranchas de quadro-negro preservam o pensar visual da palestra: setas, polaridades e relações. Use-as para reconstruir o argumento, distinguindo o papel explicativo do diagrama da evidência de que suas setas representam causas reais.',
'Um desenho do enxame ao lado da figura humana comunica uma analogia rapidamente. A clareza da imagem não decide se a reencarnação ocorre.',
'O que a imagem da enxameação estabelece por si só?',
'A comparação que Steiner deseja que o público contemple|Que a reprodução biológica prova a reencarnação|Que o desenho verifica toda afirmação química da palestra',
'Sim. Ela torna compreensível a correspondência pretendida.|A interpretação espiritual exige mais que o evento biológico.|Um desenho explicativo não é verificação independente.',
'Escolha uma relação nas pranchas e redesenhe-a com suas palavras. Explique o que é observação e o que é interpretação espiritual.',
'As pranchas foram inspecionadas visualmente como diagramas históricos, sem transcrição alemã certificada. As afirmações sobre telegrafia dependente de formigas e rejuvenescimento universal pelo ácido fórmico não são ciência estabelecida.'
]);
add('appendix',91,99,[
'Group souls and the wider lecture context','Compare dated extracts without flattening their distinct contexts.',
'The appendix broadens the main sequence. The 1905 extract relates the hive’s consciousness to a future Venus stage; the 1908 extract places elemental beings at the meeting of bee and blossom; the 1909 answer compares group souls. These passages supply spiritual context rather than extra chapters of a continuous 1923 lecture.\n\nThe November 1923 extracts return to the head analogy and artificial breeding. Later December and January material develops the plant-insect relationship, proteins, quartz forms and the hive’s soul. Hahn’s reported answers repeat material already printed after Lecture Five. Read the repeated report as one witness, not as independent corroboration.',
'Two pages repeat the same reported conversation. They can help locate the passage, but counting them as two separate confirmations exaggerates the evidence.',
'How should the appendix be used?',
'As distinct dated contexts that extend and sometimes repeat the main themes|As one uninterrupted lecture from December 1923|As a set of modern experimental replications',
'Yes. Date, lecture context and reporting status remain important.|The extracts range from 1905 to 1924.|The appendix offers historical spiritual accounts, not replications.',
'Choose group soul, formative force or bee and blossom. Compare its treatment in one main lecture and one dated appendix extract.',
'Group souls, elemental beings and the future Venus stage belong to Steiner’s spiritual cosmology. Venus as an evolutionary stage is not simply a claim about conditions on today’s planet Venus.'
],[
'Almas grupais e contexto ampliado das palestras','Compare excertos datados sem apagar seus contextos distintos.',
'O apêndice amplia a sequência principal. O excerto de 1905 relaciona a consciência da colmeia a um futuro estágio de Vênus; o de 1908 situa seres elementares no encontro de abelha e flor; a resposta de 1909 compara almas grupais. São contextos espirituais, não capítulos extras de uma palestra contínua de 1923.\n\nOs excertos de novembro de 1923 retomam a cabeça e a criação de rainhas. Os de dezembro e janeiro desenvolvem relações entre planta e inseto, proteínas, quartzo e alma da colmeia. As respostas relatadas por Hahn repetem material após a quinta palestra. A repetição é uma testemunha, não confirmação independente.',
'Duas páginas repetem a mesma conversa relatada. Ajudam a localizar a passagem, mas contá-las como confirmações independentes exagera a evidência.',
'Como utilizar o apêndice?',
'Como contextos datados que ampliam e às vezes repetem temas|Como uma palestra ininterrupta de dezembro de 1923|Como um conjunto de repetições experimentais modernas',
'Sim. Data, contexto e caráter de relato importam.|Os excertos vão de 1905 a 1924.|O apêndice oferece descrições espirituais históricas.',
'Escolha alma grupal, força formadora ou abelha e flor. Compare o tema numa palestra principal e num excerto datado.',
'Almas grupais, seres elementares e o futuro estágio de Vênus pertencem à cosmologia espiritual de Steiner. Vênus como estágio evolutivo não é apenas o planeta atual.'
]);
add('afterword',100,113,[
'Beuys warmth and social sculpture','Understand how a later artist transforms the hive image.',
'David Adams’s 1998 afterword follows Joseph Beuys’s engagement with Steiner. Beeswax, honey and fat become artistic materials through which warmth, movement and form can be experienced. A material’s transformation supplies the work’s meaning as well as its visible appearance.\n\nAdams connects the queen-bee works, How to Explain Pictures to a Dead Hare and Honey Pump at the Workplace with a wider project of social sculpture. In the Honey Pump discussion, circulating honey and human conversation belong together: creative participation is part of the artwork. This is Beuys’s artistic adaptation interpreted by Adams, not another lecture by Steiner or proof of the lecture’s physiology.',
'A group redesigns how neighbors share a garden. Calling the process social sculpture directs attention to the form created through conversation and decisions.',
'Whose interpretive voice organizes this afterword?',
'David Adams discussing Beuys’s use of Steiner|Steiner speaking to workers in 1923|The queen bee describing a social program',
'Yes. Keep the author, artist and historical source distinct.|The afterword was written in 1998.|The hive analogy does not literally give bees a human political program.',
'Sketch an artwork expressing cooperation with ordinary paper and pencil. Explain what the chosen forms convey and how a participant could change the work.',
'The hive is an artistic stimulus, not a blueprint for restricting human individuality. Adams’s biographical and art-historical claims are studied as this afterword’s account; they have not all been independently verified here.'
],[
'Beuys calor e escultura social','Compreenda como um artista posterior transforma a imagem da colmeia.',
'O posfácio de David Adams, de 1998, acompanha o envolvimento de Joseph Beuys com Steiner. Cera, mel e gordura tornam-se materiais artísticos para experimentar calor, movimento e forma. A transformação do material participa do sentido da obra, além de sua aparência.\n\nAdams relaciona as obras da rainha-abelha, Como explicar imagens a uma lebre morta e Bomba de mel no local de trabalho ao projeto de escultura social. Na Bomba de mel, circulação e conversa humana pertencem uma à outra: a participação criativa integra a obra. É a adaptação artística de Beuys interpretada por Adams, não outra palestra de Steiner nem prova de sua fisiologia.',
'Um grupo redesenha a partilha de um jardim entre vizinhos. Chamar o processo de escultura social destaca a forma criada por conversas e decisões.',
'Que voz interpretativa organiza o posfácio?',
'David Adams discutindo o uso de Steiner por Beuys|Steiner falando aos trabalhadores em 1923|A rainha descrevendo um programa social',
'Sim. Distinga autor, artista e fonte histórica.|O posfácio foi escrito em 1998.|A analogia não dá literalmente às abelhas um programa político humano.',
'Esboce com papel e lápis uma obra que expresse cooperação. Explique o sentido das formas e como um participante poderia modificá-la.',
'A colmeia é estímulo artístico, não modelo para restringir a individualidade humana. As afirmações biográficas e artísticas de Adams são estudadas como seu relato; nem todas foram verificadas independentemente aqui.'
]);
add('synthesis',7,113,[
'Learning to care for a living whole','Bring the lectures together in a reasoned account of bees and responsibility.',
'Three threads connect the course. First, Steiner asks us to see the colony as a whole whose relationships matter. Second, he follows transformations from blossom to honey, wax and human nourishment. Third, he asks what insects give to the wider life of the Earth. Cosmic correspondences and spiritual physiology provide his explanations of these relationships.\n\nA responsible synthesis can explain his viewpoint sympathetically while making clear which observations, analogies and causal claims support it. Practical care then requires its own evidence: sustained forage, appropriate habitat, knowledgeable disease management and attention to the colony over time. Reverence becomes a reason to observe and learn carefully.',
'An orchard project proposes adding hives. A whole-system question asks about existing pollinators, flowering gaps, disease, local habitat and who will provide continuing care.',
'Which conclusion demonstrates the course’s method?',
'Explain Steiner’s view and assess practical decisions with appropriate evidence|Treat every analogy as a proven biological mechanism|Reject observation because the course concerns spiritual ideas',
'Yes. Accurate interpretation and responsible judgment work together.|Analogy can clarify a view without proving its mechanism.|Observation is central to both the lectures and the study method.',
'Write 400–600 words on “The colony as a living whole.” Use one idea from each of the eight lectures, distinguish Hauk and Adams, and propose one observable care question. Compare your answer with the synthesis guide below.',
'A strong answer can disagree with Steiner while explaining him accurately. The final task evaluates understanding, attribution and reasoning rather than belief.'
],[
'Aprender a cuidar de um todo vivo','Reúna as palestras numa descrição fundamentada de abelhas e responsabilidade.',
'Três fios ligam o curso. Primeiro, Steiner pede perceber a colônia como um todo cujas relações importam. Segundo, acompanha transformações da flor ao mel, à cera e à nutrição humana. Terceiro, pergunta o que os insetos oferecem à vida da Terra. Correspondências cósmicas e fisiologia espiritual fornecem suas explicações.\n\nUma síntese responsável explica sua perspectiva com abertura e distingue observações, analogias e afirmações causais. O cuidado prático exige evidências próprias: continuidade de alimento, habitat adequado, manejo informado de doenças e acompanhamento da colônia. A reverência torna-se motivo para observar e aprender com atenção.',
'Um projeto de pomar propõe instalar colmeias. Considerar o todo exige perguntar sobre polinizadores existentes, lacunas de florada, doenças, habitat e responsabilidade pelos cuidados contínuos.',
'Qual conclusão demonstra o método do curso?',
'Explicar Steiner e avaliar decisões práticas com evidências apropriadas|Tratar toda analogia como mecanismo biológico provado|Rejeitar a observação porque o curso aborda ideias espirituais',
'Sim. Interpretação precisa e julgamento responsável caminham juntos.|A analogia esclarece uma visão sem provar seu mecanismo.|A observação é central nas palestras e no estudo.',
'Escreva 400–600 palavras sobre “A colônia como todo vivo”. Use uma ideia de cada palestra, distinga Hauk e Adams e proponha uma pergunta observável de cuidado. Compare com o guia de síntese abaixo.',
'Uma boa resposta pode discordar de Steiner e explicá-lo com precisão. A tarefa avalia compreensão, atribuição e raciocínio, não crença.'
]);
for(const lesson of lessons)for(const lang of ['en','pt']){
 const q=lesson[lang].check,shift=lesson.id%3;
 q.options=[...q.options.slice(shift),...q.options.slice(0,shift)];
 q.feedback=[...q.feedback.slice(shift),...q.feedback.slice(0,shift)];
 q.answer=(3-shift)%3;
}
export const pageNames=['index.html','chapters.html','sources.html','glossary.html','print.html',...lessons.map(l=>`lessons/${String(l.id).padStart(2,'0')}.html`)];
export const courseRoutes=['','pt/'].flatMap(prefix=>pageNames.map(page=>`${prefix}learn/bees/${page}`));
