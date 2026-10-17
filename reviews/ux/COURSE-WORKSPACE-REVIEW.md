# Course reading and navigation review

Review branch: `redesign/course-learning-workspace`.
Layout baseline: `798a3b7d997c786be901ef8d34ba225c72a45345`.
This continuation prepares reviewable changes only. It does not merge or deploy them.

The courses now use a focused reading column, a desktop curriculum sidebar and a mobile Chapters drawer. Compact overviews put chapter selection before optional course guidance. The Learn and Books catalogues have bilingual, accent-insensitive search and pagination. The implementation retains the source-owned lesson order, including optional practices and Waldorf branches.

## Coverage and pedagogical evidence

The existing pedagogical redevelopment covers 24 course groups and 487 authored teaching units: 487 scoped audits, 256 revised units and 231 individually retained units. The 36 additional Waldorf grade/support routes are tracked separately. These are teaching-unit counts, not unique original book chapters. This continuation changes presentation and navigation; it does not count existing teaching as newly rewritten.

- [Per-course checklist](../pedagogy/COURSE-CHECKLIST.md): audited, revised and retained counts and bilingual coverage.
- [Individual lesson audits](../pedagogy/COMPLETED-LESSON-AUDIT.md): objectives, concepts, prerequisites, connections, misconceptions, gaps, teaching methods and source limits.
- [Chapter census](../pedagogy/chapter-coverage.json): every English route and Portuguese counterpart with content evidence.
- [Source inventory](../pedagogy/source-availability.json) and [exact source requests](../pedagogy/SOURCE-REQUEST.md): unavailable witnesses, their roles and work that can proceed independently.
- [Theosophy sample and review](../pedagogy/THEOSOPHY-CLARITY-REVIEW.md): complete 24-lesson first course, with [bilingual examples](../pedagogy/THEOSOPHY-CLARITY-SAMPLES.md).

The shared adapter covers 23 course families and 1,277 pages: 926 lesson pages, 46 overviews, 283 reference pages, 18 section pages and four catalogue pages. The separate Theosophy implementation covers another 50 pages, including all 24 lessons in both languages. [The generated coverage list](course-workspace-coverage.json) records every route and its role. Legacy source companions that were English-only remain English-only; the layout does not manufacture translations.

## What changed

Existing page content is moved into a clearer layout at runtime. All 1,277 original main documents remain byte-identical to the baseline. Short teaching, worked examples, optional questions with explanations, retained deeper readings, quotations, source locators, IDs and study hooks remain present. No authored `content/` file or study-storage implementation is changed in this continuation.

On lessons, the current chapter stays visible in the desktop curriculum. Mobile uses a native dialog with keyboard containment, Escape, focus return and the existing site navigation. Previous and next links remain visible during reading. Long Waldorf resource menus move into a labelled curriculum disclosure. Section links reveal deeper disclosures when necessary. Existing personal-study controls remain available under My study where applicable.

Course overviews retain the original introduction, artwork, source information and study tools, with most supporting guidance in a disclosure. Searchable curriculum groups appear near the beginning. Catalogue cards are retained, with six results per mobile page or nine per desktop page. Print reveals all filtered cards and disclosures and hides fixed navigation. Without JavaScript, the complete original page remains available.

The build integration runs after all course generators, including the existing Waldorf generator. The course registry derives titles, groups and routes from current course data and generated pages; it does not replace the Waldorf content model.

## Validation

Final receipts are stored beside this report:

- `course-workspace-validators.json`: 47 repository validators, including the 1,587-page local link and anchor check.
- `course-workspace-browser.json`: all 1,277 enhanced pages at 390 and 1440 CSS pixels; byte-preserved main documents, authored prose, unique IDs, headings, navigation targets and overflow checks. Representative pages additionally exercise deeper reading, keyboard drawer controls, unobstructed document ends and no-JavaScript fallback.
- `course-workspace-interactions.json`: 13 checks covering seven existing study systems, GitHub Pages path prefix, consent before persistence, EN/PT completion and notes where supported, catalogue search, print, 200% zoom-equivalent reflow and unavailable storage.
- `course-workspace-theosophy.json`: 100 regression cases for the separate Theosophy preview and its existing study behavior.

The final browser run supersedes the earlier run whose four Foundations overview checks counted a relocated resume link as missing paragraph content. The link itself was preserved; the assertion now excludes that dynamic link container. A real mobile overflow defect caused by inherited global flex navigation was corrected before the final run.

Screenshots cover mobile and desktop representatives from every course family, plus Portuguese overviews and catalogue views. `scripts/package-course-workspace-review.cjs` packages them into `Anthroposophy-course-layout-review.pdf` in the review output directory. Screenshots are local renders, not proof of a production deployment.

## Reproduce

Run from the repository root with Node, Playwright, pdf-lib and Chromium available. Browser scripts use `/usr/bin/chromium`; this environment supplies Node modules through `NODE_PATH=/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules`.

```sh
node scripts/build-lessons.mjs
mkdir -p /tmp/course-layout-baseline
git archive 798a3b7 docs | tar -x -C /tmp/course-layout-baseline
node scripts/review-course-workspace.cjs
node scripts/review-course-workspace-interactions.cjs
PREVIEW_OUTPUT=/workspace/course-ui-rollout/theosophy node scripts/review-theosophy-workspace.cjs
node scripts/package-course-workspace-review.cjs
git diff --check
```

Run every `scripts/check-*.mjs` with Node for the repository validator suite. Keep generated files stable while browser tests run. `REVIEW_OUTPUT` changes the shared browser/PDF output directory; `PREVIEW_OUTPUT` changes the Theosophy output directory.

## Remaining limits

Source-fidelity verification remains separate from teaching and software validation. The original witnesses listed in the source inventory are unavailable locally. The smallest Theosophy request remains `Teosophy new (2).md`; the PDF is needed only for scan-dependent questions. Located Library files are not equivalent to downloaded, inspected source material.

Nutrition's Portuguese teaching is a condensed adaptation; quoted excerpts and documentary capture notes remain labelled English. Threefold Society covers only the supplied opening, not an entire GA 23 edition. Spiritual teachings retain their attribution and are not newly presented as established empirical or medical findings. This layout pass adds no quotations, page references or health claims.

Browser validation uses local Chromium. It is not a screen-reader certification or a physical Android/Safari device test. No merge, deployment, paid service, credential change or external message is part of this review delivery.
