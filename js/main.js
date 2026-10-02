(() => {
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const body=document.body, header=$('#siteHeader'), nav=$('#siteNav'), menuBtn=$('#menuBtn');
  const audio=$('#myAudio'), welcome=$('#welcome'), openSurprise=$('#openSurprise');
  const soundToggle=$('#soundToggle'), soundLabel=$('#soundLabel'), progressBar=$('#progressBar');
  const sections=$$('[data-section]'), navLinks=$$('[data-scroll]'), revealItems=$$('.reveal');

  const closeMenu=()=>{ if(!nav||!menuBtn)return; nav.classList.remove('open');menuBtn.classList.remove('open');menuBtn.setAttribute('aria-expanded','false'); };
  if(menuBtn) menuBtn.addEventListener('click',()=>{const open=!nav.classList.contains('open');nav.classList.toggle('open',open);menuBtn.classList.toggle('open',open);menuBtn.setAttribute('aria-expanded',String(open));});
  navLinks.forEach(link=>link.addEventListener('click',()=>closeMenu()));

  const setSoundUI=playing=>{if(!soundToggle)return;soundToggle.classList.toggle('is-playing',playing);soundToggle.setAttribute('aria-pressed',String(playing));if(soundLabel)soundLabel.textContent=playing?'music is playing':'play the song';};
  async function playAudio(){if(!audio)return;audio.loop=true;try{await audio.play();setSoundUI(true);}catch{setSoundUI(false);}}
  if(soundToggle)soundToggle.addEventListener('click',async()=>{if(!audio)return;if(audio.paused)await playAudio();else{audio.pause();setSoundUI(false);}});
  if(openSurprise)openSurprise.addEventListener('click',async()=>{welcome.classList.add('hidden');body.classList.remove('lock');setTimeout(()=>welcome.style.display='none',650);await playAudio();});

  function updateScroll(){const y=window.scrollY,max=document.documentElement.scrollHeight-window.innerHeight;if(progressBar)progressBar.style.width=`${max?(y/max)*100:0}%`;if(header)header.classList.toggle('scrolled',y>30);const probe=y+innerHeight*.35;let active='top';sections.forEach(s=>{if(s.offsetTop<=probe)active=s.dataset.section});navLinks.forEach(l=>l.classList.toggle('active',l.dataset.scroll===active));}
  addEventListener('scroll',updateScroll,{passive:true});updateScroll();

  if('IntersectionObserver'in window){const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');obs.unobserve(e.target)}}),{threshold:.12});revealItems.forEach(i=>obs.observe(i));}else revealItems.forEach(i=>i.classList.add('is-visible'));

  // Gallery lightbox
  const cards=$$('.memory-card'), lightbox=$('#lightbox'), lbImage=$('#lbImage'), lbCount=$('#lbCount');
  const photos=cards.map(c=>({src:$('img',c).src,alt:$('img',c).alt}));let current=0,touchX=null;
  function openLightbox(index){if(!lightbox||!photos.length)return;current=(index+photos.length)%photos.length;lbImage.src=photos[current].src;lbImage.alt=photos[current].alt;lbCount.textContent=`${String(current+1).padStart(2,'0')} / ${String(photos.length).padStart(2,'0')}`;lightbox.classList.add('show');lightbox.setAttribute('aria-hidden','false');body.classList.add('lock');}
  function closeLightbox(){if(!lightbox)return;lightbox.classList.remove('show');lightbox.setAttribute('aria-hidden','true');body.classList.remove('lock');}
  cards.forEach((c,i)=>c.addEventListener('click',()=>openLightbox(i)));$('#lbClose')?.addEventListener('click',closeLightbox);$('#lbPrev')?.addEventListener('click',()=>openLightbox(current-1));$('#lbNext')?.addEventListener('click',()=>openLightbox(current+1));
  lightbox?.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox()});lightbox?.addEventListener('touchstart',e=>touchX=e.changedTouches[0].clientX,{passive:true});lightbox?.addEventListener('touchend',e=>{if(touchX===null)return;const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>50)openLightbox(current+(dx>0?-1:1));touchX=null},{passive:true});

  // Reasons
  const reasons=['Because even the simplest conversations with you somehow become memories.','Because your presence can make a normal day feel a little less ordinary.','Because you have a way of making people feel seen, and that is a beautiful thing.','Because your laugh is one of those sounds I hope I get to hear a lot more.','Because I genuinely want good things to happen to you — even the tiny ones.','Because somehow, being around you feels like a place I can breathe.','Because you are you. And honestly, that is already more than enough.'];
  let reasonIndex=0;$('#reasonBtn')?.addEventListener('click',()=>{reasonIndex=(reasonIndex+1)%reasons.length;const card=$('#reasonCard');card.classList.add('changing');setTimeout(()=>{$('#reasonText').textContent=reasons[reasonIndex];$('#reasonNumber').textContent=String(reasonIndex+1).padStart(2,'0');card.classList.remove('changing')},150)});

  // Free browser voice note (Web Speech API)
  // const voiceMessage="Hey Kak Devy. Happy birthday. I hope today reminds you how loved, appreciated, and special you are. I hope this new chapter brings you a lot of happiness, peaceful days, random adventures, and reasons to smile. Thank you for being you. Enjoy your day, okay? Happy birthday.";
  // const voiceBtn=$('#voiceBtn'),voiceWave=$('#voiceWave'),voiceTime=$('#voiceTime'),voiceIcon=$('#voiceIcon'),voiceBtnText=$('#voiceBtnText');
  // $$('#voiceWave i').forEach((el,i)=>el.style.setProperty('--n',i+1));let speaking=false,voiceTimer=null,voiceStarted=0;
  // function stopVoice(){if('speechSynthesis'in window)speechSynthesis.cancel();speaking=false;voiceWave?.classList.remove('playing');if(voiceIcon)voiceIcon.textContent='▶';if(voiceBtnText)voiceBtnText.textContent='play voice note';clearInterval(voiceTimer);}
  // voiceBtn?.addEventListener('click',()=>{if(!('speechSynthesis'in window)){voiceBtnText.textContent='voice narration is not supported here';return;}if(speaking){stopVoice();return;}const u=new SpeechSynthesisUtterance(voiceMessage);u.rate=.88;u.pitch=1;u.volume=1;const voices=speechSynthesis.getVoices();u.voice=voices.find(v=>/en-US|en_GB|English/i.test(v.lang+' '+v.name))||voices[0]||null;u.onend=stopVoice;u.onerror=stopVoice;speaking=true;voiceWave.classList.add('playing');voiceIcon.textContent='Ⅱ';voiceBtnText.textContent='pause / stop';voiceStarted=Date.now();voiceTime.textContent='00:00';voiceTimer=setInterval(()=>{const s=Math.floor((Date.now()-voiceStarted)/1000);voiceTime.textContent=`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`},500);speechSynthesis.cancel();speechSynthesis.speak(u);});
  const voiceAudio = new Audio('audio/birthdaywish.m4a');

