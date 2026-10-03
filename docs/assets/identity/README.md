# Anthroposophy visual identity

Prepared 3 October 2026 for the learning website.

The unfolding brand mark, the course symbols and the learning landscape are original editorial graphics made for this site. They suggest growth, observation and relationships between ideas. They do not reproduce Sophia Institute branding or historical Steiner drawings, and they are not official Anthroposophical emblems. Course accent colours are editorial design choices, not asserted spiritual correspondences.

## Self-hosted fonts

The site uses two contemporary, open-source typefaces. Neither is presented as a historical Anthroposophical font.

- **Fraunces**, by Undercase Type, Phaedra Charles and Flavia Zimbardi: expressive headings. The bundled variable WOFF2 retains optical size 9–144 and weight 400–700. Softness is fixed at 30 and wonk at 0 for restrained headings.
- **Alegreya Sans**, by Juan Pablo del Peral and Huerta Tipográfica: reading text, navigation and controls. Both the actual Regular and Bold masters are bundled; bold is not synthesized from the regular face.

Both fonts remain licensed under the **SIL Open Font License 1.1**. Complete licenses are retained in `fonts/Fraunces-OFL.txt` and `fonts/AlegreyaSans-OFL.txt`. These files must accompany redistributed font files.

Canonical sources:

- https://github.com/google/fonts/tree/main/ofl/fraunces
- https://github.com/undercasetype/Fraunces
- https://github.com/google/fonts/tree/main/ofl/alegreyasans
- https://github.com/huertatipografica/Alegreya-Sans

The fonts were converted to WOFF2 and subset with fontTools 4.61.1, using Brotli compression. The subset keeps available Latin and Latin Extended characters, Greek, typographic punctuation, currency, arrows and mathematical symbols. Every bundled font was reopened and checked for Portuguese accents, German accented terms, smart quotation marks, en/em dashes and ellipsis. Fraunces does not provide the right arrow; the normal sans-serif fallback supplies that symbol. Alegreya Sans includes it.

`fonts/font-sources.json` records original source URLs, original and bundled SHA-256 hashes, file sizes, retained axes and verified accent coverage. The original source TTFs remain private working assets; the public site needs only these smaller WOFF2 files.

## Graphics

`illustrations/learning-landscape.svg` is the original homepage graphic. The course family consists of:

| File | Subject motif |
| --- | --- |
| `human-being.svg` | Interwoven forms for constitution, individuality and their relationships |
| `freedom.svg` | Converging paths for thinking and free action |
| `higher-worlds.svg` | Rising arcs for attention and inner development |
| `agriculture.svg` | Growth and roots for cultivation and soil |
| `colour.svg` | Related colour arcs for visual observation |
| `temperaments.svg` | Four varied curves, without classifying a person |
| `society.svg` | Interrelated forms for cultural, legal and economic life |
| `education.svg` | An unfolding plant form for development |
| `thinking.svg` | Connected paths for observation and reasoning |
| `unfolding.svg` | A general growth motif for introductory learning |

Images are decorative in the interface: written course names and descriptions carry the meaning. The symbol family does not replace teaching diagrams or historical source drawings.
