# Seven-course conceptual review and independent QA follow-up

This batch continues from `3e83271` on the review branch. It individually audits the requested Colour, Encountering the Self and four temperament groups, then continues to the What Is Biodynamics? anthology. **96 authored teaching units are audited: 21 revised bilingually and 75 retained with individual reasons.** Three earlier-course QA findings are also corrected; those corrections do not add new units to the audit count.

| Course | Authored units audited | Revised | Retained | EN/PT lesson pages |
| --- | ---: | ---: | ---: | ---: |
| Colour | 14 | 4 | 10 | 28 |
| Encountering the Self | 17 | 4 | 13 | 34 |
| The Four Temperaments | 11 | 2 | 9 | 22 |
| Understand Temperament (Childs) | 13 | 2 | 11 | 26 |
| Mystery of Temperaments | 15 | 3 | 12 | 30 |
| Understanding Temperaments (practice) | 12 | 1 | 11 | 24 |
| What Is Biodynamics? | 14 | 5 | 9 | 28 |
| Total | **96** | **21** | **75** | **192** |

These are authored teaching records, not unique original book chapters or unique concepts. Several temperament courses intentionally address related sources. Their English and Portuguese versions are counted once. Source-derived substantive explanations are preserved; revised passages replace an existing example or its explanation, rather than append a repeated teaching template.

## Learning criteria and decisions

The [six-course ledger](six-course-revision-ledger.json) and [anthology ledger](anthology-revision-ledger.json) record an individual learning criterion, prerequisites, actual retained explanation and feedback, a specific gap or retention reason, the teaching method and source limitations for every lesson. [COMPLETED-LESSON-AUDIT.md](COMPLETED-LESSON-AUDIT.md) incorporates these into the broader review.

Examples of the criteria and resulting decisions:

- **Colour 06, revised:** keep the head/cosmos viewpoint reversal distinct from past/future polarity. The sketch now explains which relation changes with standpoint and which concerns becoming.
- **Encountering the Self 05, revised:** explain successive developmental emphasis with simultaneous cooperation. The paragraph explicitly follows the diagram's arrows without treating an ordinary learner's preference as a measurement of the spiritual model.
- **Mystery 03, revised:** explain reciprocal colouring as interaction. A sustained musical phrase changes its realization on a plucked or bowed instrument, while the intended phrase selects which possibilities are used.
- **Childs 08, revised:** derive ten unordered pairings and distinguish that counting convention from partners having identical roles or needs.
- **Four Temperaments 09, retained:** reason's indirect role and the different child/adult phlegmatic proposals are already explained. The short comparison task and existing feedback provide the required distinction.
- **Understanding Temperaments 07, retained:** support follows the identified difficulty. The unreachable-materials transfer already makes the learner revise an interest-based interpretation into an access adjustment.
- **Anthology 08, retained:** the winter/summer and below/above polarity is already connected to trial uncertainty and ordinary manuring. Its three-way machinery comparison supplies actual reasons rather than a blanket machine prohibition.

## Substantive before/after samples

### Encountering the Self 06: discovery, design and revision

Before: “One person can use both directions of learning. The example clarifies the contrast without assigning capacities permanently by age.”

After: “In the first step, pressure on the clay produces a curve the learner notices and develops: the encountered material helps suggest the form. In the second, an anticipated vessel guides what the hands try to make. Comparing result and plan can then alter the next intention. One learner thus moves from discovery toward design and back through revision.” The paragraph retains the distinction between this exercise and proof of Koepke's bodily explanations.

### Mystery 12: why the arrangement matters

Before: “The arrangement gives variety a useful role while asking for a small completed result.”

After: “The two-paragraph task uses the very movement that was disrupting study: attention shifts from one passage to the other to find a connection. The purpose gives that shift a direction, the five-minute boundary limits its extent, and the written connection supplies a completion point.” The rest explains reason's indirect role and a possible revision when the learner alternates without finding a connection.

### Understanding Temperaments 11: a completed synthesis

