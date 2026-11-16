// Main JavaScript for Mahadev Ashram Charitable Trust Website

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initCounters();
  initDonationSuite();
  initGalleryCarouselAndLightbox();
  initFaqAccordion();
  initModals();
  initForms();
  initScrollTop();
  initWorkFilter();
});

// Animated Counter for Stats Banner
function initCounters() {
  const counterEls = document.querySelectorAll('.counter-num');
  if (!counterEls.length) return;

  let started = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        counterEls.forEach(el => {
          const target = parseInt(el.getAttribute('data-target'), 10);
          const duration = 1600;
          const stepTime = 25;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              el.textContent = target.toLocaleString('en-IN');
              clearInterval(timer);
            } else {
              el.textContent = Math.floor(current).toLocaleString('en-IN');
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.25 });

  const section = document.getElementById('stats-counter');
  if (section) observer.observe(section);
}

// Toast notification helper
function showToast(message, type = 'success') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  
  const icon = type === 'success' 
    ? `<svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`
    : `<svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`;

  toast.innerHTML = `
    <div class="flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-slate-700">
      ${icon}
      <span class="text-sm font-medium">${message}</span>
    </div>
  `;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// Copy to clipboard helper
window.copyToClipboard = function(text, label) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`${label || 'Details'} copied to clipboard!`);
  }).catch(() => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast(`${label || 'Details'} copied!`);
  });
};

// Mobile & Off-Canvas Menu
function initMobileMenu() {
  const menuBtn = document.getElementById('hamburger-btn');
  const closeBtn = document.getElementById('drawer-close');
  const menuDrawer = document.getElementById('nav-drawer');
  const overlay = document.getElementById('drawer-overlay');
  const navLinks = document.querySelectorAll('.drawer-nav-link');

  function openMenu() {
    menuDrawer?.classList.remove('translate-x-full');
    overlay?.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menuDrawer?.classList.add('translate-x-full');
    overlay?.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (menuBtn) menuBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

// Gallery Carousel & Lightbox
function initGalleryCarouselAndLightbox() {
  const prevBtn = document.getElementById('gallery-prev-btn');
  const nextBtn = document.getElementById('gallery-next-btn');
  const track = document.getElementById('gallery-track');
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  if (track && prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -320, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: 320, behavior: 'smooth' });
    });
  }

  // Lightbox click for any gallery card
  document.querySelectorAll('.gallery-card-item').forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const title = card.getAttribute('data-caption') || 'Mahadev Ashram Seva';
      if (img && lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        if (lightboxCaption) lightboxCaption.textContent = title;
        lightbox.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightbox?.classList.add('hidden');
      document.body.style.overflow = '';
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.add('hidden');
        document.body.style.overflow = '';
      }
    });
  }
}

// Smart Donation Suite
function initDonationSuite() {
  const tierPills = document.querySelectorAll('.tier-pill');
  const customInput = document.getElementById('custom-donation-input');
  const impactText = document.getElementById('tier-impact-description');
  const payUpiBtn = document.getElementById('pay-upi-btn');
  const qrAmountDisplay = document.getElementById('qr-modal-amount');

  const impactData = {
    '500': {
      title: '10 Nutritious Meals for the Elderly & Destitute',
      desc: 'Provides fresh warm khichdi, roti, sabzi, and clean water to destitute elders and homeless individuals in our community drives.',
      icon: '🍲'
    },
    '1100': {
      title: 'Full Vidya School Kit for an Underprivileged Child',
      desc: 'Covers notebook sets, school backpack, geometry box, stationery, and winter sweater for a child in need.',
      icon: '🎒'
    },
    '2500': {
      title: 'Free Diagnostic Screening & Medicines for 5 Patients',
      desc: 'Supplies essential hypertension, diabetes, and infection medicines, eye drops, and basic health tests in rural health camps.',
      icon: '🩺'
    },
    '5000': {
      title: '1 Month of Women’s Vocational Tailoring Materials',
      desc: 'Funds sewing machine accessories, fabrics, and craft training materials to help 3 women become financially independent.',
      icon: '🧵'
    },
    '11000': {
      title: 'Sponsor an Entire Community Medical Camp',
      desc: 'Enables our medical team to deploy a full medical camp, providing free consultations, tests, and medicines to over 200 villagers.',
      icon: '🏥'
    }
  };

  let currentAmount = 1100;

  function updateDonation(amount) {
    currentAmount = amount;
    const info = impactData[amount] || {
      title: `Direct Seva Contribution of ₹${Number(amount).toLocaleString('en-IN')}`,
      desc: 'Your generous contribution will be immediately deployed where the need is most urgent across our healthcare, education, or food distribution programs.',
      icon: '❤️'
    };

    if (impactText) {
      impactText.innerHTML = `
        <span class="block text-orange-600 font-bold text-sm mb-1">${info.icon} ${info.title}</span>
        <span class="text-slate-600 text-xs leading-relaxed">${info.desc}</span>
      `;
    }

    const upiUrl = `upi://pay?pa=339438766258690@cnrb&pn=MAHADEV%20ASHRAM%20CHARITABLE%20TRUST&am=${amount}&cu=INR&tn=Donation%20for%20Seva`;
    if (payUpiBtn) {
      payUpiBtn.setAttribute('href', upiUrl);
    }
    if (qrAmountDisplay) {
      qrAmountDisplay.textContent = `₹${Number(amount).toLocaleString('en-IN')}`;
    }
  }

  tierPills.forEach(pill => {
    pill.addEventListener('click', () => {
      tierPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const val = pill.getAttribute('data-amount');
      if (customInput) customInput.value = '';
      updateDonation(val);
    });
  });

  if (customInput) {
    customInput.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      tierPills.forEach(p => p.classList.remove('active'));
      if (val && val > 0) {
        updateDonation(val);
      } else {
        updateDonation(0);
      }
    });
  }

  updateDonation(1100);
}

// FAQ Accordion
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon');

    if (question && answer) {
      question.addEventListener('click', () => {
        const isOpen = answer.classList.contains('open');
        document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
        document.querySelectorAll('.faq-icon').forEach(ic => ic.classList.remove('rotate-180'));

        if (!isOpen) {
          answer.classList.add('open');
          if (icon) icon.classList.add('rotate-180');
        }
      });
    }
  });
}

// Modals
function initModals() {
  window.openModal = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeModal = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.add('hidden');
      document.body.style.overflow = '';
    }
  };

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.app-modal:not(.hidden)').forEach(modal => {
        modal.classList.add('hidden');
      });
      document.body.style.overflow = '';
    }
  });
}

// Forms & Receipt Slip Generator
function initForms() {
  const volunteerForm = document.getElementById('volunteer-form');
  if (volunteerForm) {
    volunteerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('vol-name')?.value;
      closeModal('volunteer-modal');
      volunteerForm.reset();
      showToast(`Dhanyawad ${name || 'ji'}! Your volunteer application has been submitted.`);
    });
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name')?.value;
      contactForm.reset();
      showToast(`Thank you, ${name || 'friend'}! We have received your message.`);
    });
  }
}

// Scroll to Top Button Visibility
function initScrollTop() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });
}

// Work Initiatives Filter Tabs
function initWorkFilter() {
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  const items = document.querySelectorAll('.work-item-card');
  if (!filterBtns.length || !items.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      items.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}
