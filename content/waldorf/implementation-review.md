# Waldorf course implementation and validation

Implemented on 7 October 2026 in the existing static Anthroposophy repository.
The course starts at `/learn/waldorf/index.html`, beneath the existing GitHub
Pages `/docs` publication root. This record describes the pre-publication
implementation checks. The user subsequently authorized publication through
the repository's existing `main:/docs` GitHub Pages setup.

## Architecture and content authority

The uploaded ZIP's 74 files remain byte-for-byte unchanged in `waldorf-course/`.
The five package guides were read before implementation. Only the 62 Markdown
content files in foundations, development, grades, subjects and parents supply
educational prose. The course master supplies the navigation, developmental
spine and grade overview matrix; README, CONTENT_STATUS and SOURCES supply the
orientation, status and provenance pages. Reference conversation records and
implementation directives are retained in the repository, not published as
additional educational prose.

`scripts/waldorf-content.mjs` explicitly maps Markdown to public routes and
records the four content states. `scripts/build-waldorf.mjs` renders 98 pages,
scoped styles and scripts. `content/waldorf/manifest.json` records routes, source
fingerprints and pending verification. The builder runs before final shared
navigation in the existing full build. The shared Learn hub renderer includes
a prominent course card before its existing course sections, in English and
Portuguese; the Portuguese card clearly identifies English content.

The existing Fraunces/Alegreya Sans typography, palette, navigation and original
education artwork are reused. Course CSS stays scoped. Tables become labeled
cards on small screens; the developmental timeline becomes vertical. Topic
filtering uses no framework. Optional local reading marks follow the site's
study-control pattern in a separate `anthro-waldorf-v1:` namespace, because the
existing controllers validate their own course IDs and route structures. No
existing course records are changed. Marking a draft as read never implies that
its copy or sources are complete.

## Decisions relative to the supplied specification

- The preferred `/learn/waldorf/` location and named HTML routes are retained.
- Each grade has an overview, child, curriculum and why-now page. The overview
  preserves the **entire** dossier, available in a native expandable section.
  Focused pages reproduce intact numbered sections selected explicitly in the
  model. They are labeled dossier views, not newly authored parent lessons.
- Some subject files lack a complete grade-by-grade pathway. Those pages show
  the supplied planning points, a clear awaiting-copy notice and grade links.
  Supplied sequences and grade tables become curriculum journeys. Missing
  sequences and subject explanations have not been filled with invented text.
- Two additional supplied parent questions (art and class teacher) are retained
  alongside the requested topics. Home Life remains a visibly labeled placeholder.
- Sources & Origins panels show inherited categories, file identity, conversation
  traces and unresolved citation clues. Existing quotations and attributions
  remain unverified. Internal citation tokens become explicit citation-pending
  text; no invented title, page locator or link resolves them.
- The local preview server now serves SVG and font MIME types correctly. This
  fixes original site artwork in the preview without changing public assets.

## Pages awaiting final educational copy

Full clickable inventory: `/learn/waldorf/status.html`.

| Content | Pages / supplied files | Remaining work |
|---|---|---|
| Foundation lessons 1–6 | 6 lesson drafts | Editorial review and source/quotation verification; substantive draft prose already supplied |
| Foundation lessons 7–19 | 13 outlines | Final lesson explanations, examples and source checks |
| Development lessons 20–26 | 7 outlines | Final stage lessons, examples, activities and source checks |
| Grades 1–9 | 9 dossiers, plus 27 focused view pages | Final parent-facing lessons, classroom case studies, exercises, parent observations and assessment guidance; missing subject details and primary passages |
| Subject pathways | 13 outlines | Final explanations, examples, missing grade sequences and source checks |
| Parent questions other than Home Life | 13 outlines | Final answers, school-variation qualifications and source checks |
| Home Life | 1 placeholder | Substantive question, explanation, examples and sources absent |

The subject pages are Mathematics, Language, History, Geography, Natural Science,
Physics, Chemistry, Handwork, Arts, Music, Eurythmy and Movement, Foreign Languages
and Technology.

