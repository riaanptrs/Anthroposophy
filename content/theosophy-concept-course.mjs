import fs from 'node:fs';
import {loadTheosophyCourse} from './theosophy-guided.mjs';

const slug = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const languages = ['en', 'pt'];
const read = name => JSON.parse(fs.readFileSync(new URL(name, import.meta.url), 'utf8'));
const requireValue = (condition, message) => { if (!condition) throw new Error(message); };
const text = (value, label) => requireValue(typeof value === 'string' && value.trim().length > 0, `Missing ${label}`);
const list = (value, label, min = 1, max = Infinity) => {
  requireValue(Array.isArray(value) && value.length >= min && value.length <= max, `Invalid ${label}`);
  value.forEach((item, i) => text(item, `${label}[${i}]`));
};
const index = (entries, kind) => {
  const result = new Map();
  for (const entry of entries) {
    requireValue(slug.test(entry.id ?? '') && !result.has(entry.id), `Invalid or duplicate ${kind}: ${entry.id}`);
    result.set(entry.id, entry);
  }
  return result;
};

/** Validate the authored graph before any public page is written. */
export function validateConceptCourse(course, groups, readingCourse = loadTheosophyCourse()) {
  requireValue(course.id === 'theosophy' && course.route === 'theosophy', 'Unsupported prototype identity');
  requireValue(course.schemaVersion === 1, 'Unsupported conceptual course schema');
  requireValue(['authoring', 'ready'].includes(course.status), 'Unsupported publication status');
  for (const lang of languages) {
    for (const field of ['title', 'question', 'subtitle']) text(course[lang]?.[field], `Course ${lang}/${field}`);
    for (const field of ['introduction', 'purpose', 'audience', 'outcomes', 'approach', 'synthesis']) list(course[lang]?.[field], `Course ${lang}/${field}`);
  }
  const lessons = groups.flatMap(group => group.lessons ?? []);
  const concepts = groups.flatMap(group => group.concepts ?? []);
  const practices = groups.flatMap(group => group.practices ?? []);
  const lessonById = index(lessons, 'lesson'), conceptById = index(concepts, 'concept'), practiceById = index(practices, 'practice');
  const moduleById = index(course.modules, 'module');
  const declaredLessonIds = course.modules.flatMap(module => module.lessonIds);
  requireValue(JSON.stringify(declaredLessonIds) === JSON.stringify(course.lessonIds.filter(id => id !== course.synthesis.id)), 'Module sequence differs from lesson sequence');
  requireValue(new Set(course.lessonIds).size === course.lessonIds.length, 'Duplicate lesson in course order');
  requireValue(JSON.stringify([...lessonById.keys()].sort()) === JSON.stringify([...declaredLessonIds].sort()), 'Authored lessons differ from curriculum');
  requireValue(slug.test(course.synthesis.id) && !lessonById.has(course.synthesis.id), 'Invalid synthesis identity');
  requireValue(course.lessonIds.at(-1) === course.synthesis.id, 'Synthesis must end the course');
  for (const group of groups) {
    requireValue(Array.isArray(group.moduleIds) && group.moduleIds.every(id => moduleById.has(id)), 'Invalid authoring module group');
    requireValue(group.lessons.every(lesson => group.moduleIds.includes(lesson.moduleId)), 'Lesson authored outside declared module');
  }

  const checkSources = (sources, label) => {
    requireValue(Array.isArray(sources) && sources.length > 0, `Missing sources: ${label}`);
    for (const source of sources) {
      const bounds = source.chapter === 0 ? [5, 12] : readingCourse.source.chapters.find(chapter => chapter.number === source.chapter)?.captures;
      requireValue(bounds && Array.isArray(source.captures) && source.captures.length === 2, `Invalid source bounds: ${label}`);
      const [first, last] = source.captures;
      requireValue(Number.isInteger(first) && Number.isInteger(last) && first <= last && first >= bounds[0] && last <= bounds[1], `Source outside verified chapter: ${label}`);
      requireValue(Array.isArray(source.readingIds) && source.readingIds.length > 0 && new Set(source.readingIds).size === source.readingIds.length, `Invalid reading context: ${label}`);
      if (source.noteIds) requireValue(Array.isArray(source.noteIds) && source.noteIds.length > 0 && new Set(source.noteIds).size === source.noteIds.length && source.noteIds.every(id => Number.isInteger(id) && id >= 1 && id <= readingCourse.source.notes.count), `Invalid 1910 note reference: ${label}`);
      for (const id of source.readingIds) {
        const reading = readingCourse.byId.get(id);
        requireValue(reading && id !== 22 && reading.chapter === source.chapter, `Reading context differs from source chapter: ${label}/${id}`);
      }
    }
  };
  const resolveIds = (ids, lookup, label, min = 1) => {
    requireValue(Array.isArray(ids) && ids.length >= min && new Set(ids).size === ids.length, `Invalid ${label}`);
    ids.forEach(id => requireValue(lookup.has(id), `Unknown ${label}: ${id}`));
  };
  for (const module of course.modules) {
    resolveIds(module.lessonIds, lessonById, `${module.id} lessons`);
    module.lessonIds.forEach(id => requireValue(lessonById.get(id).moduleId === module.id, `Conflicting lesson module: ${id}`));
    for (const lang of languages) for (const field of ['title', 'description', 'question']) text(module[lang]?.[field], `${module.id}/${lang}/${field}`);
  }
  for (const lesson of lessons) {
    requireValue(conceptById.has(lesson.primaryConceptId), `Unknown primary concept: ${lesson.id}`);
    resolveIds(lesson.termIds, conceptById, `${lesson.id} terminology`);
    resolveIds(lesson.conceptIds, conceptById, `${lesson.id} concepts`);
    requireValue(lesson.conceptIds.includes(lesson.primaryConceptId), `Primary concept absent from connections: ${lesson.id}`);
    requireValue(Array.isArray(lesson.connections) && lesson.connections.length > 0, `Missing meaningful connections: ${lesson.id}`);
    for (const edge of lesson.connections) {
      requireValue(conceptById.has(edge.id) && lesson.conceptIds.includes(edge.id), `Unknown connected concept: ${lesson.id}/${edge.id}`);
      languages.forEach(lang => text(edge[lang], `${lesson.id} relationship/${lang}`));
    }
    requireValue(lesson.practiceId === null || practiceById.has(lesson.practiceId), `Unknown practice: ${lesson.id}`);
    if (lesson.practiceId) requireValue(practiceById.get(lesson.practiceId).lessonIds.includes(lesson.id), `Practice missing reciprocal lesson: ${lesson.id}`);
    checkSources(lesson.sources, lesson.id);
    for (const lang of languages) {
      const copy = lesson[lang];
      for (const field of ['title', 'question', 'centralIdea', 'distinction']) text(copy?.[field], `${lesson.id}/${lang}/${field}`);
      list(copy.experience, `${lesson.id}/${lang}/experience`);
      list(copy.explanation, `${lesson.id}/${lang}/explanation`, 2, 5);
      if (copy.comparisons) {
        requireValue(Array.isArray(copy.comparisons), `Invalid comparison collection: ${lesson.id}/${lang}`);
        for (const table of copy.comparisons) {
          text(table.title, 'comparison title'); list(table.headers, 'comparison headers', 2, 3);
          requireValue(Array.isArray(table.rows) && table.rows.length > 0, 'Comparison has no rows');
          for (const row of table.rows) list(row, 'comparison row', table.headers.length, table.headers.length);
        }
      }
      text(copy.reflection?.question, `${lesson.id}/${lang}/reflection`);
      list(copy.reflection?.notes, `${lesson.id}/${lang}/reflection notes`);
      list(copy.takeaways, `${lesson.id}/${lang}/takeaways`, 3, 6);
      requireValue(Array.isArray(copy.deeper), `Invalid deeper study: ${lesson.id}/${lang}`);
      for (const deeper of copy.deeper) {text(deeper.title, 'deeper title'); list(deeper.paragraphs, 'deeper explanation');}
    }
  }
  for (const concept of concepts) {
    checkSources(concept.sources, concept.id);
    requireValue(Array.isArray(concept.related), `Missing concept relationships: ${concept.id}`);
    for (const edge of concept.related) {
      requireValue(conceptById.has(edge.id) && edge.id !== concept.id, `Invalid concept edge: ${concept.id}/${edge.id}`);
      languages.forEach(lang => text(edge[lang], `${concept.id} relationship/${lang}`));
    }
    requireValue(lessons.some(lesson => lesson.conceptIds.includes(concept.id)), `Concept without a teaching context: ${concept.id}`);
    for (const lang of languages) {
      const copy = concept[lang];
      for (const field of ['term', 'definition', 'distinction']) text(copy?.[field], `${concept.id}/${lang}/${field}`);
      list(copy.alsoCalled, `${concept.id}/${lang}/synonyms`, 0);
      list(copy.explanation, `${concept.id}/${lang}/explanation`, 1, 3);
    }
  }
  for (const practice of practices) {
    checkSources(practice.sources, practice.id);
    requireValue(['course-adaptation', 'source-exercise'].includes(practice.sourceType), `Invalid practice attribution: ${practice.id}`);
    requireValue(['observation', 'self-observation', 'thinking', 'attention', 'biography', 'equanimity'].includes(practice.category), `Unsupported practice category: ${practice.id}`);
    resolveIds(practice.lessonIds, lessonById, `${practice.id} lessons`);
    resolveIds(practice.conceptIds, conceptById, `${practice.id} concepts`);
    for (const lang of languages) {
      const copy = practice[lang];
      for (const field of ['title', 'purpose', 'duration', 'reflection', 'sourceBasis']) text(copy?.[field], `${practice.id}/${lang}/${field}`);
      list(copy.steps, `${practice.id}/${lang}/steps`, 3, 5);
      list(copy.notes, `${practice.id}/${lang}/notes`);
    }
  }
  checkSources(course.synthesis.sources, course.synthesis.id);
  checkSources(course.sources, 'Course introduction');
  if (course.status === 'ready') for (const lang of languages) {
    const copy = course.synthesis[lang];
    text(copy?.title, `Synthesis ${lang} title`); text(copy?.question, `Synthesis ${lang} question`);
    requireValue(Array.isArray(copy.bigPicture) && copy.bigPicture.length > 0, `Synthesis ${lang} concept map`);
    for (const cluster of copy.bigPicture) {
      text(cluster.title, 'Concept cluster title'); text(cluster.relationship, 'Concept cluster relationship');
      resolveIds(cluster.conceptIds, conceptById, 'Synthesis concepts');
    }
    list(copy.takeaways, `Synthesis ${lang} takeaways`, 3, 6);
    requireValue(Array.isArray(copy.reviewQuestions) && copy.reviewQuestions.length === 10, `Synthesis ${lang} ten review questions`);
    for (const review of copy.reviewQuestions) {text(review.question, 'Review question'); list(review.notes, 'Review notes');}
    requireValue(Array.isArray(copy.continuing) && copy.continuing.length > 0, `Synthesis ${lang} continuing study`);
    for (const entry of copy.continuing) {
      text(entry.title, 'Continuing title'); text(entry.description, 'Continuing explanation');
      requireValue(/^[a-z0-9/-]+\.html$/.test(entry.route) && !entry.route.startsWith('/') && !entry.route.split('/').some(part => part === '.' || part === '..'), 'Invalid continuing route');
    }
  }
  return {course: {...course, sourceLedger: readingCourse.source}, lessons: course.lessonIds.filter(id => lessonById.has(id)).map(id => lessonById.get(id)), concepts, practices, lessonById, conceptById, practiceById, moduleById, readingCourse};
}

export function loadConceptCourse() {
  const course = read('theosophy-concept-course.json');
  requireValue(Array.isArray(course.dataFiles) && course.dataFiles.every(name => /^theosophy-concept-[a-z-]+\.json$/.test(name)), 'Invalid teaching data file');
  return validateConceptCourse(course, course.dataFiles.map(read));
}
