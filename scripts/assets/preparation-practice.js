(()=>{
 function update(form){
  const pt=form.dataset.lang==='pt',areaInput=form.elements.area,area=Number(areaInput.value),prep=form.elements.preparation.value;
  const dose=form.querySelector('[data-dose]'),water=form.querySelector('[data-water]'),feedback=form.querySelector('[data-calculator-feedback]');
  if(!areaInput.value.trim()||!areaInput.validity.valid||!Number.isFinite(area)||area<=0){dose.textContent='—';water.textContent='—';feedback.textContent=pt?'Informe uma área positiva válida em m².':'Enter a valid positive area in m².';return;}
  const grams=Number(form.getAttribute('data-rate-'+prep))*area/10000,litres=Number(form.dataset.waterRate)*area/10000;
  if(!Number.isFinite(grams)||!Number.isFinite(litres)){dose.textContent='—';water.textContent='—';feedback.textContent=pt?'Confira a área informada.':'Check the entered area.';return;}
  const fmt=new Intl.NumberFormat(pt?'pt-BR':'en',{maximumSignificantDigits:8});dose.textContent=fmt.format(grams)+' g';water.textContent=fmt.format(litres)+' L';
  feedback.textContent=pt?'Exemplo métrico; mantenha 1 hora de agitação. Confira a precisão da balança e o protocolo do produto.':'Metric example; retain 1 hour of stirring. Check balance precision and the actual product protocol.';
 }
 function init(){const entry=document.querySelector('.preparation-guide-entry'),hero=document.querySelector('.cw-hero');if(entry&&hero)hero.append(entry);for(const f of document.querySelectorAll('[data-preparation-calculator]')){f.querySelector('[data-calculator-controls]').disabled=false;update(f);}}
 document.addEventListener('input',e=>{const f=e.target.closest('[data-preparation-calculator]');if(f)update(f);});
 document.addEventListener('change',e=>{const f=e.target.closest('[data-preparation-calculator]');if(f)update(f);});
 document.addEventListener('submit',e=>{if(e.target.matches('[data-preparation-calculator]'))e.preventDefault();});
 document.addEventListener('click',e=>{if(e.target.closest('[data-preparation-print]'))window.print();});
 if(document.readyState!=='complete')document.addEventListener('DOMContentLoaded',init);else init();
})();
