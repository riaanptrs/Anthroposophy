// The authored course retains its original route and notebook identities.
export const coreRouteIds = Object.freeze([0, 1, 10, 2, 3, 5, 6, 7, 8, 11, 12, 9]);
export const optionalRouteIds = Object.freeze([4]);
export const partSlugs = Object.freeze(['practical', 'observation', 'training', 'judgment']);
export function isPracticalThinkingOwned(relative, html) {
  return /^(?:pt\/)?practical-thinking\/(?:index\.html|tools\.html|source-notes\.html|lessons\/(?:0[0-9]|1[0-2])\.html|parts\/(?:practical|observation|training|judgment)\.html)$/.test(relative.replaceAll('\\', '/'))
    && /<main\b[^>]*\bdata-practical-thinking-owned="true"/.test(html);
}
