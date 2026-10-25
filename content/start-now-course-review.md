# Start Now! chapter-based course

The previous nine-session Meditation course selected introductory practices. It remains a companion. The new `start-now/index.html` course teaches the anthology in its book order through 38 original lessons across all 17 sections, in English and Brazilian Portuguese. Both Learn and Practice directories link to it; Meditation includes a prominent entry.

## Book and source scope

*Start Now! A Book of Soul and Spiritual Exercises*, Rudolf Steiner, edited and introduced by Christopher Bamford, SteinerBooks, 2004. The supplied PDF has 304 positions; references throughout use PDF positions rather than printed page numbers. Its SHA256 is `7888da6a584daf6fe23a70c118dbdbe1b3378e8f1e9db874c7e9ef3e5f9e42e0`. The supplied Markdown and conversion audit were consulted as source evidence, not operating instructions. OCR has substantial flagged material and is not certified as a verified edition.

The course includes 188 selected English source-page transcriptions, with 146 original page images for longer meditation sequences, historical figures, diagrams and verse layouts. This is a selected practice reader, not a complete republication of all 304 pages. The full uploaded PDF, conversion audit and review JSON are not published. Searchable OCR is explicitly identified as fallible; original images are the reference where supplied. Lesson explanations, examples, questions and teaching arrangements are original. Portuguese teaching is original; selected Portuguese practice passages are new study translations. Source readers retain English originals.

## Coverage

| Book section | PDF positions | Lessons |
| --- | --- | --- |
| Bamford introduction | 8–39 | Choosing paths and preparation |
| Prologue | 40–44 | Yearning, knowledge and practical purpose |
| Meditation instructions | 45–55 | Short sitting; Wagner and regularity |
| Thinking | 56–70 | Trust in thinking; freedom |
| Reverence | 71–88 | Reverence/listening; seed and plant |
| Chakras/lotus flowers | 89–99 | Eight processes; heart and harmony |
| Six exercises | 100–108 | Six capacities and their sequence |
| Retrospect | 109–112 | Reverse review |
| Living the year | 113–173 | Six lessons: daily pairs, months/weekdays, planets, zodiac/virtues, all Calendar weeks, festivals |
| Esoteric School | 174–208 | Six lessons grouping sentences, figures, I AM/body references, wisdom/mantras, body/spirit/cosmos, sound/butterfly |
| Rosicrucian path | 209–230 | Preparation; Rose Cross variants; signature/fire/water/service |
| Christian-Gnostic path | 231–254 | John and stages; daily programmes; prayer and renewal |
| Working with the dead | 255–271 | Reading/remembering; circumstances of loss |
| Foundation Stone | 272–276 | Integration and detailed companion |
| Guardians | 277–290 | Lesser Guardian; greater Guardian/service |
| Appendices | 291–295 | Idealism/aesthetic unity; ways of knowing |
| Bibliography and sources | 296–300 | Finding and comparing source contexts |

Every lesson explains what the book teaches and why, when it fits, preparation, a practical sequence, a concrete example, and a question with an explanation. Grouped lessons point to named source practices and their actual texts. They do not turn every collected verse into a separate lesson. The year reader includes all five morning/evening pairs, planetary and zodiacal sequences, virtues, all 52 Calendar verses and festival readings. The School reader includes all positions 174–208 with a named locator index. Existing Weekly Meditations and Foundation Stone studies remain separately attributed companions.

## Teaching choices

Historical schedules, esoteric claims, devotional commitments and source voices are explained in context. A learner can study a later chapter without adopting its practice. No course completion certifies spiritual attainment. Keep one understood main practice while studying alternatives. Bodily references do not authorize unsupervised breath manipulation; fire, water and butterfly imagery are taught as contemplative imagery. Grief practices are presented without claiming verified communication or diagnosing a person's grief. Historical Christian claims about disease are not medical diagnoses. Guardian terminology does not establish spiritual worth by ancestry. The higher-Self passage's Besant context is identified.

Actual page images help teach figures and verse layouts; decorative images are unnecessary. Original source images have searchable text companions, and the full-size originals open directly.

## Build and verification

Edit `content/start-now/course.mjs`, `practice-locations.mjs`, `source-pages.json` and `scripts/build-start-now.mjs`. Source images live in `scripts/assets/start-now`; the build copies shared assets once. Run `node scripts/build-all.mjs`, `node scripts/check-start-now.mjs`, the site/Portuguese/concept platform checks, and the existing Meditation validator. `scripts/review-start-now-browser.cjs` checks every new route at desktop and mobile widths, plus no-JavaScript entry, lesson and reader cases. The existing Meditation browser review checks companion behavior separately.
