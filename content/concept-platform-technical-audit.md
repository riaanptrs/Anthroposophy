# Concept platform: technical audit and integration contracts

Audit date: 2 October 2026. Baseline: published commit `efbb5a3c4c6694c1700fb68df0dae0e87a62f25f`. This is the read-only technical contribution to Phase 1 of the platform redesign. It proposes integration contracts; it does not implement the redesign or authorize rewriting other courses.

The safest integration is an additional, explicitly owned Theosophy concept course at `theosophy/lessons/`, with its Portuguese partners at `pt/theosophy/lessons/`. Keep the existing `lessons/00.html`–`lessons/27.html` routes, reading commentary, chapter pages, source records and browser records. New concept completion must have its own semantic identities and storage. Four new navigation areas require a coordinated change to the actual generators and validators, not a visual relabelling of generated HTML. The accepted implementation direction is recorded in [the platform contract](concept-platform-contract.md): the conceptual gateway takes `theosophy/index.html`; the retained reading index moves to `read/theosophy/index.html`; the existing beginner sequence gets a preserved index at `learn/foundations/index.html`.

## 1. Baseline and inspected material

The publication currently contains **964 HTML files**. The legacy book catalogue has **16 collections and 232 reading pairs**, including 28 Theosophy readings. The 36-lesson beginner path, 28-lesson Introduction course, 24-lesson native Biodynamics course and English research documents have separate publication contracts. The research map contains 122 authored documents and 12 themes. These are different inventories; a platform redesign must not collapse them into one lesson count.

The audit inspected the build entry point and successive transforms; shared HTML helpers; Theosophy, beginner, Introduction, Practical Thinking, research and native Biodynamics generators; common and course styles; all relevant progress controllers; site, learning-system, Theosophy, notebook, constitution and native-course checks; and representative generated HTML. The mobile evidence comes from executing those generated pages, not from the README.

No complete build or validator was run for this audit. Earlier checks belong to the published baseline. The new measurements below are a separate, narrower browser audit.

## 2. Build ownership and order

| Stage | Actual owner and output | Integration consequence |
|---|---|---|
| Entry | [`scripts/build-all.mjs`](../scripts/build-all.mjs) imports `build-lessons.mjs`. Most course builders are modules with import side effects. | There is no framework router, package installation step or application bundler. Run commands from the repository root. Do not assume an exported build function exists. |
| Initial Theosophy and other courses | [`scripts/build-lessons.mjs`](../scripts/build-lessons.mjs):1–87 emits older Theosophy pages, then imports the other book/course builders, guided-study transform, passage transform and terminology reference builder. | Early Theosophy output is subsequently replaced. Editing those initial lesson templates does not change the final published Theosophy teaching. |
| Reviewed source companions | `build-lessons.mjs`:91–94 emits What Is Biodynamics?, the threefold opening and Agriculture after the legacy passage transforms. | Their independent passage/check banks and existing routes must remain independent. |
| Learning layer | [`scripts/build-learning-system.mjs`](../scripts/build-learning-system.mjs) emits homepages, the 36 beginner lessons, book hub, generic course/chapter structure and research; it then invokes the final Theosophy, Introduction and Practical Thinking builders. | This module both renders pages and changes other builders' output. Importing it alone is not a harmless shell update. |
| Final legacy Theosophy | [`scripts/build-theosophy-guided.mjs`](../scripts/build-theosophy-guided.mjs):6–8,88–104 writes `lessons/NN.html`, `theosophy/index.html`, `theosophy/chapters/book-*.html` and `theosophy/source-notes.html`. | Keep this reading owner. New conceptual lessons need an additional owner; changing `readingPath()` would silently relocate old commentary and break bookmarks. |
| Global navigation pass | `build-learning-system.mjs`:154–179 walks **every HTML file** under `docs`, inserts navigation/assets, rewrites selected course anchors and removes numerical grading language. | An isolated new page can still be altered on the next full build. Ownership checks and navigation policy must explicitly include the prototype. The pass inserts rather than generally replaces navigation; rerunning this module independently can duplicate navigation on existing pages. |
| Final terminology pass | `build-lessons.mjs`:96–97 invokes [`scripts/link-constitution.mjs`](../scripts/link-constitution.mjs) again. | Existing owned courses opt out. A new prototype needs its own precise exemption or deliberate linking policy; automatic term linking is not a concept relationship model. |
| Native Biodynamics | `build-lessons.mjs`:98–103 imports the ready native builder **after** the learning layer. [`scripts/build-biodynamic-agriculture.mjs`](../scripts/build-biodynamic-agriculture.mjs) emits its own navigation, assets and hub/onward integration. | A new universal navigation pass must also reach these late pages. Updating only the learning-layer pass leaves Biodynamics using the old four destinations. |

