// ── HERO IMAGE CURSOR TRAIL ──
(function () {
  const hero = document.getElementById('hero');

  const IMAGES = [
    'figuras del banner/Frame 1984078183.png',
    'figuras del banner/Frame 1984078184.png',
    'figuras del banner/Group 657324919.png',
    'figuras del banner/Group 657324920.png',
    'figuras del banner/Group 657324921.png',
    'figuras del banner/Group 657324923.png',
    'figuras del banner/Group 657324925.png',
  ];

  let imgIndex = 0;
  let lastX = 0, lastY = 0;
  const DISTANCE = 80;
  const MAX = 4;
  let active = [];

  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dx = x - lastX, dy = y - lastY;
    if (Math.sqrt(dx * dx + dy * dy) < DISTANCE) return;
    lastX = x; lastY = y;

    const img = document.createElement('img');
    img.src = IMAGES[imgIndex % IMAGES.length];
    imgIndex++;

    img.className = 'trail-img';
    const w = 160;
    const h = 210;
    img.style.cssText = `
      position:absolute;
      left:${x - w / 2}px;
      top:${y - h / 2}px;
      width:${w}px;
      height:${h}px;
      object-fit:contain;
      border-radius:0;
      pointer-events:none;
      z-index:0;
      opacity:0;
      transform:scale(0.85) rotate(${(Math.random() - 0.5) * 14}deg);
      transition:opacity 0.15s ease, transform 0.15s ease;
    `;

    hero.appendChild(img);
    active.push(img);

    requestAnimationFrame(() => {
      img.style.opacity = '1';
      img.style.transform = `scale(1) rotate(${(Math.random() - 0.5) * 8}deg)`;
    });

    if (active.length > MAX) {
      const old = active.shift();
      old.style.opacity = '0';
      old.style.transform = `scale(0.8) rotate(${(Math.random() - 0.5) * 12}deg)`;
      setTimeout(() => old.remove(), 400);
    }
  });

  hero.addEventListener('mouseleave', () => {
    active.forEach(img => {
      img.style.opacity = '0';
      setTimeout(() => img.remove(), 400);
    });
    active = [];
  });
})();

// ── DISEÑO WEB — HOVER MODAL ──
(function () {
  const rows   = document.querySelectorAll('.webdesign__row');
  const modal  = document.getElementById('wdModal');
  const slider = document.getElementById('wdSlider');
  const cursor = document.getElementById('wdCursor');
  if (!rows.length || !modal) return;

  // Posición suavizada con lerp
  const pos   = { mx: 0, my: 0, cx: 0, cy: 0 };
  const speed = { modal: 0.1, cursor: 0.15 };
  let raf;

  function lerp(a, b, t) { return a + (b - a) * t; }

  function tick() {
    pos.mx = lerp(pos.mx, pos.cx, speed.modal);
    pos.my = lerp(pos.my, pos.cy, speed.modal);
    pos.cx = lerp(pos.cx, pos.cx, 1); // cursor ya está en target

    modal.style.left  = pos.mx + 'px';
    modal.style.top   = pos.my + 'px';
    cursor.style.left = pos.cx + 'px';
    cursor.style.top  = pos.cy + 'px';
    raf = requestAnimationFrame(tick);
  }

  // Separar velocidades: modal más lento, cursor más rápido
  const mPos = { x: 0, y: 0 };
  const cPos = { x: 0, y: 0 };
  let rafId;

  function animate() {
    mPos.x = lerp(mPos.x, cPos.x, 0.08);
    mPos.y = lerp(mPos.y, cPos.y, 0.08);
    modal.style.left  = mPos.x + 'px';
    modal.style.top   = mPos.y + 'px';
    cursor.style.left = lerp(parseFloat(cursor.style.left) || cPos.x, cPos.x, 0.15) + 'px';
    cursor.style.top  = lerp(parseFloat(cursor.style.top)  || cPos.y, cPos.y, 0.15) + 'px';
    rafId = requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('mousemove', e => {
    cPos.x = e.clientX;
    cPos.y = e.clientY;
  });

  rows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      const idx = +row.dataset.index;
      slider.style.top = `${idx * -400}px`;
      modal.classList.add('active');
      cursor.classList.add('active');
    });
    row.addEventListener('mouseleave', () => {
      modal.classList.remove('active');
      cursor.classList.remove('active');
    });
  });
})();

