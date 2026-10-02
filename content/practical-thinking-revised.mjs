import fs from 'node:fs';
const read = name => JSON.parse(fs.readFileSync(new URL(name, import.meta.url), 'utf8'));
export const thoughtSourceMap = read('practical-thinking-source-map.json');
export const thoughtParts = [1, 2, 3, 4].map(id => read(`practical-thinking-part-${id}.json`));
export const thoughtLessons = thoughtParts.flatMap(part => part.lessons);
export const thoughtForecast = read('practical-thinking-forecast.json');
export const thoughtInventory = [...thoughtLessons, thoughtForecast];
export const thoughtTitle = {en: 'Practical Training in Thought', pt: 'Treinamento Prático do Pensar'};
