import fs from 'node:fs';
const inventory=JSON.parse(fs.readFileSync('content/teaching-audit-inventory.json','utf8'));
// Editorial recommendations in stable lesson order; no student pages are changed.
const recommendations=[
[
'Keep a first answer to the helping-a-friend scene, then revisit it after the chapter; look for a more precise question, not a prescribed conviction. Separate quick start from optional connections.',
'Let two observers respond to the same stars before revealing body, soul and spirit; ask which relationship remains intelligible despite different feelings. Transfer to a different shared event.',
'Reveal the bell event, sensation and reaction separately; have the learner explain why the heard tone is already part of inner experience. Feedback targets soul being reduced to emotion.',
'Compare stone, plant and animal through observed differences, then introduce the life-body explanation; require the learner to name the additional claim rather than infer it directly from growth.',
'Offer three possible replies to a correction; ask which aspect of soul each illustrates and where the example overlaps. Feedback rejects treating a person as a single isolated soul-part.',
'Use two speakers saying “I”; ask what the word refers to before introducing the terms. Then distinguish I, consciousness soul and spirit self with one source-based relationship each.',
'Turn the existing nine-card task into a stepwise grouping with keyboard controls; require an explanation of both joined pairs and why the transformation list answers a different question.',
'Have learners sort remembered learning events, current skill and lasting consequences from one fictional practice history; introduce a new skill to check transfer beyond the typing example.',
'Reveal the quick-learning observation before the proposed reincarnation account; let learners supply the missing premises. Feedback distinguishes understanding the argument from establishing those premises.',
'Compare three claims about consequence, fatalism and assigning blame; ask learners to repair one invalid inference. Return to the sleep analogy and identify its precise limit.',
'Build one sympathy/antipathy relation at a time using labelled arrows; ask for an explanation before showing the full regional sequence. Include a complete static reading map.',
'Start with the misplaced-mug habit and ask what persists; compare purification and karma in the source. Assess the difference, not merely recollection of the analogy.',
'Show a building and its plan; ask what the comparison fails to capture about a living archetype. Feedback should require the source’s positive description as well as limits.',
'Reuse the earlier learning-history case, now across two projects; ask what becomes capacity and what remains memory. Mark the source’s proposed extension between lives separately.',
'Present two accounts of development, one equating it with status; ask the learner to revise that explanation using capacity and purpose without attributing a hidden history to anyone.',
'Build a concept map gradually and give every connection a verb; ask where the ice/water analogy helps and where it changes the kind of explanation being offered.',
'Show a village festival first as an observable event, then as a claimed spiritual interpretation; require a fair explanation of each and distinguish what support each would need.',
'Compare “warm voice,” visible red paint and an aura description; ask which senses of colour are involved. Feedback should preserve what Steiner intends, not reduce everything to metaphor.',
'Let the learner reconstruct the reasoning before seeing the arithmetic answer or commentary; use a changed premise for transfer and ask separately about meaning and justification.',
'Offer alternative replies to the corrected-date scene and reveal the calendar afterward; ask what changes in the judgment and what need not change in the feeling.',
'Change journey time after the learner forms a departure plan; require revision of the linked steps. Then distinguish coherent reasoning from the ethical worth of its aim.',
'Present the same outward choice with different possible motives; separate options, practical capacity and understood reasons. A good response leaves unestablished motives open.',
'Revisit the opening question and progressively assemble the four-chapter map; annotate one revised understanding, one source-supported connection and one unresolved question.'
],
[
'Ask learners to retrieve one GA 9 idea before showing a recap; distinguish what this book adds from what an everyday observation has already established.',
'Use a short exchange between dismissal, deference and fair questioning; ask the learner to formulate a respectful objection after paraphrasing the claim.',
'Show Alex’s interruption in two brief stages; collect a first description and a retrospective account. Feedback distinguishes describing an action from judging an entire personality.',
'Present the dog-at-the-door scene without its interpretation, then add an alternative explanation; ask which sentences need revision. Offer optional audio with an equivalent transcript.',
'Compare seed and model, ask for a prediction and conditions, then reveal the source’s further claim; the learner marks the point where ordinary observation no longer suffices.',
'Invite a question to the quiet classmate before supplying any explanation; assess whether it allows the person to answer or decline rather than assigns a hidden condition.',
'Use three small situations to distinguish courage, self-control and presence of mind; match each with the source’s trial and explain the analogy without staging an ordeal.',
'Reveal the changed deadline only after an initial response; rewrite a firm reply that uses the facts. Feedback addresses confusing equanimity with either submission or numbness.',
'Give partial information about the failed group project; ask which questions would clarify responsibility. Add information and distinguish participation from equal blame.',
'Ask for a response to the cancelled supply need; compare persistence, stubbornness and justified revision. Return to the condition’s actual wording before drawing the distinction.',
'Use a labelled map of the source’s activities and qualities; ask for an ordinary paraphrase and the additional spiritual relation. Do not turn the map into anatomy or a type test.',
'Let a learner interpret Lee’s message, then disclose the expectation shaping it; compare the revision with the text’s account without equating the ordinary and supersensible cases.',
'Present one clock sound and two possible dream scenes; ask what the available information can distinguish. Feedback targets vividness being mistaken for knowledge of origin.',
'Show two narrative fragments and ask the learner to tag remembered, supplied and inferred links; then reconstruct the chapter’s three states without inventing missing experience.',
'Explore three versions of the neighbour-helping scene with a different imbalance each; ask how thinking, feeling and action can be coordinated and what the source claims beyond this.',
'Build the Guardian account through narrative, asserted spiritual reality and analogy; ask learners to explain why the ledger clarifies responsibility without replacing the being described.',
'Compare the two Guardians using cited passages, then introduce the chapter’s hierarchy as an objection to examine; require explanation of the tension rather than a generic service slogan.',
'Return to an earlier answer and add the appendix passage; ask exactly which wording changes and why. Retain an unresolved question where the appendix does not settle it.',
'Assemble the existing synthesis from saved responses; ask for one GA 9/GA 10 connection, one difference and one changed explanation. Annotated examples show these separately.'
],
[
'Record one question about knowing and one about acting; use the meeting-time case before commentary, then show how the two preface questions organize the course.',
'Present one invitation choice with several possible motives; ask what knowing the selected day fails to explain. Feedback separates options, ability and the ground of action.',
'Replace the repeated-title objective with an observable task: distinguish observation, question and explanation. Add a second branch-moving clue and require a revised inference.',
'Ask learners to describe the fallen-cup event before explaining it; compare two causal accounts and ask what evidence distinguishes them. Return to thinking’s conceptual contribution.',
'Withhold the arithmetic result initially; let learners calculate, reconstruct and compare with the worked steps. Transfer to a timetable whose premise changes after the first answer.',
'Show front and tilted views of a card with a complete text alternative; distinguish changed appearance from changed object, then put the card away and identify recall.',
'Let learners construct the representation-only argument, then highlight an assumed premise; offer Steiner’s objection and ask what it does and does not establish.',
'Reveal flower records sequentially; invite an expectation before the next record and add a changed condition. Assess how the learner connects development rather than names the plant.',
'Compare two nonidentical triangles before giving the definition; ask learners to explain the common relation and then separate feeling and remembered representation.',
'Use two bicycle encounters, one the same bicycle and one similar; ask which observation supports identity versus kind. Feedback directly addresses confusing the two forms of recognition.',
'Present an unavailable record, an ambiguous question and a claim of impossibility; ask which next step fits each. Reconstruct the book’s broader argument separately.',
'Let learners propose a seating response before the example’s solution; ask why the chair move fits the concern and whether another action could embody the same understanding.',
'Separate the meeting-summary case into motive, driving force and resources; use “notes are available” as a targeted misconception. A retry changes resources but leaves the aim intact.',
'Contrast reasons for the same helpful deed, then add mixed motives; ask what would still need examination. Feedback prevents novelty or a virtuous slogan from proving freedom.',
'Offer summary and conversation as distinct actions serving an understood aim; introduce the newcomer’s preference and revise. Require explanation of shared concept and individual deed.',
'Build a timeline of present representation, action and outcome; cancel the meeting after planning. Ask why the original purpose existed even without the planned result.',
'Ask the learner to explain inclusion without the slogan, then compare a hunch, a rule and a reasoned ethical aim. Request source support for the distinction.',
'Take one accessibility aim through proposal and practical delivery; reveal a failed file test and revise the technique. Keep the chapter’s historical-development argument as a separate reading task.',
'Track the musician’s desire, experience and result across stages; compare two readings of the same incomplete practice. Ask for the opponent’s argument and Steiner’s reply in distinct voices.',
'Compare book repair with a pleasurable substitute, then introduce a risk of further damage; assess why the aim matters and when a changed plan better serves it.',
'Reveal the quiet member’s request only after an initial inference; revise the role assignment and explain how even a flattering category can obscure individuality.'
],
[
'Use an original three-voice dialogue to sort source claim, interpretation and response; save a starting question and revisit it in the synthesis.',
'Compare ordinary observation, imagining and inferring before defining the technical capacities; ask for a source example so the exercise does not substitute everyday cognition for the lecture.',
'Begin with a source map of the Buddha/Jesus relationship, then connect one precise aspect to the two volunteers; assess the spiritual account and ethical transfer separately.',
'Let learners write thought, speech and action in the accusation case; add a detail that changes the response. Ask which lecture passage motivates the proposed connection.',
'Build separate Matthew and Luke columns from identified passages; add Steiner’s interpretation in a third layer. Feedback catches a claim attributed to the wrong voice.',
'Supply relationship arrows with competing verbs; require a source-backed verb for each. Use the musician analogy only afterward to clarify contribution versus identity.',
'Stage a community decision and ask which information matters; return to the cultural hierarchy in the lecture and formulate a precise objection rather than replacing its content with the case.',
'Reveal the attributed chronology in three stages; ask who is the subject at each point and what changes at baptism. Keep an accessible full timeline alongside the guided sequence.',
'Place a short healing-narrative reading beside Steiner’s interpretation; ask what each asserts and what an ordinary learning analogy cannot establish. Avoid diagnosis or treatment branches.',
'Give the same note-sharing deed three possible motives; ask for a source-based explanation of ideal versus active power before the learner proposes a practical application.',
'First reconstruct the lecture’s Golgotha conclusion, then examine the borrowed-object case; ask which relation helps discuss hope and which features cannot transfer between the two.',
'Return to the opening three-column note; include a revised source interpretation as well as the care proposal. Replace a generic good intention with one reviewable action and one cited reason.'
],
[
'Collect a description of a patch before any mood words; distinguish arrangement, experience and interpretation. Save the original response for comparison with the portfolio.',
'Let learners swap centres on equal green grounds; reveal the source’s image-colour account after observation. Require both a perceptual comparison and an attributed conceptual explanation.',
'Let learners reverse centre/edge intensity before reading the prescribed tendency; accept differing impressions and ask what feature supports the description. Keep both versions.',
'Guide outline-first and colour-first studies in separate steps; ask which decision emerged during making. Feedback compares process and intention rather than declares a universally better method.',
'Offer the fixed-shape colour swap with neutral labels; record attention before the lecture description. Compare another observer’s response if available, without requiring a partner.',
'Ask for feeling descriptions before showing others’ words, then change a neighbour colour; distinguish a personal artistic reading from a judgment about character.',
'Use a sketch and its proposed revision to mark completed and becoming; build the lecture’s temporal relations separately. Feedback checks that the analogy is not treated literally.',
'Let learners explain the sign-making action causally and by its reason; ask for the additional bridge in the lecture. Keep the cosmic claim distinct from the practical description.',
'Compare a translucent sheet against ordinary light/dark grounds with a written alternative; record conditions first, then distinguish description, proposed spiritual account and physical explanation.',
'Swap colours while holding shape and position constant, then add overlap separately; ask which change explains each depth judgment. Provide a no-clear-effect response.',
'Build the three compositional regions one at a time; ask what the middle does before commentary. Distinguish the original abstract study from the actual artwork discussed in the source.',
'Move a small dark region across a pale field; ask the learner to justify the preferred balance. Feedback names position and intensity without treating visual weight as mass.',
'Assemble warmth, light, colour and form with attributed relations; pause for a meaning question at each step. Ask what a harmonious diagram cannot establish.',
'Replace “Submit” with a supported save/export action or “Prepare” until submission exists; display initial and revised studies side by side with annotated examples of useful commentary.'
],
[
'Show the same fictional person in two contrasting situations before naming a type; save an initial account and identify what information is still missing.',
'Build the two-stream diagram gradually; ask what question temperament answers in the source. Require a sentence separating the explanatory proposal from the sibling observation.',
'Use a reconstructable mapping followed by the “others lack this member” misconception; assess relational predominance rather than only the four memorized pairings.',
'Offer two responses to the unstable model bridge, then a learner reply; revise the support using task information. Do not reward winning a contest of wills.',
'Invite an activity based on the bird interest, then introduce a missed completion point; ask what to change in the task and how to check the effect.',
'Let the learner write an invitation before showing examples; reveal that quiet observation may be engagement. Feedback distinguishes a useful role from pressure to participate.',
'Compare acknowledgment with “others have it worse,” then ask for an optional act of care; assess whether the second part preserves the first rather than cancels it.',
'Delay the second set of behavioural details until after the first impression; ask which absolute claim must change. Transfer to another case with a flattering initial label.',
'Give one project and different reported needs; ask which support fits each detail, then add a new response. Explain the shared educational principle without assigning fixed types.',
'Design a short habit task, anticipate a difficulty, then review an imagined result; assess the reason for adjusting the setting rather than repeating self-reproach.',
'Compare the opening and final descriptions of the same fictional person; highlight one corrected assumption, one cited idea and one practical response that remains revisable.'
],
[
'Retrieve one idea from Steiner’s course and introduce Childs’s different voice; use an author/source comparison alongside the continuing disagreement case.',
'Contrast two uses of quickness and invite a third counterexample; require an explanation of what the tendency leaves undecided about the particular action.',
'Unpack one classification axis at a time before showing the combined map; use the design task to challenge an unsupported link between sociability and thinking style.',
'Ask learners to draft feedback to the efficient repair leader, then reveal the overlooked support; compare specific appreciation, flattery and actionable correction.',
'Transform the event idea into a small explicit commitment; introduce a changed circumstance and draft a timely renegotiation rather than merely recalling the definition of follow-through.',
'Show the quiet meeting and later written contribution in stages; ask how the participation conditions should change. Assess the revised invitation, not the inferred type.',
'Let learners choose questions about a concern, then compare leading and open wording; assess whether the response invites information rather than dismisses the experience.',
'Plan roles using skills, preferences and requirements before showing typological suggestions; add a member’s correction and revise the plan with an explicit reason.',
'Use two dialogue versions about advance notice; have the learner negotiate a concrete agreement. Treat the ten pairings as prompts for questions, not compatibility predictions.',
'Write separate statements of Childs’s spiritual foundation and the ordinary act of care; ask how one inspires the other without assuming that useful action proves the account.',
'Place the earlier stability claim beside the appendix’s possibility of change; ask learners to describe the tension and evidence needed, not invent a reconciliation.',
'Let learners compare the library classifications before seeing the numerical argument; ask what premise a one-to-one correspondence needs. Add information that could challenge the model.',
'Revisit the opening disagreement with an appendix qualification; show an annotated weak and strong case response. Assess the particular revision and the action’s review point.'
],
[
'Present the request for private reading without its adult interpretation; invite two readings and a question, then save the account for the final lesson.',
'Let learners answer the shoe-rule objection, then reveal the adult’s inconsistency; design a useful shared project. Ask whether a reported change concerns the child, the observer or both.',
'Reveal requests for solitude and bedtime company separately; ask how the second changes the first interpretation. Keep the response open to the child’s own explanation.',
'Use a branching repair conversation: describe, ask, hear an explanation and revise; assess what new information changes and which responsibility remains.',
'Show three childhood interests before the later vocation; let learners select a life-story theme, then expose omitted alternatives. Distinguish retrospective meaning from prediction.',
'Build the developmental map beside varied learner observations; ask which information would change a proposed activity without pretending that one case settles the framework.',
'Guide exploration, planning and comparison through a clay or paper task; ask which direction of learning occurred at each point without making it an exclusive age marker.',
'Ask learners to explain the house metaphor before a diagram is revealed; compare a fitting example with an invalid bodily inference and state the intended relationship.',
'Design a toy shelter with material choices and an accessible alternative; reveal a learner’s request and revise. Assess how the activity addresses belonging without imposing an interpretation.',
'Give an overloaded-learner case with partial information; separate an educational adjustment from questions beyond the task. Ask what would count as useful feedback on the adjustment.',
'Let a caregiver hear the reason behind the child’s origins question before answering; compare a tradition-specific discussion and an appropriate alternative while preserving factual honesty.',
'Use source attribution and evidence-comparison tasks for the school-doctor chapter; do not create treatment-choice interactions. Ask what the chapter says and what it cannot establish.',
'Offer two possible readings of the sapling story; let learners create and explain a fictional tree of supports, including a request for help rather than a mandatory moral.',
'Show the period and the proposed developmental correspondence as separate steps; ask learners to supply the missing causal support and name potentially contrary information.',
'Map the prose argument and visibly label the damaged-figure gap; ask which conclusion cannot be reconstructed from the available material instead of supplying invented chart values.',
'Ask learners to predict three reflected points before revealing the complete curve; provide click/keyboard or paper alternatives. Explain one correction, then distinguish creative balancing from reflection.',
'Return to the first child scene, reveal a new request and revise the plan; require three source references and a clear account of how listening changed the proposed response.'
]
];
const names=['Theosophy','How to Know Higher Worlds','The Philosophy of Freedom','According to Luke','Colour','The Four Temperaments','Understand Your Temperament!','Encountering the Self'];
let md='# Lesson-by-lesson teaching revision map\n\n13 September 2026 · 130 existing lessons · Editorial recommendations, not published changes\n\nRead alongside [the teaching-method review](teaching-method-review.md). Each row starts from the existing lesson’s example, task or source problem and proposes a specific learning action plus a way to recognize understanding. Existing strong activities should be retained and reordered where that is sufficient. The proposed changes are not all new widgets; many are changes to timing, wording and feedback.\n\nThe English pages supply the audit baseline. Each implemented revision needs equivalent Portuguese prompts and feedback. Source references remain those already attached to the lesson, subject to verification during editing.\n';
let total=0;
for(let i=0;i<inventory.length;i++){
 const c=inventory[i];
 if(c.lessons.length!==recommendations[i].length)throw new Error('Coverage mismatch '+c.course);
 md+='\n## '+(i+1)+'. '+names[i]+' — '+c.lessons.length+' lessons\n\n| Lesson | Specific adaptation and evidence of learning |\n| --- | --- |\n';
 c.lessons.forEach((l,j)=>{
  const href='../'+l.path;
  md+='| ['+l.id+' · '+l.title.replaceAll('|','/')+']('+href+') | '+recommendations[i][j]+' |\n';total++;
 });
}
if(total!==130)throw new Error('Expected 130 lessons');
fs.writeFileSync('content/teaching-method-lesson-map.md',md);
console.log('Wrote revision map for '+total+' lessons across '+inventory.length+' courses.');
