// ============================================================
// BD PLUS NEWS — Premium TV-Style News Portal
// ============================================================

// ===== DATE & TIME =====
function updateDateTime() {
  const now = new Date();
  const dateEl = document.getElementById('currentDate');
  const timeEl = document.getElementById('currentTime');
  const tickerTimeEl = document.getElementById('tickerTime');

  if (dateEl) {
    dateEl.textContent = now.toLocaleDateString('en-BD', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }
  if (timeEl) {
    timeEl.textContent = now.toLocaleTimeString('en-BD', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    });
  }
  if (tickerTimeEl) {
    tickerTimeEl.textContent = now.toLocaleTimeString('en-BD', {
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  }
}
updateDateTime();
setInterval(updateDateTime, 1000);

// ===== DARK MODE =====
const savedTheme = localStorage.getItem('bdpn-theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
updateDarkIcon(savedTheme);

function toggleDark() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('bdpn-theme', next);
  updateDarkIcon(next);
}
function updateDarkIcon(theme) {
  const icon = document.getElementById('darkIcon');
  if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// ===== SEARCH OVERLAY =====
function toggleSearch() {
  const overlay = document.getElementById('searchOverlay');
  const input   = document.getElementById('searchInput');
  if (!overlay) return;
  const isActive = overlay.classList.toggle('active');
  if (isActive && input) setTimeout(() => input.focus(), 80);
}
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const overlay = document.getElementById('searchOverlay');
    if (overlay) overlay.classList.remove('active');
    const nav = document.getElementById('mainNav');
    if (nav && nav.classList.contains('open')) nav.classList.remove('open');
  }
});

// ===== MOBILE NAV =====
function toggleNav() {
  const nav = document.getElementById('mainNav');
  const btn = document.getElementById('hamburgerBtn');
  if (!nav) return;
  const isOpen = nav.classList.toggle('open');
  if (btn) {
    btn.innerHTML = isOpen
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-bars"></i>';
  }
}
// Close mobile nav on outside click
document.addEventListener('click', function(e) {
  const nav = document.getElementById('mainNav');
  const btn = document.getElementById('hamburgerBtn');
  if (nav && nav.classList.contains('open')) {
    if (!nav.contains(e.target) && btn && !btn.contains(e.target)) {
      nav.classList.remove('open');
      btn.innerHTML = '<i class="fas fa-bars"></i>';
    }
  }
});

// ===== HERO SLIDER =====
let currentSlide = 0;
const SLIDE_INTERVAL = 6000;
const slides    = document.querySelectorAll('.hero-slide');
const dots      = document.querySelectorAll('.hero-dot');
const photoBgs  = document.querySelectorAll('.hero-photo');
const progressBar = document.getElementById('heroProgress');
let sliderTimer   = null;
let progressTimer = null;

function startProgress() {
  stopProgress();
  if (!progressBar) return;
  progressBar.style.transition = 'none';
  progressBar.style.width = '0%';
  // Tiny delay to allow the CSS reset to paint
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      progressBar.style.transition = `width ${SLIDE_INTERVAL}ms linear`;
      progressBar.style.width = '100%';
    });
  });
}
function stopProgress() {
  if (!progressBar) return;
  progressBar.style.transition = 'none';
}

function goSlide(n) {
  if (!slides.length) return;
  const total = slides.length;
  n = ((n % total) + total) % total; // wrap safely

  // Deactivate current
  slides[currentSlide].classList.remove('active');
  if (dots[currentSlide])   dots[currentSlide].classList.remove('active');
  if (photoBgs[currentSlide]) photoBgs[currentSlide].classList.remove('active');

  currentSlide = n;

  // Activate new
  slides[currentSlide].classList.add('active');
  if (dots[currentSlide])   dots[currentSlide].classList.add('active');
  if (photoBgs[currentSlide]) photoBgs[currentSlide].classList.add('active');

  // Restart timer + progress
  clearInterval(sliderTimer);
  startProgress();
  sliderTimer = setInterval(() => goSlide(currentSlide + 1), SLIDE_INTERVAL);
}

// Init slider
if (slides.length) {
  startProgress();
  sliderTimer = setInterval(() => goSlide(currentSlide + 1), SLIDE_INTERVAL);
}

// Pause slider on hover
const heroSection = document.getElementById('hero');
if (heroSection) {
  heroSection.addEventListener('mouseenter', () => {
    clearInterval(sliderTimer);
    stopProgress();
  });
  heroSection.addEventListener('mouseleave', () => {
    startProgress();
    sliderTimer = setInterval(() => goSlide(currentSlide + 1), SLIDE_INTERVAL);
  });
}