Recommended eventual build contract: retain the existing legacy generation sequence, render the new prototype from independent content after legacy reading generation, and apply one shared navigation policy after all ready native builders have finished. New renderers should accept an output directory for private staging; use logical `docs/...` paths to compute relative links and map them into the staged directory, as the Biodynamics builder does. A preview must not run the public build accidentally.

The current build does not remove every obsolete HTML file. `check-site.mjs` catches unexpected routes afterward. Give the new renderer an exact owned-file inventory; any future cleanup must be limited to that inventory, never to all of `theosophy/`.

## 3. Existing lessons and reusable components

[`scripts/learning-html.mjs`](../scripts/learning-html.mjs) provides escaping, zero-padding, relative links, whole-element extraction, a basic bilingual shell and unscored quiz/reflection rendering. The shell includes the viewport, description, language alternate, skip link and shared CSS/JS. It does **not** itself provide the four main navigation destinations; the later pass normally adds them.

Current Theosophy readings have a source-order location block and optional contents, a central question, preparation, attributed source excerpt or assignment, explanation, one defined term, everyday example, distinction, two comprehension questions, connection, optional deeper reading and optional study controls. Chapter and book syntheses already contain relationship chains, distinctions and model answers. These are useful content and accessibility precedents, but the renderer is designed around book commentary rather than an independent conceptual learning sequence.

Shared quizzes use a native `fieldset`/`legend`, labelled radio inputs, explicit check/retry buttons, live feedback and a `details` explanation. Reflections reveal a model approach without grading prose. Reading and explanations remain available without JavaScript. Answers are not persisted. These contracts can be reused independently of the old book-course sequencing.

For the new prototype:

- Keep the question, explanation, relationship model, worked example, practice and optional source reading as distinct authored fields. Their DOM order should follow the agreed new teaching contract, not the legacy validator's source-first requirements.
- Keep a visible separation between course explanation, Steiner's source wording and the learner's interpretation. A relationship diagram needs an accessible text equivalent; directional labels must describe the actual relationship.
- Give source links stable destinations in the retained reading commentary. Use the existing verified Theosophy edition/source maps for attribution. A new concept ID is not a PDF capture, book subsection or legacy reading number.
- Give every EN/PT pair one explicit partner route, unique IDs, readable headings and meaningful next-step links. A language switch should preserve the concept identity.

## 4. CSS, JavaScript and assets

The common stylesheet chain is `site-watercolour.css` → `base.css` and `watercolour.css`; `base.css` also imports `examples.css`. Shared `learning-system.css` follows this chain. These files contain global element selectors and shared class rules. Most are tracked, directly authored files in `docs/`, not generated from hidden source files. The Theosophy builder links `docs/theosophy-study.css` and `docs/theosophy-study.js`; it does not generate those assets. Biodynamics uses a different, explicit source-owned pattern: `scripts/assets/biodynamic-course.*` is copied by its builder.

Consequences:

- Avoid changing global `body`, `header`, `main`, heading, navigation or quiz rules to style only the prototype. Add a prototype class/ownership marker and scope its layout and typography. Shared shell/navigation changes should be intentional and reviewed against preserved courses.
- Do not put the new concept controller behind `.theosophy-study[data-theosophy-order]`. That selector activates the old reading controller and its numeric IDs. Do not add `data-learning-id` or `data-study-id` merely to obtain a notebook; those attributes activate unrelated stores.
- `learning-system.js` provides common table scrolling and quiz behavior before its course-specific early returns. It then handles beginner progress/search and only initializes beginner notes when `[data-learning-id]` exists. The prototype may share its quiz behavior while leaving all legacy identity attributes absent.
- Shared JavaScript can wrap `main table` in a keyboard-focusable, labelled scroll region. The small-screen CSS also supplies a no-script table wrapping fallback. New models should work without depending on a post-load wrapper to establish meaning.
- Use content hashes for newly generated asset URLs, following the existing native Biodynamics CSS/JS pattern. Many older course assets use stable URLs without a version; changing them changes cached behavior across courses.
- Keep source-owned new assets in a clearly identified location and copy them deterministically. Do not hand-edit an output asset whose builder will overwrite it later.

Research is a separate retrieval system. Its EN/PT indexes currently embed enough authored search material to produce approximately **1.92 MB of HTML each**. A concise concept explorer should have its own concept metadata and relationships, not reuse the full research index as its initial payload. Research routes and source notes can remain available as deeper links.

## 5. Progress and note compatibility

