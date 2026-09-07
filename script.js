/**
 * WEBNORA DIGITAL STUDIO - INTERACTIVE LOGIC
 * Brand: Webnora (Digital Web Agency & Studio)
 * Email: hellowebnora@gmail.com
 */

document.addEventListener('DOMContentLoaded', () => {
  // Global App State (US Market Standard Pricing)
  const state = {
    currency: 'USD', // USD
    estimator: {
      type: 'landing',
      typeName: 'Landing Page',
      basePriceUSD: 399,
      pages: 3,
      addonsTotalUSD: 99, // speed_opt checked by default
      addonsList: ['Hyper Performance & Speed'],
      multiplier: 1.0,
      timelineName: 'Standard (1 - 2 weeks)',
      finalPriceUSD: 498
    }
  };

  /* ==========================================================================
     1. TOAST NOTIFICATION UTILITY
     ========================================================================== */
  const toastContainer = document.getElementById('toast-container');

  function showToast(message, icon = 'fa-check-circle', duration = 3500) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas ${icon} text-emerald"></i> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  /* ==========================================================================
     2. THEME TOGGLE (DARK / LIGHT)
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Check saved theme (default dark monochrome)
  const savedTheme = localStorage.getItem('webnora_theme') || 'dark';
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('webnora_theme', newTheme);
      showToast(`Switched Theme Mode`, newTheme === 'dark' ? 'fa-moon' : 'fa-sun', 2000);
    });
  }

  /* ==========================================================================
     3. NAVBAR SCROLL EFFECT & MOBILE DRAWER
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function toggleMobileDrawer(open) {
    if (!mobileDrawer) return;
    if (open) {
      mobileDrawer.classList.add('open');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    } else {
      mobileDrawer.classList.remove('open');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  mobileMenuBtn?.addEventListener('click', () => toggleMobileDrawer(true));
  drawerCloseBtn?.addEventListener('click', () => toggleMobileDrawer(false));
  drawerOverlay?.addEventListener('click', () => toggleMobileDrawer(false));
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileDrawer(false));
  });

  /* ==========================================================================
     4. CURRENCY DISPLAY (USD DEFAULT FOR US CLIENTS)
     ========================================================================== */
  const currencyBtns = document.querySelectorAll('.currency-btn');
  const priceValues = document.querySelectorAll('.price-val');
  const currencySymbols = document.querySelectorAll('.currency-symbol');

  if (currencyBtns.length > 0) {
    currencyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        currencyBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const selectedCurrency = btn.getAttribute('data-currency') || 'USD';
        state.currency = selectedCurrency;

        priceValues.forEach(el => {
          const usd = el.getAttribute('data-usd');
          el.textContent = usd || el.textContent;
        });

        currencySymbols.forEach(el => {
          el.textContent = '$';
        });

        updateEstimator();
      });
    });
  }

  /* ==========================================================================
     5. PROJECT COST ESTIMATOR (US MARKET STANDARDS)
     ========================================================================== */
  const projectTypeRadios = document.querySelectorAll('input[name="project_type"]');
  const pageSlider = document.getElementById('page-slider');
  const pageCountVal = document.getElementById('page-count-val');
  const addonCheckboxes = document.querySelectorAll('input[name="addon"]');
  const speedRadios = document.querySelectorAll('input[name="delivery_speed"]');

  const calculatedPriceDisplay = document.getElementById('calculated-price');
  const summaryCurrencyUnit = document.querySelector('.summary-total-price .currency-unit');
  const summaryBaseType = document.getElementById('summary-base-type');
  const summaryPages = document.getElementById('summary-pages');
  const summaryAddonsCount = document.getElementById('summary-addons-count');
  const summaryTimeline = document.getElementById('summary-timeline');
  const sendEstimateEmailBtn = document.getElementById('send-estimate-email-btn');
  const copyEstimateBtn = document.getElementById('copy-estimate-btn');

  // Radio button active styles sync
  function syncRadioCardUI(radios) {
    radios.forEach(radio => {
      const card = radio.closest('.estimator-radio-card');
      if (card) {
        if (radio.checked) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      }
    });
  }

  // Checkbox active styles sync
  function syncCheckboxCardUI(checkboxes) {
    checkboxes.forEach(cb => {
      const card = cb.closest('.addon-checkbox-card');
      if (card) {
        if (cb.checked) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      }
    });
  }

  function updateEstimator() {
    // 1. Project Type Base
    const selectedType = document.querySelector('input[name="project_type"]:checked');
    if (selectedType) {
      state.estimator.type = selectedType.value;
      state.estimator.basePriceUSD = parseFloat(selectedType.getAttribute('data-base-usd')) || 399;
      
      const titleSpan = selectedType.closest('.estimator-radio-card')?.querySelector('.option-title');
      state.estimator.typeName = titleSpan ? titleSpan.textContent.trim() : 'Landing Page';
    }

    // 2. Page Count
    const pageVal = parseInt(pageSlider?.value || 3, 10);
    state.estimator.pages = pageVal;
    if (pageCountVal) {
      pageCountVal.textContent = pageVal === 1 ? '1 Single Page' : `${pageVal} Custom Pages`;
    }

    // Extra page cost: $50 / page for >1 page on landing or >3 on business
    let extraPages = Math.max(0, pageVal - (state.estimator.type === 'landing' ? 1 : 3));
    let extraPageCostUSD = extraPages * 50;

    // 3. Addons
    let addonsTotalUSD = 0;
    const activeAddonNames = [];

    addonCheckboxes.forEach(cb => {
      if (cb.checked) {
        addonsTotalUSD += parseFloat(cb.getAttribute('data-usd')) || 0;
        const nameEl = cb.closest('.addon-checkbox-card')?.querySelector('.addon-name');
        if (nameEl) activeAddonNames.push(nameEl.textContent.trim());
      }
    });

    state.estimator.addonsTotalUSD = addonsTotalUSD;
    state.estimator.addonsList = activeAddonNames;

    // 4. Timeline Multiplier
    const selectedSpeed = document.querySelector('input[name="delivery_speed"]:checked');
    const multiplier = parseFloat(selectedSpeed?.getAttribute('data-multiplier') || 1.0);
    state.estimator.multiplier = multiplier;
    state.estimator.timelineName = multiplier > 1.0 ? '⚡ Express Priority (3-5 Days)' : 'Standard (1-2 Weeks)';

    // Compute Total in USD
    const subtotalUSD = state.estimator.basePriceUSD + extraPageCostUSD + addonsTotalUSD;
    const finalUSD = Math.round(subtotalUSD * multiplier);

    state.estimator.finalPriceUSD = finalUSD;

    // Update UI Elements
    if (summaryCurrencyUnit) {
      summaryCurrencyUnit.textContent = '$';
    }

    if (calculatedPriceDisplay) {
      calculatedPriceDisplay.textContent = finalUSD.toLocaleString('en-US');
    }

    if (summaryBaseType) summaryBaseType.textContent = state.estimator.typeName;
    if (summaryPages) summaryPages.textContent = `${pageVal} ${pageVal === 1 ? 'Page' : 'Pages'}`;
    if (summaryAddonsCount) {
      summaryAddonsCount.textContent = activeAddonNames.length === 0 
        ? 'None' 
        : `${activeAddonNames.length} Selected`;
    }
    if (summaryTimeline) summaryTimeline.textContent = state.estimator.timelineName;
  }

  // Event Listeners for Estimator
  projectTypeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      syncRadioCardUI(projectTypeRadios);
      updateEstimator();
    });
  });

  pageSlider?.addEventListener('input', updateEstimator);

  addonCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      syncCheckboxCardUI(addonCheckboxes);
      updateEstimator();
    });
  });

  speedRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      syncRadioCardUI(speedRadios);
      updateEstimator();
    });
  });

  // Initial Sync
  syncRadioCardUI(projectTypeRadios);
  syncCheckboxCardUI(addonCheckboxes);
  syncRadioCardUI(speedRadios);
  updateEstimator();

  // Helper to detect mobile device
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
  };

  // Helper to open Email client (Native Gmail App on mobile, Web Gmail on desktop)
  function openEmailClient(email, subject = '', body = '') {
    const encSubject = encodeURIComponent(subject);
    const encBody = encodeURIComponent(body);
    const mailtoUrl = `mailto:${email}?subject=${encSubject}&body=${encBody}`;
    const webGmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encSubject}&body=${encBody}`;

    if (isMobileDevice()) {
      // On mobile, launch default native Gmail / Email app directly via mailto:
      window.location.href = mailtoUrl;
      showToast('Opening default Gmail app...', 'fa-envelope-open', 3500);
    } else {
      // On desktop, open Web Gmail in new browser tab
      window.open(webGmailUrl, '_blank');
      showToast('Opening Gmail in your browser...', 'fa-envelope-open', 3500);
    }
  }

  // Send Estimator Scope via Email
  sendEstimateEmailBtn?.addEventListener('click', () => {
    const est = state.estimator;
    const priceStr = `$${est.finalPriceUSD.toLocaleString('en-US')}`;
    const addonsStr = est.addonsList.length > 0 ? est.addonsList.join(', ') : 'Standard Features';

    const subject = `Webnora Project Scope - ${est.typeName} (${priceStr})`;
    const body = `Hi Webnora Team,\n\nI calculated a project scope on your website:\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📋 ESTIMATED PROJECT SCOPE\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n• Project Type: ${est.typeName}\n• Estimated Pages: ${est.pages}\n• Selected Add-ons: ${addonsStr}\n• Timeline Preference: ${est.timelineName}\n• Total Estimated Cost: ${priceStr}\n\nPlease review this scope and let us know how we can get started!`;

    openEmailClient('hellowebnora@gmail.com', subject, body);
  });

  // Copy Estimate Summary to Clipboard
  copyEstimateBtn?.addEventListener('click', () => {
    const est = state.estimator;
    const priceStr = `$${est.finalPriceUSD.toLocaleString('en-US')}`;
    const textToCopy = `Webnora Project Scope Estimate:
