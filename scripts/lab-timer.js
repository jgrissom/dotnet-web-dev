(function(){
// Marp rewrites the ⏱️ into a twemoji <img>, so the duration lives in the text
// node right after it. Fall back to a plain-text match if twemoji is ever off.
var targets=[];
[].forEach.call(document.querySelectorAll('img[data-marp-twemoji]'),function(img){
  if(!/23f1/.test(img.getAttribute('src')||''))return;
  var t=img.nextSibling;
  if(t&&t.nodeType===3&&/^\s*\d+\s*minutes/.test(t.nodeValue))targets.push(t);
});
if(!targets.length){
  var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),n;
  while(n=w.nextNode()){if(/⏱️?\s*\d+\s*minutes/.test(n.nodeValue))targets.push(n);}
}
targets.forEach(function(t){
  var m=t.nodeValue.match(/(\d+)\s*minutes/);
  if(!m)return;
  var mins=parseInt(m[1],10),host=t.parentNode;

  // swap the "NN minutes" text for a live face, keep whatever follows it
  var idx=t.nodeValue.indexOf(m[0]);
  var tail=t.splitText(idx+m[0].length);
  t.nodeValue=t.nodeValue.slice(0,idx);
  var face=document.createElement('span');
  host.insertBefore(face,tail);

  var start=document.createElement('button'),reset=document.createElement('button');
  [start,reset].forEach(function(b){
    b.type='button';
    b.style.cssText='font:inherit;font-size:.5em;font-weight:700;margin-left:.6em;'+
      'padding:.1em .8em;border:2px solid currentColor;border-radius:.5em;'+
      'background:transparent;color:inherit;cursor:pointer;vertical-align:.15em;opacity:.8';
    b.onmouseenter=function(){b.style.opacity='1';};
    b.onmouseleave=function(){b.style.opacity='.8';};
  });
  start.textContent='Start';
  reset.textContent='Reset';
  reset.style.display='none';
  host.appendChild(start);
  host.appendChild(reset);

  var total=mins*60,left=total,id=null,run=false;
  function paint(){
    if(!run){face.textContent=mins+' minutes';face.style.color='';return;}
    var mm=Math.floor(left/60),ss=left%60;
    face.textContent=mm+':'+(ss<10?'0':'')+ss;
    face.style.color=left<=60?'#ff8080':(left<=300?'#ffd166':'');
  }
  function tick(){
    if(left>0){left--;paint();return;}
    clearInterval(id);id=null;
    face.textContent="time's up";face.style.color='#ff8080';start.style.display='none';
  }
  start.addEventListener('click',function(e){
    e.preventDefault();e.stopPropagation();
    start.blur();
    if(id){clearInterval(id);id=null;start.textContent='Resume';}
    else{run=true;id=setInterval(tick,1000);start.textContent='Pause';reset.style.display='';}
    paint();
  });
  reset.addEventListener('click',function(e){
    e.preventDefault();e.stopPropagation();
    reset.blur();
    if(id){clearInterval(id);id=null;}
    run=false;left=total;start.textContent='Start';start.style.display='';
    reset.style.display='none';paint();
  });
  // keep the deck's key/click navigation out of the buttons
  ['keydown','keyup','keypress','mousedown','mouseup'].forEach(function(k){
    start.addEventListener(k,function(e){e.stopPropagation();});
    reset.addEventListener(k,function(e){e.stopPropagation();});
  });
  paint();
});
})();
