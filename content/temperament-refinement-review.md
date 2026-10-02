# Understanding Temperaments: teaching and notebook refinement

Reviewed 2 October 2026. The existing twelve-lesson course and all three book companions retain their routes, primary passages and notebook identities. The work uses the already reviewed Kelly/Barton *The Four Temperaments*, Childs’s *Understand Your Temperament!*, and the separately credited, unidentified supplied *Mystery of Temperaments* witness.

## Teaching changes

The first two lessons now begin with three concise explanatory sections in each language. Their English explanations contain 305 and 320 words. All earlier teaching paragraphs, edition qualifications and source distinctions remain available in optional deeper-study sections. The source passage and its credit still precede explanation and practice.

Two attributed comparison charts connect the four portraits and their educational routes, and distinguish the three sources’ shared concerns, different emphases and the course’s original adaptations. Tables have semantic row/column headings and labelled, keyboard-accessible scrolling regions for small screens. Child education remains distinct from adult self-education; the stronger historical prescriptions remain attributed and explained in the deeper source discussions.

Lessons with route IDs 06 and 10 gain bilingual, unscored comparison questions. They preserve Childs’s differing statements about temperament change and distinguish Steiner’s arranged circumstances from Childs’s deliberately exercised compensating qualities. The existing questions and practical cases remain available.

The final reading adds a complete model of the assignment: Lea’s opening entry, three later observations, a concept explanation, two named sources, a genuine difference and limitation, a revisable response, and a subsequent fictional session. Six companion links let the reader inspect the cited source discussions. Observed behaviour is kept distinct from claims about inner constitution.

## Notebook preservation

The shared authored `docs/guided-study.v1.js` controller now restores existing notes and completion when saving is re-enabled. Edits made while saving is off merge only the deliberately changed fields, preserving untouched notes, unknown fields and the other language. Pending edits flush before an explicit opt-out; malformed records remain unchanged until explicit deletion. Storage failures leave visible text exportable. A deletion in another tab prevents pending timers or page exit from recreating the record while retaining the unsaved draft for export.

The guided-study builder derives the script’s asset version from its content hash so cached clients receive the correction. Other courses’ generated HTML changes only that script URL; their teaching stays unchanged.

## Validation

- Complete build and all 27 repository validators pass, covering 895 HTML pages and their links.
- The new notebook regression suite passes 28 tests in both languages. The original controller fails 22 of those tests, demonstrating that the suite detects the preservation defects.
- Real Chromium notebook checks pass on the combined temperament and Luke lessons in English and Portuguese, including malformed/blocked storage, exports and two-tab deletion. No page errors were reported.
- Course browser checks cover all 24 lesson pages at 320, 390 and 1280 pixels: 72 page/viewport combinations, twelve chart states and all four new comparison-question flows. Ten no-JavaScript routes confirm keyboard access to explanations and deeper readings. A focused final table-size review repeats twelve chart states after the sizing refinement.
- Independent content review confirms the four member/temperament relationships, source attribution, child/adult distinction and the final assignment’s requirements against the existing reviewed source records.
- The original 177-record passage bank and 185-record question bank retain their exact hashes. All three source companions’ teaching remains unchanged.

Edit `temperament-refinement.mjs` for the opening explanations and charts, and `temperament-comparison-practice.mjs` for the comparative questions and model. The existing practice-course builder uses `scripts/render-temperament-refinement.mjs`; run the complete build for final output. `scripts/check-temperament-refinement.mjs` and `scripts/check-guided-notebook.mjs` provide the new source/rendering and preservation checks.

No additional book is required for this refinement. The supplied Mystery witness’s unidentified edition remains an explicit provenance limitation. Publication follows the repository’s GitHub Pages workflow.
