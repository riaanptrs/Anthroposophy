# Anthroposophy

A bilingual learning website for studying Anthroposophy in English and Brazilian Portuguese.

## Website

The generated static website lives in `docs/`. Viewing or hosting it needs no installation.
Open `docs/index.html` locally to preview it. The Portuguese edition is in `docs/pt/index.html`.

To publish with GitHub Pages, use **Settings → Pages → Deploy from a branch**, choose the branch containing these files, and select **/docs**. The expected address is https://riaanptrs.github.io/Anthroposophy/ once Pages is enabled and deployment succeeds.

## Developing the lessons

Start with the [agreed course outline](content/course-outline.md): a beginner course built around Rudolf Steiner's **Theosophy / Teosofia (GA 9)**. The [chapter-by-chapter teaching plan](content/theosophy-chapter-teaching-plan.md) records the source analysis. The website now contains the orientation, 21 book lessons, and a final synthesis in both languages.

Edit original bilingual lesson content in `content/lessons.mjs` and `content/lessons-chapter-2.mjs` through `content/lessons-chapter-4.mjs`. Run `node scripts/build-lessons.mjs` to regenerate the lesson pages and course indexes. Run `node scripts/check-site.mjs` to check every local link, language pair, and lesson structure before publishing. No packages are required.

The course uses original explanations, notebook exercises, expandable suggested answers, and a self-assessment rubric. The 1971 English edition supplies printed-page references; the edition comparison records OCR limitations and recovered parallel readings. Portuguese explanations are original Brazilian Portuguese course text, not quotations from a published Portuguese translation.

1. Supply a book, excerpt, or transcript, together with available author, edition, page, or timestamp information.
2. Identify the learning objectives and create a draft using `content/lesson-template.md`.
3. Prepare matching English and Brazilian Portuguese lessons, a glossary, reflection questions, and review answers.
4. Review source accuracy and translations before adding published lesson pages under `docs/` and linking them from both homepages.

The editorial plan remains a working record. The published lessons are introductory reading companions, with source assignments for deeper study; they do not reproduce the book or claim expert endorsement.

Keep original source files intended only for preparation in `.sources/` (ignored by Git). Publish only material intended for the website. The `content/` folder contains editorial templates and is outside the Pages publishing folder.

## Design

Responsive, accessible static HTML and CSS with matching language navigation, semantic headings, visible keyboard focus, and no third-party scripts or services.