const voiceBtn = $('#voiceBtn');
const voiceWave = $('#voiceWave');
const voiceTime = $('#voiceTime');
const voiceIcon = $('#voiceIcon');
const voiceBtnText = $('#voiceBtnText');

$$('#voiceWave i').forEach((el, i) => {
  el.style.setProperty('--n', i + 1);
});

let playing = false;
let voiceTimer = null;

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);

  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function stopVoice() {
  voiceAudio.pause();
  voiceAudio.currentTime = 0;

  playing = false;

  voiceWave?.classList.remove('playing');

  if (voiceIcon) {
    voiceIcon.textContent = '▶';
  }

  if (voiceBtnText) {
    voiceBtnText.textContent = 'play voice note';
  }

  if (voiceTime) {
    voiceTime.textContent = '00:00';
  }

  clearInterval(voiceTimer);
}

voiceBtn?.addEventListener('click', () => {

  if (playing) {
    stopVoice();
    return;
  }

  voiceAudio.play();

  playing = true;

  voiceWave.classList.add('playing');

  voiceIcon.textContent = 'Ⅱ';
  voiceBtnText.textContent = 'pause / stop';

  clearInterval(voiceTimer);

  voiceTimer = setInterval(() => {
    voiceTime.textContent = formatTime(voiceAudio.currentTime);
  }, 500);
});