// ── ROTATING WORD + PHOTO SWAP ──
(function () {
  const ITEMS = [
    { word: 'Todo',         photo: 'default.png' },
    { word: 'Arquitectura', photo: 'arquitecto.png' },
    { word: 'Cocina',       photo: 'chef.png' },
    { word: 'Arte',         photo: 'pintura.png' },
  ];

  const wordEl = document.querySelector('.rotating-word__text');
  const photoEl = document.getElementById('about-photo');
  if (!wordEl || !photoEl) return;

  let current = 0;

  function next() {
    current = (current + 1) % ITEMS.length;
    const { word, photo } = ITEMS[current];

    wordEl.classList.add('exit');
    photoEl.classList.add('swapping');

    setTimeout(() => {
      wordEl.textContent = word;
      wordEl.classList.remove('exit');
      wordEl.classList.add('enter');

      photoEl.src = photo;
      photoEl.onload = () => photoEl.classList.remove('swapping');
      setTimeout(() => photoEl.classList.remove('swapping'), 300);

      requestAnimationFrame(() => requestAnimationFrame(() => wordEl.classList.remove('enter')));
    }, 350);
  }

  setInterval(next, 2500);
})();

// ── NAV SLIDING PILL ──
const pill = document.querySelector('.nav__pill');
const slider = document.querySelector('.nav__slider');
const navItems = document.querySelectorAll('.nav__item');

function moveSliderTo(el) {
  const pillRect = pill.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  slider.style.opacity = '1';
  slider.style.width = elRect.width + 'px';
  slider.style.transform = `translateX(${elRect.left - pillRect.left - 6}px)`;
  navItems.forEach(item => item.classList.remove('on-slider'));
  el.classList.add('on-slider');
}

function hideSlider() {
  slider.style.opacity = '0';
  navItems.forEach(item => item.classList.remove('on-slider'));
}

navItems.forEach(item => {
  item.addEventListener('mouseenter', () => moveSliderTo(item));
});

pill.addEventListener('mouseleave', () => {
  const active = document.querySelector('.nav__item.active');
  active ? moveSliderTo(active) : hideSlider();
});

// ── SCROLL SPY ──
const sections = ['sobre-mi', 'appdesign', 'playground', 'contacto'];

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navItems.forEach(item => item.classList.remove('active'));
      const match = document.querySelector(`.nav__item[data-section="${id}"]`);
      if (match) {
        match.classList.add('active');
        moveSliderTo(match);
      }
    }
  });
}, { threshold: 0.4 });

sections.forEach(id => {
  const el = document.getElementById(id);
  if (el) spyObserver.observe(el);
});

