await import('./build-lessons.mjs');

// Shared academy interface follows every course owner and preserves their content.
const {applyAcademyPolish}=await import('./build-academy-ui.mjs');
applyAcademyPolish();
