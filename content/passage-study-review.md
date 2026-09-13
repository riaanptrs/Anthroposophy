# Passage-led course revision

All ten primary courses now begin each lesson with a selected source passage, a specific explanation of its wording, and the lesson's central question. The existing chapter teaching opens immediately. Examples, written responses, source comparison and application follow it. English and Brazilian Portuguese have matching coverage: 140 core sessions plus six optional Philosophy of Freedom exercises, or 292 pages.

`passage-study.json` contains 133 selections, with explicit assignments where orientations, synthesis lessons or optional exercises revisit a passage. Each entry records author, work, location, edition, source wording, translations and original course commentary. It is the editable build input; full books remain private. `build-passage-study.mjs` runs last in the complete build.

## Editions and verification

- Theosophy: supplied 1971 Monges/Church English edition, checked against extracted PDF text; printed page references account for the PDF's front matter.
- How to Know Higher Worlds: original German GA 10, with new English and Portuguese study translations. These excerpts have their own paragraph references; the older 107-page transcription references still identify the wider reading assignment.
- Philosophy of Freedom: public 1916 Hoernlé English edition. Its opening chapter, The Goal of Knowledge, precedes the chapters numbered 1–14 in later editions. Source links identify the corresponding chapter. The excerpt credit distinguishes this edition from the later 1918 additions discussed in the course.
- Practical Training in Thought: original German GA 108, with new English and Portuguese study translations.
- Understanding Temperaments: original German GA 57 plus selected passages from the supplied Gilbert Childs book. Each passage names its author, so Childs's interpretation is not attributed to Steiner.
- According to Luke: original German GA 114 across all ten lectures, with new study translations; not presented as quotations from the incomplete supplied English capture.
- Colour: supplied English collection, checked against the recovered twelve lecture sections; lecture and translation credits accompany the selections.
- Encountering the Self: supplied Koepke English text, using its capture-page locations rather than inventing printed page numbers.
- Ancient Myths: supplied 1971 Cotterell English edition, checked against extracted PDF text.
- Meditation: selected portions of the course's existing attributed verses, plus explicitly labelled parallel GA 10 readings and the GA 13 Rose Cross passage. The GA 10 self-observation passage does not prescribe reverse-order recall; the explanation makes that distinction explicit. Complete selected meditation texts remain available further down the lesson.

English-source quotations were matched to source text with whitespace normalized. German originals were matched to the cited numbered paragraphs before translations were written. Brazilian Portuguese translations are study translations, not quotations from a published Portuguese edition. Source passages and interpretive explanations remain visibly separate.

## Validation

Run `node scripts/build-all.mjs`, followed by `check-passage-study.mjs`, `check-site.mjs`, `check-guided-study.mjs`, `check-practice-courses.mjs`, `check-freedom-route.mjs`, `check-ancient-myths.mjs` and `check-meditation.mjs` in `scripts/`. These cover every assignment, initial visibility and order, local links and anchors, language partners, preserved notebooks and complete meditation texts.

The three optional temperament source companions retain their existing content and URLs. The ten-course revision applies to the primary routes. These changes are prepared locally; publication is a separate step.
