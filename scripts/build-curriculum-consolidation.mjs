import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {mysteryLessons} from '../content/mystery-temperaments.mjs';
const inventory=JSON.parse(fs.readFileSync('content/teaching-audit-inventory.json','utf8'));
inventory.push({course:'mystery-temperaments',lessons:mysteryLessons.map(l=>({id:String(l.id).padStart(2,'0'),title:l.en.title,goal:l.en.goal,path:`docs/mystery-temperaments/lessons/${String(l.id).padStart(2,'0')}.html`}))});
const names={'theosophy':'Foundations / Theosophy','higher-worlds':'Self-observation and the path of knowledge','philosophy-of-freedom':'Thinking and freedom','according-to-luke':'According to Luke','colour':'Colour and artistic practice','temperaments':'The Four Temperaments','understand-temperament':'Understand Your Temperament!','encountering-the-self':'Understanding the developing child','mystery-temperaments':'The Mystery of Temperaments'};
const destinations={
 'temperaments':['T01','T02','T02','T03','T04','T05','T06','T07','T08','T11','T12'],
 'understand-temperament':['T01','T07','T02 + optional source comparison','T03','T04','T05','T06','T09','T10','T02 / T12','T07 + optional source comparison','Optional: historical body-type models','T12'],
 'mystery-temperaments':['T01','T01','T02: optional deeper reading','T02: optional deeper reading','T02','T02','T07','T07','T04','T03','T06','T05','T11','T10 / T12','T12']
};
const special={
 'theosophy':{
 0:'Shorten to one course orientation; link the shared site introduction and study method.',
 1:'Retain the body/soul/spirit foundation; link later courses here instead of repeating the full introduction.',
 2:'Retain: bodily event versus inner experience is distinct from Lesson 03’s life/sensation distinction.',
 3:'Retain; use the same foundation diagram as Lesson 02 with a new relationship highlighted.',
 5:'Retain as the primary reference for the I; other courses need a short recall link.',
 6:'Retain the classification inquiry; reuse its basic diagram in temperament T02 without repeating the whole lesson.',
 7:'Candidate combined unit with 13: memory and capacity, followed by the spiritual extension. Preserve the extra premises.',
 8:'Retain the reincarnation argument; temperament T02 can link here for depth.',
 9:'Retain: consequences and destiny are not the same question as repeated lives.',
 13:'Candidate combined unit with 07, in two stages; do not make ordinary learning evidence for spiritland.',
 17:'Retain as spiritual-source interpretation; link Colour, but do not equate aura descriptions with painting effects.',
 18:'Shorten repeated arithmetic to a recall task and link the fuller thinking activity in Philosophy of Freedom 04.',
 19:'Shorten repeated disagreement setup; link Higher Worlds 07 for extended practice, retaining this book’s claim.',
 20:'Retain a brief source-specific application; link Philosophy of Freedom 15–17 for purpose and action.',
 21:'Retain a bridge to Philosophy of Freedom, not a second introductory course on freedom.',
 22:'Retain one foundation synthesis; do not require every optional supplement in the core assessment.'
 },
 'higher-worlds':{
 0:'Short orientation with optional foundation recall, not another body/soul/spirit lesson.',
 2:'Retain self-observation; share the observation/inference notebook with Lesson 03.',
 3:'Retain listening as the new task; remove repeated instructions already learned in 02.',
 7:'Retain as the full equanimity practice; other courses can link here.',
 8:'Candidate combined unit with 09: one map of all seven conditions, two activity stages.',
 9:'Combine with 08 if the source reading fits; retain conditions four through seven explicitly.',
 10:'Retain: spiritual colour vocabulary is not interchangeable with the Colour studio.',
 12:'Retain but pair with 13 in navigation: dream imagery and continuity make different claims.',
 13:'Retain as a second stage after 12; do not collapse sleep, recall and the claimed continuity.',
 14:'Use a brief foundation recall, then teach this chapter’s additional claim about separation and coordination.',
 15:'Retain and compare with 16 using one shared two-stage map.',
 16:'Retain the greater Guardian’s distinct role; a shared diagram should not erase it.',
 18:'Retain one synthesis; reuse notebook entries instead of requesting a new opening case.'
 },
 'philosophy-of-freedom':{
 0:'Retain a short orientation to knowing and acting; move general site-use directions out.',
 2:'Candidate combined unit with 03: one event, a question, competing explanations and the contribution of thinking.',
 3:'Combine with 02 as a second step, retaining the difference between observation and conceptual connection.',
 4:'Retain as the main thinking-process exercise; replace duplicate full arithmetic elsewhere with recall links.',
 5:'Retain the changing-view experiment; Lesson 06 addresses an additional argument, not another viewing exercise.',
 6:'Retain the argument and objection about representations; do not merge merely because both lessons say perception.',
 8:'Retain shared concepts; link foundation terminology rather than adding a full glossary lesson.',
 9:'Retain the distinction between recognizing another example and recognizing the same individual object.',
 11:'Retain the philosophical criticism of one-sided accounts; use a short thinking/feeling/willing recall.',
 12:'Keep as step one of a paired unit with 13: aim, motive and capacity must be distinguished before free action.',
 13:'Keep as step two after 12; helpful behaviour alone does not establish ethical freedom.',
 15:'Retain the purpose timeline; link it from other courses instead of repeating its full exercise.',
 16:'Candidate combined unit with 17: ethical insight → imagined proposal → practical means.',
 17:'Combine with 16 in three explicit stages; retain practical constraints and the source’s additional argument.',
 18:'Candidate combined unit with 19: desire, enjoyment and the value of a particular aim.',
 19:'Combine with 18 using one revisited project; preserve the opponent’s argument and Steiner’s reply.',
 20:'Retain the philosophical argument about individuality; link temperament T01/T07 for application rather than re-teach types.'
 },
 'according-to-luke':{
 0:'Short source-specific orientation; shared claim/interpretation guidance should be a reusable site resource.',
 1:'Retain technical spiritual terms in this lecture’s context; link the general knowledge route.',
 2:'Retain the lecture; replace generic care practice with a source-specific task. Carry one care case through 03 and 09.',
 3:'Retain the lecture’s distinctive claims; continue the case from 02 instead of beginning another similar exercise.',
 4:'Retain; begin one persistent relationship map used again in 05 and 07.',
 5:'Retain; add named relationship arrows to the map from 04 rather than repeat the whole map lesson.',
 6:'Retain the source claim; link individuality practice instead of another general anti-stereotyping introduction.',
 7:'Retain; add the chronology to the shared 04/05 map. Different stages are not duplicate lessons.',
 8:'Retain the healing-text interpretation; link the shared source/evidence guide instead of repeating generic study advice.',
 9:'Retain the lecture-specific argument; revisit the care case from 02/03.',
 10:'Retain: the concluding religious interpretation has a distinct learning aim.',
 11:'Retain one synthesis with the accumulated passage map and care case.'
 },
 'colour':{
 0:'Short studio orientation; fold generic study instructions into the shared site guide.',
 1:'Retain the source’s image-colour framework; introduce it once.',
 2:'Retain the centre/edge experiment as the reusable studio comparison method.',
 3:'Retain the process of forming through colour; it differs from depth and visual movement.',
 4:'Pair with 09 through a shared studio project; movement and depth need distinct prompts.',
 5:'Retain qualitative response; link spiritual-vocabulary cautions rather than repeat aura theory.',
 6:'Retain the light/thought and darkness/will relations; use one conceptual map carried into 07.',
 7:'Retain its additional nature/action bridge; link freedom’s motive/purpose vocabulary.',
 8:'Retain observation under changed backgrounds; its learning aim differs from the centre/edge activity.',
 9:'Continue the project from 04 with colour depth and overlap as separate variables.',
 10:'Candidate combined composition unit with 11: three regions, visual weight and a revised balance.',
 11:'Combine with 10 using the same artwork; retain the distinction between visual and physical weight.',
 12:'Make an optional advanced spiritual-cosmology reading in the studio route; retain it in the complete book companion.',
 13:'Retain one portfolio built from earlier studies; use “prepare/export”, not “submit”, without an instructor service.'
 },
 'encountering-the-self':{
 0:'Short child-development orientation; link temperament observation basics without assuming one typology explains a child.',
 1:'Retain the particular Peter case and meaningful participation.',
 2:'Retain the Monica case; fear and privacy need their own context, not a temperament category.',
 3:'Retain the staged repair conversation; link from temperament T08 as an optional practice.',
 4:'Optional biographical reading: useful perspective, not essential before the practical child-observation sequence.',
 5:'Candidate combined developmental-map unit with 06 and 07; keep the book’s concepts and age distinctions explicit.',
 6:'Second stage of combined 05–07: compare doing, perceiving and feeling without treating ages as fixed measures.',
 7:'Third stage of combined 05–07: use the house metaphor and name its limits.',
 8:'Candidate combined practical studio with 15: design a curriculum activity and test one accessible drawing example.',
 9:'Retain a practical observation/support case; do not reinterpret difficulty as temperament.',
 10:'Pair with 12 as optional story and religious-image work, clearly retaining each source’s setting.',
 11:'Optional critical source-reading module with 13/14; preserve its separate author and historical-care context.',
 12:'Optional story activity linked from 10; do not require one religious reading of the imagery.',
 13:'Optional critical source-reading module: astronomical correspondence and evidence; no replacement for the child case.',
 14:'Optional critical source-reading module: damaged figure and anatomical claim; preserve the capture limitation.',
 15:'Combine with 08 as a worked curriculum example; also link from Colour without duplicating the exercise.',
 16:'Retain one child-development synthesis from the original case.'
 }
};
const outline=[
 ['T01','Meet the person before the type','Observe a person in two situations; separate behaviour from inference. One introduction and one continuing case.','Steiner + Mystery openings; Childs orientation'],
 ['T02','The four tendencies and their background','Compare the four patterns, distinguish tendency from fixed identity, and give a concise attributed account of Steiner’s framework.','Steiner framework; Mystery two streams/four members; Childs map as an optional comparison'],
 ['T03','Purpose and resistance: choleric','Compare insistence with capable action; revise specific feedback after hearing new information.','Steiner/Mystery guidance + Childs initiative and correction'],
 ['T04','Interest and follow-through: sanguine','Build a small task from an existing interest with a completion point and a planned return.','Steiner/Mystery interest + Childs commitments'],
 ['T05','Steadiness and participation: phlegmatic','Offer preparation time and two ways to contribute; recognize quiet engagement.','Steiner/Mystery invitation + Childs privacy and steadiness'],
 ['T06','Sensitivity and care: melancholic','Acknowledge a concern, ask a question and offer optional practical help.','Steiner/Mystery compassion + Childs concern and assumptions'],
 ['T07','Mixtures, context and change','Revisit the original impression using a counterexample; compare disagreements between the authors about change and recognition.','All three; physical-recognition material treated critically'],
 ['T08','Supporting a learner','Choose between two supports for one learning task and revise after an observed response. Apply the four earlier lessons rather than re-teach them.','Steiner education comparison; Mystery educational passages; optional Koepke repair case'],
 ['T09','Working together','Match tasks to demonstrated skills, preferences and support needs; agree a review point.','Childs workplace chapter'],
 ['T10','Relationships and communication','Discuss differences in pace, privacy and decisions. Use selected pairing questions with no compatibility score.','Childs relationships; Mystery’s social aim'],
 ['T11','Self-education through a small experiment','Choose a habit, change one circumstance, set a limit and evaluate what happened.','Steiner + Mystery indirect self-education; Childs practical contributions'],
 ['T12','A more attentive encounter','Return to the opening case: explain one concept, use two named sources, identify a disagreement or limit, and propose a revisable response.','One synthesis replacing three final projects']
];
let report=`# Curriculum consolidation review

13 September 2026 · Proposal, not a published website change

## Decision

Create **one learner-facing course on temperaments**, drawing on three named sources. Replace the three competing course cards with one twelve-lesson path. Keep the current book companions as optional source-study material with their existing URLs and notebooks.

The present catalogue was organized by incoming books. That preserved source coverage but made overlapping books look like three different subjects. The next stage should organize the main navigation by what a learner wants to understand. A new book should enrich the relevant course unless it introduces a genuinely distinct aim.

The three existing temperament companions contain **39 lessons**: 11 from The Four Temperaments, 13 from Gilbert Childs, and 15 from The Mystery of Temperaments. A twelve-lesson core removes 27 required lesson stops (about 69%). This is a count of stops, not a measured reduction in learning time. Do not paste 39 lessons into twelve oversized pages.

## Basis and limits of this review

Reviewed the objectives, everyday examples, activities and source-review records represented in the previous 130-lesson inventory, the current guided-study implementation and the fifteen new Mystery lessons. The appendix accounts for all 145 existing lesson identities and verifies their current pages. English and Portuguese should share the resulting architecture. This is a curriculum and duplication review, not a new translation review, factual verification of every source claim, or evidence from learner testing.

## The proposed temperament course

Working title: **Understanding Temperaments: People, Relationships and Self-Development**. Portuguese: **Compreendendo os temperamentos: pessoas, relações e autoeducação**.

| Lesson | Focus | Learner's task | Principal contribution |
|---|---|---|---|
${outline.map(r=>'| '+r.join(' | ')+' |').join('\n')}

The first seven lessons form the conceptual core; Lessons 8–11 apply it in distinct settings, and Lesson 12 brings the work together. A learner can read an application independently after the core, but the full route retains all four settings.

### What to combine, and what to preserve

- Combine the three introductions and three final projects into one beginning and one returning case.
- Teach each temperament once. Bring the short Steiner passages and Childs’s additions together within that lesson, with explicit attribution.
- Put the two-stream/four-member background in a concise, clearly attributed explanation. Offer the longer spiritual argument as optional reading, with a link to the foundation course.
- Keep work and relationship lessons: these are substantial additions from Childs, not repetitions to discard.
- Keep an optional comparison on the authors’ claims about stability, change and recognition from appearance. Do not silently smooth disagreements into a single doctrine.
- Move the historical body-type speculation and detailed comparison tables out of the required beginner sequence. Preserve access and explanations of source limitations.
- Distinguish the two Steiner lecture treatments from Childs’s later interpretation. “The books say” is inadequate where only one author makes a claim.

For example, the sanguine lesson would use one unfinished-project situation. The learner proposes a next step; a short Steiner/Mystery explanation introduces working through existing interest; Childs adds a clear commitment and completion point; new information changes the plan; the learner revises. Three readings deepen one learning event instead of creating three lessons with similar beginnings.

Use one main question, one explanation, one meaningful practice and a brief revision per lesson. Offer a second source and extended exercise when useful. Keep Brian-inspired attempts, diagrams and feedback, but remove generic repeated tasks that merely make every page longer. A short guided session is a design aim to test; source reading and practice take additional time.

## The other six subject routes

| Route | Current lessons | Recommendation |
|---|---:|---|
| Foundations / Theosophy | 23 | Keep the distinct framework. One primary introduction to body/soul/spirit; link it elsewhere. Consider a two-stage memory/capacity unit from 07 and 13. |
| Self-observation and the path of knowledge | 19 | Keep distinct from foundation theory. Combine the two halves of the seven conditions (08–09); retain differences among dreams, continuity and the Guardians. |
| Thinking and freedom | 21 | Keep its philosophical argument. Candidates: 02+03, 16+17, 18+19. Do not merge perception with its epistemological objection or motives with the claim of free action. |
| According to Luke | 12 | Keep as a specialized source course. Reuse one evolving map in 04/05/07. Replace repeated general care exercises in 02/03/09 with source-specific work and one continuing case. |
| Colour and artistic practice | 14 | Keep a studio route. Reuse a project for movement/depth; combine composition and balance (10–11). Spiritual cosmology can be optional for the studio route while retained in the complete book companion. |
| Understanding the developing child | 17 | Keep Koepke separate from temperament. Candidates: one developmental map from 05–07, one curriculum studio from 08+15. Biography and specialist appendices become optional reading branches. |

These are targeted candidates, not a quota requiring every course to be shorter. A recurring word does not make a lesson redundant: “colour” in an aura description and colour in a painting have different roles; a general account of thinking differs from a philosophical argument about knowledge. The all-lesson appendix records these distinctions.

## Proposed navigation and source access

Seven primary subject cards: foundations; thinking and freedom; self-observation; temperaments; child development; colour; Luke. A separate **Book library / Read by source** keeps all nine source companions available. Show optional preparation links rather than forcing everyone through every course.

The shared site guide should explain observation versus inference, reading references, notebook use and evidence types once. Lessons still need brief context where a particular claim requires it. Repetition is useful when it asks for recall or a changed application; repeating the same explanation and questionnaire is less useful.

Implementation should add the consolidated temperament route first, update the catalogue and label the three former cards as source companions. Keep existing source URLs accessible so bookmarks and saved notes continue working. New course progress starts separately; do not mark a merged lesson complete simply because one old source lesson was marked studied. Provide access to old notes and let learners carry useful entries forward. Apply the same twelve lessons and source attributions in Portuguese.

The public website is unchanged by this review. No lessons or saved work have been removed.

## All-lesson disposition map

“Retain” means the lesson contributes a distinct aim; it does not mean its present wording needs no editing. Combined-unit candidates need one rewritten teaching sequence, not concatenated pages. T01–T12 refer to the consolidated temperament outline above.
`;
let total=0,temperamentTotal=0;
for(const c of inventory){
 report+=`\n### ${names[c.course]} — ${c.lessons.length} lessons\n\n| Current lesson | Proposed disposition |\n|---|---|\n`;
 for(const l of c.lessons){
  const id=Number(l.id);assert.ok(fs.existsSync(l.path),l.path);const current=fs.readFileSync(l.path,'utf8');assert.ok(current.includes('data-study-id='),l.path);
  const destination=destinations[c.course]?.[id];if(destination)temperamentTotal++;
  const decision=destination?`Integrate into **${destination}**; retain this page as a named-source reading.`:(special[c.course]?.[id]||'Retain its distinct source-specific question; remove duplicated general instructions and use shared recall links.');
  report+=`| [${l.id} · ${l.title.replaceAll('|','/')}](../${l.path.replaceAll('\\','/')}) | ${decision} |\n`;total++;
 }
}
assert.equal(total,145);assert.equal(temperamentTotal,39);
report+='\n## Supporting editorial records\n\n[Earlier teaching-method review](teaching-method-review.md) · [Guided implementation](guided-study-implementation.md) · [Four Temperaments source review](temperaments-reading-review.md) · [Childs source review](understand-temperament-reading-review.md) · [Mystery source review](mystery-temperaments-reading-review.md)\n';
fs.writeFileSync('content/curriculum-consolidation-review.md',report);
const links=[...report.matchAll(/\]\(([^)]+)\)/g)].map(m=>m[1]);
for(const link of links)assert.ok(fs.existsSync(path.resolve('content',link)),link);
console.log(`Verified ${links.length} report links.`);
console.log(`Wrote curriculum proposal: ${total} lessons accounted for, ${temperamentTotal} mapped into one temperament path.`);
