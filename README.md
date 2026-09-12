# Anthroposophy

A bilingual learning website for studying Anthroposophy in English and Brazilian Portuguese.

## Website

The generated static website lives in `docs/`. Viewing or hosting it needs no installation.
Open `docs/index.html` locally to preview it. The Portuguese edition is in `docs/pt/index.html`.

To publish with GitHub Pages, use **Settings → Pages → Deploy from a branch**, choose the branch containing these files, and select **/docs**. The expected address is https://riaanptrs.github.io/Anthroposophy/ once Pages is enabled and deployment succeeds.

## Developing the lessons

The site now contains **two bilingual reading courses**: *Theosophy* (orientation, 21 book lessons and synthesis) and *How to Know Higher Worlds* (orientation and 18 lessons including synthesis). Course 2 starts at `docs/higher-worlds/index.html`, with its Portuguese counterpart at `docs/pt/higher-worlds/index.html`. The homepages link both courses, and the final GA 9 lesson leads into GA 10.

Edit Course 2 in `content/higher-worlds.mjs` and its four short GA 9 supplements in `content/higher-worlds-connections.mjs`. Every Course 2 lesson includes a worked example, explanation, source assignment, glossary, activity, three answer checks, a rubric and a link back to Course 1. Its page references use the replacement **107-page transcription**, not the original 294-marker file. Source texts remain private and are not copied into the public site.

`node scripts/build-lessons.mjs` builds both courses; it invokes `scripts/build-higher-worlds.mjs`. `node scripts/check-site.mjs` checks all **88 pages**, their links and anchors, language pairs, required learning sections and content completeness. The source comparison and editorial history remain in `content/higher-worlds-reading-review.md` and `content/higher-worlds-course-plan.md`.

Start with the [agreed course outline](content/course-outline.md): a beginner course built around Rudolf Steiner's **Theosophy / Teosofia (GA 9)**. The [chapter-by-chapter teaching plan](content/theosophy-chapter-teaching-plan.md) records the source analysis. The website now contains the orientation, 21 book lessons, and a final synthesis in both languages.

Begin with the new **Why study anthroposophy? / Por que estudar antroposofia?** introduction (Lesson 0). It includes an everyday example, the purpose of the study, a linked course map, and a comprehension check. Selected connections with *What Is Anthroposophy?* deepen Lessons 1, 5, 6, 7, 18, 19, 21, and 22 while keeping *Theosophy* as the main sequence. The general study guide remains available on the homepage.

Edit the introduction in `content/introduction.mjs`, the later-lecture connections in `content/anthroposophy-connections.mjs`, and the main lessons in `content/lessons.mjs` and `content/lessons-chapter-2.mjs` through `content/lessons-chapter-4.mjs`. Run `node scripts/build-lessons.mjs` to regenerate the lesson pages and course indexes. Run `node scripts/check-site.mjs` to check every local link, language pair, and lesson structure before publishing. No packages are required. Source limitations and the follow-up for a replacement transcription are recorded in `content/anthroposophy-introduction-review.md`.

The course uses original worked examples, explanations, one key takeaway per lesson, notebook exercises, expandable suggested answers, and a self-assessment rubric. Edit the bilingual examples in `content/lesson-examples.mjs`. Examples explicitly distinguish what they illustrate from the wider claims they do not establish. The opening lesson distinguishes soul from emotion alone and spirit from reasoning alone. The 1971 English edition supplies printed-page references; the edition comparison records OCR limitations and recovered parallel readings. Portuguese explanations are original Brazilian Portuguese course text, not quotations from a published Portuguese translation.

1. Supply a book, excerpt, or transcript, together with available author, edition, page, or timestamp information.
2. Identify the learning objectives and create a draft using `content/lesson-template.md`.
3. Prepare matching English and Brazilian Portuguese lessons, a glossary, reflection questions, and review answers.
4. Review source accuracy and translations before adding published lesson pages under `docs/` and linking them from both homepages.

The editorial plan remains a working record. The published lessons are introductory reading companions, with source assignments for deeper study; they do not reproduce the book or claim expert endorsement.

Keep original source files intended only for preparation in `.sources/` (ignored by Git). Publish only material intended for the website. The `content/` folder contains editorial templates and is outside the Pages publishing folder.

## Design

Responsive, accessible static HTML and CSS with matching language navigation, semantic headings, visible keyboard focus, and no third-party scripts or services.
