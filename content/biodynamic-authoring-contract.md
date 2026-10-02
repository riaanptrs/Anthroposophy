# Biodynamic Agriculture authoring contract

Internal implementation record for the 2 October 2026 revision. The attached task and the user's final source direction govern the scope. This contract records the data interface and source/provenance safeguards; it does not add an approval requirement.

The user's final instruction, “use the markdown files,” authorizes release from the supplied Markdown and supersedes the earlier PDF-inspection publication condition. Creeger/Gardner 1993 is the canonical witness; Adams 1958/2012 is the comparator. Quotes must be verified in their actual canonical captures, and teaching diagrams are original explanations. Native PDF wording, pagination and historical images remain unverified; their inspection flags must stay false. Release validation and deployment are still in progress.

The supplied Markdown matches the previously reviewed source fingerprints. Source maps cover all eight lectures and four discussions. Parts were authored and reviewed **in order**, one part at a time; all six are complete. Modern teaching claims use only the reviewed evidence register and its declared limits.

## Part files

Write `content/biodynamic-part-N.json`, with this shape:

```json
{
  "id": 1,
  "en": {
    "question": "Central agricultural question for this part",
    "sources": "GA 327 Lecture 1, 7 June 1924; Lecture 2, 10 June 1924",
    "outcomes": ["Three to five concrete learning outcomes"],
    "synthesis": {
      "summary": ["An explanation of the connections, not a lesson list"],
      "steps": ["A meaningful sequence of three to seven relationships"],
      "question": "One synthesis question",
      "answer": ["A reasoned optional model answer"]
    }
  },
  "pt": "Same object structure, complete Brazilian Portuguese",
  "lessons": [
    {
      "id": 1,
      "titleEn": "Required lesson title",
      "titlePt": "Equivalent Portuguese title",
      "source": {
        "lecture": 1,
        "date": "1924-06-07",
        "captures": [18, 19, 20],
        "quoteCapture": 20,
        "quoteEn": "One exact short canonical Markdown excerpt, preferably under 35 words",
        "quotePt": "An original Portuguese study translation of that exact excerpt",
        "pdfVerified": false,
        "printedPages": null,
        "additional": [
          {"labelEn": "Lecture/discussion or separately attributed context", "labelPt": "Equivalent label", "date": "1924-06-12", "captures": [66, 67]}
        ]
      },
      "en": {
        "question": "A concrete agricultural question",
        "intro": ["Why this question arises on a farm or garden"],
        "proposal": ["At least two developed paragraphs explaining Steiner accurately"],
        "model": ["Starting condition", "Proposed process", "Intermediate effect", "Intended outcome"],
        "example": ["An original concrete agricultural example, with invented cases identified"],
        "anthroposophy": ["Explain relevant spiritual terms within the attributed model"],
        "modernContext": ["A useful modern comparison, without pretending it establishes the proposed spiritual mechanism"],
        "limits": ["A precise boundary between source claim, observation and causal inference"],
        "modernReferences": [],
        "checks": [
          {"question": "Understanding question", "options": ["Option A", "Option B", "Option C"], "answer": 1, "explanation": "Why this matches the source"},
          {"question": "Second conceptual distinction", "options": ["Option A", "Option B", "Option C"], "answer": 2, "explanation": "Reasoned feedback"},
          {"type": "reflection", "question": "Apply or connect the distinction", "explanation": "A suggested way to reason"}
        ],
        "observe": {
          "task": ["A noninvasive observation or document-based system mapping task"],
          "record": ["Date/conditions", "Observable detail", "Separate interpretation"],
          "interpretation": "What observations can establish and what requires another kind of evidence"
        },
        "connection": ["Why the next named lesson follows"],
        "optional": [],
        "tables": []
      },
      "pt": "Full equivalent object, with matching check answer indexes"
    }
  ]
}
```