All current records are browser-local. Completion is not a measure of agreement with Steiner, quiz answers are unscored, and none of these controllers provides account/device synchronization.

| System | Namespace and stored identity | Preservation contract |
|---|---|---|
| Legacy guided notebooks | `anthro-study-v1:<course>/<NN>`; shared consent `anthro-study-v1:enabled="yes"`; global resume `anthro-study-v1:last`. Language maps include `first`, `source`, `after`, sometimes `session1`–`session3`; record-wide `complete` and `updated`. | [`docs/guided-study.v1.js`](../docs/guided-study.v1.js) merges changed fields, retains other-language/unknown fields and protects malformed records until explicit deletion. Keep this store and behavior. |
| Current Theosophy reading | `anthro-study-v1:theosophy/00`–`27`; the same legacy consent and global resume. Language field `after` contains the current personal note; old `first/source` remain readable. | [`docs/theosophy-study.js`](../docs/theosophy-study.js):18–44,127–140 reuses reading records. Numeric reuse would make a new concept appear completed and repurpose its note. Export includes both languages' known note fields. No delete control is supplied. |
| Beginner path | `anthro-learning-v1:enabled`, `:lesson:01`–`36`, `:last`; `{en:{note},pt:{note},complete,updated}`. | [`docs/learning-system.js`](../docs/learning-system.js) owns this independent store. Keep the 36 IDs, language maps, opt-in preference and routes. Export is a current-language text note. |
| Introduction | `anthro-introduction-v1:progress`; `{version:1,completedIds:["01",…],lastLesson}`. | [`docs/introduction-anthroposophy.js`](../docs/introduction-anthroposophy.js) owns marks/resume, with no notes/export/delete UI. Do not merge into beginner or conceptual progress. |
| Practical Thinking | `anthro-study-v1:practical-thinking/00`–`12`; shared legacy consent; own `anthro-study-v1:practical-thinking:last`. Language fields include `date/exercise/noticed/changed` and preserved earlier fields. | [`docs/practical-thinking.js`](../docs/practical-thinking.js) retains its own source-order route sequence, journal exports and malformed-record protection. Keep the optional forecasting route and its identity. |
| Native Biodynamics | `anthro-study-v1:biodynamics/01`–`24` through the common notebook; own `anthro-study-v1:biodynamics:last` through its course controller. | Preserve both lesson records and course resume. A global last-reading record is insufficient to represent each course's continuation. |
| Meditation | No storage namespace, completion or resume. | [`docs/meditation.js`](../docs/meditation.js) exports the current reflection as text. Adding global progress must not implicitly change that existing practice. |

Current Theosophy resume explicitly reconstructs `/lessons/NN.html`, not `/theosophy/lessons/NN.html` (`theosophy-study.js`:55–67). Its page-supplied order is non-numeric: `[0,1,2,3,23,4,5,24,6,7,8,27,9,10,25,11,26,12,13,14,15,16,17,18,19,20,21,22]`. Incrementing reading IDs does not follow the book. The generic notebook's resume accepts numeric lesson paths within a local or `/Anthroposophy/` mount; it is not a semantic concept router.

The accepted new reading index introduces one specific legacy-controller change: `theosophy-study.js` must recognize `read/theosophy/index.html` as an allowed index while still rebuilding old reading destinations at `lessons/NN.html`. Merely allowing arbitrary prefixes can interpret `read/` as the site mount and send a learner to nonexistent `read/lessons/NN.html`. Validate local and `/Anthroposophy/` mounts, EN/PT indexes and old saved resume URLs explicitly. Keep record IDs, consent and reading completion unchanged.

The older Theosophy and beginner JSON readers turn an unreadable record into an empty value. Their runtime existence does not establish a safe migration reader. The newer generic notebook and Practical Thinking controller explicitly preserve unreadable raw records. None needs to be modified or invoked to migrate the new prototype.

**New progress contract:** use a separate, versioned namespace, a stable semantic course/lesson identity, explicit opt-in, bilingual notes and course-scoped continuation. The exact prefix should be registered in the implementation contract; for example, `anthro-concept-v1:theosophy:<semantic-id>` distinguishes it from every existing store. Never automatically translate reading completion into concept completion, copy numeric records, change the shared legacy preference or write legacy `:last`. A learner who has completed a reading has not necessarily completed a different conceptual lesson.

The new controller should validate record shape and IDs, preserve other-language/unknown fields, protect malformed data, flush pending edits on navigation/consent changes, distinguish opt-out from explicit deletion, and keep unsaved notes/export usable when storage is blocked. Resume must reconstruct an allowed same-origin route from the manifest and preserve the language and site mount. These are requirements for new work, not claims that a prototype already exists.

