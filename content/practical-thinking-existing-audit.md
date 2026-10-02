# Existing Practical Training in Thought audit

Pre-edit audit preserved from 2 October 2026. The source-map gate was completed before lesson changes; the final implementation is documented in [the revision review](practical-thinking-review.md). References to provisional decisions below describe the audit stage.

Read the complete user brief before auditing. This is Phase 1 plus an audit of the existing source references, not a claim to have completed the required whole-lecture source map. No shared repository files were edited. `Private review artifact: thought-existing-audit.json` contains every original exported lesson, the depth walkthroughs, exercise map, storage contract and provisional decision map. Lesson drafting must remain gated on the complete GA 108 map.

## What actually exists

The English and Brazilian Portuguese course has ten learner-friendly practice lessons at `practical-thinking/lessons/00.html`–`09.html`. Its main content exports are `thinkingLessons` and `thinkingSource` in `content/practical-thinking.mjs`. `deepenThinkingLessons()` adds and corrects bilingual teaching from `content/thinking-depth.mjs`; the resulting data, not the initial literal array alone, is the current authored course. These corrections are valuable: successive states are distinguished from missing intervals, cause-checking replaces a former scheduling example, deliberate selection is separated from detailed recollection, imaginative completion is acknowledged, and preparing alternatives precedes a pause.

The final rendered pages are already source-first. `build-practice-courses.mjs` originally starts with a modern situation; `build-guided-study.mjs` adds a first attempt, notebook and openable explanation; `build-passage-study.mjs` then explicitly moves the selected source passage and core explanation above scenarios and first attempts. A final learning-system pass adds another question, context, choice check and next-reading explanation. Therefore the chief remaining problem is layered length and repetition, not a total absence of source-first ordering.

The index visibly repeats the full ten-lesson path twice: a catalogue hierarchy outside, and the earlier full index inside “Edition notes, original course guides and journals.” It includes the old rhythm guide, connected-study panel, full exercise table, journal and source guide, with a second course title as h2. The public h1 is currently “Practical Thinking,” while the embedded original title is “Practical Training in Thought.” Both should resolve to the requested title and one visible path.

Existing quotations are credited as **new course translations from the German**, while depth/reading assignments cite the numbered **Adams English witness**. Preserve that distinction. The old English quotation is not automatically verbatim Adams wording. The existing source review says the archive paragraph 49 is untranslated, so existing source assignments stop at 48; the complete new source map should confirm the supplied witness before extending that boundary.

## Every current lesson: preserve and change

| Original ID / title | Decision | Revised destination | Preserve | Revise or move |
|---|---|---|---|---|
| 00 · Habit or a reason? | KEEP / REVISE | 1 · Practical and Impractical Thinking | Routine versus examined reason; railway-truck comparison; workshop sign | Start with Steiner’s criterion of meeting circumstances. The long four-example source note moves to optional applications. One practice replaces mandatory three sessions. |
| 01 · An attitude of inquiry | KEEP / SPLIT / REVISE | 2 · Attitude; 3 · Thought Meets Reality | Welcome inconvenient observations; intelligibility versus certainty; watchmaker; creation versus understanding | Split attitude from thought/reality premise. Attribute the spiritual foundation rather than treating sign success as proof. Shorten repeated plant/watch explanation. |
| 02 · Observe before explaining | KEEP / REVISE / MOVE | 4 · Observe Before Explaining | Clouds; present observation versus remembered image; speculative explanation is not all thinking; immediate-check adaptation label | Source exercise over successive days comes first. Move five-step cloud vocabulary/GA 4 discussion to optional deeper study. Preserve a bounded account of the source’s astral-body explanation. |
| 03 · Follow a change | KEEP / REVISE | 5 · Follow Change Through Time | Folded/open leaf; endpoints versus unseen interval; uncertainty is legitimate; no forced invented cause | One short practice, then deeper multi-day practice at Part II synthesis. Forecasting can remain a separate source-supported continuation. |
| 04 · Make a prediction you can check | MOVE / OPTIONAL / MERGE | Optional forecasting tool; relevant continuation of 5 and 9 | Original source’s forward forecast-and-check exercise when connections are understood; preserve expectation before outcome | Keep route/notebook identity. Move mini-statistics off the main path. Do not confuse forecasts with choices between actions. |
| 05 · Investigate how something happened | KEEP / REVISE | 6 · Investigate Causes Without Guessing | Missing pencils; possible cause → check → revise; temporal precedence does not prove causation; no accusation from a story | Explicitly label modern competing-hypothesis/check protocol COURSE APPLICATION. Do not restore generic scheduling/productivity. |
| 06 · Choose and sustain a line of thought | KEEP / REVISE | 7 · Sustain a Chosen Thought | Voluntary subject outside habitual worries; scene or book possible; notice and return; five minutes rather than mandatory thirty; differs from memory | Actual source selection first, one ordinary application/practice. Ordinary thinking versus meditation should be clear and concise. |
| 07 · Build and check a mental picture | KEEP / REVISE | 8 · Build an Accurate Mental Picture | Source past encounter; remembered/uncertain/imagined; Steiner permits deliberate imaginative completion; immediate-check adaptation; no guaranteed deadline | Do not rewrite Steiner as prohibiting imagined details. Explain why constructing the picture trains later observation. One labelled modern practice. |
| 08 · Compare, pause and decide | KEEP / SPLIT / REVISE | 9 · Compare Possibilities; 10 · Pause Before Judgment; 11 · Conclusions | Alternative **actions**, preparation before pause, return interval, reasons and limits, inner necessity versus strong feeling | Three pedagogical focuses overlap one source exercise and must not pretend to be source headings. Compare before pause, respecting source conceptual order. Keep urgent-decision caveat as a course adaptation. |
| 09 · Review how your thinking changed | KEEP / REVISE / MOVE | 12 · How Thinking Changes Through Practice | Specific change versus broad self-rating; no change is honest; feelings do not settle facts; source conclusion; controlled Freedom connection | Short synthesis of observation, patience, representation, causation and judgment. Earlier records remain optional; no gather-every-note requirement. End with meditation link. |

