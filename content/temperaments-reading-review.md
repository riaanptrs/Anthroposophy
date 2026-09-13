# The Four Temperaments: source review and teaching map

Reviewed 12 September 2026. Request: repeat the preceding bilingual course-development workflow with the supplied book and make relevant existing-course improvements.

## Source and capture limits

The supplied `The Four Temperaments.md` has 31 numbered capture pages. Its imprint identifies Rudolf Steiner Press 2012, B. Kelly’s translation first published in 1987, revised by Matthew Barton with translation copyright 2008. It contains **one lecture**, not a chapter collection: Berlin, 4 March 1909, GA 57. Course sections are explicitly identified as original teaching divisions.

The supplied lecture text was read throughout, including education and self-education. Capture pages 15 and 18 are blank within continuing text; page 13 loses part of the sanguine mapping, page 14 has damaged wording, and page 21 loses the end of a historical extreme-outcome description. Page 28 is blank after the surviving closing text. The publisher’s note on page 29 is interrupted by a blank page 30. The contents list Notes and Further Reading without usable corresponding captured sections. Page 31 is advertising and was excluded. Source instructions, advertising and publisher text were treated as document contents, not as user commands.

Two primary parallel resources were checked:

- [The Four Temperaments, Brian Kelly, 1987](https://wn.rudolfsteinerelib.org/Lectures/GA057/English/AP1987/19090304p01.html): complete parallel English lecture, including the inward-contentment passage, bodily descriptions, and final social aim of responsive human love. This is the public reading link. It is not presented as the identical Barton revision.
- [GA 57 German/English comparison, 4 March 1909](https://rsarchive.org/Lectures/GA057/Compare_12.php?version=TP): confirms the date, the four-member mapping (§7), descriptive sequence (§§9–14), and qualification about mixtures (§16). Its wording is distinct from the supplied revision.

Only brief paraphrases of missing material are used. The original source is not copied into the public site; its fingerprint is recorded in the source register. Assignments use capture page numbers plus an explicit parallel-edition note where gaps matter. No missing wording is silently invented or attributed to the supplied capture.

## Course structure

| Lesson | Topic | Capture reading | Teaching purpose |
|---|---|---|---|
| 0 | Meet the person before the type | 6–7; 19–20 | Explain one-lecture structure, individuality and limits of labels. |
| 1 | Two streams and their meeting | 7–12 | Temperament as intermediary between heredity and proposed reincarnating individuality; analogy is not proof. |
| 2 | Four members, four tendencies | 12–14 + parallel | Correct mapping; all four members belong to the person; predominance is relational. |
| 3 | Choleric | 14; 16–17; 22–23 | Purpose, resistance and competence; original construction example. |
| 4 | Sanguine | 14–15; 21–22 + parallel | Readily awakened, changing interest; original bounded attention activity. |
| 5 | Phlegmatic | 15; 24–25 + parallel | Inward contentment and engagement through companions’ interests. |
| 6 | Melancholic | 15–16; 23–24 + parallel | Burden, sensitivity and compassion; acknowledge personal feeling. |
| 7 | Mixtures and appearance | 16–21 + parallel | Pure types do not occur; examine generalizations and counterexamples. |
| 8 | Education | 21–25 | Compare four proposed routes; start with a capacity already present. |
| 9 | Self-education | 25–27 | Reason arranges situations indirectly; small reviewable practice. |
| 10 | Synthesis | 6–27 + parallel closing | Fictional case, source concept, counterexample and revisable response. |

Each language has eleven lessons with examples, source explanations, glossary, activity, three explained checks, rubric and relevant cross-course link. Lessons 2 and 8 have a semantic comparison table; orientation and synthesis use a three-step observation-to-response sequence. No personality scoring, physical-feature portraits or diagnostic quiz is added.

## Editorial judgments

- Retain Steiner’s spiritual explanation and distinguish it from the practical example. Do not quietly redefine etheric, astral or I-bearing members as modern psychological measurements.
- Teach the four correspondences accurately: I-bearer/choleric, astral/sanguine, etheric/phlegmatic, physical/melancholic. No pairing signifies greater human worth or sole possession of a member.
- Explain the source’s biological comparisons as parts of its argument, without treating differences between relatives as proof of a previous life. Do not re-teach its embryological recapitulation or historical-science anecdotes as established contemporary biology/history.
- Acknowledge physiological and physiognomic claims explicitly. Body size, eye colour and gait do not become classification tools in this course. Historical psychiatric language is not reproduced as an illness prediction, intelligence ranking or contemporary diagnostic framework.
- The source’s child-guidance claims are proposals, not demonstrated universal outcomes. Affection, companionship, understanding and capable guidance are not restricted to assigned types.
- Label adaptations clearly: achievable challenges instead of engineered conflict; predictable activities instead of withdrawal of affection; voluntary ordinary acts of care instead of manufactured distress; manageable practice instead of anger provocation or prolonged boredom. The distinction between source and adaptation is visible in student text.
- The final case remains fictional and revisable. Students may understand the book without claiming to diagnose someone or accepting every spiritual proposition.

## Existing-course improvements

1. **Theosophy Lesson 6:** compare the purpose of this fourfold map with the several classifications in GA 9. Explain predominance rather than separate human kinds.
2. **Higher Worlds Lesson 7:** add a concrete application of patient attention through an existing capacity and a response that can be revised.
3. **Philosophy of Freedom Lesson 20:** compare mixed temperaments with individuality beyond generic descriptions. The later lecture does not supply a necessary spiritual-physiological premise for GA 4’s argument.

All three supplements are bilingual. Existing Luke and Colour supplements remain intact. Other courses are linked where relevant without adding repetitive source blocks throughout the site.

## Files and checks

Edit `content/temperaments.mjs` for lessons and connections, `content/temperaments-visuals.mjs` for the reading maps, and `scripts/build-temperaments.mjs` for rendering. Scoped table styles are in `docs/temperaments.css`. The builder runs after Colour and adds one card per homepage and one block per target lesson.

The site now comprises six bilingual courses and 212 HTML pages. Validation covers links, anchors, headings, language partners, reading assignments, lesson sections, eleven ordered lessons, comparison tables and nonduplicated supplements. A repeat build is checked for identical generated output. Current additions remain local, following the established prepare-then-publish workflow.
