const bubble=document.querySelector('.bubble');
const line=document.querySelector('#line');
const speaker=document.querySelector('.speaker');
const next=document.querySelector('#next');
const stage=document.querySelector('.stage');
const lineSizing=document.querySelector('#line-sizing');
const progress=document.querySelector('#progress');
const yuraCharacter=document.querySelector('.character-yura');
const herCharacter=document.querySelector('.character-her');
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const dialogue=[
 {speaker:'Г',text:'Юра, ко мне!',side:'right'},
 {speaker:'Я',text:'Да, моя госпожа',side:'left'},
 {speaker:'Г',text:'В дс быстро',side:'right'},
 {speaker:'Я',text:'аф аф',side:'left'},
 {speaker:'Г',text:'Собери вещи',side:'right'},
 {speaker:'Я',text:'Слушаюсь',side:'left'},
 {speaker:'Г',text:'Правильно пес !',side:'right'},
 {speaker:'Г',text:'Плохо себя ведёшь',side:'right'},
 {speaker:'Я',text:'Извините',side:'left'},
 {speaker:'Г',text:'Юра!!! Жопу Притащил',side:'right'},
 {speaker:'Я',text:'Бегуууу',side:'left'}
];
let dialogueIndex=0;
let timer=null;
let fullText='';
let typing=false;
function finishTyping(){
 clearTimeout(timer);timer=null;typing=false;
 line.textContent=fullText;
 bubble.classList.remove('typing');
 bubble.setAttribute('aria-busy','false');
}
function showLine(){
 clearTimeout(timer);
 const currentLine=dialogue[dialogueIndex];
 fullText=currentLine.text;
 bubble.setAttribute('aria-busy','true');
 bubble.className='bubble '+currentLine.side;
 speaker.textContent=currentLine.speaker;
 lineSizing.textContent=fullText;
 progress.textContent=`${dialogueIndex+1} / ${dialogue.length}`;
 yuraCharacter.classList.remove('speaking');
 herCharacter.classList.remove('speaking');
 const activeCharacter=currentLine.side==='left'?yuraCharacter:herCharacter;
 void activeCharacter.offsetWidth;
 activeCharacter.classList.add('speaking');
 next.textContent=dialogueIndex===dialogue.length-1?'Сначала ↻':'Дальше →';
 line.textContent='';
 void bubble.offsetWidth;
 bubble.classList.add('appear');
 if(reducedMotion.matches){finishTyping();return;}
 typing=true;bubble.classList.add('typing');
 const letters=Array.from(fullText);let cursor=0;
 function tick(){
  line.textContent=letters.slice(0,++cursor).join('');
  if(cursor>=letters.length){finishTyping();return;}
  timer=setTimeout(tick,42);
 }
 tick();
}
function advance(){
 if(typing){finishTyping();return;}
 dialogueIndex=(dialogueIndex+1)%dialogue.length;
 showLine();
}
function tapFeedback(event){
 if(reducedMotion.matches||event.detail===0)return;
 const bounds=stage.getBoundingClientRect();
 const existingRings=stage.querySelectorAll('.tap-ring');
 if(existingRings.length>=4)existingRings[0].remove();
 const ring=document.createElement('span');
 ring.className='tap-ring';ring.setAttribute('aria-hidden','true');
 ring.style.left=(event.clientX-bounds.left-stage.clientLeft)+'px';
 ring.style.top=(event.clientY-bounds.top-stage.clientTop)+'px';
 stage.appendChild(ring);
 setTimeout(()=>ring.remove(),650);
}
next.addEventListener('click',advance);
stage.addEventListener('click',event=>{tapFeedback(event);advance();});
stage.addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.repeat){event.preventDefault();advance();}});
document.addEventListener('keydown',event=>{if(event.code==='Space'&&event.target!==next&&!event.repeat){event.preventDefault();advance();}});
reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches)finishTyping();});
showLine();