The parent-question outlines are Advanced Child, Arts, Assessment, Class Teacher,
High School and University, Learning Differences, Reading, Religion, Science,
Storytelling, Struggling Child, Technology and Textbooks. Home Life is the separate
placeholder. Each file's original unfinished-work notes remain in the rendered
page. No educational source has been independently verified by this implementation.

## Validation evidence

- Full site build succeeded. A second full build changed **zero** output files.
- `check-site.mjs` passed across all 1,467 HTML pages: links, anchors, shared
  navigation, source companions and existing teaching structures.
- `check-waldorf.mjs` passed: 98 routes, 62 content fingerprints, distinct draft
  states, source panels, page titles, anchors and Learn hub discovery.
- Browser review passed **294 page/viewport checks**, all 98 pages at 1280, 390
  and 320 pixels. Grade dossiers and source panels also expand without page
  overflow at the smallest width. SVG artwork loads successfully.
- Browser text comparison confirmed that the entire visible text of all **62**
  educational Markdown files survives rendering, including qualifications,
  examples, inherited quotations, provenance and unfinished-work sections.
- Filtering, combined search/section selection and empty results passed.
  Timeline, grade, Learn hub and source-panel keyboard navigation passed.
- GitHub Pages repository-prefix navigation was tested under `/Anthroposophy/`.
  Static navigation and dossiers work with JavaScript disabled. Opt-in saving,
  reload, deletion and blocked localStorage were tested.
- All original package files compare exactly against their ZIP entries.
  Among previously existing public files, only `docs/learn/index.html` and
  `docs/pt/learn/index.html` changed; all existing course pages are unchanged.
- The authored implementation passes `git diff --check` excluding the unchanged
  uploaded `waldorf-course/` package. Original Markdown hard breaks, trailing
  spaces and blank lines are retained byte-for-byte rather than reformatted.

The complete repository validator run passed **32 of 33** scripts. The sole
failure is `check-guided-study.mjs`, which expects an `esoteric-christianity-1`
reading entry in `docs/books/index.html`. That Books page is byte-for-byte
unchanged from the initial snapshot and Git HEAD. Running the validator against
an isolated baseline containing only the initial public files reproduces the
same failure. This is an existing unrelated reading-hub inconsistency.

## Preview and reproduction

### Published lesson layout correction

After publication, a user screenshot showed repeated package status and source
provenance paragraphs interrupting the opening of a foundation lesson. The
renderer now places editorial status blocks, source traces and provenance
notes inside the collapsed Sources & Origins panel. A compact visible status
notice retains the correct draft state and pending source verification; outlines
and placeholders still visibly say they await final course copy. Educational
explanations, examples, qualifications and inherited provenance labels remain
in the reading area. Original package files remain unchanged.

The browser fidelity check compares the reading area and relocated source-note
area separately against the corresponding supplied Markdown blocks, and checks
that their combined original blocks reconstruct the entire source body exactly.
This preserves the source material while removing duplicate editorial text from
the lesson opening.

From the repository root:

```sh
node scripts/build-all.mjs
node scripts/check-waldorf.mjs
node scripts/check-waldorf-provenance.mjs
node scripts/check-site.mjs
node scripts/preview.mjs
```

Open `http://127.0.0.1:4173/learn/waldorf/index.html`. With the server running:

```sh
node scripts/review-waldorf-browser.cjs
```

Browser verification uses the environment's Playwright and Chromium, following
the existing review scripts. `WALDORF_PREVIEW_URL` and `CHROMIUM_PATH` can override
the defaults. Preview screenshots are saved outside public docs at
`/workspace/waldorf-preview-1280.png`, `waldorf-preview-390.png` and
`waldorf-preview-320.png`; the JSON browser report is in
`/tmp/waldorf-browser-review.json`.

Inherited provenance markers now display as readable notes. Book attributions
name a work only when its complete supplied register title appears in the same
heading section; otherwise the source is explicitly unresolved. A named work
does not establish passage verification. Exact original categories remain in
`data-original-label` and in the unchanged Markdown. Browser fidelity checks
restore those original labels before comparing educational text.

Internal citation indices, message IDs, and original package notes are preserved
inside a separately collapsed “Editorial source records” section. Inline
conversation tokens display only “Source verification pending”; their original
indices remain available for source auditing and text-preservation checks.
Browser checks cover the default collapsed state and expanded mobile layout.
