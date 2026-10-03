# Prototype teaching data contract

Implementation schema for the reusable components. All student prose is authored in English and Brazilian Portuguese. IDs are semantic lowercase slugs and never change with a lesson's display number.

The provisional source-audit scope is five modules (5 / 4 / 3 / 7 / 4 teaching units) and one final synthesis. Formal curriculum allocation follows the architecture, reusable components and course landing phases.

## Module files

Each `content/theosophy-concept-<group>.json` contains:

```json
{
  "moduleIds": ["human-being"],
  "lessons": [],
  "concepts": [],
  "practices": []
}
```

Authoring ownership may combine modules in one file. The final loader checks uniqueness across every file.

## Source reference

```json
{"chapter": 1, "captures": [13, 15], "readingIds": [1]}
```

Use only source-ledger chapter/capture bounds and existing reading IDs. These locate the Shields primary source and the retained reading commentary. Source chapter headings and translation credit come from the source ledger, not an invented label. No source passage is copied into the new data. Additional source notes belong in attributed deeper study. Exact teaching divisions are separate from original subsections.

An optional `noteIds: [1, 2]` identifies the supplied 1910 edition's nine Notes and Amplifications, which the renderer cites separately at captures 93–94. Main chapter capture bounds remain unchanged. These note IDs do not name the 1971 edition's thirteen addenda.

## Teaching lesson

```json
{
  "id": "life-and-etheric-body",
  "moduleId": "human-being",
  "primaryConceptId": "etheric-body",
  "termIds": ["etheric-body", "physical-body"],
  "conceptIds": ["etheric-body", "physical-body", "spiritual-transformation"],
  "connections": [
    {"id": "physical-body", "en": "The living organism has a physical constitution.", "pt": "O organismo vivo tem uma constituição física."}
  ],
  "practiceId": "observe-living-form",
  "sources": [{"chapter": 1, "captures": [17, 21], "readingIds": [3]}],
  "en": {
    "title": "Life and the etheric body",
    "question": "What makes an organism alive?",
    "experience": ["An ordinary, concrete observation before the term is introduced."],
    "centralIdea": "A concise statement of Steiner's concept.",
    "explanation": ["Two to five progressive paragraphs that teach the idea without requiring the book."],
    "distinction": "A genuine neighboring-concept distinction or misconception.",
    "reflection": {"question": "Explain the distinction in your own words.", "notes": ["A concise course synthesis revealed optionally."]},
    "takeaways": ["Three to six substantial things to remember."],
    "deeper": [{"title": "A useful advanced question", "paragraphs": ["Precisely attributed deeper treatment."]}]
  },
  "pt": {"title": "Equivalent complete Portuguese fields."}
}
```

`practiceId` may be null when ordinary practice would be artificial. A fitting conceptual reflection remains useful. `termIds`, `conceptIds` and `connections` resolve only to authored concept entries. An explanation should develop a distinction and its purpose, not be a renamed paragraph summary. Ordinary experience illustrates a question; Steiner's supersensible account is attributed in the central idea/explanation.

An optional localized `comparisons` array supports meaningful conceptual tables: `{title, headers: [two or three strings], rows: [[the same number of strings]]}`. Use short entries, accurate distinctions and a caption; the renderer wraps them for narrow screens. For example, the soul world's seven regions need their actual names and organizing relations without seven oversized paragraphs.

## Concept

```json
{
  "id": "etheric-body",
  "sources": [{"chapter": 1, "captures": [17, 21], "readingIds": [3]}],
  "related": [
    {"id": "physical-body", "en": "Physical constitution of the living organism", "pt": "Constituição física do organismo vivo"}
  ],
  "en": {
    "term": "Etheric body",
    "alsoCalled": ["Life body"],
    "definition": "A beginner definition that retains Steiner's meaning.",
    "explanation": ["One or two further explanatory paragraphs."],
    "distinction": "A useful neighboring-concept distinction."
  },
  "pt": {"term": "Corpo etérico", "alsoCalled": ["Corpo vital"], "definition": "...", "explanation": ["..."], "distinction": "..."}
}
```

German is optional: use `german` only when its form has been verified; it is not a required beginner field. Each concept page derives its relevant lessons and practices from validated IDs and has primary references and deeper reading links. Related edges name actual relations; they do not make every relationship a causal sequence.

## Practice

```json
{
  "id": "observe-living-form",
  "category": "observation",
  "sourceType": "course-adaptation",
  "lessonIds": ["life-and-etheric-body"],
  "conceptIds": ["etheric-body", "physical-body"],
  "sources": [{"chapter": 1, "captures": [17, 21], "readingIds": [3]}],
  "en": {
    "title": "Observe a living form",
    "purpose": "What the activity helps distinguish.",
    "duration": "A flexible ordinary-life suggestion, identified as the course arrangement.",
    "steps": ["Three to five concrete steps, without a required written submission."],
    "reflection": "A question linked to the taught distinction.",
    "notes": ["Concise comparison notes; no spiritual diagnosis or claimed result."],
    "sourceBasis": "How this course exercise arises from the identified source idea."
  },
  "pt": {"title": "Complete equivalent Portuguese fields."}
}
```

Permitted source types: `course-adaptation` or `source-exercise`. The latter must actually be an exercise given by Steiner. A course duration is not falsely presented as prescribed in the book. Categories: `observation`, `self-observation`, `thinking`, `attention`, `biography`, `equanimity`. Other categories require a specific source basis rather than a generic wellbeing promise.

## Source and terminology guards

Preserve body/soul/spirit, the formative life-body, sentient-body versus sentient-soul, the grouping use of astral body, the three soul functions, the I and spiritual members. Memory differs from retained ability; heredity, individuality, reincarnation and karma differ. Soul regions and Spirit-land regions have different organizing principles and interpenetrate. Purification differs from karma. Archetypes are independent creative beings in Steiner's account, not just abstractions. Aura descriptions are asserted spiritual perceptions, not personality diagnoses. Understanding, assent and personal investigation differ; receptivity preserves judgment and equanimity preserves feeling.

Do not ask for past-life identification, aura perception, spiritual ranking, diagnosis or belief declarations. Do not copy a 1971 addendum into the 1910 source without its explicit separate attribution. Chapter III's collective beings are asserted independently of human souls, not produced by their psychological aggregation.
