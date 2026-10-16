# Agriculture and biodynamics clarity review

Review branch: `review/remaining-course-clarity`. Baseline `4f931f4`. No push, merge or deployment.

## Scope and teaching

All 56 units now have complete bilingual short first readings: Agriculture 18, Biodynamics 24 and What Is Biodynamics 14, producing 112 pages. Each reading has two newly authored paragraphs (concrete entry and practical/conceptual application), two selected existing explanatory paragraphs, and two optional questions with explained answers. Questions that relied on details outside the short reading were rewritten. These are substantive teaching additions and curated explanations, not 56 wholesale replacements of all source commentary. The entire original main body remains byte-for-byte intact inside optional deeper reading, with its heading and navigation moved outside.

The native Biodynamics sequence develops visible soil behaviour, growth versus form, feed/manure dependencies, differentiated preparations, diagnosis and proportionate management, calendar confounding and causal comparisons. The Agriculture companion follows its full lecture argument, including the tension between experimental verification and claimed spiritual certainty. The anthology keeps Courtney, Steiner and editors distinct; its nature-being account is taught as the spiritual causation the author claims, not silently reduced to metaphor or presented as experimentally established botany.

Exercises use observation, existing records, drawings and paper comparisons. They do not assign manure application, mineral grinding, wildlife killing/burning, plant tasting, altered sleep, changed animal diets or medical treatments. The practical manure guidance separates treatment and handling from smell or burial; pesticide decisions begin with identification and actual damage. FDA and EPA links accompany relevant lessons. Their US scope is identified; no universal regulatory interval or preparation efficacy claim is introduced.

The batch's composition is recorded per unit in `content/agriculture-clear-lessons.json`. Learning objectives guide the prose and private audit rather than becoming public scoring rubrics. The six shared GA 327 topics use common new entry/application paragraphs in the two book companions, but retain each companion's own explanation and source context.

## Validation

- Full `node scripts/build-all.mjs` completed.
- All 43 `scripts/check-*.mjs` validators passed; outputs in `agriculture-clarity-checks.json`.
- 224 browser cases passed: all 112 pages at 1280px and 320px with JavaScript disabled; report in `agriculture-clarity-browser.json`.
- Browser checks cover complete visible prose in authored order, two optional explained answers operated by keyboard, closed/openable original depth, visible navigation, language, one heading, local links/fragments, assets, duplicate IDs and horizontal overflow.
- `check-agriculture-clarity.mjs` verifies exact course order, bilingual composition and preservation of every original body against `4f931f4`.

The first browser invocation used an incorrect dependency search path and stopped before opening pages. Rerunning with the installed Playwright path completed all cases. This was an execution configuration issue, not a page failure. No learner trial has been conducted; software checks do not validate pedagogical outcomes or spiritual/agronomic claims.

## Review deliverables

`AGRICULTURE-CLARITY-AUDIT.md` audits every chapter's goal, prerequisite, essential concepts, connections, misconceptions/limits and new teaching bridge. `agriculture-clarity-ledger.json` records separate audited, rewritten, validated and source-blocked fields. `AGRICULTURE-CLARITY-SAMPLES.md` contains complete English/Portuguese readings and answers for farm individuality, compost, the horn pair and spiritual nature observation. All 56 complete readings are in the authoring JSON.

## Source access and remaining work

The current workspace has derived course text and source records, not the original witnesses. Exact missing materials for these courses: `Agriculture.pdf`, `Agriculture course.pdf`, `Agriculture.md`, `Agriculture course.md`, `What is biodinamics.pdf`, `What is biodinamics (2).md`. The later research/standards records additionally name absent `2026_Int_Dem_bio_Standard_eng.pdf`, `1741-dok-dossier-en.pdf`, `1787-dok-factsheet.pdf` and `EN_Booklet_BD.pdf`. This prevents a fresh original-book/PDF comparison, including images and printed-page verification; it does not block independent teaching from the existing explanations. No new quotation or locator was invented, and inherited verification flags were not promoted into fresh verification. This is an availability block, not an approval denial.

Practical reference pages inspected in this batch: [FDA produce safety](https://www.fda.gov/food/food-safety-modernization-act-fsma/fsma-final-rule-produce-safety) and [EPA integrated pest management](https://www.epa.gov/safepestcontrol/integrated-pest-management-ipm-principles). These support the limited handling/identification guidance, not biodynamic efficacy. Existing DOK and Demeter material remains attributed to its earlier reviewed versions; this batch makes no new current-standard certification claim.

The separately completed Foundations/Introduction/Meditation batch remains `4f931f4` (73 units, 42 validators, 292 browser cases). The current clarity inventory now reaches 258/487 units; 229 units in 11 groups remain pending. Childs and Mystery temperament originals are still needed for their book-specific work. No remaining course is silently counted as complete.
