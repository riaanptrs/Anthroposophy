import fs from 'node:fs';
import {buildRemainingClarity} from './build-remaining-clarity.mjs';
export const companionClarity=JSON.parse(fs.readFileSync(new URL('../content/temperament-companions-clear-lessons.json',import.meta.url),'utf8'));
export function buildCompanionClarity(){buildRemainingClarity(companionClarity);}