// ── CAROUSEL SKIPER54 — INFINITE LOOP ──
(function () {
  const track   = document.getElementById('carouselTrack');
  const dots    = document.querySelectorAll('.carousel__dot');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  if (!track) return;

  const originals = Array.from(track.children);
  const total = originals.length;
  if (!total) return;

  // Estructura: [clones_inicio] [originales] [clones_final]
  originals.forEach(el => track.appendChild(el.cloneNode(true)));
  [...originals].reverse().forEach(el => track.prepend(el.cloneNode(true)));

  // hover pause para videos
  Array.from(track.children).forEach(item => {
    item.addEventListener('mouseenter', () => {
      const v = item.querySelector('.carousel__video');
      if (v && item.classList.contains('active')) v.pause();
    });
    item.addEventListener('mouseleave', () => {
      const v = item.querySelector('.carousel__video');
      if (v && item.classList.contains('active')) v.play().catch(() => {});
    });
  });

  const GAP = 48;
  let current   = total; // apunta al primer original
  let realIndex = 0;
  let busy      = false;
  let autoTimer = null;
  let videoEndTarget = null;
  let videoEndHandler = null;

  function clearAutoAdvance() {
    clearTimeout(autoTimer);
    autoTimer = null;
    if (videoEndTarget && videoEndHandler) {
      videoEndTarget.removeEventListener('ended', videoEndHandler);
    }
    videoEndTarget = null;
    videoEndHandler = null;
  }

  function scheduleNext() {
    clearAutoAdvance();
    const activeItem = track.children[current];
    const v = activeItem?.querySelector('.carousel__video');
    if (v) {
      videoEndHandler = () => { videoEndTarget = null; videoEndHandler = null; goTo(1); };
      videoEndTarget = v;
      v.addEventListener('ended', videoEndHandler, { once: true });
    } else {
      autoTimer = setTimeout(() => goTo(1), 4000);
    }
  }

  function itemWidth() {
    return track.children[current].getBoundingClientRect().width;
  }

  function posFor(idx) {
    const iW = itemWidth();
    const vp = track.parentElement.offsetWidth;
    // offsetLeft del item idx = idx * (iW + GAP) porque no hay padding en el track
    return idx * (iW + GAP) - (vp / 2 - iW / 2);
  }

  function setPos(animated) {
    track.style.transition = animated
      ? 'transform 0.6s cubic-bezier(0.77,0,0.18,1)'
      : 'none';
    track.style.transform = `translateX(-${posFor(current)}px)`;
  }

  function syncVideos() {
    Array.from(track.children).forEach(el => {
      const v = el.querySelector('.carousel__video');
      if (!v) return;
      if (el.classList.contains('active') && !el.matches(':hover')) {
        v.currentTime = 0;
        v.play().catch(() => {});
      } else {
        v.pause();
        v.currentTime = 0;
      }
    });
  }

  function markActive() {
    Array.from(track.children).forEach(el => el.classList.remove('active'));
    track.children[current].classList.add('active');
    dots.forEach(d => d.classList.remove('active'));
    dots[realIndex]?.classList.add('active');
    syncVideos();
  }

  function silentJump() {
    Array.from(track.children).forEach(el => el.classList.remove('active'));
    const item = track.children[current];
    item.classList.add('jump', 'active');
    dots.forEach(d => d.classList.remove('active'));
    dots[realIndex]?.classList.add('active');
    syncVideos();
    setPos(false);
    requestAnimationFrame(() => requestAnimationFrame(() => item.classList.remove('jump')));
  }

  function goTo(dir) {
    if (busy) return;
    busy = true;
    clearAutoAdvance();

    current   += dir;
    realIndex  = ((realIndex + dir) % total + total) % total;
    markActive();
    setPos(true);

    track.addEventListener('transitionend', function h() {
      track.removeEventListener('transitionend', h);
      // Salto silencioso: si estamos en un clon, volver al original equivalente
      if (current >= total * 2) {
        current -= total;
        silentJump();
      } else if (current < total) {
        current += total;
        silentJump();
      }
      busy = false;
      scheduleNext();
    });
  }

  // Init
  window.addEventListener('load', () => {
    markActive();
    setPos(false);
    scheduleNext();
  });

  window.addEventListener('resize', () => setPos(false));

  prevBtn?.addEventListener('click', () => goTo(-1));
  nextBtn?.addEventListener('click', () => goTo(1));

  dots.forEach(d => d.addEventListener('click', () => {
    const t = +d.dataset.dot;
    if (t !== realIndex) goTo(t > realIndex ? 1 : -1);
  }));

  track.addEventListener('click', e => {
    const item = e.target.closest('.carousel__item');
    if (!item || busy) return;
    const idx = Array.from(track.children).indexOf(item);
    if (idx > current) goTo(1);
    else if (idx < current) goTo(-1);
  });

})();

// ── PLAYGROUND SCROLL COLUMNS ──
(function () {
  const section = document.getElementById('playground');
  const cols    = document.querySelectorAll('.playground__col');
  if (!section || !cols.length) return;

  const offsets = Array.from(cols).map(c => +c.dataset.offset || 0);
  const current = offsets.slice();

  function update() {
    const rect = section.getBoundingClientRect();
    const vh   = window.innerHeight;

    // El efecto va de progress=0 (sección entra por abajo)
    // a progress=1 (sección completamente en viewport)
    // rect.top: vh → fuera de vista; 0 → sección en la parte superior
    const progress = Math.max(0, Math.min(1, (vh - rect.top) / vh));

    cols.forEach((col, i) => {
      const target = offsets[i] * (1 - progress);
      current[i]  += (target - current[i]) * 0.1;
      col.style.transform = `translateY(${current[i].toFixed(2)}px)`;
    });

    requestAnimationFrame(update);
  }

  // Init posición
  offsets.forEach((o, i) => { current[i] = o; });
  update();
})();

// ── MODAL CERTIFICADOS ──
(function () {
  const btn     = document.getElementById('certBtn');
  const overlay = document.getElementById('certOverlay');
  const closeBtn= document.getElementById('certClose');
  const mainImg = document.getElementById('certMainImg');
  const thumbs  = document.querySelectorAll('.cert-thumb');
  if (!btn || !overlay) return;

  btn.addEventListener('click', () => overlay.classList.add('open'));
  closeBtn.addEventListener('click', () => overlay.classList.remove('open'));
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const newSrc    = thumb.dataset.src;
      const oldSrc    = mainImg.src;
      const mainWrap  = document.getElementById('certMain');

      // animación: main encoge, thumb crece
      mainWrap.classList.add('shrinking');
      thumb.classList.add('growing');

      setTimeout(() => {
        // intercambiar imágenes
        mainImg.src = newSrc;
        thumb.querySelector('img').src = oldSrc;
        thumb.dataset.src = oldSrc;

        mainWrap.classList.remove('shrinking');
        thumb.classList.remove('growing');
      }, 300);
    });
  });
})();

