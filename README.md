# Anthroposophy

A bilingual learning website for studying Anthroposophy in English and Brazilian Portuguese.

## Website

The static website lives in `docs/`. It needs no installation or build step.
Open `docs/index.html` locally to preview it. The Portuguese edition is in `docs/pt/index.html`.

To publish with GitHub Pages, use **Settings → Pages → Deploy from a branch**, choose the branch containing these files, and select **/docs**. The expected address is https://riaanptrs.github.io/Anthroposophy/ once Pages is enabled and deployment succeeds.

## Developing the lessons

Start with the [agreed course outline](content/course-outline.md): a beginner course built around Rudolf Steiner's **Theosophy / Teosofia (GA 9)**. The supplied 1971 English edition has now been read and analysed in the [chapter-by-chapter teaching plan](content/theosophy-chapter-teaching-plan.md), including proposed lessons, source pages, activities, and comprehension checks. The next step is drafting Lesson 1.

1. Supply a book, excerpt, or transcript, together with available author, edition, page, or timestamp information.
2. Identify the learning objectives and create a draft using `content/lesson-template.md`.
3. Prepare matching English and Brazilian Portuguese lessons, a glossary, reflection questions, and review answers.
4. Review source accuracy and translations before adding published lesson pages under `docs/` and linking them from both homepages.

The initial site contains an original study orientation. Source-based subject lessons are now planned and await drafting and review before publication.

Keep original source files intended only for preparation in `.sources/` (ignored by Git). Publish only material intended for the website. The `content/` folder contains editorial templates and is outside the Pages publishing folder.

## Design

Responsive, accessible static HTML and CSS with matching language navigation, semantic headings, visible keyboard focus, and no third-party scripts or services.
