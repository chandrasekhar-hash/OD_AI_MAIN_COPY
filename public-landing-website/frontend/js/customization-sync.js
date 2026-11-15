/**
 * OD AI HUB — Dynamic Live Customization & 2D Visual Editor Sync
 * Enables real-time synchronization between the Management Dashboard and the Public Website:
 * - Logo zoom & image updates
 * - 2-color combos and gradients per section
 * - Background artwork replacement
 * - Font family and typography tuning
 * - Click-to-inspect 2-way postMessage communication
 */

(function () {
  'use strict';

  function applyCustomization(data) {
    if (!data || typeof data !== 'object') return;

    // 1. Logo URL and Size Zoom
    const logoImgs = document.querySelectorAll('.lg img, #lgi, .ring-logo-img');
    if (data.logo_url) {
      logoImgs.forEach(img => {
        img.src = data.logo_url;
      });
    }
    if (data.logo_size) {
      const sizePx = typeof data.logo_size === 'number' ? `${data.logo_size}px` : data.logo_size;
      logoImgs.forEach(img => {
        img.style.setProperty('width', sizePx, 'important');
        img.style.setProperty('height', sizePx, 'important');
        img.style.setProperty('max-width', 'none', 'important');
        img.style.setProperty('transition', 'width 0.2s ease, height 0.2s ease', 'important');
      });
      // Adjust navbar brand container height if logo is large
      const lgEl = document.querySelector('.lg');
      if (lgEl && parseInt(sizePx, 10) > 48) {
        lgEl.style.setProperty('gap', '12px', 'important');
      }
    }

    // 2. Global Fonts
    if (data.font_display) {
      document.documentElement.style.setProperty('--font-display', data.font_display);
    }
    if (data.font_body) {
      document.documentElement.style.setProperty('--font-sans', data.font_body);
    }

    // 3. Global Text Colors
    if (data.text_colors) {
      if (data.text_colors.heading) {
        document.documentElement.style.setProperty('--heading-color', data.text_colors.heading);
      }
      if (data.text_colors.body) {
        document.documentElement.style.setProperty('--body-text-color', data.text_colors.body);
      }
    }

    // 4. Section Background Artwork & 2-Color Combos
    const sectionMap = {
      home_hero: 'header.hero, #view-home .hero',
      academy: '#view-academy .global-hero, header[data-hero="academy"], .prog-header',
      technologies: '#view-technologies .global-hero, header[data-hero="technologies"]',
      innovation_lab: '#view-innovation-lab .global-hero, header[data-hero="innovation-lab"]',
      startups: '#view-startups .global-hero, header[data-hero="startups"]',
      for_business: '#view-for-business .global-hero, header[data-hero="for-business"]',
      for_institutions: '#view-for-institutions .global-hero, header[data-hero="for-institutions"]',
      events: '#view-events .global-hero, header[data-hero="events"]',
      success_stories: '#view-success-stories .global-hero, header[data-hero="success-stories"]',
      about: '#view-about .global-hero, header[data-hero="about"], .about-hero',
      blog: '#view-blog .global-hero, header[data-hero="blog"]'
    };

    // Apply 2-Color Combos
    if (data.combos) {
      Object.entries(data.combos).forEach(([secKey, combo]) => {
        if (!combo || !combo.color1 || !combo.color2) return;
        const selector = sectionMap[secKey];
        if (!selector) return;
        const els = document.querySelectorAll(selector);
        const angle = combo.angle || '135deg';
        const grad = `linear-gradient(${angle}, ${combo.color1} 0%, ${combo.color2} 100%)`;
        els.forEach(el => {
          el.style.setProperty('background', grad, 'important');
        });
      });
    }

    // Apply Background Artwork Images
    if (data.backgrounds) {
      Object.entries(data.backgrounds).forEach(([secKey, bgUrl]) => {
        if (!bgUrl) return;
        const selector = sectionMap[secKey];
        if (!selector) return;
        const els = document.querySelectorAll(selector);
        els.forEach(el => {
          // If a 2-color combo exists, layer it with the image
          const combo = data.combos?.[secKey];
          if (combo && combo.color1 && combo.color2) {
            const angle = combo.angle || '135deg';
            el.style.setProperty(
              'background-image',
              `linear-gradient(${angle}, ${combo.color1} 0%, ${combo.color2} 100%), url("${bgUrl}")`,
              'important'
            );
            el.style.setProperty('background-blend-mode', 'overlay', 'important');
          } else {
            el.style.setProperty(
              'background-image',
              `linear-gradient(90deg, rgba(15, 29, 74, 0.85) 0%, rgba(30, 58, 138, 0.45) 45%, transparent 75%), url("${bgUrl}")`,
              'important'
            );
          }
          const isMobile = window.innerWidth <= 768;
          el.style.setProperty('background-size', 'cover', 'important');
          el.style.setProperty('background-position', isMobile ? 'center top' : 'center right', 'important');
        });
      });
    }

    // 5. 3D Ring Colors
    if (data.ring_colors?.academy && Array.isArray(data.ring_colors.academy)) {
      data.ring_colors.academy.forEach((col, idx) => {
        const ringCard = document.querySelector(`.rc-academy[data-i="${idx}"]`);
        if (ringCard) {
          ringCard.style.setProperty('border-color', col, 'important');
          ringCard.style.setProperty('--rc-glow', col);
        }
      });
    }

    // 6. Text Content Overrides
    if (data.text_content) {
      if (data.text_content.hero_title) {
        const titleEl = document.querySelector('.hero-title, .global-hero-title');
        if (titleEl) titleEl.innerHTML = data.text_content.hero_title;
      }
      if (data.text_content.hero_tagline) {
        const tagEl = document.querySelector('.hero-tagline, .global-hero-tagline');
        if (tagEl) tagEl.textContent = data.text_content.hero_tagline;
      }
    }
  }

  // Load saved customization on page start
  async function loadInitialCustomization() {
    const endpoints = [
      '/customization.json',
      '/api/v1/website/customization',
      '/api/website/customization',
      'http://localhost:8002/api/v1/admin/website/customization',
      'http://localhost:8001/api/v1/website/customization'
    ];
    for (const url of endpoints) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data === 'object') {
            applyCustomization(data);
            break;
          }
        }
      } catch (e) {
        // try next endpoint
      }
    }
  }

  // Listen for real-time postMessage from 2D Visual Site Customizer
  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'ODAI_CUSTOMIZATION_UPDATE') {
      applyCustomization(event.data.payload);
    }
  });

  // Enable Click-to-Inspect when running inside management preview iframe
  if (window.self !== window.top) {
    document.addEventListener('click', (e) => {
      // Find what was clicked
      const logo = e.target.closest('.lg, #lgi');
      const hero = e.target.closest('.global-hero, header.hero');
      const card = e.target.closest('.rc, .feature-card, .course-card');

      let targetInfo = null;
      if (logo) {
        targetInfo = { element: 'logo', label: 'Brand Logo & Sizing' };
      } else if (hero) {
        const view = hero.closest('.view')?.id?.replace('view-', '') || 'home_hero';
        targetInfo = { element: 'hero', section: view, label: `${view.toUpperCase()} Hero Banner` };
      } else if (card) {
        targetInfo = { element: 'card', label: 'Interactive Card' };
      }

      if (targetInfo) {
        window.parent.postMessage({
          type: 'ODAI_ELEMENT_SELECTED',
          payload: targetInfo
        }, '*');
      }
    }, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadInitialCustomization);
  } else {
    loadInitialCustomization();
  }

  window.odaiApplyCustomization = applyCustomization;
})();