// ── FADE IN ON SCROLL ──
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.about, .work, .playground, .contact').forEach(el => {
  el.classList.add('fade-section');
  fadeObserver.observe(el);
});

// ── NAV SHADOW ON SCROLL ──
window.addEventListener('scroll', () => {
  pill.style.boxShadow = window.scrollY > 20
    ? '0 4px 24px rgba(0,0,0,0.08)'
    : 'none';
});

// ── PROJECT DETAIL MODAL ──
(function () {
  // Agrega aquí el embed URL de Figma para cada proyecto.
  // Ejemplo: figma: 'https://www.figma.com/proto/XXXX/...'
  const PROJECTS = {
    nami: {
      title: 'Nami',
      category: 'Diseño Web & UX',
      desc: 'Diseñé la página web de Nami y propuse distintas soluciones para que sus clientes pudieran pagar sus servicios de forma fácil y sin fricciones. De la arquitectura de la información al flujo de pago, cada paso tenía que tener un porqué.',
      tools: ['Figma', 'Illustrator', 'Photoshop', 'Gemini', 'Webflow'],
      figma: 'https://embed.figma.com/proto/pRIhvljL5yHQLa7WZOD0sq/Nami?page-id=0%3A1&node-id=1-2&p=f&viewport=557%2C79%2C0.06&scaling=scale-down-width&content-scaling=fixed&embed-host=share'
    },
    'toyota-tgr': {
      title: 'Toyota TGR',
      category: 'Rediseño Web',
      desc: 'Participé en el rediseño general del sitio web de Toyota con foco en la sección de Gazoo Racing. Velocidad, precisión y una identidad visual que le hace justicia a la marca.',
      tools: ['Figma', 'Photoshop', 'Illustrator'],
      figma: 'https://embed.figma.com/proto/LEDlCAAKGJpCUaArBhj9YW/Toyota?page-id=0%3A1&node-id=1-302&p=f&viewport=703%2C478%2C0.16&scaling=scale-down-width&content-scaling=fixed&embed-host=share'
    },
    cimonamia: {
      title: 'Cimonamía',
      category: 'Diseño Web & Branding',
      desc: 'Una página de coming soon que no solo decía "próximamente", sino que ya contaba la historia. Generamos expectativa, presentamos la esencia de la marca y dejamos al usuario con ganas de más.',
      tools: ['Figma', 'Illustrator', 'Photoshop', 'Webflow', 'Gemini'],
      figma: 'https://embed.figma.com/proto/5i1bbrfyK3eWyx1ixnVL5h/CimonaMia?page-id=0%3A1&node-id=2-3&p=f&viewport=564%2C-2666%2C0.28&scaling=scale-down-width&content-scaling=fixed&embed-host=share'
    },
    versor: {
      title: 'Grupo Versor',
      category: 'Diseño Web',
      desc: 'Diseñé el home para aterrizar las ideas de producto de Grupo Versor. Lo desarrollé en versión clara y oscura, porque una buena propuesta se tiene que ver bien en cualquier contexto.',
      tools: ['Figma', 'Magnific', 'After Effects'],
      figma: 'https://embed.figma.com/proto/skesGxS1O8FshZK6Vv5k0H/Grupo-Versor?node-id=1-225&viewport=514%2C193%2C0.36&scaling=scale-down-width&content-scaling=fixed&page-id=0%3A1&embed-host=share'
    },
    arboleda: {
      title: 'Arboleda Virtual',
      category: 'UX & Desarrollo',
      desc: 'Junto a Sara Gómez diseñamos una propuesta de aplicación para la Escuela de Comunicación de la Universidad Sergio Arboleda. Un proyecto académico que tomamos con la seriedad de uno real.',
      tools: ['Figma', 'Antigravity', 'HTML', 'CSS'],
      figma: 'https://embed.figma.com/proto/T44I4peOrjZOQSom7R6lRT/-INT--Arboleda-Virtual?node-id=317-929&viewport=484%2C598%2C0.17&scaling=scale-down&content-scaling=fixed&starting-point-node-id=705%3A4680&page-id=317%3A928&embed-host=share'
    },
    'toyota-usados': {
      title: 'Toyota Usados',
      category: 'Diseño de Aplicativo',
      desc: 'Construí un aplicativo para gestionar el inventario de vehículos usados de Toyota, partiendo del programa Genera. Un sistema claro, funcional y pensado para quien lo va a usar día a día.',
      tools: ['Figma', 'Genera', 'ChatGPT'],
      figma: 'https://embed.figma.com/proto/p7inAxN32OKR3Ky3lkpmpz/Toyota-Usados?node-id=1-3&viewport=403%2C134%2C0.06&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&embed-host=share'
    },
    'consul-virtual': {
      title: 'Consul Virtual',
      category: 'UX Research & Diseño',
      desc: 'Con Angélica Ortega fuimos desde el insight hasta el prototipo. El resultado: una app que simula la entrevista de aprobación de visa, analiza los documentos requeridos, te hace el simulacro y al final te dice exactamente cómo te fue. Un proyecto donde la investigación lo fue todo.',
      tools: ['Figma', 'Illustrator', 'Photoshop'],
      figma: 'https://embed.figma.com/proto/9MgKA1tdqt16XQSb2pJkw2/Consul-Virtual?page-id=0%3A1&node-id=1-15&viewport=541%2C60%2C0.09&scaling=scale-down-width&content-scaling=fixed&embed-host=share'
    }
  };

  const overlay  = document.getElementById('projOverlay');
  const closeBtn = document.getElementById('projClose');
  const figmaEl  = document.getElementById('projFigma');
  const titleEl  = document.getElementById('projTitle');
  const descEl   = document.getElementById('projDesc');
  const toolsEl  = document.getElementById('projTools');
  const catEl    = document.getElementById('projCategory');
  if (!overlay) return;

  const PLACEHOLDER_HTML = `
    <div class="proj-figma-placeholder">
      <svg viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.5 57c5.247 0 9.5-4.253 9.5-9.5V38H9.5C4.253 38 0 42.253 0 47.5S4.253 57 9.5 57z" fill="currentColor" opacity=".5"/>
        <path d="M0 28.5C0 23.253 4.253 19 9.5 19H19v19H9.5C4.253 38 0 33.747 0 28.5z" fill="currentColor" opacity=".5"/>
        <path d="M0 9.5C0 4.253 4.253 0 9.5 0H19v19H9.5C4.253 19 0 14.747 0 9.5z" fill="currentColor" opacity=".5"/>
        <path d="M19 0h9.5C33.747 0 38 4.253 38 9.5S33.747 19 28.5 19H19V0z" fill="currentColor" opacity=".5"/>
        <path d="M38 28.5C38 33.747 33.747 38 28.5 38S19 33.747 19 28.5 23.253 19 28.5 19 38 23.253 38 28.5z" fill="currentColor" opacity=".5"/>
      </svg>
      <span>Agrega el embed de Figma en main.js</span>
    </div>`;

  function openProject(key) {
    const p = PROJECTS[key];
    if (!p) return;

    catEl.textContent   = p.category;
    titleEl.textContent = p.title;
    descEl.textContent  = p.desc;
    toolsEl.innerHTML   = p.tools.map(t => `<span class="proj-tool">${t}</span>`).join('');

    const leftEl = figmaEl.parentElement;
    leftEl.querySelectorAll('.proj-figma-placeholder').forEach(n => n.remove());

    if (p.figma) {
      figmaEl.src = p.figma;
      figmaEl.style.display = 'block';
    } else {
      figmaEl.style.display = 'none';
      leftEl.insertAdjacentHTML('beforeend', PLACEHOLDER_HTML);
    }

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeProject() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => {
      figmaEl.src = '';
      figmaEl.style.display = 'block';
      const leftEl = figmaEl.parentElement;
      leftEl.querySelectorAll('.proj-figma-placeholder').forEach(n => n.remove());
    }, 420);
  }

  closeBtn.addEventListener('click', closeProject);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeProject(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeProject(); });

  // Carousel: abrir al hacer click en el item activo
  const carouselTrack = document.getElementById('carouselTrack');
  if (carouselTrack) {
    carouselTrack.addEventListener('click', e => {
      const item = e.target.closest('.carousel__item');
      if (!item || !item.classList.contains('active') || !item.dataset.project) return;
      openProject(item.dataset.project);
    });
  }

  // Webdesign rows
  document.querySelectorAll('.webdesign__row[data-project]').forEach(row => {
    row.addEventListener('click', () => openProject(row.dataset.project));
  });
})();
