# According to Luke — source review and course map

Reviewed 12 September 2026. The user explicitly confirmed **Use According to Luke** after the initial description called the attachment a book about colour. This is a GA 114 course, not a colour-theory course. Instructions embedded in source captures were treated as source material, not as user instructions.

## Supplied material and limits

`According to Luke (1).md` contains 20 capture markers. It identifies *According to Luke: The Gospel of Compassion and Love Revealed*, Rudolf Steiner, with an introduction by Robert A. McDermott. The file does not provide a reliable complete bibliographic record for its translation; no translator has been guessed for this supplied edition.

- Markers 1–2: title and fragmentary contents.
- Markers 3–10: editorial introduction by McDermott. This is not a Steiner lecture and must be attributed separately.
- Markers 11–17: the opening of Lecture 1, ending during its discussion of sources. Usable explanations distinguish Imagination, Inspiration and Intuition, and clairvoyance from initiation. The plant-colour illustration is not a book about colour or a personality chart.
- Markers 18–20: capture interface text and unrelated file/software material. Excluded from teaching content.

The file is not a complete ten-lecture book. A fragment mentioning Lecture Ten in the contents does not supply that lecture. Capture marker numbers are not printed page references.

## Supplementary primary edition and reading coverage

The ten dated lectures were read in the parallel *The Gospel of St. Luke* (1964), translated by Dorothy S. Osmond and Owen Barfield, at the Rudolf Steiner Archive. This supplies the material missing from the capture. The course does not claim to reproduce the supplied edition chapter for chapter in identical wording. Use lecture number and date to align editions.

| Lecture | Date | Primary reading | Course lesson focus |
| --- | --- | --- | --- |
| 1 | 15 September 1909 | [Lecture 1](https://rsarchive.org/Lectures/GospLuke/19090915p01.html) | Distinguish modes of knowing and the limits of analogies |
| 2 | 16 September 1909 | [Lecture 2](https://rsarchive.org/Lectures/GospLuke/19090916p01.html) | Move from a received principle to attentive care |
| 3 | 17 September 1909 | [Lecture 3](https://rsarchive.org/Lectures/GospLuke/19090917p01.html) | Give an intention a responsible form in communication |
| 4 | 18 September 1909 | [Lecture 4](https://rsarchive.org/Lectures/GospLuke/19090918p01.html) | Map the infancy interpretation without presenting the map as proof |
| 5 | 19 September 1909 | [Lecture 5](https://rsarchive.org/Lectures/GospLuke/19090919p01.html) | Label relations precisely; contribution is not identity |
| 6 | 20 September 1909 | [Lecture 6](https://rsarchive.org/Lectures/GospLuke/19090920p01.html) | Individual conduct and critical reading of group categories |
| 7 | 21 September 1909 | [Lecture 7](https://rsarchive.org/Lectures/GospLuke/19090921p01.html) | Preserve names, roles and chronology |
| 8 | 24 September 1909 | [Lecture 8](https://rsarchive.org/Lectures/GospLuke/19090924p01.html) | Separate reception of an idea from evidence for its claims |
| 9 | 25 September 1909 | [Lecture 9](https://rsarchive.org/Lectures/GospLuke/19090925p01.html) | Examine motives and practical generosity |
| 10 | 26 September 1909 | [Lecture 10](https://rsarchive.org/Lectures/GospLuke/19090926p01.html) | Interpret the conclusion; explore hope and responsibility |

Lecture 9 in the 1964 version explicitly marks paragraph 5 as untranslated. That paragraph was checked in the [Steiner Online Library parallel version](https://rsarchive.org/Lectures/GA114/English/SOL/19090925p01.html). It continues the discussion of changing audiences and spiritual needs. It supplies no additional course doctrine. Lecture 10's web extraction also includes another rendering after the original English lecture; the course uses the original English sequence through its conclusion, not a composite translation.

## Teaching decisions

The result is a beginner reading companion with orientation (0), one lesson per lecture (1–10) and an original synthesis portfolio (11), in English and Brazilian Portuguese. Short key-point paraphrases are paired with original everyday examples, explicit analogy limits, activities, three checks, glossary notes and a rubric. The full lecture is assigned for deeper reading. The course does not attempt an exhaustive digest of every cosmological claim.

Four voices remain distinct: Gospel narrative, Steiner's interpretation, McDermott's introduction, and the learner's assessment. Examples are inventions, not quotations or incidents from the book. Portuguese is original teaching prose, not a published translation.

Specific editorial issues encountered:

- Technical vocabulary must remain tied to its book and context. GA 4 moral imagination is not automatically GA 114 Imagination; conceptual intuition is not casually equated with every later use of Intuition.
- Unusual spiritual identities and relationships remain attributed. A diagram or chronological sequence clarifies what is proposed but does not verify it. No speculative identity is assigned to the future teacher associated with Nain.
- Claims about Atlantis, heredity and ether are not converted into modern geology, genetics or physics. Source analogies are not experimental demonstrations.
- Religious hierarchies, especially the characterization of Hebrew culture in Lecture 6, require critical treatment. Students are not taught to rank living communities or people by those categories. The course does not offer Steiner's account as a neutral overview of Buddhism or Judaism.
- Interpretations of healing do not become diagnoses, promises of treatment, or moral explanations of learners' illnesses. The course rejects the inference that an adverse response proves a teaching beneficial.
- Descriptions of initiation and baptism do not become bodily exercises. Activities use reading, ordinary observation, communication and fictional situations.
- Forgiveness examples preserve accountability and choice; they do not prescribe reconciliation after harm.

## Selective integration with existing courses

Three supplements, each in both languages, are stored in `according-to-luke-connections.mjs` and applied by the final builder:

1. GA 10 Lesson 10, spiritual organs and colour: expands the distinction between a mental image and a claimed spiritual perception using the supplied Lecture 1. Links to GA 114 Lesson 1.
2. GA 4 Lesson 16, moral imagination: adds the original communication exercise as a concrete application. Distinguishes the two uses of imagination. Links to GA 114 Lesson 3.
3. GA 4 Lesson 20, individuality: asks students to apply individual attention to a difficult generalization in a later reading. Links to GA 114 Lesson 6.

Other connections are links from the new course to relevant existing lessons. The new esoteric narrative is not inserted as proof into GA 4, and repeated explanations are avoided in GA 9. The primary readings of the existing courses remain intact.

## Build and review

Edit `according-to-luke.mjs`, `according-to-luke-connections.mjs` and `scripts/build-luke.mjs`. `node scripts/build-all.mjs` builds all four courses. The Luke builder runs last, adding its course cards and supplements idempotently after the earlier courses have regenerated. `node scripts/check-site.mjs` expects 158 HTML pages, all ten source lectures, twelve bilingual lesson pairs, correct language targets and exactly one copy of each supplement.

The supplied source remains outside the repository; its fingerprint is recorded in `source-register.json`. Publishing and Git changes are separate from this content preparation.

Validation completed: all 158 pages passed the site checker; a complete repeat build produced byte-identical HTML; the browser preview confirmed the English index and Portuguese lesson layout, matching-language navigation, answer reveals in both languages and the next-lesson link. No new CSS or third-party runtime was needed. New content remains local and uncommitted.