Type: ${est.typeName}
Pages: ${est.pages}
Add-ons: ${est.addonsList.join(', ') || 'None'}
Timeline: ${est.timelineName}
Estimated Cost: ${priceStr}
Contact Email: hellowebnora@gmail.com`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast('Estimate summary copied to clipboard!', 'fa-copy');
    }).catch(() => {
      showToast('Could not copy to clipboard', 'fa-exclamation-triangle');
    });
  });

  /* ==========================================================================
     6. PORTFOLIO FILTERING & CASE STUDY MODAL
     ========================================================================== */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // Case Study Details Data Store
  const caseStudies = {
    1: {
      title: 'ShopSphere — E-Commerce UI Design',
      category: 'E-Commerce Store & UI Design',
      image: 'assets/shopsphere.png',
      client: 'ShopSphere Retail Group',
      timeline: '2 Weeks Delivery',
      metrics: ['+185% Conversion Rate', '< 0.8s Page Load Speed', '99.9% Uptime'],
      challenge: 'The client had a slow legacy storefront with poor mobile conversion and bloated scripts.',
      solution: 'Designed and built a custom, lightning-fast static UI with optimized cart drawer, product filter, and instant checkout flow.',
      stack: ['HTML5/CSS3', 'Vanilla JS', 'Figma', 'Vercel Edge CDN'],
      testimonial: '"The speed and polish of our new storefront resulted in an immediate jump in online sales within 14 days of launch."'
    },
    2: {
      title: 'SevenMentor — IT Training & Placement Institute',
      category: 'EdTech & Training Platform',
      image: 'assets/sevenmentor.png',
      client: 'SevenMentor Training Institute',
      timeline: '2 Weeks Delivery',
      metrics: ['50,000+ Trained Students', '500+ Hiring Partners', 'Job-Oriented Course Portal'],
      challenge: 'Needed a high-scale, modern educational web platform showcasing IT courses, corporate training modules, and student placement tracks.',
      solution: 'Engineered an interactive EdTech portal with course catalog navigation, instant callback requests, and corporate recruitment channels.',
      stack: ['EdTech Platform', 'Training Portal', 'Placement Engine', 'Web Architecture'],
      testimonial: '"SevenMentor’s platform seamlessly connects thousands of students with top IT hiring partners across India."'
    },
    3: {
      title: 'The Boho House — Luxury Cocktail Bar & Dining',
      category: 'Hospitality & Brand Showcase',
      image: 'assets/bohohouse.png',
      client: 'The Boho House Pune',
      timeline: '1 Week Delivery',
      metrics: ['+210% Table Reservations', 'Luxury Brand Aesthetic', 'Mobile-First Layout'],
      challenge: 'Needed a captivating, high-end web presence reflecting the atmospheric luxury dining experience of the cocktail bar.',
      solution: 'Crafted a bespoke, rich visual website with instant table reservation CTAs, brand storytelling, and event showcases.',
      stack: ['HTML5/CSS3', 'CSS Grid', 'Brand Design', 'Technical SEO'],
      testimonial: '"High-net-worth guests are thoroughly impressed with the presentation and atmosphere of our site."'
    }
  };

  const caseStudyModal = document.getElementById('case-study-modal');
  const modalBody = document.getElementById('modal-body');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  function openCaseStudyModal(projectId) {
    const data = caseStudies[projectId];
    if (!data || !modalBody || !caseStudyModal) return;

    modalBody.innerHTML = `
      <div class="modal-project-header">
        <span class="section-subtitle">${data.category}</span>
        <h2 style="font-family: var(--font-heading); font-size: 1.8rem; margin: 0.5rem 0 1rem 0;">${data.title}</h2>
      </div>

      <div style="aspect-ratio: 16/9; border-radius: var(--radius-md); overflow: hidden; margin-bottom: 1.5rem;">
        <img src="${data.image}" alt="${data.title}" style="width: 100%; height: 100%; object-fit: cover;">
      </div>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-bottom: 1.5rem; background: var(--bg-surface-elevated); padding: 1rem; border-radius: var(--radius-md);">
        ${data.metrics.map(m => `
          <div style="font-size: 0.85rem; font-weight: 700; color: var(--purple-700); display: flex; align-items: center; gap: 0.4rem;">
            <i class="fas fa-check-circle"></i> <span>${m}</span>
          </div>
        `).join('')}
      </div>

      <div style="display: flex; flex-direction: column; gap: 1.2rem; margin-bottom: 2rem;">
        <div>
          <h4 style="font-size: 1rem; color: var(--text-primary); margin-bottom: 0.35rem;">The Challenge:</h4>
          <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6;">${data.challenge}</p>
        </div>

        <div>
          <h4 style="font-size: 1rem; color: var(--text-primary); margin-bottom: 0.35rem;">The Solution & Architecture:</h4>
          <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6;">${data.solution}</p>
        </div>

        <div>
          <h4 style="font-size: 1rem; color: var(--text-primary); margin-bottom: 0.5rem;">Tech Stack Used:</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
            ${data.stack.map(t => `<span class="tech-tag">${t}</span>`).join('')}
          </div>
        </div>

        <div style="padding: 1rem; background: var(--purple-50); border-left: 3px solid var(--purple-600); border-radius: 0 var(--radius-sm) var(--radius-sm) 0;">
          <p style="font-size: 0.9rem; font-style: italic; color: var(--text-primary);">${data.testimonial}</p>
          <span style="font-size: 0.78rem; color: var(--purple-700); font-weight: 700; display: block; margin-top: 0.4rem;">— ${data.client}</span>
        </div>
      </div>

      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <a href="mailto:hellowebnora@gmail.com?subject=Inquiry%20for%20Project%20like%20${encodeURIComponent(data.title)}&body=Hi%20Webnora%20Team,%0A%0AI%20saw%20your%20case%20study%20for%20${encodeURIComponent(data.title)}%20and%20I%20would%20like%20a%20similar%20website%20built%20for%20my%20business.%0A%0APlease%20let%20me%20know%20your%20availability%20and%20timeline." class="btn btn-emerald btn-block btn-lg" onclick="document.getElementById('case-study-modal').classList.remove('open'); document.body.style.overflow='';">
          <i class="fas fa-paper-plane"></i> Request a Website Like This
        </a>
      </div>
    `;

    caseStudyModal.classList.add('open');
    caseStudyModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCaseStudyModal() {
    if (!caseStudyModal) return;
    caseStudyModal.classList.remove('open');
    caseStudyModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.view-project-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const projectId = btn.getAttribute('data-project-id');
      openCaseStudyModal(projectId);
    });
  });

  modalCloseBtn?.addEventListener('click', closeCaseStudyModal);
  caseStudyModal?.addEventListener('click', (e) => {
    if (e.target === caseStudyModal) closeCaseStudyModal();
  });

  /* ==========================================================================
     7. FAQ ACCORDION
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all other items for clean accordion UX
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('open');
        otherItem.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ==========================================================================
     8. QUERY CONTACT FORM & DIRECT EMAIL APP LAUNCHER
     ========================================================================== */
  const contactForm = document.getElementById('project-contact-form');
  const formSubmitBtn = document.getElementById('form-submit-btn');
  const formFeedback = document.getElementById('form-feedback');

  function getValidatedFormData() {
    const nameInput = document.getElementById('client_name');
    const emailInput = document.getElementById('client_email');
    const companyInput = document.getElementById('company_website');
    const serviceSelect = document.getElementById('service_interest');
    const detailsInput = document.getElementById('project_details');

    const name = nameInput?.value.trim() || '';
    const email = emailInput?.value.trim() || '';
    const company = companyInput?.value.trim() || 'Not specified';
    const service = serviceSelect?.value || 'Complete Business Website';
    const details = detailsInput?.value.trim() || '';

    if (!name) {
      showToast('Please enter your name', 'fa-exclamation-circle');
      nameInput?.focus();
      return null;
    }
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'fa-exclamation-circle');
      emailInput?.focus();
      return null;
    }
    if (!details) {
      showToast('Please briefly describe your project requirement', 'fa-exclamation-circle');
      detailsInput?.focus();
      return null;
    }

    return { name, email, company, service, details };
  }

  function generateEmailDraft(data) {
    const subject = `🚀 Web Design Query from ${data.name} - ${data.service}`;
    const body = `Hi Webnora Team,\n\nI would like to discuss a web design project with Webnora Studio.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📋 CLIENT QUERY DETAILS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n• Client Name: ${data.name}\n• Email Address: ${data.email}\n• Company / Website: ${data.company}\n• Selected Package / Service: ${data.service}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📝 PROJECT SCOPE & REQUIREMENTS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${data.details}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nSent via Webnora Website`;
    
    return { subject, body };
  }

  // SINGLE PRIMARY BUTTON SUBMIT: Opens default Email App / Webmail with pre-filled query
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = getValidatedFormData();
    if (!data) return;

    const { subject, body } = generateEmailDraft(data);
    const encSubject = encodeURIComponent(subject);
    const encBody = encodeURIComponent(body);
    const mailtoUrl = `mailto:hellowebnora@gmail.com?subject=${encSubject}&body=${encBody}`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=hellowebnora@gmail.com&su=${encSubject}&body=${encBody}`;

    openEmailClient('hellowebnora@gmail.com', subject, body);

    // Display interactive status box with instant 1-click manual trigger buttons
    if (formFeedback) {
      formFeedback.className = 'form-feedback-box success';
      formFeedback.innerHTML = `
        <i class="fas fa-paper-plane" style="font-size: 1.5rem; color: var(--text-primary); margin-top: 2px;"></i>
        <div style="width: 100%;">
          <strong style="font-size: 1rem; color: var(--text-primary);">Opening Default Gmail App / Webmail...</strong>
          <p style="margin: 0.4rem 0 0.8rem 0; font-size: 0.88rem; color: var(--text-secondary);">
            Your query has been formatted and addressed to <strong>hellowebnora@gmail.com</strong>.
          </p>
          <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
            <a href="${mailtoUrl}" class="btn btn-emerald btn-sm" style="text-decoration:none;">
              <i class="fas fa-envelope"></i> Open Native Gmail App
            </a>
            <a href="${gmailUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm" style="text-decoration:none;">
              <i class="fab fa-google"></i> Open Web Gmail
            </a>
          </div>
        </div>
      `;
      formFeedback.style.display = 'flex';
      formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  /* ==========================================================================
     9. CLICK-TO-COPY CONTACT BUTTONS
     ========================================================================== */
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy');
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied "${text}" to clipboard!`, 'fa-check');
        btn.innerHTML = '<i class="fas fa-check text-emerald"></i>';
        setTimeout(() => {
          btn.innerHTML = '<i class="fas fa-copy"></i>';
        }, 2000);
      }).catch(() => {
        showToast('Could not copy to clipboard', 'fa-times');
      });
    });
  });

  /* ==========================================================================
     10. SMOOTH SCROLL SPY & ACTIVE NAV HIGHLIGHT
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    desktopNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // Package booking CTA button links handler (selects package in dropdown & smooth scrolls to contact)
  const packageCtas = document.querySelectorAll('.package-cta');
  const serviceDropdown = document.getElementById('service_interest');

  packageCtas.forEach(cta => {
    cta.addEventListener('click', () => {
      const pkgName = cta.getAttribute('data-package') || '';
      if (serviceDropdown && pkgName) {
        for (let i = 0; i < serviceDropdown.options.length; i++) {
          if (serviceDropdown.options[i].text.includes(pkgName) || serviceDropdown.options[i].value.includes(pkgName)) {
            serviceDropdown.selectedIndex = i;
            break;
          }
        }
      }
    });
  });

  // Smooth scroll and focus on contact form when clicking links pointing to #contact
  document.querySelectorAll('a[href="#contact"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const contactSection = document.getElementById('contact');
      const nameInput = document.getElementById('client_name');
      if (contactSection) {
        setTimeout(() => {
          nameInput?.focus();
        }, 500);
      }
    });
  });

  // Smart Email Link Handler: Launches native Gmail app on mobile, Web Gmail on desktop
  document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', (e) => {
      // On mobile devices, allow default browser mailto action to launch installed native Gmail App directly
      if (isMobileDevice()) {
        return;
      }
      
      e.preventDefault();
      const mailtoUrl = link.getAttribute('href');
      const email = 'hellowebnora@gmail.com';
      
      let subject = '';
      let body = '';
      
      const queryPart = mailtoUrl.split('?')[1];
      if (queryPart) {
        const params = new URLSearchParams(queryPart);
        subject = params.get('subject') || '';
        body = params.get('body') || '';
      }
      
      openEmailClient(email, subject, body);
    });
  });

});
