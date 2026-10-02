import fs from 'node:fs';

const read = name => JSON.parse(fs.readFileSync(new URL(name, import.meta.url), 'utf8'));

export function loadTheosophyCourse({pilot = false} = {}) {
  const source = read('theosophy-guided-source-map.json');
  const chapters = source.chapters.map(meta => {
    if (pilot && meta.number !== 1) return {...meta, lessons: []};
    return {...meta, ...read(`theosophy-guided-chapter-${meta.number}.json`), titlePt: meta.titlePt};
  });
  const introduction = read('theosophy-guided-introduction.json');
  const ending = pilot ? [] : [read('theosophy-guided-synthesis.json')];
  const lessons = [introduction, ...chapters.flatMap(c => c.lessons), ...ending];
  const order = [0, ...source.chapters.flatMap(c => c.plannedIds), 22];
  const byId = new Map(lessons.map(l => [l.id, l]));
  if (byId.size !== lessons.length) throw Error('Duplicate Theosophy reading identity');
  if (!pilot && JSON.stringify(lessons.map(l => l.id)) !== JSON.stringify(order)) {
    throw Error('Theosophy readings do not follow the verified chapter sequence');
  }
  for (const lesson of lessons) {
    for (const lang of ['en', 'pt']) {
      if (!lesson[lang]?.title) throw Error(`Missing Theosophy title ${lesson.id}/${lang}`);
      if (lesson.id !== 22 && lesson[lang].checks?.length !== 2) {
        throw Error(`Expected two text-comprehension checks ${lesson.id}/${lang}`);
      }
    }
  }
  return {source, chapters, lessons, order, byId, pilot};
}
