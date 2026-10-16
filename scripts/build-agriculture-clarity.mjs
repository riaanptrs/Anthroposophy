import fs from 'node:fs';
import {buildRemainingClarity} from './build-remaining-clarity.mjs';
export const agricultureClarity=JSON.parse(fs.readFileSync(new URL('../content/agriculture-clear-lessons.json',import.meta.url),'utf8'));
export function buildAgricultureClarity(){buildRemainingClarity(agricultureClarity);}
