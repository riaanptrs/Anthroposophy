import {rootRoute} from './waldorf-content.mjs';

// Editorial navigation between topics already present in the supplied package.
// Connections are reading suggestions, not additional educational assertions.
const connections={
 'foundations/what-is-waldorf.html':['foundations/seven-year-periods.html','foundations/thinking-feeling-willing.html'],
 'foundations/first-waldorf-school.html':['foundations/anthroposophy-and-education.html','parents/class-teacher.html'],
 'foundations/anthroposophy-and-education.html':['parents/religion.html','foundations/whole-human-being.html'],
 'foundations/whole-human-being.html':['foundations/thinking-feeling-willing.html','foundations/seven-year-periods.html'],
 'foundations/thinking-feeling-willing.html':['foundations/teaching-through-art.html','subjects/handwork.html','parents/arts.html'],
 'foundations/seven-year-periods.html':['development/school-readiness.html','development/nine-year-change.html','development/age-12-causality.html','development/adolescence-judgment.html'],
 'foundations/development-determines-curriculum.html':['development/nine-year-change.html','development/age-12-causality.html','grades/grade-3/index.html','grades/grade-6/index.html'],
 'foundations/imagination-before-abstraction.html':['development/ages-7-9.html','parents/storytelling.html','parents/science.html'],
 'foundations/teaching-through-art.html':['parents/arts.html','subjects/arts.html','foundations/thinking-feeling-willing.html'],
 'foundations/rhythm-repetition-sleep.html':['foundations/main-lesson.html','grades/grade-1/index.html'],
 'foundations/main-lesson.html':['foundations/rhythm-repetition-sleep.html','foundations/main-lesson-books.html'],
 'foundations/class-teacher.html':['parents/class-teacher.html','development/puberty-authority.html'],
 'foundations/main-lesson-books.html':['parents/textbooks.html','subjects/language.html'],
 'foundations/eurythmy.html':['subjects/movement-eurythmy.html','foundations/thinking-feeling-willing.html'],
 'foundations/music.html':['subjects/music.html','foundations/thinking-feeling-willing.html'],
 'foundations/handwork.html':['subjects/handwork.html','foundations/thinking-feeling-willing.html'],
 'foundations/foreign-languages.html':['subjects/foreign-languages.html','subjects/language.html'],
 'foundations/assessment.html':['parents/assessment.html','parents/high-school.html'],
 'foundations/technology.html':['parents/technology.html','subjects/technology.html','grades/grade-9/index.html'],
 'parents/advanced-child.html':['parents/struggling-child.html','foundations/development-determines-curriculum.html'],
 'parents/arts.html':['foundations/teaching-through-art.html','foundations/thinking-feeling-willing.html','subjects/arts.html'],
 'parents/assessment.html':['foundations/assessment.html','parents/high-school.html'],
 'parents/class-teacher.html':['foundations/class-teacher.html','development/puberty-authority.html'],
 'parents/high-school.html':['development/adolescence-judgment.html','grades/grade-9/index.html','parents/assessment.html'],
 'parents/home-life.html':['parents/struggling-child.html','foundations/rhythm-repetition-sleep.html'],
 'parents/learning-differences.html':['parents/struggling-child.html','parents/reading.html'],
 'parents/reading.html':['subjects/language.html','grades/grade-1/index.html','grades/grade-2/index.html','parents/learning-differences.html','parents/struggling-child.html'],
 'parents/religion.html':['foundations/anthroposophy-and-education.html','grades/grade-2/index.html','grades/grade-3/index.html'],
 'parents/science.html':['subjects/natural-science.html','development/age-12-causality.html','subjects/physics.html'],
 'parents/storytelling.html':['foundations/imagination-before-abstraction.html','subjects/language.html','grades/grade-2/index.html'],
 'parents/struggling-child.html':['parents/learning-differences.html','parents/assessment.html'],
 'parents/technology.html':['foundations/technology.html','subjects/technology.html','grades/grade-9/index.html'],
 'parents/textbooks.html':['foundations/main-lesson-books.html','foundations/main-lesson.html'],
 'subjects/arts.html':['foundations/teaching-through-art.html','parents/arts.html'],
 'subjects/chemistry.html':['grades/grade-7/index.html','grades/grade-8/index.html','grades/grade-9/index.html','subjects/natural-science.html'],
 'subjects/movement-eurythmy.html':['foundations/eurythmy.html','grades/grade-1/index.html','grades/grade-2/index.html','grades/grade-4/index.html'],
 'subjects/foreign-languages.html':['foundations/foreign-languages.html','subjects/language.html'],
 'subjects/geography.html':['grades/grade-3/index.html','grades/grade-4/index.html','subjects/history.html','subjects/natural-science.html'],
 'subjects/handwork.html':['foundations/handwork.html','foundations/thinking-feeling-willing.html','grades/grade-3/index.html','grades/grade-8/index.html'],
 'subjects/history.html':['parents/storytelling.html','grades/grade-5/index.html','grades/grade-6/index.html','grades/grade-9/index.html'],
 'subjects/language.html':['parents/reading.html','parents/storytelling.html','grades/grade-1/index.html','grades/grade-2/index.html'],
 'subjects/mathematics.html':['grades/grade-1/index.html','grades/grade-4/index.html','grades/grade-6/index.html'],
 'subjects/music.html':['foundations/music.html','foundations/thinking-feeling-willing.html'],
 'subjects/natural-science.html':['parents/science.html','development/ages-9-12.html','development/age-12-causality.html','subjects/physics.html','subjects/chemistry.html'],
 'subjects/physics.html':['development/age-12-causality.html','grades/grade-6/index.html','grades/grade-8/index.html','subjects/technology.html'],
 'subjects/technology.html':['foundations/technology.html','parents/technology.html','grades/grade-8/index.html','grades/grade-9/index.html']
};
export function relatedReadingRoutes(item) {
 return (connections[item.route.slice(rootRoute.length)]||[]).map(route=>rootRoute+route);
}
export function courseSequence(items,item) {
 const group=['foundations','development','grades'].includes(item.group);
 const ordered=group?items.filter(i=>['foundations','development','grades'].includes(i.group)):items.filter(i=>i.group===item.group);
 const index=ordered.indexOf(item);
 return {previous:ordered[index-1]||null,next:ordered[index+1]||null,atCourseEnd:group&&!ordered[index+1]};
}
