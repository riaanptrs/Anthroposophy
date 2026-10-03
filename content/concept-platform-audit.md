# Anthroposophy platform: architecture audit and redesign decisions

Audit completed 2 October 2026 for the user's concept-based learning-platform redesign. Theosophy is the only course being rewritten in this prototype. This internal record describes the repository and its implementation contracts; it is separate from student teaching.

## Existing architecture

The initial snapshot contains 964 HTML files: 421 English/Portuguese pairs and 122 original English research notes. The complete navigation inventory covers nineteen collections, including the sixteen catalogue entries, the 36-lesson beginner path, the separate 28-lesson Introduction to Anthroposophy and the 24-lesson Biodynamic Agriculture course.

```text
SITE
├── Home: Learn Anthroposophy
├── Beginner learning path: 36 lessons
├── Introduction to Anthroposophy: 28 lessons
├── Books: mixed book guides, practice courses and source companions
│   ├── Theosophy: 28 source-ordered readings
│   ├── Philosophy of Freedom
│   ├── How to Know Higher Worlds
│   ├── Colour and According to Luke
│   ├── Temperaments: combined course plus three source companions
│   ├── Encountering the Self
│   ├── Practical Thinking and Meditation
│   ├── Biodynamic Agriculture plus two source companions
│   └── Ancient Myths and supplied Threefold Society opening
├── Themes and Applications: twelve scoped topics
├── Human-constitution reference
├── Research: authored ledgers, comparisons and dated editorial notes
└── Shared UI: static generators, CSS, JavaScript and optional local notebooks
```

The site is static and publishes `docs/` through GitHub Pages from `main`. `node scripts/build-all.mjs` imports the complete ordered generator chain. Dedicated late writers own Introduction, Practical Thinking, Theosophy and Biodynamics. Existing validators check source data, source excerpts, retained routes, notebook behavior, bilingual partners, local links and anchors.

The current Theosophy reading sequence has substantial source-based explanations, distinctions, diagrams and chapter syntheses. Its lesson structure nevertheless makes a book assignment the prerequisite and uses repeated comprehension quizzes. Its index presents the book's chapter/capture structure as the student's learning structure. The requested prototype changes that teaching experience while retaining the source commentary.

Existing Waldorf material covers Koepke's development/education cases, temperament guidance and scoped introductory connections. There is no complete specialist Waldorf curriculum in the reviewed corpus. Preserve those links without announcing a newly authored complete Waldorf course.

## Primary source and existing commentary

The current Theosophy source is the supplied Elizabeth Douglas Shields translation (1910), in a Delhi Open Books digital reissue. The source map records 94 PDF captures, their corresponding supplied Markdown and a complete prior image review. Printed pagination is not established for that reissue. The separate 1971 Monges/Church witness has 228 captures, printed pagination and thirteen addenda; its qualifications remain attributed to that edition.

The original 28 readings remain at `lessons/00.html` through `lessons/27.html`, in both languages. Their numeric identifiers differ from their pedagogical order. They are the detailed reading-commentary layer, not automatically the identities of the new conceptual lessons. Source-passage anchors and all old chapter/source routes must survive.

## New architecture

Four main learning areas serve distinct purposes:

- **Learn:** complete courses and a recommended beginner route. The existing 36-lesson path gets a distinct Foundations landing; Introduction remains available. Theosophy becomes the concept-based prototype.
- **Explore Concepts:** an extensible graph of explanations, terminology, related concepts, course context, source references and deeper study.
- **Practice:** source-based, optional observation and thinking activities, linked to the lessons that explain their purpose; existing practical courses remain accessible.
- **Read Steiner:** source-led commentary, original book/lecture groupings and source context. Related authors and anthology contributors retain their names and distinct attribution.

Research, applications/themes and the existing constitution reference remain accessible as supporting destinations. The homepage explains the learning identity and offers beginner, course and concept entry paths.

The route and pedagogical contract is in [concept-platform-contract.md](concept-platform-contract.md). The final generator must run after the legacy writers, preserve old routes and apply one validated navigation contract to every page. A second complete build must reproduce the final architecture rather than re-copying a prior new hub into the wrong legacy role.

## Progress and preservation

Source reading records remain in their existing stores. The rewritten course uses semantic lesson identifiers in an independent opt-in local store, with Not started, Exploring, Studied and Reviewed, bookmarks and optional bilingual reflections. Existing reading completion does not silently become completion of a different lesson. Learners can return to their old notes through the retained commentary.

The initial file hashes and historical passage/check-bank hashes are saved privately under `.sites-runtime/concept-platform/baseline.json`. No source books or transcriptions are added to public output.

## Audit evidence

- [Navigation and complete collection inventory](concept-platform-navigation-audit.md): all nineteen collections, existing Waldorf scope, retained routes and generator/link traps; 48 hub/index pages had valid local destinations and language partners.
- [Technical audit](concept-platform-technical-audit.md): progress, shared CSS/JS, builder ownership and check contracts; browser measurements cover eighteen EN/PT representative pages at 320px with no overflow, failed requests or pre-consent storage.
- [Content audit](concept-platform-content-audit.md): all sixteen catalogue courses, reusable practice assets, Theosophy's current teaching and the source-derived conceptual scope.
- [Destiny and knowledge source audit](concept-platform-source-destiny-knowledge-audit.md): every supplied Chapter II and IV capture, all nine Notes, and the eight existing bilingual reading units and syntheses.
- [Spiritual worlds source audit](concept-platform-source-worlds-audit.md): every Chapter III capture, all ten existing bilingual explanations and both syntheses; full regional/relationship coverage and source-specific terminology guards.

Chapter I and the source front matter were independently read by the content lead; the two chapter audits complete the supplied primary text and current reading coverage. The new source read used Markdown. The prior PDF review remains explicitly attributed to the existing source ledger; this redesign does not invent a fresh image review.

Only internal audit/contract files were written during this audit. These findings establish the implementation contracts in [concept-platform-contract.md](concept-platform-contract.md). Global architecture is the next phase; reusable components precede the course landing and formal curriculum allocation.
