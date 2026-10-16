import fs from 'node:fs';
import {buildRemainingClarity} from './build-remaining-clarity.mjs';
export const foundationClarity=JSON.parse(fs.readFileSync(new URL('../content/foundations-introduction-clear-lessons.json',import.meta.url),'utf8'));
export function buildFoundationsClarity(){buildRemainingClarity(foundationClarity);}