For the separately dated June 11 address or June 20 report, `source.sectionEn` and `source.sectionPt` may replace the lecture label. Such a block remains Steiner's words; Pfeiffer, Shouldice, Courtney and editor prose cannot be put under a Rudolf Steiner quotation heading.

For tables, each language supplies objects with `caption`, `headers`, `rows` and `credit`. Every row has the same number of cells as the headers. Row labels belong in the first cell. These are original course comparison tables, with precise primary locators in the credit.

Lesson 11 and the Part III synthesis also use `cycle` with `caption`, `start`, `paths` (each with `title`, `steps` and alternative `returns`), `end`, `note` and `credit`. The renderer shows separate manure and plant-residue routes, including an explicitly optional compost branch. A compulsory single manure→compost chain would contradict the explanation.

Optional reading objects have `route` relative to the language's docs root, `title` and `label`. Useful stable routes include `what-is-biodynamics/lessons/00.html` (source orientation), `01.html` (Courtney), `05.html` (GA 230), `03.html` (GA 136), and `agriculture/index.html` (full reading companion).

Reviewed modern teaching-reference IDs are `demeter-standard`, `dok-fibl` and `usda-soil`. The evidence register records applicable Demeter 2026 clauses, FiBL's official DOK design and 2024 synthesis findings, and NRCS definitions/testing guidance with precise review extents and locators. Use only those reviewed facts, with their scope and limitations. The corrected Mäder 2002 and Brock 2019 papers are unread optional bibliographic leads; do not put them in a lesson's `modernReferences` or attribute findings to direct reading of those papers. Certification requirements, measured outcomes and proposed spiritual causes remain distinct.

## Specific requirements

- Part III: make animals, feed, manure and landscape reciprocal; retain Steiner's qualification about economic constraints on self-sufficiency. The manure–compost–soil cycle is a conceptual diagram, not a claim that every farm handles all manure identically.
- Part IV: explain why first; distinguish the two horn treatments carefully; provide one substantial six-row 502–507 table; include enclosure, exposure, destination and attributed role. Include a nine-row 500–508 role map in the part synthesis or tables. The preparation numbers are later labels. Horsetail has a different status. Never combine conflicting translations into a precise recipe.
- Part V: separate weeds, mice/other pests, insects, plant pathology and rhythms. Source certainty and invitations to trials are different claims. The course provides no animal-killing or burning instructions. Current field management requires appropriate diagnoses and lawful, humane methods.
- Part VI: teach observed outcome versus causal explanation and whole-system versus preparation-specific study. The final lesson reconstructs the conceptual system and contains `project` with `title`, `introduction`, `tasks` and a longitudinal, clearly fictional `model` in each language. The project is **Portrait of a Living Place**, with observation and Anthroposophical interpretation kept separate.

Each source quote must be checked in its actual canonical capture block. Locators are labelled Markdown captures; printed page numbers are not inferred from captures or Kindle indicators. Native PDFs were not inspected, and PDF verification must not be claimed. The approved Markdown release does not require that inspection. Primary source data uses only the Creeger/Gardner witness; comparison terminology is discussed only where it changes understanding. Extraction damage and unresolved translation/provenance issues remain explicit.

The renderer creates original process diagrams and explicitly distinguishes these from historical drawings. Historical-image reproductions are not part of this release. Any future reproduction would need its own inspected image witness and attribution.

## Practice library

After completing the six parts, write `content/biodynamic-practice-library.json` with five `categories`: farm observation, fertility, preparations, farm challenges and rhythms. Each category has `id`, `titleEn`, `titlePt` and `entries`. Each entry has a unique `id`, `titleEn`, `titlePt`, a valid `lessonId`, and complete `en`/`pt` objects containing `observation` (paragraph array), `steiner`, `later` and `evidence`. The three provenance labels describe different kinds of claim; historical indications are not operational protocols. Entries link to the lesson's full source block and modern references. Keep the library separate from the sequential lesson list.
