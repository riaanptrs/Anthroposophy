# Concept-based Anthroposophy platform: implementation contract

User direction received 2 October 2026. Theosophy is the prototype; other course teaching remains intact until the prototype is complete. This is an implementation document, not a student lesson.

## Learning model

Teach the principal ideas of the source through clear questions, ordinary experience, accurate terminology, connected explanations, appropriate everyday practice and concise takeaways. Reading the original book is optional. Preserve the distinction between ordinary observation, Steiner's account and a course exercise through short labels rather than repeated disclaimers. References support the lesson at its end. Detailed reading commentary belongs in Read Steiner.

Use English and Brazilian Portuguese throughout the new student routes. Preserve translation identities, edition-specific locators and the existing private-source boundary. Do not invent quotations, source passages, GA references or complete courses for topics with only partial source coverage.

## Ordered implementation

1. Audit repository, routes, source content, mobile behavior and saved progress.
2. Establish Learn, Explore Concepts, Practice and Read Steiner in global navigation.
3. Build reusable course and lesson components.
4. Build the Theosophy introduction and module landing.
5. Finalize conceptual modules and lessons from the full source analysis.
6. Rewrite lessons around their learning questions, rather than renaming reading units.
7. Preserve detailed commentary and its existing addresses in Read Steiner.
8. Connect concept pages and related concepts.
9. Connect source-based practical exercises and their course context.
10. Complete the course synthesis, glossary, review questions and practice overview.
11. Verify desktop, mobile, keyboard, no-JavaScript reading, storage compatibility and full-site links.
12. Consider the next course only after the Theosophy prototype works.

## Planned route contract

| Area | Role | Compatibility |
| --- | --- | --- |
| `index.html` | Identity and three entry paths | Retain useful old anchors |
| `learn/index.html` | Courses and recommended beginner journey | Existing beginner lesson URLs survive |
| `learn/foundations/index.html` | Existing 36-lesson beginner sequence | Rebase links; keep its existing progress store |
| `theosophy/index.html` | Conceptual course introduction and modules | Stable course address |
| `theosophy/lessons/<slug>.html` | Rewritten conceptual teaching | New semantic identities, distinct from old reading completion |
| `concepts/index.html`, `concepts/<slug>.html` | Connected terminology and explanations | Source-based, extensible graph |
| `practice/index.html`, `practice/<slug>.html` | Course-linked exercises | No mandatory account, assessment or spiritual experience |
| `read/index.html`, `read/theosophy/index.html` | Original sources and detailed commentary | All existing reading URLs, source notes and notes preserved |
| `lessons/00.html` through `lessons/27.html` | Existing Theosophy reading commentary | Existing content, notebook IDs and source assignments preserved |
| `research/`, `themes/`, `reference/` | Existing specialist assets | Still accessible as supporting destinations |

Every route has its `pt/` counterpart except existing original English research notes, which retain their honest language label.

## Reusable teaching sections

Question; Begin with experience (Observe); Central idea (Steiner's account); useful terminology; Building the concept; genuine misconception; connected concept map; appropriate Try it in life; reflection with native Reveal course notes; three to six takeaways; optional Deeper study; Primary source and Read in context.

Diagrams explain relationships. They do not imply that interpenetrating members are anatomical layers or successive stages. Ordinary practice does not become evidence for supersensible claims.

## Data and progress

Keep historical course data and passage/check banks unchanged. New teaching content has semantic lesson/concept/exercise IDs and explicit source references. A validated manifest determines every new route and relationship.

Existing `anthro-study-v1:`, `anthro-learning-v1:`, introduction, practical-thinking and biodynamic records remain untouched. The conceptual course uses an independent store. Existing reading completion is not silently equated with studying rewritten lessons. Local saving requires opt-in; session-only work remains usable without it. Support Not started, Exploring, Studied and Reviewed, bookmarking, optional bilingual reflection and note export. Malformed or unrelated records cannot corrupt other courses or redirect resume links outside the site and the course.

## Verification boundary

Keep full-site link and language checks, source fidelity, preserved source-bank hashes and legacy notebook checks. Update assertions only where the user's new navigation or course identity intentionally changes behavior, and add meaningful checks for the new concept graph, source placement, lesson completeness and storage isolation. Validate the actual final build twice when preservation/copy order can affect a repeated build. No public draft placeholders or unfinished lessons.
