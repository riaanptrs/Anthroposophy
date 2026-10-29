import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {constitutionIllustration} from './render-constitution-illustrations.mjs';

const guide=JSON.parse(fs.readFileSync(new URL('../content/human-constitution-illustrations.json',import.meta.url),'utf8'));
const item=guide.illustrations.find(image=>image.id==='threefold-human-being');
const original=fs.readFileSync('docs/'+item.file);
assert.equal(createHash('sha256').update(original).digest('hex'),'8142173371d861114a92a65565eef8a9eb53d54f74f1e8364622f83f04627a21','The English artwork must remain unchanged');
assert.equal(item.pt.imageLanguage,'pt-BR');
assert.notEqual(item.pt.file,item.file,'Portuguese artwork needs its own asset');
const translated=fs.readFileSync('docs/'+item.pt.file);
assert.equal(translated.subarray(0,8).toString('hex'),'89504e470d0a1a0a','Localized artwork must be a PNG');
assert.equal(item.pt.width,translated.readUInt32BE(16),'Rendered width must match the localized PNG');
assert.equal(item.pt.height,translated.readUInt32BE(20),'Rendered height must match the localized PNG');

for(const file of ['docs/pt/learn/lessons/05.html','docs/pt/reference/human-constitution.html']){
 const html=constitutionIllustration(item.id,'pt',file);
 assert.equal((html.match(/threefold-human-being-pt-br\.png/g)||[]).length,3,'Image and both full-size links must use Portuguese artwork');
 assert.ok(!html.includes('threefold-human-being.png'),'Portuguese rendering must not link to the English artwork');
 assert.ok(html.includes('lang="pt-BR"'));
 assert.ok(!html.includes('lang="en"'));
 assert.ok(!html.includes('Legendas da imagem em inglês.'));
 assert.ok(html.includes('aria-label="Abrir imagem completa: '+item.pt.title+'"'));
 assert.ok(html.includes('alt="'+item.pt.alt+'"'));
 assert.ok(item.pt.description.every(paragraph=>html.includes(paragraph)),'The Portuguese textual equivalent must be retained');
}
for(const file of ['docs/learn/lessons/05.html','docs/reference/human-constitution.html']){
 const html=constitutionIllustration(item.id,'en',file);
 assert.equal((html.match(/threefold-human-being\.png/g)||[]).length,3);
 assert.ok(!html.includes('threefold-human-being-pt-br.png'));
 assert.ok(html.includes('width="1774" height="887"'));
 assert.ok(html.includes('alt="'+item.en.alt+'"'));
}
for(const image of guide.illustrations.filter(image=>!image.pt.file)){
 const html=constitutionIllustration(image.id,'pt','docs/pt/reference/human-constitution.html');
 assert.ok(html.includes('lang="en"'),'Untranslated artwork must identify its English labels');
 assert.ok(html.includes('Legendas da imagem em inglês.'),'Untranslated artwork must retain its language notice');
}
console.log('Passed: localized Portuguese artwork, intrinsic dimensions, accessible descriptions, full-size links, and preserved English artwork/language notices.');
