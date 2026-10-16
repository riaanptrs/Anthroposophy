# Theosophy workspace preview

Review branch: `review/theosophy-learning-workspace`.
Baseline: `350061aee27dfabec08db99effaa97f3eeda3749`.
Scope: Theosophy overview plus 24 lessons, English and Portuguese (50 pages).
This branch is for review; do not merge or deploy without layout approval.

## Result

The course overview puts its curriculum immediately after the compact introduction.
Its modules can be opened independently; guidance, descriptions and sources remain
available. Desktop lessons have a scrolling curriculum rail with the current lesson
in view and a comfortable reading column. Mobile lessons use a native modal Chapters
drawer with focus containment, Escape, focus return and the original site links.
Lesson position and previous/next links remain visible during reading. The existing
short reading is followed by indexed optional depth, source context and personal
study. The original warm palette, artwork and typefaces remain in use.

## Preservation and implementation

The `main` HTML of all 50 generated pages is byte-identical to baseline. The new
layout moves existing DOM nodes; it does not rewrite lesson content, quotations,
source references, existing IDs, URLs or study selectors. The study implementation
and storage namespace in `concept-platform.js` are unchanged. No other course
receives these assets. Without JavaScript, the original complete layout remains
usable. Printing opens all disclosures and hides fixed navigation; screen state
is restored afterward.

Files:

- `scripts/theosophy-workspace.mjs`: route-scoped build integration.
- `scripts/assets/theosophy-workspace.{css,js}`: progressive layout enhancement.
- `scripts/review-theosophy-workspace.cjs`: preservation, interaction and browser tests.
- `scripts/package-theosophy-preview.cjs`: standalone review-only HTML (outside docs).
- `scripts/review-theosophy-portable.cjs`: offline package browser tests.
- `scripts/package-theosophy-screenshots.cjs`: captioned screenshot PDF.

The standalone HTML includes all 50 pages with inline assets. Its small review
adapter provides page navigation inside an iframe and uses a separate
`anthro-layout-review-v1:` namespace. This adapter is not part of the website build.
Other courses/reference pages open an explanatory preview notice. Their original
links remain unchanged in the actual branch. The package makes no network requests.

## Validation

- Full `node scripts/build-lessons.mjs` build.
- `node scripts/check-site.mjs`: 1,587 pages and local links/anchors.
- `node scripts/check-theosophy-clarity.mjs`: complete bilingual first readings.
- `node scripts/check-concept-platform.mjs`: conceptual course contracts.
- 100 browser cases: all 50 pages at 390 and 1440 CSS pixels, including expanded depth.
- Every authored paragraph, heading and definition retained after DOM enhancement.
- Mobile modal keyboard containment, Escape, focus return and desktop resize.
- Original opt-in storage, state, bookmarks, EN/PT notes, reload, export and deletion.
- Direct deep links, Portuguese long labels, no horizontal overflow and no bottom-bar
  obstruction of the document end.
- 200% zoom-equivalent reflow (720 x 500 CSS pixels from 1440 x 1000).
- Complete Portuguese synthesis print: 19 pages; glossary and source context present.
- No-JavaScript reading and disclosure fallback.
- Portable package: course/next/language/long-lesson navigation, drawer, depth and
  isolated review saving at 390/1440, with zero external requests.

Browser tests use Playwright and `/usr/bin/chromium`. In this environment:

```sh
NODE_PATH=/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules node scripts/review-theosophy-workspace.cjs
node scripts/package-theosophy-preview.cjs
NODE_PATH=/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules node scripts/review-theosophy-portable.cjs
```

Set `PREVIEW_OUTPUT` to change the artifact directory (default:
`/workspace/theosophy-ux-preview`). Screenshot PDF packaging uses the reviewed
captures in that directory. Generated review files are not emitted into `docs`.

## Review files and limits

`Theosophy-layout-review.pdf` contains nine desktop/mobile screenshots plus a review
cover. `Theosophy-layout-preview.html` contains the interactive bilingual preview.
Both are saved to ChatGPT Library; they are not public deployments.

Screenshots are local renders, not live-site verification. Direct live access and
file:// navigation are blocked by this environment. No physical Android device or
screen-reader certification was available. The 200% check tests CSS-pixel reflow,
not a physical browser zoom control. Downloaded HTML execution depends on the
Android browser/viewer; the PDF is the reliable visual review companion. The live
website and all other courses remain unchanged pending review.
