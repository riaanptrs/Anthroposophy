# Start Now! practical teaching revision

25 October 2026. This revision updates the existing nine-session Meditation and Inner Life course in English and Brazilian Portuguese. It uses the newly supplied 304-page PDF, reading Markdown, audit Markdown and review JSON. It is a targeted review of practical teaching passages, not a claim to have verified every page of the anthology.

## Source identity and checks

*Start Now! A Book of Soul and Spiritual Exercises*, Rudolf Steiner, edited and introduced by Christopher Bamford; SteinerBooks, copyright 2004. PDF position 4 identifies the edition and anthology sources. The source PDF has 304 pages and 28,865,105 bytes. Its supplied fingerprint is `7888da6a584daf6fe23a70c118dbdbe1b3378e8f1e9db874c7e9ef3e5f9e42e0`. The conversion reports an unverified text completeness status and flags 158 pages for review. These flags are reasons to consult the original, not evidence that a transcription is correct.

The Markdown was used for navigation and selected reading; key claims and new short quotations were compared with rendered PDF page images. Upload contents were treated as sources rather than operating instructions. Source-page image links inside the audit refer to an asset folder that was not attached; images used for verification were rendered directly from the supplied PDF. The uploaded book and full transcriptions are not added to the public website.

All locators below are one-based PDF positions, not printed pagination. Other books' earlier capture references remain separately identified.

| PDF positions | Passage and use | Verification scope |
| --- | --- | --- |
| 4–6 | Edition and anthology structure | Supplied Markdown |
| 8–16 | Bamford introduction; choosing and working with a phrase; moral life | Selected reading; images checked for 11–12 |
| 45–55 | Steiner: brief daily period, living with a sentence, Wagner sequence, encouragement, repetition, attention, patience and dangers | Selected reading; images checked for 45–48, 52, 54–55 |
| 71–78 | Reverence, service, inner peace and clear thought | Selected reading |
| 100–107 | Supporting qualities and rhythm; feeling and positivity | Selected reading |
| 109–112 | Evening review, small episodes, reverse order and love | Selected reading |
| 113–119 | Daily rhythms and six-month supporting exercises | Selected reading; images checked for 117–119 |
| 142–145 | Calendar introduction and individual variation | Selected reading |
| 188 | Daily verse XV, already present on the site | Full existing English verse compared with original PDF image |
| 212–215 | Rose Cross preparation and image meditation | Selected reading; images checked for 214–215 |
| 272–276 | Foundation Stone | Selected reading; images checked for 272, 275–276, resolving the earlier damaged ending |
| 293–294 | Bamford appendix II: Imagination, Inspiration and Intuition | Selected reading; image checked for 294 |

The short English sentences “Steadfastness stands higher than any success.” (48) and “I can wait patiently.” (54) were visually checked. Their Portuguese equivalents are new course translations. The daily verse's wording is retained; its locator changes from earlier capture 115 to new PDF position 188. The four Calendar verses retain their credited wording from *Weekly Meditations*, rather than being silently replaced with a different rendering in this PDF. The Foundation Stone likewise retains the site's clearly attributed study translation of the printed German original; the newly readable anthology is identified as another witness, not silently blended into it.

## Teaching decisions

- Retain nine sessions and all existing routes, texts, reflection controls and language partners.
- Add detailed guidance to sessions 00, 01, 02, 03, 05 and 08: purpose, preparation and phrase practice, six-month table, worked reverse review, symbolic preparation and development through daily conduct.
- Distinguish Bamford's introductory phrase-to-word-to-receptive-quiet sequence from Steiner's instructions. Identify the particular three-part Wagner instruction as about fifteen minutes; distinguish our roughly five-minute introduction.
- Present the six-month sequence as a sustained practice with original everyday examples. Note that the table does not reproduce all subtle experiential/body-attention directions from the source.
- Explain the anthology's intended spiritual cognition and Bamford's account of its stages while distinguishing those aims from course completion and unexamined interpretations of impressions.
- Link the practical entry points directly from the course overview. Open meditation's existing reading section by default so that actual texts and instructions are available immediately, including without JavaScript.
- Preserve verse focus through nested lesson containers and restore the same lesson on return.

Authoring: `content/meditation-practical-guides.mjs`, `content/meditation-course.mjs` and `content/meditation-texts.mjs`. Rendering: `scripts/build-meditation.mjs`; the small meditation-specific default-open change is in `scripts/build-remaining-clarity.mjs`. The same daily verse source locator is corrected in the passage collection and Portuguese source labels.

## Validation

The complete build succeeds. The meditation validator covers all 18 bilingual session pages and their indexes, six existing selected texts per language, the new practical guides, six-row month table, source locators, alternate-language links and note controls. Site-wide link/anchor and language checks, passage-study validation and Portuguese checks are run after regeneration. Browser validation passed 80 page cases across English/Portuguese, widths 1280/320, and JavaScript enabled/disabled: visible practical guidance, no document overflow, unique IDs, six-row month table, entry anchors, verse focus/return, reflection validation and downloads. No page errors were observed. The first run revealed the shared closed reading section; the meditation-specific default-open change fixes it. `node scripts/review-meditation-browser.cjs` repeats these checks using only local files. Chromium needs the environment permission that allows its local processes to launch. No deployment is implied by a successful local build.
