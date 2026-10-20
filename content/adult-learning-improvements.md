# Adult learner revision

## Purpose

The beginner course already contained useful teaching, but the shared workspace
hid its starting guidance, conceptual aids and study controls. Several concise
Introduction readings named more ideas than they explained. This revision makes
the existing courses easier to enter and follow without adding a competing course.

## Teaching changes

- Foundations remains the recommended first course. A visible bilingual panel
  explains that the seven-part Introduction is an alternative starting route.
- All Introduction lessons show their learning question before the reading.
- Introduction lessons 1, 5, 15, 26 and 28 have revised explanations and section
  headings. Lesson 1 explains the inner need before asking about it. Lesson 26
  introduces medicine, art and eurythmy with their different purposes and scope.
- Lesson 17 adds an optional plant/memory observation with an example response.
  Lesson 28 adds a short optional final task and example, connecting course ideas
  to a situation the learner can explain.
- Existing four-member cards, world relationships and the synthesis map move
  beside the main questions. The final study pathways remain visible.
- Introduction completion controls, overview resume links and progress summaries
  are visible. Foundations retains its consent checkbox with its now-visible
  notebook and completion controls. Storage code, keys and lesson identities are
  unchanged. No new account, tracking, automatic opt-in or progress migration is
  introduced.
- The workspace hides the replaced navigation, removes repeated direction
  labels, and uses a compact mobile footer. Existing source-owned destinations
  remain the navigation authority.

## Sources used for the additions

The supplied books were read separately; complete copyrighted source files are
not published here. The new learner prose is original explanation and adaptation.

| Addition | Source and scope |
| --- | --- |
| Human constitution support | Francis Edmunds, *An Introduction to Anthroposophy*, 2012 edition, Chapter 3. Steiner's detailed distinctions remain in the original lesson evidence. |
| Observation and recollection exercise | Edmunds, Chapter 2, supplied PDF captures 27–31. A brief course adaptation of the plant and memory exercises. |
| Practical fields | Matthew Barton's afterword, dated 2005, in the 2012 Edmunds edition, supplied captures 123–127. Used as a historical introduction, without reproducing old counts as current facts or making efficacy claims. |
| Freedom, memory and love | Rudolf Steiner, *What Is Anthroposophy?*, 2002 edition, Lecture III, 22 July 1923, GA 225, supplied captures 51–61. The triad is distinguished from thinking, feeling and willing; everyday examples are course applications. |

Capture numbers refer to positions in the supplied PDFs, not printed pagination.
Supporting source credits appear in both language versions. Specialist medicine
and eurythmy source gaps in the full source study remain explicitly recorded.

## Maintenance and verification

Edit `foundations-introduction-clear-lessons.json` for these readings and optional
activities, `scripts/platform-architecture.mjs` for the starting panel, and
`scripts/assets/course-workspace.*` for the reading layout. Run the complete build
and the existing validators. Generated pages use content-derived asset versions;
many page diffs therefore change only stylesheet/script fingerprints.

The catalogue validator now distinguishes the orientation panel's links from
course cards. The preservation validator still checks every learning link while
allowing content-derived CSS/JS fingerprints to change.
