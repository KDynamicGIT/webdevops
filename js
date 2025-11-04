(function(){
  // Before/After slider
  const container = document.getElementById('ba-container-1');
  const range = document.getElementById('ba-range-1');
  const after = document.getElementById('ba-after-1');
  const handle = document.getElementById('ba-handle-1');
  const gesture = document.getElementById('ba-gesture-1');

  function updateBA(value){
    const pct = Math.max(0, Math.min(100, Number(value)));
    if (after) after.style.width = pct + '%';
    if (handle) handle.style.left = pct + '%';
    if (after) after.setAttribute('aria-hidden', pct === 0 ? 'true' : 'false');
  }
  function hideGesture(){
    if (!gesture) return;
    gesture.classList.add('hidden');
    gesture.setAttribute('aria-hidden','true');
  }
  if (range){
    range.addEventListener('input', e => { hideGesture(); updateBA(e.target.value); });
    range.addEventListener('focus', hideGesture);
    updateBA(range.value);
  }

  if (container){
    let dragging=false;
    function setFromPointer(clientX, cont){
      const rect = cont.getBoundingClientRect();
      const pct = ((clientX - rect.left) / rect.width) * 100;
      if (range){ range.value = Math.max(0, Math.min(100, pct)); updateBA(range.value); }
    }
    container.addEventListener('pointerdown', e => { hideGesture(); dragging=true; try{ container.setPointerCapture(e.pointerId); }catch(err){} setFromPointer(e.clientX, container); });
    container.addEventListener('pointermove', e => { if (!dragging) return; setFromPointer(e.clientX, container); });
    container.addEventListener('pointerup', e => { dragging=false; try{ container.releasePointerCapture(e.pointerId); }catch(err){} });
    container.addEventListener('pointercancel', () => { dragging = false; });
  }

  // Generic carousel setup
  function setupCarousel({ trackId, prevId, nextId, dotsContainerId, carouselId, autoplayInterval = 4500 }){
    const track = document.getElementById(trackId);
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);
    const dotsContainer = document.getElementById(dotsContainerId);
    const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll('.carousel-dot')) : [];
    const carouselEl = document.getElementById(carouselId);
    if (!track) return;
    const slidesCount = track.children.length;
    if (slidesCount === 0) return;

    let idx = 0;
    function goTo(index){
      idx = ((index % slidesCount) + slidesCount) % slidesCount;
      track.style.transform = `translateX(-${idx * 100}%)`;
      if (dots.length) {
        dots.forEach(d => d.classList.remove('active'));
        if (dots[idx]) dots[idx].classList.add('active');
      }
    }
    if (prevBtn) prevBtn.addEventListener('click', () => goTo(idx - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(idx + 1));
    if (dots.length) {
      dots.forEach(d => d.addEventListener('click', e => goTo(Number(e.currentTarget.dataset.index))));
    }

    let autoPlayTimer = null;
    try { autoPlayTimer = setInterval(() => goTo(idx + 1), autoplayInterval); } catch (err) {}

    if (carouselEl){