## Source-conditioned sequence and stable identities

The root intends to swap the requested ninth and tenth titles so that comparison precedes the deliberate pause, because the lecture prepares possibilities before leaving the question to rest. The user explicitly permits source-faithful adjustment within four parts. This proposal remains conditional on the full source map.

| New learner number | Part | Title | Existing/new route ID |
|---|---|---|---|
| 1 | I | Practical and Impractical Thinking | 00 preserved |
| 2 | I | The Attitude Needed for Thinking | 01 preserved |
| 3 | I | Thinking Must Meet Reality | 10 new |
| 4 | II | Observe Before Explaining | 02 preserved |
| 5 | II | Follow Change Through Time | 03 preserved |
| 6 | II | Investigate Causes Without Guessing | 05 preserved |
| 7 | III | Sustain a Chosen Thought | 06 preserved |
| 8 | III | Build an Accurate Mental Picture | 07 preserved |
| 9 | III | Compare Possibilities | 08 preserved |
| 10 | IV | Pause Before Judgment | 11 new |
| 11 | IV | Arrive at Conclusions | 12 new |
| 12 | IV | How Thinking Changes Through Practice | 09 preserved |

Old `04.html` remains an optional forecasting tool, outside the twelve-lesson main sequence. This gives twelve core lessons plus one valuable retained optional exercise route, rather than deleting the original practice. Progress counts only the twelve main route IDs. Never compute adjacency, numbering or progress by `id + 1`; use explicit ordered route IDs.

## Exact notebook/progress preservation

Existing local records use:

- `anthro-study-v1:enabled` = `yes`: global opt-in.
- `anthro-study-v1:last`: JSON `{url,title,course}`; currently global, potentially another course.
- `anthro-study-v1:practical-thinking/00` through `/09`: JSON `{en:{first,source,after,session1,session2,session3},pt:{...},complete,updated}`. Completion is shared between languages; notes are language-specific.

Keep the ten old route IDs matched to the same conceptual subject. Do not turn old `/02` completion into new learner Lesson 3 merely because the new learner number is 3. Do not automatically complete new 10/11/12. Keep old04 records accessible and exportable even though its completion does not count toward the twelve core lessons.

**Loss risk:** the old guided controller rebuilds the language object using only fields rendered on the page, then writes `{...previous,[lang]:notes,...}`. Removing any of the six old fields and retaining that controller silently drops the absent stored notes on the next edit. It also assumes all status/save/completion/export/delete/first-preview/reading-view controls exist. A simplified course should use a scoped controller with these properties:

1. Merge `previous[lang]` with current edited fields; preserve unknown fields and the other language.
2. Load and export every existing known/unknown text field. Show old six-field records in a closed “Earlier practice notes” disclosure if present, not six mandatory new tasks.
3. One concise current practice note can use a new `practice` field with Date / Exercise / What I noticed / What changed as suggested contents.
4. Retain optional saving, no automatic opt-in, blocked/malformed storage fallback, language-shared completion and explicit delete semantics.
5. “Continue studying” validates this course’s route allowlist and current language; global `last` from another course must not take the learner elsewhere. A separate course-specific resume key can coexist without overwriting unrelated global history.
6. Course and part completion totals count only the explicit core IDs. No grades, streaks or automatic grading.
7. Do not load the legacy controller on simplified owned pages unless a precise owned-page guard prevents its assumptions and writes.

