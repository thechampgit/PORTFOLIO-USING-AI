// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initHeaderScroll();
  initGSAPAnimations();
  initProjectsFilter();
  initStarParallax();
});

/* ==========================================================================
   Custom Cursor Logic
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.getElementById('customCursor');
  const cursorDot = document.getElementById('customCursorDot');
  
  if (!cursor || !cursorDot) return;

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let dotX = 0, dotY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth animation frame loop for lag effect
  function animateCursor() {
    // Outer cursor smooth interpolation (delay factor 0.15)
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    // Inner dot cursor very fast interpolation (delay factor 0.45)
    dotX += (mouseX - dotX) * 0.45;
    dotY += (mouseY - dotY) * 0.45;
    cursorDot.style.left = `${dotX}px`;
    cursorDot.style.top = `${dotY}px`;

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover states
  const interactiveElements = document.querySelectorAll('a, button, .software-card, .project-card, .scroll-down-badge, .social-item');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovered');
    });
  });
}

/* ==========================================================================
   Header Scroll State
   ========================================================================== */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   GSAP & ScrollTrigger Animations
   ========================================================================== */
function initGSAPAnimations() {
  // 1. Horizontal scrolling of PORTFOLIO outline texts in Hero
  const parallaxTexts = document.querySelectorAll('.text-parallax');
  parallaxTexts.forEach(text => {
    const speed = parseFloat(text.dataset.speed) || 1;
    gsap.to(text, {
      x: () => (speed * 100),
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  });

  // 2. Parallax vertical scroll of RESUME outlines in background of skills
  const resumeBgTexts = document.querySelectorAll('.resume-bg-text');
  resumeBgTexts.forEach((text, index) => {
    const direction = index % 2 === 0 ? 150 : -150;
    gsap.to(text, {
      x: direction,
      scrollTrigger: {
        trigger: '#resume',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });

  // 3. Reveal animations using GSAP and CSS Intersection Observer
  // Instead of complex plugins, we can use ScrollTrigger for clean triggers
  const revealItems = document.querySelectorAll('.reveal-item');
  revealItems.forEach(item => {
    gsap.fromTo(item, 
      { opacity: 0, y: 50 },
      {
        opacity: 1, 
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // 4. Parallax about section floating badges
  gsap.to('.pill-dob', {
    y: -30,
    rotate: -8,
    scrollTrigger: {
      trigger: '#about',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });

  gsap.to('.pill-nation', {
    y: 20,
    rotate: 5,
    scrollTrigger: {
      trigger: '#about',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });

  // 5. Hero Portrait parallax scaling
  gsap.to('.hero-portrait-card img', {
    scale: 1.15,
    y: 20,
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });
}

/* ==========================================================================
   Interactive Projects Filter Logic
   ========================================================================== */
function initProjectsFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterButtons.length || !projectCards.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active class on buttons
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.dataset.filter;

      projectCards.forEach(card => {
        const category = card.dataset.category;

        if (filterVal === 'all' || category === filterVal) {
          // Show with animate
          gsap.to(card, {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            display: 'flex',
            overwrite: 'auto'
          });
        } else {
          // Hide with animate
          gsap.to(card, {
            opacity: 0,
            scale: 0.9,
            duration: 0.4,
            display: 'none',
            overwrite: 'auto'
          });
        }
      });
      
      // Refresh ScrollTrigger as elements position changes
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);
    });
  });
}

/* ==========================================================================
   Interactive Star Parallax
   ========================================================================== */
function initStarParallax() {
  document.addEventListener('mousemove', (e) => {
    const stars = document.querySelectorAll('.star-decor');
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    stars.forEach(star => {
      const rect = star.getBoundingClientRect();
      const starX = rect.left + rect.width / 2;
      const starY = rect.top + rect.height / 2;

      // Small movement relative to mouse distance
      const deltaX = (mouseX - starX) * 0.03;
      const deltaY = (mouseY - starY) * 0.03;

      gsap.to(star, {
        x: deltaX,
        y: deltaY,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });
  });
}
