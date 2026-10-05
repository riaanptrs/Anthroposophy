// Optional enhancement only: explanations and the complete explorer work without JS.
for(const group of document.querySelectorAll('.foodwise-choice')){
 for(const button of group.querySelectorAll('[data-foodwise-choice]'))button.addEventListener('click',()=>{
  for(const option of group.querySelectorAll('button'))option.setAttribute('aria-pressed',String(option===button));
  const correct=button.dataset.foodwiseChoice===group.dataset.correct,pt=document.documentElement.lang==='pt-BR';
  group.querySelector('[data-foodwise-feedback]').textContent=correct?(pt?'Correto. Abra a explicação para entender a relação.':'Correct. Open the explanation to understand the connection.'):(pt?'Reconsidere a distinção ensinada acima; a explicação está disponível.':'Reconsider the distinction taught above; the explanation is available.');
 });
}
const input=document.querySelector('[data-foodwise-search]');
if(input){const norm=s=>s.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();input.addEventListener('input',()=>{let count=0;for(const card of document.querySelectorAll('[data-foodwise-ingredients] article')){card.hidden=!norm(card.textContent).includes(norm(input.value.trim()));if(!card.hidden)count++;}document.querySelector('[data-foodwise-count]').textContent=`${count} ${document.documentElement.lang==='pt-BR'?'ingredientes encontrados':'ingredients found'}`;});}