// ===== BREAKING NEWS TICKER PAUSE ON HOVER =====
const tickerTrack = document.getElementById('tickerTrack');
if (tickerTrack) {
  tickerTrack.addEventListener('mouseenter', () => {
    tickerTrack.style.animationPlayState = 'paused';
  });
  tickerTrack.addEventListener('mouseleave', () => {
    tickerTrack.style.animationPlayState = 'running';
  });
}

// ===== STICKY HEADER SHADOW =====
const mainHeader = document.getElementById('mainHeader');
function handleScroll() {
  const scrollY = window.scrollY;

  // Header shadow
  if (mainHeader) {
    mainHeader.classList.toggle('scrolled', scrollY > 20);
  }

  // Back to top
  const btn = document.getElementById('backToTop');
  if (btn) btn.classList.toggle('visible', scrollY > 400);

  // Category nav active highlight on scroll (scroll spy)
  updateActiveCategoryTab();
}
window.addEventListener('scroll', handleScroll, { passive: true });

// ===== BACK TO TOP =====
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== SCROLL SPY (Category Nav) =====
function updateActiveCategoryTab() {
  const sectionIds = ['latest','national','videos','politics','economy','sports','world','crime','entertainment','technology','health','gallery'];
  const navItems   = document.querySelectorAll('.quick-nav-item');
  const sectionMap = {
    'all':          null,
    'national':     'national',
    'world':        'world',
    'politics':     'politics',
    'economy':      'economy',
    'sports':       'sports',
    'crime':        'crime',
    'entertainment':'entertainment',
    'technology':   'technology',
    'health':       'health',
    'video':        'videos',
    'photo':        'gallery',
  };

  let activeId = '';
  const offset = 140;
  for (const id of sectionIds) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= offset) {
      activeId = id;
    }
  }

  navItems.forEach(item => {
    const href = item.getAttribute('href');
    if (!href) return;
    const target = href.replace('#','');
    const isCurrent = sectionMap[target] === activeId || target === activeId;
    item.classList.toggle('active', isCurrent);
  });
}

// ===== QUICK NAV CLICK =====
document.querySelectorAll('.quick-nav-item').forEach(item => {
  item.addEventListener('click', function() {
    document.querySelectorAll('.quick-nav-item').forEach(i => i.classList.remove('active'));
    this.classList.add('active');
  });
});

// ===== LANGUAGE SWITCHER =====
function setLang(lang) {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    const text = btn.textContent.trim();
    btn.classList.toggle('active',
      lang === 'en' ? text.toLowerCase() === 'en' : text !== 'EN'
    );
  });
  document.body.classList.toggle('lang-bn', lang === 'bn');
}

// ===== NEWSLETTER FORM =====
function handleNewsletter(e) {
  e.preventDefault();
  const form  = e.target;
  const input = form.querySelector('input[type="email"]');
  const btn   = form.querySelector('button[type="submit"]');
  if (!input || !btn || !input.value) return false;

  const original = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
  btn.style.background = '#22c55e';
  btn.style.color      = 'white';
  input.value = '';

  setTimeout(() => {
    btn.innerHTML    = original;
    btn.style.background = '';
    btn.style.color      = '';
  }, 3500);
  return false;
}

// ===== SCROLL-REVEAL (IntersectionObserver) =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity  = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.07, rootMargin: '0px 0px -36px 0px' });

// Apply to all cards with staggered delay
const revealTargets = document.querySelectorAll(
  '.news-card, .compact-card, .video-card, .opinion-card, .sidebar-widget, .gallery-item'
);
revealTargets.forEach((el, i) => {
  const delay = Math.min(i * 0.035, 0.5);
  el.style.opacity   = '0';
  el.style.transform = 'translateY(18px)';
  el.style.transition = `opacity 0.45s ease ${delay}s, transform 0.45s ease ${delay}s`;
  revealObserver.observe(el);
});

// ===== VIDEO PLAY SIMULATION =====
document.querySelectorAll('.play-btn, .play-btn-live, .live-player-play').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    // In a real implementation, this would launch a video player
    // For demo, we just add a brief visual feedback
    const origColor = this.style.background;
    this.style.background = 'rgba(0,91,65,0.9)';
    setTimeout(() => { this.style.background = origColor; }, 300);
  });
});