## 6. Navigation and validator traps

The requested areas are **Learn, Explore Concepts, Practice, Read Steiner**. Existing destinations are **learn, books, themes, research**. Replacing labels while leaving the old destination semantics would not implement the new architecture. Retain themes/research/reference routes as secondary resources and retain all existing course routes.

A single source-owned destination manifest should supply language labels, routes and current-area state to all shells. Determine current area from the page's explicit ownership/role: a concept lesson under `theosophy/lessons/` belongs to Learn, while preserved commentary and source chapters belong to Read Steiner. The existing broad `theosophy/` prefix cannot distinguish these purposes.

| Existing contract | Exact integration trap | Required change when implementing |
|---|---|---|
| `build-learning-system.mjs`:158–163 | Classifies any catalogue route, including all `theosophy/`, as `books`; hardcodes the old four destinations. Usually appends another nav instead of replacing one. | Use the shared area manifest and deterministic replacement; explicitly classify conceptual ownership before book-prefix rules. |
| `build-introduction-anthroposophy.mjs`:47 and `build-biodynamic-agriculture.mjs`:52 | Also generate the old four destinations independently; Biodynamics runs late. | Consume the same manifest, preserving each course's existing teaching, controls and routes. |
| `check-site.mjs`:39,95–103 | Its legacy Theosophy predicate matches all `theosophy/` pages when they have `data-theosophy-owned="true"`; it then expects a legacy title and language partner under `lessons/`. | Give concepts a distinct marker and exact manifest-backed predicate; check them before the old branch. Do not broaden the old marker. |
| `check-site.mjs`:40–56 | Common duplicate-ID, one-h1, path-containment, asset/link and anchor checks run before course branches. | Keep these checks for the prototype; ownership is not an exemption from common integrity checks. |
| `check-site.mjs`:229–238 | Requires native Biodynamics navigation to point to `learn/books/themes/research`, with `books` current. | Replace this intended navigation invariant with the shared four-area manifest and the appropriate Read Steiner state; retain native source/title/count checks. |
| `check-site.mjs`:343–382 | Derives an exact route set and rejects every unexpected HTML page. | Register new concept/area routes from explicit publication data. Keep exact inventories for all old course/source banks; do not disable the unexpected-route check. |
| `check-learning-system.mjs`:19–49,87–153 | Pins 36 beginner lessons, old passage/question bank counts and 28 Theosophy reading entries. | Keep those old inventories. New conceptual lessons need a separate manifest and dedicated checks, not insertion into the old catalogue as additional book readings. |
| `check-learning-system.mjs`:177–184 | Every page must have exactly one `class="system-nav"` and shared assets; every `theosophy/` catalogue page must mark the book destination current. | Retain one-navigation integrity; revise area-current checks using explicit role/ownership so new concepts can be Learn. |
| `check-guided-study.mjs`:14–35 | Selects numeric nested `lessons/NN.html` outside a limited set of owned courses; requires exactly 286 legacy notebook pages/143 bilingual identities. | Numeric concept routes would enter this inventory. Exclude only exact new owned routes with a dedicated validator; retain 286/143 legacy assertions. Semantic filenames still require explicit site/route validation. |
| `check-theosophy.mjs`:115,149–241 | Pins all 28 old reading routes, source excerpts, language partners, reading order, chapter syntheses and the existing index's 28 reading markers. | Preserve the old reading checker. If the main Theosophy index becomes the concept-course gateway, explicitly retain its old anchors/reading-map access and adjust only that intentional index responsibility. |
| `link-constitution.mjs`:38 and `check-constitution.mjs`:30–31 | The broad legacy Theosophy exemption is marker-dependent. New prose otherwise receives automatic physical/etheric/astral links. | Add an exact new ownership exemption with authored concept links and a corresponding check; keep automatic linking unchanged for other courses. |

A concept ownership helper should require both a specific marker such as `data-theosophy-concept-owned="true"` and membership in the new publication manifest. Avoid `path.includes('theosophy')`, an unbounded `theosophy/` skip or any arbitrary `data-*` flag that bypasses validation. Existing Biodynamics and Practical Thinking helpers demonstrate confined ownership, though the new manifest need not use their numeric filenames.

