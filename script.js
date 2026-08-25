/**
 * VB PORTFOLIO & CLIENT ACQUISITION - INTERACTIVE LOGIC
 * Author: Vedant (VB) - Freelance Web Developer, Pune, Maharashtra
 * Email: contacttovedant5@gmail.com
 */

document.addEventListener('DOMContentLoaded', () => {
  // Global App State (Affordable Starter Pricing for New Web Designer)
  const state = {
    currency: 'INR', // 'INR' or 'USD'
    estimator: {
      type: 'landing',
      typeName: 'Landing Page',
      basePriceINR: 2999,
      basePriceUSD: 49,
      pages: 3,
      addonsTotalINR: 599, // speed_opt checked by default
      addonsTotalUSD: 9,
      addonsList: ['Hyper Performance & Speed'],
      multiplier: 1.0,
      timelineName: 'Standard (1 - 2 weeks)',
      finalPriceINR: 3598,
      finalPriceUSD: 58
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

  // Check saved theme (default light white & purple)
  const savedTheme = localStorage.getItem('vb_theme') || 'light';
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('vb_theme', newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'White & Purple'} Theme`, newTheme === 'dark' ? 'fa-moon' : 'fa-sun', 2000);
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
     4. CURRENCY SWITCHER
     ========================================================================== */
  const currencyBtns = document.querySelectorAll('.currency-btn');
  const priceValues = document.querySelectorAll('.price-val');
  const currencySymbols = document.querySelectorAll('.currency-symbol');

  currencyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currencyBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedCurrency = btn.getAttribute('data-currency');
      state.currency = selectedCurrency;

      // Update package price cards
      priceValues.forEach(el => {
        const inr = el.getAttribute('data-inr');
        const usd = el.getAttribute('data-usd');
        el.textContent = selectedCurrency === 'INR' ? inr : usd;
      });

      currencySymbols.forEach(el => {
        el.textContent = selectedCurrency === 'INR' ? '₹' : '$';
      });

      // Update estimator price display
      updateEstimator();
    });
  });

  /* ==========================================================================
     5. PROJECT COST ESTIMATOR (AFFORDABLE BEGINNER RATES)
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
      state.estimator.basePriceINR = parseFloat(selectedType.getAttribute('data-base-inr')) || 9999;
      state.estimator.basePriceUSD = parseFloat(selectedType.getAttribute('data-base-usd')) || 199;
      
      const titleSpan = selectedType.closest('.estimator-radio-card')?.querySelector('.option-title');
      state.estimator.typeName = titleSpan ? titleSpan.textContent.trim() : 'Landing Page';
    }

    // 2. Page Count
    const pageVal = parseInt(pageSlider?.value || 3, 10);
    state.estimator.pages = pageVal;
    if (pageCountVal) {
      pageCountVal.textContent = pageVal === 1 ? '1 Single Page' : `${pageVal} Custom Pages`;
    }

    // Extra page cost: For >1 page on landing or >3 on business
    let extraPages = Math.max(0, pageVal - (state.estimator.type === 'landing' ? 1 : 3));
    let extraPageCostINR = extraPages * 1200;
    let extraPageCostUSD = extraPages * 20;

    // 3. Addons
    let addonsTotalINR = 0;
    let addonsTotalUSD = 0;
    const activeAddonNames = [];

    addonCheckboxes.forEach(cb => {
      if (cb.checked) {
        addonsTotalINR += parseFloat(cb.getAttribute('data-inr')) || 0;
        addonsTotalUSD += parseFloat(cb.getAttribute('data-usd')) || 0;
        const nameEl = cb.closest('.addon-checkbox-card')?.querySelector('.addon-name');
        if (nameEl) activeAddonNames.push(nameEl.textContent.trim());
      }
    });

    state.estimator.addonsTotalINR = addonsTotalINR;
    state.estimator.addonsTotalUSD = addonsTotalUSD;
    state.estimator.addonsList = activeAddonNames;

    // 4. Timeline Multiplier
    const selectedSpeed = document.querySelector('input[name="delivery_speed"]:checked');
    const multiplier = parseFloat(selectedSpeed?.getAttribute('data-multiplier') || 1.0);
    state.estimator.multiplier = multiplier;
    state.estimator.timelineName = multiplier > 1.0 ? '⚡ Express Priority (3-5 Days)' : 'Standard (1-2 Weeks)';

    // Compute Total
    const subtotalINR = state.estimator.basePriceINR + extraPageCostINR + addonsTotalINR;
    const subtotalUSD = state.estimator.basePriceUSD + extraPageCostUSD + addonsTotalUSD;

    const finalINR = Math.round(subtotalINR * multiplier);
    const finalUSD = Math.round(subtotalUSD * multiplier);

    state.estimator.finalPriceINR = finalINR;
    state.estimator.finalPriceUSD = finalUSD;

    // Update UI Elements
    if (summaryCurrencyUnit) {
      summaryCurrencyUnit.textContent = state.currency === 'INR' ? '₹' : '$';
    }

    if (calculatedPriceDisplay) {
      calculatedPriceDisplay.textContent = state.currency === 'INR' 
        ? finalINR.toLocaleString('en-IN') 
        : finalUSD.toLocaleString('en-US');
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

  // Send Estimator Scope via Email (Direct to Gmail Compose)
  sendEstimateEmailBtn?.addEventListener('click', () => {
    const est = state.estimator;
    const priceStr = state.currency === 'INR' ? `₹${est.finalPriceINR.toLocaleString('en-IN')}` : `$${est.finalPriceUSD.toLocaleString('en-US')}`;
    const addonsStr = est.addonsList.length > 0 ? est.addonsList.join(', ') : 'Standard Features';

    const subject = `Project Proposal Scope - ${est.typeName} (${priceStr})`;
    const body = `Hi Vedant (VB),\n\nI calculated a project scope on your portfolio website:\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📋 ESTIMATED PROJECT SCOPE\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n• Project Type: ${est.typeName}\n• Estimated Pages: ${est.pages}\n• Selected Add-ons: ${addonsStr}\n• Timeline Preference: ${est.timelineName}\n• Total Estimated Cost: ${priceStr}\n\nPlease review this scope and let me know how we can get started!`;

    const encSubject = encodeURIComponent(subject);
    const encBody = encodeURIComponent(body);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=contacttovedant5@gmail.com&su=${encSubject}&body=${encBody}`;

    window.open(gmailUrl, '_blank');
    showToast('Opening Gmail with calculated scope pre-filled...', 'fa-envelope-open', 4000);
  });

  // Copy Estimate Summary to Clipboard
  copyEstimateBtn?.addEventListener('click', () => {
    const est = state.estimator;
    const priceStr = state.currency === 'INR' ? `₹${est.finalPriceINR.toLocaleString('en-IN')}` : `$${est.finalPriceUSD.toLocaleString('en-US')}`;
    const textToCopy = `VB Portfolio Scope Estimate:
Type: ${est.typeName}
Pages: ${est.pages}
Add-ons: ${est.addonsList.join(', ') || 'None'}
Timeline: ${est.timelineName}
Estimated Cost: ${priceStr}
Contact Email: contacttovedant5@gmail.com`;

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
      title: 'Apex Flow — SaaS Analytics Platform',
      category: 'High-Converting Landing Page',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&auto=format&fit=crop&q=80',
      client: 'Apex Analytics Inc.',
      timeline: '4 Days Delivery',
      metrics: ['+280% Signups in Month 1', '0.5s First Contentful Paint', '99/100 Mobile PageSpeed'],
      challenge: 'The client was running paid Google Ads to an outdated, slow website with a high 74% bounce rate and dismal 1.8% conversion.',
      solution: 'We engineered a high-velocity landing page with value-first copywriting, an interactive pricing calculator, and seamless lead capture.',
      stack: ['Next.js 14', 'Tailwind CSS', 'Framer Motion', 'Vercel Edge CDN'],
      testimonial: '"Vedant completely changed our acquisition economics. Our cost per signup dropped by 62% in the very first week."'
    },
    2: {
      title: 'Zenith Apparel — Modern D2C Fashion Store',
      category: 'E-Commerce Store & Checkout',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&auto=format&fit=crop&q=80',
      client: 'Zenith Fashion House',
      timeline: '1.5 Weeks Delivery',
      metrics: ['₹18L+ Monthly Sales', '1-Click UPI & Razorpay Checkout', '42% Higher Mobile Orders'],
      challenge: 'Their existing Shopify theme was bloated with third-party plugins causing slow 4.5s load times and high cart abandonment.',
      solution: 'Built a lightning-fast custom storefront with instant product search, optimized cart drawer, automatic coupon application, and automated invoice delivery.',
      stack: ['React', 'Node.js Express', 'Razorpay Payment Gateway', 'Cloudflare CDN'],
      testimonial: '"The checkout speed is astonishing. Customers constantly compliment how effortless ordering has become."'
    },
    3: {
      title: 'Pulse Health Clinic — Medical Practice Portal',
      category: 'Business Website & Local SEO',
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1000&auto=format&fit=crop&q=80',
      client: 'Pulse Medical Center (Pune)',
      timeline: '6 Days Delivery',
      metrics: ['#1 Google Rank for Pune Clinic', '140+ Direct Monthly Appointments', 'Zero Hosting Glitches'],
      challenge: 'Patients were having trouble finding doctor schedules and booking appointments on mobile, relying heavily on slow phone reception.',
      solution: 'Designed a clean, calming UI with instant doctor calendar booking, automated email appointment reminders, and localized Google Maps Schema SEO.',
      stack: ['HTML5/CSS3', 'Modern JS ES6+', 'Automated Booking Engine', 'Google Schema'],
      testimonial: '"Patients love booking online and we are ranking on page 1 across Kothrud and Baner in Pune."'
    },
    4: {
      title: 'FinPulse — Financial SaaS Dashboard',
      category: 'Custom Web Application',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80',
      client: 'FinPulse Tech',
      timeline: '2 Weeks Delivery',
      metrics: ['10,000+ Active Users', 'Sub-100ms API Latency', 'Multi-currency support'],
      challenge: 'Needed an intuitive, lag-free analytics dashboard capable of rendering complex real-time cashflow charts and generating instant PDF invoices.',
      solution: 'Built a modular TypeScript application with responsive chart visualizations, role-based authentication, and automated PDF exports.',
      stack: ['React 18', 'TypeScript', 'Chart.js', 'Node.js', 'PostgreSQL'],
      testimonial: '"Vedant is rare — a developer who understands both hardcore code architecture and sleek aesthetic design."'
    },
    5: {
      title: 'Nova Living — Luxury Real Estate Showcase',
      category: 'High-Ticket Business Website',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1000&auto=format&fit=crop&q=80',
      client: 'Nova Realty Developers',
      timeline: '7 Days Delivery',
      metrics: ['₹4.2 Cr Project Bookings', 'Virtual Floor Plan Tours', 'Direct Lead Engine'],
      challenge: 'Needed a premier digital brochure to showcase high-net-worth villas with interactive neighborhood insights and fast lead capture.',
      solution: 'Crafted an editorial-grade real estate showcase with ultra-high-resolution asset optimization, virtual walk-throughs, and automated inquiry distribution.',
      stack: ['Next.js', 'CSS Grid', 'Mapbox GL', 'Technical SEO'],
      testimonial: '"High-net-worth buyers were thoroughly impressed with the presentation and speed of our project portal."'
    },
    6: {
      title: 'Taste Of Pune — Cloud Kitchen Direct Ordering',
      category: 'Food Delivery & Online Store',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop&q=80',
      client: 'Taste Of Pune Hospitality',
      timeline: '8 Days Delivery',
      metrics: ['Saved 30% Swiggy/Zomato Commissions', 'Instant UPI QR Checkout', 'Direct Digital Menu'],
      challenge: 'Excessive 30% commission fees on third-party food delivery aggregators were eating into daily restaurant profits.',
      solution: 'Created a direct online ordering portal allowing customers to order in 3 clicks with instant UPI pay and automated digital kitchen tickets.',
      stack: ['JavaScript', 'UPI Deep-links', 'Order Notification System', 'Express Backend'],
      testimonial: '"We saved over ₹80,000 in delivery commissions in our very first month alone."'
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
        <a href="mailto:contacttovedant5@gmail.com?subject=Inquiry%20for%20Project%20like%20${encodeURIComponent(data.title)}&body=Hi%20Vedant,%0A%0AI%20saw%20your%20case%20study%20for%20${encodeURIComponent(data.title)}%20and%20I%20would%20like%20a%20similar%20website%20built%20for%20my%20business.%0A%0APlease%20let%20me%20know%20your%20availability%20and%20timeline." class="btn btn-emerald btn-block btn-lg" onclick="document.getElementById('case-study-modal').classList.remove('open'); document.body.style.overflow='';">
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
    const body = `Hi Vedant (VB),\n\nI would like to discuss a web design project with you.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📋 CLIENT QUERY DETAILS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n• Client Name: ${data.name}\n• Email Address: ${data.email}\n• Company / Website: ${data.company}\n• Selected Package / Service: ${data.service}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📝 PROJECT SCOPE & REQUIREMENTS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${data.details}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📍 Location: Pune / Remote Client\nSent via VB Portfolio Website`;
    
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
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=contacttovedant5@gmail.com&su=${encSubject}&body=${encBody}`;

    // Directly open Gmail in a new tab
    window.open(gmailUrl, '_blank');

    showToast('Opening Gmail with your query pre-filled...', 'fa-envelope-open', 4000);

    // Display interactive status box with instant 1-click manual trigger buttons
    if (formFeedback) {
      formFeedback.className = 'form-feedback-box success';
      formFeedback.innerHTML = `
        <i class="fas fa-paper-plane" style="font-size: 1.5rem; color: var(--purple-600); margin-top: 2px;"></i>
        <div style="width: 100%;">
          <strong style="font-size: 1rem; color: var(--text-primary);">Opening Gmail with Your Query...</strong>
          <p style="margin: 0.4rem 0 0.8rem 0; font-size: 0.88rem; color: var(--text-secondary);">
            Your query has been formatted and addressed to <strong>contacttovedant5@gmail.com</strong>.
          </p>
          <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
            <a href="${gmailUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-emerald btn-sm" style="text-decoration:none;">
              <i class="fab fa-google"></i> If it did not open, click here to open Gmail
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

  // Intercept all mailto links and open them directly in Gmail Web Compose in the browser
  document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const mailtoUrl = link.getAttribute('href');
      const email = 'contacttovedant5@gmail.com';
      
      let subject = '';
      let body = '';
      
      const queryPart = mailtoUrl.split('?')[1];
      if (queryPart) {
        const params = new URLSearchParams(queryPart);
        subject = params.get('subject') || '';
        body = params.get('body') || '';
      }
      
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      window.open(gmailUrl, '_blank');
      showToast('Opening Gmail in your browser...', 'fa-envelope-open', 3500);
    });
  });

});