The former paragraph asked the learner to name a support and a reason to revise it. It now supplies a short account: Lea's early departure fulfilled a supplies agreement; her patient repairs complicate the first judgment; Steiner's mixture qualification and Childs's attention to aptitude inform an offered role; interruptions or a different preference would change the arrangement. The source ideas, observations and proposed action remain distinct.

### Anthology 09: preserve the actual difficult claim

The former example assigned three boxes. The replacement fills them: potash and lime with hydrogen as assistant → the asserted transformation into nitrogen → a predicted change in the soil's capacity. It explains why substituting “recycling” changes the source's meaning, while accurately naming a transformation does not establish that it occurred. The example is conceptual teaching, not an agricultural procedure.

All revised examples have Portuguese counterparts. No new source quotations or page locators were introduced.

## Independent QA corrections

- **Foundations 11:** restored the established Portuguese “alma senciente” and corrected “em direção ao si-mesmo espiritual”. The same terminology correction applies to the development paragraph in Foundations 08. The earlier ledger and report now explicitly acknowledge that the main lesson already explained both pairings, nine-to-seven grouping and transformations. The added paragraph is consolidation/reinforcement, not a previously missing explanation.
- **Introduction 07:** introduces the accusation and dated receipt before analyzing the case. Its replacement optional check compares two articulate responses that both value deadlines: one defends the accusation by appealing to past delays; the other withdraws this accusation because the receipt contradicts it and treats earlier delays separately. Explained feedback identifies truth-guided revision, not verbal fluency or obvious category labels.
- **Waldorf physics:** the bilingual objective now promises interpretation of position data and separation of motion description from causal explanation, matching the existing worked records. It no longer promises an experimental controlled comparison that the lesson does not perform.

## Validation and source limits

The full build and all 37 repository validators pass. Preservation comparisons cover all 96 records: source assignments, locators, existing source quotations and non-target fields are unchanged. The six-course pass changes case explanations and feedback derived from those explanations; the anthology changes only five bilingual examples. Earlier-course QA edits are separately described above.

Browser evidence is in [six-course-browser.json](six-course-browser.json) and [anthology-browser.json](anthology-browser.json). The first checks 164 course pages plus six QA pages; the second checks 28 anthology pages. Together these are 198 pages at two widths (1280 and 320), with JavaScript disabled. Checks include visible core teaching, language, keyboard disclosures, horizontal overflow, local fragments and loaded assets. Run `node scripts/review-six-course-browser.cjs` and `node scripts/review-six-course-browser.cjs --anthology` to reproduce the two sets.

This is review of repository teaching and existing provenance, not independent reinspection of original witnesses. No original source file was recovered, published or freshly verified. The unchanged Library network failure was not retried. Source limitations remain explicit: Colour's transcript gaps; Koepke's constructed scenes and mediated quotations; the unidentified Mystery upload's translator/edition/date; Childs's contradictory formulations about changing temperament; and the anthology's distinct compiler, editor and lecture voices. Biological, medical and agricultural claims retain their attribution and evidence limits. No remedy, ingestion exercise or field-treatment protocol was added.

## Exact remaining work

The catalogue contains **487 authored units**, with **360 scoped audits: 225 revised and 135 retained**. There are **127 authored units still awaiting individual audit**:

| Remaining group | Units |
| --- | ---: |
| Agriculture | 18 |
| Biodynamic Agriculture | 24 |
| Foodwise | 39 |
| Nutrition | 18 |
| Theosophy reading companion | 28 |
| Total | **127** |

The catalogue's 523 English and 505 Portuguese routes include **36 Waldorf inherited/support views** beyond those authored units. Those views remain separately tracked. Nutrition still lacks Portuguese versions of its 18 full lessons. Earlier scoped audits are not equivalent to completing every original book or specialist discipline; fresh source verification remains pending even where teaching is audited. See [COURSE-CHECKLIST.md](COURSE-CHECKLIST.md) for the current distinctions.
