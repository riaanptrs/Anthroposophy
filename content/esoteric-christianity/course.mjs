// Original bilingual teaching. Full transcripts remain private workspace inputs.
export const modules = [
 ['Learning to read the Christ mystery','Aprender a ler o mistério do Cristo'],
 ['Freedom and the preparation of humanity','Liberdade e preparação da humanidade'],
 ['Matthew: the long preparation of wisdom','Mateus: a longa preparação da sabedoria'],
 ['Luke: innocence and compassion','Lucas: inocência e compaixão'],
 ['The two preparations meet','O encontro das duas preparações'],
 ['Meaning, practice, and further study','Sentido, prática e aprofundamento']
];
export const title = ['Esoteric Christianity I: Preparing for the Coming of Christ','Cristianismo Esotérico I: A preparação para a vinda do Cristo'];
export const subtitle = ['The Gospel accounts, the two Jesus children, and the path to the Baptism in the Jordan.','Os relatos dos Evangelhos, os dois meninos Jesus e o caminho até o Batismo no Jordão.'];
export const lessons = [];
export const courseRoutes=['','pt/'].flatMap(prefix=>['index.html','glossary.html','sources.html','sequence.html',...Array.from({length:24},(_,i)=>`lessons/ec1-${String(i+1).padStart(2,'0')}.html`)].map(page=>`${prefix}learn/esoteric-christianity/${page}`));
export function lesson(id, sources, aid, en, pt) {
 const unpack = v => {const [title,question,objectives,paraphrase,teaching,example,complication,exercise] = v;return {title,question,objectives:objectives.split('|'),paraphrase,teaching:teaching.split('\n\n'),example,complication,exercise};};
 lessons.push({id:`ec1-${String(id).padStart(2,'0')}`,number:id,module:Math.ceil(id/4),sources,aid,en:unpack(en),pt:unpack(pt)});
}
