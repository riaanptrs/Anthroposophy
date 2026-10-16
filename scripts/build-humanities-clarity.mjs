import fs from 'node:fs';
import {buildRemainingClarity} from './build-remaining-clarity.mjs';
export const humanitiesClarity=JSON.parse(fs.readFileSync(new URL('../content/humanities-clear-lessons.json',import.meta.url),'utf8'));
export function buildHumanitiesClarity(){buildRemainingClarity(humanitiesClarity);}
