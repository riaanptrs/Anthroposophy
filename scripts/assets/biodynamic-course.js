/* Course-scoped study navigation; the shared notebook owns notes and consent. */
(()=>{
  'use strict';
  const pt=document.documentElement.lang==='pt-BR',say=(en,br)=>pt?br:en;
  const get=key=>{try{return localStorage.getItem(key)}catch{return null}};
  const read=key=>{try{return JSON.parse(get(key)||'null')}catch{return null}};
  const idValid=id=>/^\d{2}$/.test(String(id))&&Number(id)>=1&&Number(id)<=24;
  const lastKey='anthro-study-v1:biodynamics:last';
  function remember(){
    const root=document.querySelector('[data-study-id]'),id=root?.dataset.studyId?.split('/');
    if(get('anthro-study-v1:enabled')!=='yes'||id?.[0]!=='biodynamics'||!idValid(id[1]))return;
    try{localStorage.setItem(lastKey,JSON.stringify({url:location.href.split('#')[0],course:'biodynamics'}))}catch{}
  }
  function render(){
    const enabled=get('anthro-study-v1:enabled')==='yes';
    const studied=id=>enabled&&read('anthro-study-v1:biodynamics/'+String(id).padStart(2,'0'))?.complete===true;
    for(const row of document.querySelectorAll('[data-biodynamic-lesson]')){
      const label=row.querySelector('[data-biodynamic-study-label]');
      if(label){label.hidden=!studied(row.dataset.biodynamicLesson);label.textContent=say('Studied ✓','Estudada ✓');}
    }
    const complete=Array.from({length:24},(_,i)=>i+1).filter(studied).length;
    for(const summary of document.querySelectorAll('[data-biodynamic-progress-summary]'))summary.textContent=enabled?say(`${complete} of 24 lessons marked studied on this device.`,`${complete} de 24 lições marcadas como estudadas neste dispositivo.`):say('Study marks are optional. Enable saving in a lesson to keep them.','As marcações são opcionais. Ative o salvamento numa lição para conservá-las.');
    const ranges=[[1,3],[4,7],[8,11],[12,16],[17,20],[21,24]];
    for(const label of document.querySelectorAll('[data-biodynamic-part-progress]')){
      const [first,last]=ranges[Number(label.dataset.biodynamicPartProgress)-1];
      const total=last-first+1,count=Array.from({length:total},(_,i)=>first+i).filter(studied).length;
      label.textContent=enabled?say(`${count} of ${total} marked studied`,`${count} de ${total} marcadas como estudadas`):'';
    }
    let resume=null;
    const last=enabled?(read(lastKey)||read('anthro-study-v1:last')):null;
    if(last?.course==='biodynamics'){
      try{
        const url=new URL(last.url,location.href),match=url.pathname.match(/^(.*?)(?:pt\/)?biodynamics\/lessons\/(\d{2})\.html$/);
        const scope=location.pathname.includes('/Anthroposophy/')?'/Anthroposophy/':'/';
        if(url.origin===location.origin&&match?.[1]===scope&&idValid(match[2])){url.pathname=scope+(pt?'pt/':'')+'biodynamics/lessons/'+match[2]+'.html';url.search='';url.hash='';resume={url,id:Number(match[2])};}
      }catch{}
    }
    for(const link of document.querySelectorAll('[data-biodynamic-resume]')){
      link.href=resume?resume.url.href:'lessons/01.html';
      link.textContent=resume?say(`Continue lesson ${resume.id} →`,`Continuar a lição ${resume.id} →`):say('Continue studying →','Continuar estudando →');
    }
  }
  remember();render();window.addEventListener('pageshow',()=>{remember();render()});window.addEventListener('storage',event=>{if(!event.key||event.key.startsWith('anthro-study-v1:'))render()});
  document.querySelector('[data-save-notes]')?.addEventListener('change',remember);
})();
