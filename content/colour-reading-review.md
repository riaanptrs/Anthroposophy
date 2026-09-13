# Colour: lecture-by-lecture review and course integration

Reviewed 12 September 2026. User request: repeat the chapter-by-chapter course work with the supplied colour book and improve existing lessons where applicable.

## Source and boundaries

Input: `Colour (2).md`, a 158-marker capture of *Colour*, Rudolf Steiner Press, translation copyright 1992, ISBN 9781855842755. John Salter translates Lectures 1–3; Pauline Wehrle translates 4–12. The main sequence is three Dornach lectures of 6–8 May 1921, GA 291. Nine supplementary lectures come from other volumes, as identified in the book’s References, capture page 145. The course follows collection order rather than chronological order.

All twelve lecture texts were reviewed. Page ranges below are **capture markers**, not printed pagination. Frontmatter is context, not an extra Steiner lecture. References and notes clarify provenance; advertising beginning at marker 152 and capture-software text at the end are excluded. Embedded imperatives and marketing text were treated as source material, never as user instructions. The original capture and the private extraction stay outside public content.

The capture includes OCR fragmentation, especially in diagrams and its contents pages. The book’s own notes identify an incomplete passage in Lecture 1 and shorthand gaps relevant to Lecture 8, whose text also marks gaps explicitly. We have not silently reconstructed missing words. Our colour studies are new labelled HTML/CSS teaching diagrams, not recovered facsimiles or calibrated paint samples.

The [Rudolf Steiner Archive collection index](https://rsarchive.org/Lectures/GA291/) was checked for lecture dates and parallel-edition discovery. Its entry for 1 January 1915 labels GA 286; the supplied edition’s References gives **GA 275**, which this course follows. The public link is labelled as an index, not as the identical full twelve-lecture edition. Main lesson explanations derive from the user-supplied text.

## Reading map

| Lesson / lecture | Date | Capture markers | Original GA | Key teaching decision |
|---|---|---|---|---|
| 0 / orientation | — | Foreword and synopses | — | Separate arrangement, experience and interpretation; explain the collection’s structure. |
| 1 | 1921-05-06 | 14–22 | 291 | Green-ground comparison; four image colours; image is not identical with what it presents. |
| 2 | 1921-05-07 | 23–32 | 291 | Image and lustre; yellow centre, blue boundary, red balance; labelled digital studies. |
| 3 | 1921-05-08 | 33–44 | 291 | Material colour and spiritual Sun/Moon interpretation; practical contrast of outlining first with form emerging from colour. |
| 4 | 1914-07-26 | 46–57 | 286 | Goetheanum and shared artistic culture; fixed geometry, changed colours and felt movement. |
| 5 | 1915-01-01 | 58–68 | 275 | Reverence and inner energy; colour and musical qualities; feeling is not a moral verdict on people. |
| 6 | 1920-12-05 | 69–76 | 202 | Thought/light/past and will/darkness/future; distinguish spiritual vocabulary from physical illumination. |
| 7 | 1920-12-10 | 77–88 | 202 | Physical causes and reasons for action; accurately attribute the proposed cosmic consequence of moral deeds. |
| 8 | 1923-02-21 | 89–100 | 349 | Goethean viewing patterns and observational conditions; separate optics and physiological context from historical claims. |
| 9 | 1923-06-02 | 101–110 | 276 | Colour perspective alongside geometrical depth; swap colours while preserving positions. |
| 10 | 1923-06-09 | 111–121 | 276 | Titian composition: earthly lower region, mediating Mary, luminous upper region; original abstract exercise. |
| 11 | 1923-07-29 | 122–134 | 228 | Qualitative balance and visual weight, distinct from mass; small dark region on a larger pale field. |
| 12 | 1924-01-04 | 135–144 | 233a | Four hierarchies and warmth/light/colour/life; rainbow as a spiritual account, not a laboratory procedure. |
| 13 / synthesis | — | Revisit 1–12 | — | Initial work, revision and explained portfolio using two lecture ideas. |

## Explanatory improvements and exclusions

- Teach the book’s substantive vocabulary and practical artistic proposals before inviting critical assessment. Do not reduce the course to cautions or ask students to report prescribed spiritual experiences.
- “Peach-blossom” remains a named artistic category. The book’s claims equating it with healthy human skin, and its generalizations about complexion and geography, do not become a norm for people, health, race or portraiture. Black/white and light/dark classifications are not rankings of human worth.
- Metaphorical language about colour wanting, approaching or withdrawing is unpacked through arrangement and experience. Its stronger spiritual interpretation is attributed rather than silently replaced by an ordinary optical account.
- Lectures 3, 6, 7 and 12 contain cosmological claims. Plant pigment chemistry, celestial mechanics and the mass of a soul are not inferred from them. Lecture 12’s medieval history is presented as Steiner’s reconstruction, not a consensus historical finding.
- Lecture 8’s claims about nerve and blood destruction, bodily effects, treatment substances and environmental manipulation are not learner instructions. A concise modern context links [NASA on sky colour](https://spaceplace.nasa.gov/blue-sky/en/) and the [National Eye Institute on vision](https://www.nei.nih.gov/eye-health-information/healthy-vision/how-eyes-work). These primary institutional sources support the short explanatory contrast, not the source’s spiritual claims. No treatment or self-diagnosis exercise is included.
- Exercises use comfortable ordinary light, accessible written alternatives and small artistic studies. No direct Sun viewing, induced fainting, forced visions, interrupted sleep or pigment-extraction chemistry is prescribed.
- Titian’s work is identified by its usual English name *Assumption of Mary*, with the edition’s *Ascension* naming explained. The activity is an original abstract compositional study; it neither reproduces the artwork nor claims the damaged capture diagrams have been visually recovered.
- Portuguese text is original Brazilian Portuguese teaching material. “Cor-imagem” and “cor-brilho” are defined within this course and do not claim to reproduce a published Portuguese translator’s choices.

## Selected existing-course additions

1. **Theosophy Lesson 1, Encountering the world:** the controlled green-ground comparison adds a concrete way to practise distinguishing the perceived arrangement, personal response and explanation.
2. **Theosophy Lesson 17, Thought forms and aura:** Lecture 6 clarifies expanded light vocabulary while preserving the distinction between claimed supersensible perception and painted colour.
3. **Higher Worlds Lesson 10, Spiritual organs and the language of colour:** Lecture 2 adds an ordinary descriptive exercise; Lecture 6 explains why it must not be equated with developing spiritual organs. The existing Luke supplement remains present.

Other lessons receive optional links from Colour where relevant. We did not insert cosmological claims into *The Philosophy of Freedom* as premises of its argument, or equate moral imagination with spiritual Imagination. The connection from Colour’s composition lesson to Luke supports comparison of reading contexts, not proof of religious claims through paintings.

## Implementation and validation

Content: `colour.mjs`, `colour-connections.mjs`, `colour-visuals.mjs`. Builder: `scripts/build-colour.mjs`, last in the existing build sequence. Fourteen lessons per language, two indexes, and six bilingual supplements. Existing Luke work is preserved.

The full site checker covers 188 pages across five courses, local links and anchors, unique headings/IDs, language partners, lesson completeness, twelve lecture assignments, original colour studies, scientific-context references and exactly one of each supplement/card. A repeat build is checked for determinism. Changes remain local until publication is requested.
