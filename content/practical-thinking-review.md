# Practical Training in Thought — completed revision

2 October 2026

The existing Practical Training in Thought course now follows the GA 108 lecture through twelve core lessons in four parts, with four short syntheses. Each lesson begins with a located Steiner reading and a verified excerpt, explains the point, identifies the source exercise when one exists, and offers one clearly labelled modern application and one short practice. The index shows the course path once. Exercise selection, older examples, the cloud study and practice notes are optional tools.

## Source and pre-edit gates

Before any lesson changes, every existing lesson was audited and the entire available English source was read in order. The [pre-edit audit](practical-thinking-existing-audit.md) records what was kept, revised, split or moved. The [complete source map](practical-thinking-source-map.json) records nineteen descriptive segments, covering all translated paragraphs 1–48 and the untranslated paragraph 49 marker, with the main idea, exercise, purpose, faculty and connection for each segment.

No local PDF or Markdown of GA 108 was available. The brief authorizes the reliable Rudolf Steiner Archive fallback. The witness is Rudolf Steiner, *Practical Training In Thought*, GA 108, 18 January 1909, Carlsruhe, translated by George (Kaufmann) Adams: <https://rsarchive.org/Lectures/GA108/English/Singles/19090118p02.html>. The source map records its retrieval date and HTML/plaintext fingerprints. It is one continuous lecture with no internal source headings. Its paragraph numbers are web locators; reliable print pagination and an identified print edition are unavailable. Paragraph 49 says “Not translated”; the course supplies no inferred content for it.

All thirteen selected English excerpts, including optional forecasting, were verified as exact contiguous source text. The Portuguese excerpts are new course study translations. Part titles, explanations, checks, cases, concise practice formats and synthesis applications are authored course material. Original source exercises are identified separately. Full source text is not copied into the public site.

## Four-part sequence

| Part | Core lessons | Reading focus |
| --- | --- | --- |
| I — What Makes Thinking Practical? | Practical and Impractical Thinking; The Attitude Needed for Thinking; Thinking Must Meet Reality | Habits, actual circumstances, the watchmaker, thought in things and the limits of the oil-drop model. |
| II — Learning to Observe | Observe Before Explaining; Follow Change Through Time; Investigate Causes Without Guessing | Precise successive images, unfamiliar versus understood processes, possible causes, inquiry and correction. |
| III — Training Thought | Sustain a Chosen Thought; Build an Accurate Mental Picture; Compare Possibilities | Voluntary ordinary thought, detailed recollection with imaginative completion, and preparation of alternative actions. |
| IV — Practical Judgment | Pause Before Judgment; Arrive at Conclusions; How Thinking Changes Through Practice | Prepared conditional delay, renewed consideration, causal reversal, objective attention and repeated nature practice. |

Comparison precedes the pause because that is the lecture’s conceptual order. The user’s proposed architecture explicitly permits this source-faithful adjustment. Lessons 9–11 develop three stages of one source instruction; they are not presented as three original lecture sections.

The course retains the workshop instructions, watch, cloud/leaf observations, missing pencils, overlooked entrance scene, shelf-memory case and alternative workshop actions where they clarify the source. The old forecasting exercise remains available at its original route as an optional tool. Lesson 5’s wider reading also introduces its source basis, so moving the detailed forecasting page off the core path does not conceal that part of the lecture.

## Fidelity decisions

- The spiritual premise remains explicit: Steiner says thought belongs to the structure of things and relates nature to spiritual beings. A watch analogy illustrates his account without independently establishing it.
- His astral-body explanation of successive observation and his account of possibilities working beyond the conscious Ego remain attributed to him. Ordinary exercise outcomes do not establish those spiritual explanations.
- With unfamiliar natural processes, retain and compare clear images before speculative forecasting. With a sufficiently understood process, the lecture permits a forecast followed by observation and correction. Restraint does not mean eliminating attentive thinking.
- “Without guessing” means not stopping at an unchecked guess. The source explicitly constructs a possible past cause, makes inquiries and compares it with actual events.
- The chosen-thought exercise is the first portion of paragraph 28. The memory exercise begins later in the same paragraph; both reading assignments state their precise portions.
- Memory training preserves the unusual instruction to invent missing details deliberately. Steiner says the initial completed picture is incorrect and expects improved future observation. The course’s remembered/unknown/imagined labels and immediate checking are identified as adaptations.
- Compare alternative actions before setting them aside. Delay only when circumstances permit, then return to the prepared possibilities. The course makes no guarantee that waiting or stronger confidence produces the right answer.
- The tree-fall example illustrates a possible inversion of cause and effect, rather than a verified diagnosis. Historical anecdotes and scientific models are not adopted as independently verified history or present-day scientific conclusions.
- The conclusion retains objective attention, feelings and habitual outlook, the anthroposophical-group context and practice with natural things least altered by civilization. The final emphasis is a capacity to see and understand rather than doctrinal assent.