Accepted first-release cutover: add semantic conceptual lesson routes, render their gateway at `theosophy/index.html`, and retain the complete original book map at `read/theosophy/index.html`. The platform builder runs last after the existing chain and deliberately owns this cutover. Preserve old chapter/source/reading routes and useful index anchor access; explicitly update the old index validators to check the retained reading index. The old `courseIndex()` helper in `build-learning-system.mjs`:23 constructs its route directly rather than reading `indexPathEn/indexPathPt`, so a metadata-only index change does not fix the renderer. The terminology ownership predicate also needs to recognize the relocated legacy index; its current `theosophy/` prefix does not recognize `read/theosophy/`. Do not accidentally remove the only link to commentary or infer reading progress from the new concepts.

## 7. Measured 320px baseline

An isolated Chromium context rendered nine routes in each language at **320 × 740**, using the actual `docs/` files and a temporary local server. Routes: homepage, beginner index and lesson 01, Theosophy index and readings 01/23, human-constitution reference, Practical Thinking reading 00 and Biodynamics lesson 01. Optional personal notes on Theosophy reading 01 were also expanded.

**18/18 pages returned 200; no horizontal document overflow, page errors or failed assets occurred. No localStorage keys were created before saving consent.** This is a representative layout/runtime result, not an exhaustive accessibility or content audit.

| Page family | EN measurement | PT measurement | Implication for the new shell |
|---|---:|---:|---|
| Shared header on homepage/Theosophy | 248px high | 248px high | Approximately one third of the first 740px screen precedes content. The four links wrap correctly, but compact area labels/location controls can improve hierarchy. |
| Theosophy reading 01 | h1 starts at y=519px | h1 starts at y=496px | Header plus reading context occupies most of the first screen; the conceptual question and relationship model should be easier to reach in the prototype. |
| Theosophy index | h1 starts at y=364px | h1 starts at y=364px | The existing reading map is usable but its heading follows substantial shell/introductory spacing. |
| Native Biodynamics reading 01 | header 339px | header 285px | Longer current destination labels wrap more. Test both languages rather than assuming the English measurements predict Portuguese. |

Main widths were 284–288px; computed body text was 17px. Current shared navigation and most primary controls already use 44px minimum heights. The Theosophy stylesheet uses scoped mobile padding, wrapping navigation and vertical relationship chains. These should inform the prototype's mobile design; there is no verified reason to rewrite preserved course layouts simply to fix overflow.

Private evidence: `/tmp/concept-platform-mobile-audit/report.json` and eight viewport screenshots in that directory. EN homepage, EN Theosophy reading 01 and PT Theosophy index screenshots were visually inspected. The temporary server/browser were closed afterward.

## 8. Concrete handoff and verification contracts

Before implementation, register the prototype's semantic lesson order, concept graph, source-reading destinations, practice entries, owned route set, EN/PT partners and one shared four-area navigation manifest. Keep this registry independent from the old 232-reading catalogue. Source concepts and relationships need authored definitions and link types; adding a glossary word alone does not supply a relationship model.

The implementation review should require:

1. **Build ownership:** new assets/pages generated from their declared owners, staged preview supported, no public incomplete draft, exact course routes registered, repeat generation produces no duplicate navigation or integration cards. Inspect the final full-build output, because the build order contains late owners.
2. **Preserved material:** all baseline routes and fragments still resolve; old source banks/counts and source quotations remain unchanged; old course main teaching/controls retain their semantics. Authorized shared-shell navigation changes should be separated from teaching changes when comparing generated files.
3. **User-data isolation:** seed realistic EN/PT old records, shared consent, each course's resume, unknown fields and malformed raw records in an isolated browser. Snapshot every old key/value; navigate, mark, write, export and delete new concept records; assert old values remain byte-for-byte unchanged. Do not treat an empty-storage test as preservation evidence. Test the legacy readers separately where needed to distinguish their intentional resume updates from new-controller effects.
4. **New persistence behavior:** semantic identities survive reordering, language switching preserves notes, opt-out/reload/re-enable preserves stored work, edits made while off do not overwrite untouched fields, pending writes flush appropriately, completion changes only on explicit action, malformed and blocked storage remain recoverable, and deletion is scoped to the user's explicit choice. No automatic reading-to-concept completion import.
5. **Navigation and learning:** the four area links and active state work from both languages, all conceptual pages, old book commentary and late-built native courses. Concept explanations, relationships, examples, practice and optional source reading have their agreed order, with contextual next-step links. Research/themes/reference remain reachable through secondary paths.
6. **Browser accessibility:** verify 320px and desktop, keyboard focus/skip link, diagram text alternatives, long EN/PT strings, expanded answers and notes, no-script reading/answer access, meaningful form labels/live feedback, local table scrolling, reduced-motion behavior and project-prefix paths. Check that the first conceptual question is reached promptly rather than buried beneath repeated location panels.

No implementation or publication occurred in this phase. Only this audit document was added to the repository.