## Optional tools and controlled bridges

Move the six-row exercise map to an optional tools page. It can become four/five short cards for jumping to conclusions, losing attention, vague memory, assuming causes, and decisions. Keep forecasting as an optional tool because it is genuinely in the source. Keep source notes/further study outside the main index. Keep the optional journal readable/exportable; do not make it the final compulsory destination.

Existing Freedom bridges from its lesson04 point to Practical `/05` (cause-checking, formerly scheduling); this link should be reviewed semantically since the linked exercise changed in an earlier revision. Lesson05 → `/07` (mental picture) and lesson16 → `/08` (compare actions) remain useful. The temperament bridge in Freedom20 → temperament06 is unrelated and must remain unchanged. Practical deeper study can use Freedom04 for active thinking, Freedom05 or09 for representation, and its index for final study; one relevant link per few lessons is sufficient.

The real meditation route is `meditation/index.html`, labelled “Meditation and Inner Life” in the current catalogue. The course can describe it as Anthroposophical Meditation and Inner Practice while linking this real route. Do not invent a new meditation route or change its course content.

## Builder ownership and checks

Reuse `learning-html.mjs` exports `esc`, `n`, `relative`, `wholeElement`, `quiz`, `shell`, `write`. Its unscored quiz supports native reveal and shared JS feedback. A course-owned main marker should combine exact route identity and `data-practical-thinking-owned="true"`; a marker alone must never exempt another course.

The safe ownership allowlist should include only this course’s index, known source/tool pages, four known part synthesis routes, and exact lesson IDs 00–12. Accept the optional old04 route explicitly. Fixtures should reject a matching marker on another course, unknown99, research archives and paths with traversal. Both language prefixes are permitted. Choose filenames once and use them consistently in the builder/ownership helper/validator.

Avoid regenerating these owned pages through the generic course wrapper. The current build chain is: base practices → guided notebook transform → passage transform → first terminology linking → source courses → shared catalogue/hierarchy wrapper → Theosophy/Introduction owned builders → global navigation → final terminology linking. Either a late owned builder replaces the Practical pages before global nav, or an early owned builder plus an exact generic-wrapper skip does so. Existing generated owned pages must be skipped by the generic guided transform on repeat builds. The old original source bank can remain unchanged for historical/other consumers.

Narrow adjustments required:

- `check-practice-courses.mjs`: retain all temperament assertions; replace only Practical’s ten-count/six-mandatory-field/sequential-ID assumptions with the owned validator and twelve-core + optional04 inventory.
- `check-thinking-depth.mjs`: new source-first/template/source-fidelity checks replace stale ten full depth-walkthrough assumptions. Preserved supplements may be tested separately.
- `check-guided-study.mjs`: exclude only owned Practical pages. Retained legacy notebook totals become **286 pages /143 bilingual pairs**, down from306/153. Keep unrelated course assertions and original guidedCounts131.
- `check-passage-study.mjs`: preserve all177 historical records/185 assignments/370 route checks; for Practical’s old ten routes verify the owned marker, like its Theosophy branch. The new source validator checks revised selected excerpts/readings instead.
- `check-learning-system.mjs`: respect owned Practical template, 2–3 questions and four-part architecture, not one generic quiz. Catalogue can record twelve core plus optional04; total reading formula must explicitly replace historical ten with its new inventoried count. Keep185 original checks and177 original source records if banks remain unchanged.
- `check-site.mjs`: check owned lesson titles/partners/source ordering before old Practical branch; do not require session1–3 as mandatory current inputs. Keep whole-site links/headings/IDs for all pages.
- Catalogue: replace only the Practical course row with source-faithful four parts, explicit reading order, original IDs, new IDs, optional04 and honest editorial divisions. Other course rows remain byte-equivalent. Books cards must use the revised course title/count appropriately.
- Generic `build-learning-system.mjs` loop must not restore the old index/details or add a second quiz/context/navigation to owned Practical pages. Preserve global site nav pass and unrelated builders.
- If automatic constitution links are excluded for the owned course, scope the exception to the exact predicate and assert it cannot exempt other pages. This prevents quotation markup and unnecessary terminology interruptions; add explicit occasional reference links instead.

Broad shared legacy notebook behavior should not change for any other course. Browser tests must seed old en/pt six-field records, open simplified lessons, edit one current field, reload/export, verify every old field and other language survive, preserve optional04, test new IDs initially incomplete, and verify all twelve sequence/navigation and four synthesis/tool routes. Test 320/390px, keyboard, native no-JS reveals, wrong/empty/correct quiz retries, malformed/blocked storage and GitHub Pages prefix.
