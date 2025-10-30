// ==== MagicBento-style effects in vanilla JS ====
(function(){
  const grid = document.getElementById('bentoGrid');
  if (!grid) return;

  // Global spotlight
  const spotlight = document.createElement('div');
  spotlight.className = 'global-spotlight';
  Object.assign(spotlight.style, {
    position: 'fixed', width: '800px', height: '800px', borderRadius: '50%',
    pointerEvents: 'none', background: `radial-gradient(circle,
      rgba(132,0,255, .15) 0%,
      rgba(132,0,255, .08) 15%,
      rgba(132,0,255, .04) 25%,
      rgba(132,0,255, .02) 40%,
      rgba(132,0,255, .01) 65%,
      transparent 70%
    )`,
    zIndex: 200, opacity: 0, transform: 'translate(-50%, -50%)', mixBlendMode:'screen'
  });
  document.body.appendChild(spotlight);

  const cards = Array.from(grid.querySelectorAll('.card'));
  const radius = 300;
  const proximity = radius * 0.5;
  const fadeDistance = radius * 0.75;

  function updateGlow(card, clientX, clientY, intensity){
    const rect = card.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--glow-x', `${x}%`);
    card.style.setProperty('--glow-y', `${y}%`);
    card.style.setProperty('--glow-intensity', `${intensity}`);
    card.style.setProperty('--glow-radius', `${radius}px`);
  }

  function onMove(e){
    const section = grid.closest('.bento-section');
    const rect = section.getBoundingClientRect();
    const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

    if(!inside){
      spotlight.style.opacity = '0';
      cards.forEach(c => c.style.setProperty('--glow-intensity','0'));
      return;
    }

    let minDist = Infinity;
    cards.forEach(card => {
      const r = card.getBoundingClientRect();
      const cx = r.left + r.width/2;
      const cy = r.top + r.height/2;
      const d = Math.hypot(e.clientX - cx, e.clientY - cy) - Math.max(r.width, r.height)/2;
      const eff = Math.max(0, d);
      minDist = Math.min(minDist, eff);

      let intensity = 0;
      if(eff <= proximity) intensity = 1;
      else if (eff <= fadeDistance) intensity = (fadeDistance - eff)/(fadeDistance - proximity);
      updateGlow(card, e.clientX, e.clientY, intensity);
    });

    spotlight.style.left = e.clientX + 'px';
    spotlight.style.top = e.clientY + 'px';
    const baseMax = document.body.classList.contains('comfort') ? 0.35 : 0.8;
    const targetOpacity = (minDist <= proximity) ? baseMax :
      (minDist <= fadeDistance) ? ((fadeDistance - minDist) / (fadeDistance - proximity)) * baseMax : 0;
    spotlight.style.opacity = String(targetOpacity);
  }
  document.addEventListener('mousemove', onMove);

  // Tilt + magnet + click ripple
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const cx = r.width/2, cy = r.height/2;
      const rotateX = ((y - cy)/cy) * -8;
      const rotateY = ((x - cx)/cx) * 8;
      const magnetX = (x - cx) * 0.05;
      const magnetY = (y - cy) * 0.05;
      card.style.transform = `perspective(900px) translate(${magnetX}px, ${magnetY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
    card.addEventListener('click', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const maxD = Math.max(Math.hypot(x,y), Math.hypot(x-r.width,y), Math.hypot(x,y-r.height), Math.hypot(x-r.width,y-r.height));
      const ripple = document.createElement('div');
      Object.assign(ripple.style, {
        position:'absolute', width: `${maxD*2}px`, height:`${maxD*2}px`, borderRadius:'50%',
        background:`radial-gradient(circle, rgba(132,0,255,${document.body.classList.contains('comfort')?'.25':'.4'}) 0%, rgba(132,0,255,.2) 30%, transparent 70%)`,
        left:`${x - maxD}px`, top:`${y - maxD}px`, pointerEvents:'none', zIndex: 1000, transform: 'scale(0)', opacity:'1'
      });
      card.appendChild(ripple);
      ripple.animate([{transform:'scale(0)',opacity:1},{transform:'scale(1)',opacity:0}], {duration:800, easing:'cubic-bezier(.2,.8,.2,1)'}).onfinish = ()=> ripple.remove();
    });
  });
})();