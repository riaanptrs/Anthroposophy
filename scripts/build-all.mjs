await import('./build-lessons.mjs');

// A single teaching journey follows the source-owned renderers and enrichment
// passes, so rebuilding cannot restore a second lesson below the first one.
const {buildAnthroposophyMaps}=await import('./build-anthroposophy-maps.mjs');
buildAnthroposophyMaps();
const {buildCoherentLessons}=await import('./build-coherent-lessons.mjs');
buildCoherentLessons();
const {preserveCoherentLessons}=await import('./preserve-coherent-lessons.mjs');
preserveCoherentLessons();
const {buildHomeEntries}=await import('./build-home-entries.mjs');
buildHomeEntries();
const {buildLearningPathways}=await import('./build-learning-pathways.mjs');
buildLearningPathways();
const {refreshCourseWorkspaceAssets}=await import('./build-course-workspace.mjs');
refreshCourseWorkspaceAssets();

// Shared academy interface follows every course owner and preserves their content.
const {applyAcademyPolish}=await import('./build-academy-ui.mjs');
applyAcademyPolish();
