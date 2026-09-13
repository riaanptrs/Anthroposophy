# Meditation course source and implementation review

13 September 2026. One selected course, nine sessions, English and Portuguese, placed after Theosophy foundations and practical thinking. This implements the new meditation request; the wider curriculum revisions in the separate learning-logic audit remain recommendations.

## Sources and scope

- `weekly meditations (2).md`: 58 capture pages. *Weekly Meditations: Rudolf Steiner's Calendar of the Soul*, SteinerBooks 2008. Calendar translation Christopher Bamford; reflections Patsy Scala. Read front matter and introduction; selected complete verses 1, 13, 26, 38 and surrounding reflections. Do not attribute Scala's nightly experience, intentions or comparative religious commentary to Steiner.
- `Start Now.md`: 177 capture pages. *Start Now! A Book of Soul and Spiritual Exercises*, SteinerBooks 2004, Rudolf Steiner, edited and introduced by Christopher Bamford. Reviewed introductory scope and selected instructions at 35–38, six exercises 76–82 and 87–89, backward review 83–85, Calendar introduction 98–100 and parallel selected verses, daily verse 115, Rose Cross 126–129, Foundation Stone 155–156. This is an anthology; the course does not claim to reproduce every practice or replace the whole book.
- `The foundation stone.md`: 8 capture pages. *The Foundation Stone Meditation*, Rudolf Steiner Press 2012, introduction Michael Wilson. The supplied file ends in Steiner's explanatory note before the verses. The Start Now ending has interleaved columns. No silent reconstruction of that English translation is used.

## Text decisions

Five selected full verses are transcribed from supplied material: one daily verse and Calendar weeks 1, 13, 26, 38. Punctuation and apostrophes are normalized; verse line breaks are preserved apart from empty OCR spacing. Week 13's heading is corrupt in Weekly Meditations; sequence and Start Now capture 102 establish its identity. Week 26's damaged opening on capture 30 is checked against Start Now capture 104. English Calendar wording follows the supplied 2008 translation, not a blend of translations. Portuguese versions are new course translations of the selected supplied English.

The full Foundation Stone is a new English and Portuguese study translation of Steiner's public-domain printed German version:
https://rsarchive.org/Lectures/GA260/English/AP1990/ChrCnf_gverses.html

It is explicitly not the Adams, Wehrle or Bamford translation. The printed version is kept distinct from conference/spoken versions; no Greek/Latin lines or historical seven-day rhythms are inserted. The four-session learning plan is labelled an original course adaptation. A full new scholarly translation comparison is not claimed.

Steiner's own statement on weekly meditations was also checked at:
https://rsarchive.org/Lectures/19120507p01.html

The purpose of feeling self-knowledge and rejection of rigid identical rules is grounded primarily in his introduction reproduced at Start Now capture 100. No fixed date calculator or universal southern-hemisphere rule is invented.

## Pedagogical choices

Every session states why it follows the previous study, what the source intends, how to work with the practice, and a specific explanatory check. Actual verse text is visible within its lesson. A distraction-reduced reading button returns to the same lesson; notes are optional and downloadable, with no storage or tracking. The simple sequence is orientation → verse → six qualities → review → Calendar → symbolic meditation → complete Foundation Stone → working over time → personal synthesis. Completing lessons is distinguished from following a practice over months.

The concise six-exercise, retrospect and Rose Cross instructions are attributed original retellings, not falsely labelled verbatim quotations. The Rose Cross includes the crucial preparatory thought/feeling sequence and the distinction between preparing the image and meditating with it. Breath imagery in the Foundation Stone is not turned into breathing manipulation. The user can select a main practice rather than perform all simultaneously.

## Build and validation

`node scripts/build-all.mjs` builds the new course after existing guided-study processing. New sessions use `meditation/00.html` through `08.html`, avoiding the existing generic mandatory first/source/revision worksheet. `node scripts/check-meditation.mjs` checks the nine bilingual sessions, text identities, complete Foundation Stone ending, language partners and note controls. Existing site/link and course checks remain applicable. The course HTML total is 396; an optional local `learning-review.html` report is checked for structure/links but excluded from that course count.