voiceAudio.addEventListener('ended', () => {
  stopVoice();
});

  // Cinematic memory sequence
  // const cinema=$('#cinemaOverlay'),cinemaImage=$('#cinemaImage'),cinemaText=$('#cinemaText'),cinemaEyebrow=$('#cinemaEyebrow'),cinemaCopy=$('#cinemaCopy'),cinemaProgress=$('#cinemaProgress');
  // const scenes=[
  //   ['img/gallery/dev-1.jpg','the beginning','Some moments look ordinary — until they become the ones you keep.'],
  //   ['img/gallery/dev-4.jpg','the little things','The random talks, the jokes, the quiet moments. Somehow, they all mattered.'],
  //   ['img/gallery/dev-7.jpg','a favorite memory','I wish life had a replay button for a few moments like this.'],
  //   ['img/gallery/dev-9.jpg','today','And today, I just hope you feel how special you are.'],
  //   ['img/slides/backgroundy.png','one last line','Out of all the people and all the days, I am still glad our stories crossed. Happy Birthday, Yolla. ♡']
  // ];let sceneIndex=0,cinemaTimer=null,wasPlaying=false;
  // function renderScene(i){sceneIndex=(i+scenes.length)%scenes.length;cinemaCopy.classList.add('changing');setTimeout(()=>{const [src,eye,text]=scenes[sceneIndex];cinemaImage.style.opacity='.18';setTimeout(()=>{cinemaImage.src=src;cinemaEyebrow.textContent=eye;cinemaText.textContent=text;cinemaImage.style.opacity='.72';cinemaCopy.classList.remove('changing');cinemaProgress.style.width=`${((sceneIndex+1)/scenes.length)*100}%`},220)},180);clearTimeout(cinemaTimer);cinemaTimer=setTimeout(()=>{if(sceneIndex<scenes.length-1)renderScene(sceneIndex+1)},5200);}
  // function openCinema(){if(!cinema)return;wasPlaying=audio&&!audio.paused;if(audio&&wasPlaying)audio.volume=.22;cinema.classList.add('show');cinema.setAttribute('aria-hidden','false');body.classList.add('lock');renderScene(0);}
  // function closeCinema(){if(!cinema)return;clearTimeout(cinemaTimer);cinema.classList.remove('show');cinema.setAttribute('aria-hidden','true');body.classList.remove('lock');if(audio)audio.volume=1;}
  // $('#cinemaStart')?.addEventListener('click',openCinema);$('#cinemaClose')?.addEventListener('click',closeCinema);$('#cinemaNext')?.addEventListener('click',()=>sceneIndex===scenes.length-1?closeCinema():renderScene(sceneIndex+1));
const cinemaStart = document.getElementById('cinemaStart');
const cinemaOverlay = document.getElementById('cinemaOverlay');
const cinemaClose = document.getElementById('cinemaClose');
const finalVideo = document.getElementById('finalVideo');


function openCinema() {

  cinemaOverlay.classList.add('active');

  document.body.style.overflow = 'hidden';

  finalVideo.currentTime = 0;

  setTimeout(() => {
    finalVideo.play();
  }, 500);
}


function closeCinema() {

  finalVideo.pause();
  finalVideo.currentTime = 0;

  cinemaOverlay.classList.remove('active');

  document.body.style.overflow = '';
}


cinemaStart?.addEventListener('click', openCinema);

cinemaClose?.addEventListener('click', closeCinema);


/* Close dengan ESC */

document.addEventListener('keydown', (e) => {

  if (e.key === 'Escape' && cinemaOverlay.classList.contains('active')) {
    closeCinema();
  }

});


/* Ketika video selesai */

finalVideo?.addEventListener('ended', () => {

  setTimeout(() => {
    closeCinema();
  }, 1500);

});

  // Gift + heart burst
  function burstHearts(count=22){for(let i=0;i<count;i++){const h=document.createElement('span');h.textContent=i%3===0?'♡':'✦';h.className='burst-heart';h.style.left=`${38+Math.random()*24}%`;h.style.top=`${45+Math.random()*8}%`;h.style.setProperty('--dx',`${(Math.random()-.5)*280}px`);h.style.setProperty('--dy',`${-80-Math.random()*210}px`);body.appendChild(h);setTimeout(()=>h.remove(),1500)}}
  $('#giftBox')?.addEventListener('click',()=>{const box=$('#giftBox');if(box.classList.contains('opened'))return;box.classList.add('opened');setTimeout(()=>{const msg=$('#finalMessage');msg.classList.add('show');msg.setAttribute('aria-hidden','false');$('#giftHint').textContent='you found the last little secret ♡';msg.scrollIntoView({behavior:'smooth',block:'center'});burstHearts()},500)});

  // Easter egg: tap the final heart five times.
  let secretTaps=0,secretReset=null;const secret=$('#secretHeart');
  secret?.addEventListener('click',()=>{secretTaps++;clearTimeout(secretReset);secretReset=setTimeout(()=>secretTaps=0,2200);if(secretTaps>=5){secretTaps=0;burstHearts(36);let toast=$('.secret-toast');if(!toast){toast=document.createElement('div');toast.className='secret-toast';body.appendChild(toast)}toast.textContent='easter egg unlocked ♡ you are very loved.';toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),3200)}});

  document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(cinema?.classList.contains('show'))closeCinema();else if(lightbox?.classList.contains('show'))closeLightbox()}if(lightbox?.classList.contains('show')){if(e.key==='ArrowLeft')openLightbox(current-1);if(e.key==='ArrowRight')openLightbox(current+1)}});
  body.classList.add('lock');
})();
