import fs from 'node:fs';
import assert from 'node:assert/strict';
import {biodynamicRoute, biodynamicPartSlugs} from './biodynamic-owned.mjs';

export const biodynamicPublicationChecks = ['sourcePassagesAndLocatorsVerified','diagramProvenanceVerified','modernSourcesVerified','legacyMigrationVerified','browserChecksPassed'];
const expectedParts = [[1,2,3],[4,5,6,7],[8,9,10,11],[12,13,14,15,16],[17,18,19,20],[21,22,23,24]];

export const readBiodynamicJSON = name => JSON.parse(fs.readFileSync(`content/${name}`, 'utf8'));
export function assertBiodynamicCourseLayout(course) {
  assert.equal(course.route,biodynamicRoute,'Fixed biodynamic course route');
  assert.equal(course.parts.length,6,'Six biodynamic course parts');
  assert.deepEqual(course.parts.map(part=>part.slug),[...biodynamicPartSlugs],'Fixed ordered biodynamic part routes');
  assert.deepEqual(course.parts.map(part=>part.lessonIds),expectedParts,'Required ordered lesson membership');
  assert.deepEqual(course.parts.map(part=>part.id),[1,2,3,4,5,6]);
}
export function biodynamicCourseData() {
  const course = readBiodynamicJSON('biodynamic-agriculture-course.json');
  assertBiodynamicCourseLayout(course);
  const parts = course.parts.map(meta => {
    const file = `biodynamic-part-${meta.id}.json`;
    if (!fs.existsSync(`content/${file}`)) throw new Error(`Biodynamic part ${meta.id} has not been authored.`);
    const authored=readBiodynamicJSON(file);
    assert.equal(authored.id,meta.id,`Biodynamic part ${meta.id} identity`);
    assert.deepEqual(authored.lessons.map(lesson=>lesson.id),meta.lessonIds,`Biodynamic part ${meta.id} lesson membership`);
    if(authored.slug)assert.equal(authored.slug,meta.slug,'Part cannot change its course-owned route');
    return {...authored, ...meta, lessons:authored.lessons};
  });
  const lessons = parts.flatMap(part => part.lessons.map(lesson => ({...lesson, part: part.id})));
  return {course, parts, lessons};
}
export function assertBiodynamicPublicationReady(course) {
  assertBiodynamicCourseLayout(course);
  const markdown = course.sourceAuthority === 'supplied-markdown';
  const knownAuthority = markdown || course.sourceAuthority === 'supplied-pdf';
  const required = markdown ? biodynamicPublicationChecks : ['pdfPassagesAndPagesVerified','pdfDrawingsInspected','modernSourcesVerified','legacyMigrationVerified','browserChecksPassed'];
  const missing = required.filter(name=>course.publicationChecks?.[name]!==true);
  const sourceReady = markdown
    ? course.canonical?.markdownVerified===true && course.comparison?.markdownVerified===true && course.canonical?.paginationKind==='markdown-capture' && course.diagramPolicy==='original-teaching-diagrams'
    : course.canonical?.pdfVerified===true && course.comparison?.pdfVerified===true && ['printed-page','pdf-page'].includes(course.canonical?.paginationKind);
  if (course.status !== 'ready' || !knownAuthority || !sourceReady || course.canonical?.paginationVerified!==true || missing.length) {
    throw new Error(`Biodynamic publication is blocked: ${missing.join(', ') || 'course source review is incomplete'}. Use --draft for private review.`);
  }
}
