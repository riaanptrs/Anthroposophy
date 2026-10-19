# Bees source and implementation review

The course follows the supplied 1998 Thomas Braatz translation of Rudolf
Steiner’s Bees. It teaches the prelude and all eight numbered lectures in
sequence, with separate treatment of Gunther Hauk’s introduction, the dated
appendix extracts, R. Hahn’s reported answers and David Adams’s afterword on
Joseph Beuys. Its 23 lessons are complete in English and Brazilian Portuguese.
The Portuguese teaching is an original study adaptation, not a published book
translation.

## Reading and coverage

The source register in `source-map.json` fingerprints both uploads and records
an idea or reference function for every one of the 119 supplied PDF captures.
Most captures contain two printed pages; section boundaries sometimes share a
capture. Public locators consistently identify captures, not printed pages.
The Markdown’s noisy OCR was compared with the PDF’s embedded text; extracting
each half of a spread separately resolved interleaved reading order. Covers
and blackboard plates were visually inspected. This review does not certify
every printed line or decipher every German inscription.

The 23 lesson sequence contains orientation, prelude, three lessons on Lecture
One, two each on Lectures Two through Four, three on Lecture Five, two each on
Lectures Six through Eight, appendix, afterword and synthesis. The chapter-ideas
page supplies three central points for each main source section. A 17-entry
glossary explains biological vocabulary and Steiner’s spiritual terminology.

Original explanations precede worked examples, option-specific comprehension
feedback and voluntary exercises. Source reading is optional and precisely
assigned. No full source books or historical drawings are republished. The
course uses an original decorative SVG and original diagrams proposed as
learner activities.

## Interpretation and practical limits

Cosmic correspondences, formative forces, group souls, the Old Moon and
spiritual physiology remain attributed to Steiner. Hauk’s 1998 retrospective
interpretation is not presented as independent confirmation of a prediction.
Hahn’s repeated report is not counted twice as corroboration. Adams’s Beuys
interpretation remains a separate author’s artistic reception.

Corrections accompany historical claims about infant honey, venom tolerance,
color vision, foulbrood, drone transformation and other physiology. The modern
reference list identifies the limited claim each reference supports. No
stinging, chemical preparation, disease experiment or medical treatment is an
exercise. The course’s observational activities avoid disturbing colonies.

## Integration and verification

The course is discoverable in Learn, Read Steiner and the compatible Books
index. Both languages receive the existing shared visual identity, navigation
and course workspace. The complete build owns the new routes. Existing source
banks and notebooks retain their storage namespaces.

Notes require explicit device-saving opt-in. Notes are separate per language;
study marks are shared across the language pair. Unchecking the visibly
qualified control removes only the Bees namespace. Export remains available
when storage is blocked. Native answer disclosures support reading without
JavaScript. Printable HTML and downloadable study guides exist in both
languages.

`node scripts/build-all.mjs` passed. All 49 current `check-*.mjs` validators
passed, including exact site routes, links, language pairs, existing source-bank
preservation and the new Bees coverage checks. The interaction validator runs
the shipped script in a DOM harness and checks feedback, retry, opt-in notes,
shared study marks, scoped deletion, export and blocked storage. It does not
verify actual browser layout. Ten existing Git-history checks initially hit a
sandbox child-process restriction; they passed with the required execution
access. Results are in `validation.json`.

No connected browser-control tool was available, so visual desktop/mobile and
print rendering remain unverified. The user authorized publication through the existing `main:/docs` GitHub Pages
deployment. Publication adds this course while preserving the existing hosting
configuration and audience.
