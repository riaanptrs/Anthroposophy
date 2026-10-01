# Higher Worlds course revision — 30 September 2026

The nineteen Higher Worlds lessons in English and Brazilian Portuguese have been reformulated around the supplied *How to Know Higher Worlds2.pdf*. The route retains its orientation, seventeen book lessons and final synthesis, along with existing lesson URLs and notebooks. It now follows the book's argument in greater detail, with individual reading assignments, selected source passages, Portuguese study translations and chapter-based comprehension work. Thirteen selections quote the supplied English PDF; six retain the original German passages and existing study translations, with new close-reading notes and separate references to the related PDF discussion.

## Which uploads were usable

| Upload | Actual contents | Use in this revision |
| --- | --- | --- |
| `How to know Higher Worlds.pdf` | Twenty screenshot pages of Frederick Amrine's *The Essential Philosophy of Freedom*, third expanded edition, copyright 2022 | Excluded from the GA 10 source base: this is a different book. |
| First `How to know Higher Worlds.md` | Transcription of the same Philosophy of Freedom capture | Excluded from GA 10. |
| `How to know Higher Worlds2.pdf` | 108 screenshot pages of Rudolf Steiner's *How to Know Higher Worlds*, Dead Authors Society, copyright 2018 | Primary source for page-by-page review and selected excerpts. |
| Second `How to know Higher Worlds.md` | Byte-identical to the first Markdown upload | Duplicate; excluded from GA 10. |

The two PDFs are different works, rather than alternative editions of GA 10. Neither uploaded Markdown transcribes the usable Higher Worlds PDF. Its native page images were therefore extracted and OCR was performed separately on the three columns, preserving their reading order. The full recovered text and images remain in the ignored `.sources/` directory. Fingerprints and source decisions are recorded in the [source register](source-register.json).

## What the lessons now teach

The early sequence explains dormant capacities, reverence for truth, enjoyment transformed into knowledge and service, inner tranquillity, the distinction between the ordinary and higher human being, and meditation as directed thought. Preparation covers growth and decay, the significance Steiner assigns to thoughts and feelings, attentive listening, the inner word and the study of spiritual-scientific writings. Illumination includes the mineral–plant–animal comparison, the seed and growing-plant exercises, and the relationship between inner perception, patience and character.

The initiation sequence explains the fire, water and air trials, spiritual script, sound judgment, self-control and presence of mind. Practical guidance reconnects patience, desires, self-knowledge and tact with daily work. All seven training conditions are taught in their actual order, including health as conscientious effort, responsibility, inward duty, revisable resolve, gratitude and harmony.

The later lessons explain the spiritual organs and their figurative names while preserving Steiner's claim that they refer to realities. They cover the sixteen-, twelve-, ten- and six-petalled organs, the eight functions and six qualities, etheric currents, the four attributes, self-knowledge, dream transformation, continuity of consciousness, and the separation and coordination of thinking, feeling and willing. The Guardian lessons distinguish the lesser and greater encounters, confront character and karma, and trace the turn toward service. The racial and national hierarchy on PDF page 101 is explicitly examined as a historical claim and rejected as a measure of individual worth.

The appendix lesson explains pure thought, the distinction from mediumistic states, the limits of descriptive language, the book's role as personal instruction, and continued competence in ordinary life. The final synthesis asks learners to explain the book's progression and connect it accurately with *Theosophy*, using evidence and distinguishing what an everyday example can establish.

## Page-by-page notes and source limits

Every one of the 108 PDF pages has a separate reading record, including contents, the two part dividers, overlapping chapter boundaries and the final appendix page:

- [Front matter and appendix: PDF 1–4 and 102–108](higher-worlds-page-notes-front-and-appendix.md)
- [Preparation: PDF 5–34](higher-worlds-page-notes-preparation.md)
- [Initiation and spiritual organs: PDF 35–67](higher-worlds-page-notes-initiation.md)
- [Consciousness and the Guardians: PDF 68–101](higher-worlds-page-notes-consciousness.md)

The capture contains the body sequence and an appendix ending in a complete paragraph. It includes an editorial preface quoting the author's September 1914 preface; it does not supply a separately reproduced set of author prefaces. Completeness against an external authoritative edition has not been established. No English translator is credited in the supplied capture, so none is invented. The 2018 date identifies this reproduction, rather than the composition of the original book.

Digitization errors occur in the images themselves, including damaged quotation marks and intrusive fragments. The thirteen selected English excerpts avoid those defects and are checked visually. The six retained German passages have their original paragraph references and study translations; related PDF references identify the discussion, rather than an exact English quotation. Reading explanations paraphrase the intelligible argument; uncertain source wording is recorded rather than silently reconstructed. Assignments use PDF pages; English excerpts also identify the screenshot column, while German passages keep their original paragraph locators. Embedded references to printed pages belong to an earlier pagination and are not treated as the PDF's page numbers.

## Implementation and verification

Main content is in `higher-worlds.mjs`; passages and close-reading notes are in `passage-study.json`. The source credits in both course indexes and all lesson pages use the current PDF. Four GA 10 supplements in Theosophy have matching page references, and guided opening questions follow the revised lesson concepts. Other course routes and notebook identities are retained.

Run the complete build and all `scripts/check-*.mjs` validators. The dedicated `check-higher-worlds.mjs` checks the 108 page records, nineteen bilingual lessons, nineteen individual source selections, source provenance, reading coverage and generated output. Validation passed: the complete build and all eleven check scripts, covering 398 HTML pages; ten general preview checks and forty Higher Worlds HTTP checks, covering both indexes and all thirty-eight lesson pages; and byte-identical repeated output across 414 static artifacts. All non-GA 10 passage records and other courses' guided prompts were preserved. The Theosophy checker confirms its prior 228-page revision remains intact. These are local repository changes; this review does not establish a deployment.