## Simpler study experience

The course has one central question per lesson, one highlighted principle, two unscored multiple-choice checks with reasons, one short practice and a conceptual connection. Each part ends with one deeper course application and an optional model. Notes suggest only Date, Exercise, What I noticed and What changed; they remain in a closed optional disclosure. The exercise-selection map is six compact choices on a separate tools page. There are no mandatory three-session workbooks, grades, badges or streaks in the revised course.

The index provides Begin, validated Continue and optional device progress, with three core lessons per part. Explicit navigation follows the core order and includes each synthesis. Every lesson displays its course, part and learner number, plus a visible next title. Occasional Philosophy of Freedom links remain in deeper study. The final lesson provides one clear continuation to the existing meditation course and explains its different context.

Both languages have thirteen lesson pages, four synthesis pages, an index, tools and source notes: forty pages altogether. The optional public source-map descriptions are also translated into Brazilian Portuguese.

## Preservation and implementation

Learner numbering is separate from route identity. The core route IDs are `[00,01,10,02,03,05,06,07,08,11,12,09]`; old `04` remains optional forecasting. Old `00`–`09` therefore keep their original subjects and notebook identities. Existing Philosophy of Freedom bridges, cloud-guide bookmarks and course-index anchors remain valid.

The scoped controller keeps the existing `anthro-study-v1:practical-thinking/NN` records. Editing a new compact field merges it with saved language data, preserving all six earlier fields, unknown fields and the other language. Older notes can be read and exported. Completion is shared between languages, excludes optional forecasting from the twelve-lesson counts and is not transferred to new route IDs. Continue validates this course and the current language; unrelated course history is preserved. Saving is opt-in. Blocked or malformed storage leaves the exercises usable and current text exportable; unreadable saved records are kept unchanged.

Edit `practical-thinking-part-1.json` through `practical-thinking-part-4.json`, `practical-thinking-forecast.json` and the source map. `practical-thinking-revised.mjs` loads them. `scripts/build-practical-thinking.mjs` renders the final course after the historical compatibility builders, before shared site navigation. An exact route-and-main-marker ownership predicate prevents layered notebook, source and catalogue wrappers from reintroducing clutter. The original practical-thinking/depth/cloud modules and the historical 177-passage and 185-check banks remain intact for existing consumers. The temperament course keeps its existing implementation and notes.

## Verification

The complete build and all twenty-five repository validators passed. The new source gate verifies complete translated-paragraph coverage, exact excerpts and locators, bilingual checks, all forty pages, the twelve-plus-one inventory, stable identities and strict ownership rejection fixtures. Whole-site checks cover 895 HTML pages and their local links/anchors. Existing source and question banks retain their pre-revision fingerprints.

Notes-controller checks passed 965 assertions, including 850 real-page assertions, including all forty pages at 320 and 390 pixels, editing all ten old routes in both languages, preservation of unknown/nested fields, exports, newly incomplete IDs, optional forecasting, storage failures and the GitHub Pages project prefix. A separate browser review passed 6,968 assertions across all forty pages, all fifty-two quiz instances, 160 mobile layout states, native no-JavaScript keyboard and pointer explanations, actual navigation and GitHub Pages paths. Final browser errors and overflow reports are empty. The final repeat build produced identical hashes for all 920 generated assets; all other courses’ lesson pages and source/question banks remain unchanged. The Practical Thinking research-source card also reflects the current reviewed scope while retaining its earlier review as archival context.

The revised files and generated pages are prepared for the repository’s GitHub Pages publication workflow. No additional book is needed for this course’s available GA 108 source scope.
