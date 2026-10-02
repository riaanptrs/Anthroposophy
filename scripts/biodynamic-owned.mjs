// Native course ownership is explicit and confined to its published page families.
export const biodynamicRoute = 'biodynamics';
export const biodynamicLessonIds = Object.freeze(Array.from({length:24}, (_,i)=>i+1));
export const biodynamicPartSlugs = Object.freeze([
  'agricultural-question', 'earth-soil-plant', 'farm-organism',
  'preparations', 'challenges-rhythms', 'biodynamics-today'
]);

export function isBiodynamicOwned(relative, html) {
  const route = relative.replaceAll('\\', '/');
  return /^(?:pt\/)?biodynamics\/(?:index\.html|sources\.html|background\.html|practice\/index\.html|lessons\/(?:0[1-9]|1[0-9]|2[0-4])\.html|parts\/(?:agricultural-question|earth-soil-plant|farm-organism|preparations|challenges-rhythms|biodynamics-today)\.html)$/.test(route)
    && /<main\b[^>]*\bdata-biodynamics-owned="true"/.test(html);
}

export const biodynamicStudyId = id => `${biodynamicRoute}/${String(id).padStart(2,'0')}`;
