# Source recovery and first-course QA

This continuation is local only. Existing commits `b25ea2b` and `1d8e28a` remain intact. Nothing was pushed, published, merged or deployed in this continuation.

## Original files

The repository ignores `.sources/`; its tracked source records describe external inputs, rather than embedding all original books. A checkout therefore does not restore those originals. This establishes the storage arrangement, not why a previous session did not retain a separate persistent copy, and does not establish that originals were deleted.

The current Library inventory locates 15 requested files: Foodwise PDF and Markdown; three esoteric Christianity transcripts; eight Philosophy chapter files (1–7 and 9); and the two introductory Anthroposophy PDFs. Exact returned identities and sizes are retained in [library-recovery-status.json](library-recovery-status.json). The eight chapter filenames do not establish that they are the original book rather than lecture commentary. Their source role still needs content inspection.

Recovery was attempted from this executor using the current Library download workflow, complete unchanged listing/search payloads, explicit file selections and ignored destination `.sources/library-recovered`. The action failed before byte transfer because the executor could not connect to Library. A retry with explicit network access failed identically. This is a connection failure, **not an approval denial**. No bytes, hashes or source fidelity are claimed as verified. The private request records remain under ignored `.sources/library-recovery-inputs/`; no signed URLs or source texts are committed.

These files are **located in Library but not materialized here**, not known lost. The inventory's zero local originals is still accurate. The unresolved Theosophy witness remains `Teosophy new (2).md` (PDF only for scan-dependent questions). Missing inputs do not prevent independent teaching improvements.

## Four completed bilingual corrections

- **Living archetypes:** the case now works through physical form, life and soul activity, their cooperation in the fourth region, and the collective higher-region account. Feedback explains why assigning entire earthly beings to individual regions is a category error. These relationships were already in the lesson's explanatory prose; this is not a new source verification.
- **Meditation 01:** the actual printed daily verse is interpreted in sequence: manifestation in the world, the soul's activity through love, rest, and future finding of oneself. Feedback explains how a claim of completed self-knowledge would change that sequence. No new quotation or locator was added.
- **Karma:** the learner explicitly causes the tool damage. The lesson separates an acquired careful habit from the repair, expense and lost use that remain in the shared world. The question tests the distinction rather than asking about an unrelated illness.
- **Synthesis:** a single meal situation now requires connecting body/soul/spirit, episodic memory/acquired capacity and inward fruit/outward consequence. The supplied answer explains each relationship before identifying the additional spiritual teaching.

## Review samples and validation

- [Living archetypes EN](../../docs/theosophy/lessons/living-archetypes.html) / [PT](../../docs/pt/theosophy/lessons/living-archetypes.html)
- [Karma EN](../../docs/theosophy/lessons/karma-and-action.html) / [PT](../../docs/pt/theosophy/lessons/karma-and-action.html)
- [Synthesis EN](../../docs/theosophy/lessons/whole-picture.html) / [PT](../../docs/pt/theosophy/lessons/whole-picture.html)
- [Meditation 01 EN](../../docs/meditation/01.html) / [PT](../../docs/pt/meditation/01.html)

The full build and all 37 existing validators passed after these edits. The pedagogy browser review passed 184 desktop/mobile cases across 92 bilingual pages with JavaScript disabled, including keyboard answers, language attributes, local assets and overflow. The coverage audit was regenerated; totals remain 523 English routes, 505 Portuguese counterparts and 108 scoped primary lesson audits. No new chapter is counted merely because an already revised case improved again.

The comprehensive redevelopment remains incomplete: 415 inventoried routes have no individual audit flag, including inherited views and support pages rather than 415 distinct book chapters. Nutrition's 18 full English lessons still lack Portuguese counterparts. Source fidelity and untouched-course teaching are not certified by the successful build. See [COVERAGE.md](COVERAGE.md) and [COMPLETED-LESSON-AUDIT.md](COMPLETED-LESSON-AUDIT.md).
