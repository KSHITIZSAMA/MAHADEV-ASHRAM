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
  initAdminAuthAndMediaUpload();
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

  // Delegated click handler for gallery items, video modals, and admin delete buttons
  document.addEventListener('click', (e) => {
    // 1. Delete button clicked
    const delBtn = e.target.closest('.admin-delete-btn');
    if (delBtn) {
      e.preventDefault();
      e.stopPropagation();
      const id = delBtn.getAttribute('data-delete-id');
      if (id && window.deleteCustomMedia) {
        window.deleteCustomMedia(id);
      }
      return;
    }

    // 2. Gallery card or grid item clicked
    const card = e.target.closest('.gallery-card-item, .gallery-grid-item');
    if (card) {
      const mediaType = card.getAttribute('data-media-type');
      if (mediaType === 'video') {
        const videoSrc = card.getAttribute('data-video-src');
        const youtubeId = card.getAttribute('data-youtube-id');
        const caption = card.getAttribute('data-caption') || 'Mahadev Ashram Seva Video';
        if (window.openVideoModal) {
          window.openVideoModal(videoSrc, caption, !!youtubeId, youtubeId);
        }
      } else {
        const img = card.querySelector('img');
        const title = card.getAttribute('data-caption') || 'Mahadev Ashram Seva';
        if (img && lightbox && lightboxImg) {
          lightboxImg.src = img.src;
          if (lightboxCaption) lightboxCaption.textContent = title;
          lightbox.classList.remove('hidden');
          document.body.style.overflow = 'hidden';
        }
      }
    }
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

// Work & Gallery Filter Tabs
function initWorkFilter() {
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      const items = document.querySelectorAll('.work-item-card, .gallery-grid-item');
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

// ==================== TRUSTEE ADMIN AUTH & MEDIA UPLOAD SUITE ====================
function initAdminAuthAndMediaUpload() {
  const AUTH_KEY = 'mahadev_admin_auth';
  const STORAGE_KEY = 'mahadev_custom_gallery_media';
  const VALID_PASSCODES = ['mahadev2026', 'trustee2026', 'mahadev', 'admin123', 'trustee'];

  // Cache modal elements
  const authModal = document.getElementById('admin-auth-modal');
  const authForm = document.getElementById('admin-auth-form');
  const passInput = document.getElementById('admin-passcode-input');
  const togglePassBtn = document.getElementById('toggle-passcode-visibility');
  const authCloseBtn = document.getElementById('admin-auth-close-btn');
  const authErrorMsg = document.getElementById('auth-error-msg');
  const authErrorText = document.getElementById('auth-error-text');
  const authDot = document.getElementById('auth-status-dot');

  const uploadModal = document.getElementById('upload-media-modal');
  const uploadForm = document.getElementById('upload-media-form');
  const uploadCloseBtn = document.getElementById('upload-media-close-btn');
  const logoutBtn = document.getElementById('admin-logout-btn');

  const photoDropzone = document.getElementById('photo-dropzone');
  const photoFileInput = document.getElementById('photo-file-input');
  const photoUrlInput = document.getElementById('photo-url-input');
  const photoPreviewWrap = document.getElementById('photo-preview-wrap');
  const photoPreviewImg = document.getElementById('photo-preview-img');
  const photoDropPrompt = document.getElementById('photo-dropzone-prompt');
  const removePhotoBtn = document.getElementById('remove-photo-btn');

  const videoDropzone = document.getElementById('video-dropzone');
  const videoFileInput = document.getElementById('video-file-input');
  const videoUrlInput = document.getElementById('video-url-input');
  const videoPreviewWrap = document.getElementById('video-preview-wrap');
  const videoPreviewPlayer = document.getElementById('video-preview-player');
  const videoDropPrompt = document.getElementById('video-dropzone-prompt');
  const removeVideoBtn = document.getElementById('remove-video-btn');

  const photoSec = document.getElementById('photo-input-section');
  const videoSec = document.getElementById('video-input-section');
  const typePhotoLabel = document.getElementById('type-photo-label');
  const typeVideoLabel = document.getElementById('type-video-label');

  const videoModal = document.getElementById('video-player-modal');
  const videoModalClose = document.getElementById('video-modal-close');
  const videoContainer = document.getElementById('video-container');
  const videoModalCaption = document.getElementById('video-modal-caption');

  let currentPhotoData = null;
  let currentVideoData = null;

  function isAdminAuthenticated() {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
  }

  function updateAuthUI() {
    const isAuth = isAdminAuthenticated();
    if (authDot) {
      if (isAuth) {
        authDot.classList.remove('hidden');
      } else {
        authDot.classList.add('hidden');
      }
    }
    document.querySelectorAll('.admin-delete-btn').forEach(btn => {
      btn.style.display = isAuth ? 'flex' : 'none';
    });
  }

  function openAuthModal() {
    if (authModal) {
      authModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      if (passInput) {
        passInput.value = '';
        passInput.focus();
      }
      if (authErrorMsg) authErrorMsg.classList.add('hidden');
    }
  }

  function closeAuthModal() {
    if (authModal) {
      authModal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  function openUploadModal() {
    if (uploadModal) {
      uploadModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      updateAuthUI();
    }
  }

  function closeUploadModal() {
    if (uploadModal) {
      uploadModal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  // Bind all Add Media trigger buttons (visible to everyone)
  document.querySelectorAll('.add-media-trigger-btn, #add-media-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (isAdminAuthenticated()) {
        openUploadModal();
      } else {
        openAuthModal();
      }
    });
  });

  // Close buttons
  if (authCloseBtn) authCloseBtn.addEventListener('click', closeAuthModal);
  if (uploadCloseBtn) uploadCloseBtn.addEventListener('click', closeUploadModal);

  // Backdrop clicks
  if (authModal) {
    authModal.addEventListener('click', (e) => {
      if (e.target === authModal) closeAuthModal();
    });
  }
  if (uploadModal) {
    uploadModal.addEventListener('click', (e) => {
      if (e.target === uploadModal) closeUploadModal();
    });
  }

  // Toggle Passcode Visibility
  if (togglePassBtn && passInput) {
    togglePassBtn.addEventListener('click', () => {
      const isPass = passInput.type === 'password';
      passInput.type = isPass ? 'text' : 'password';
      togglePassBtn.textContent = isPass ? '🙈' : '👁️';
    });
  }

  // Admin Auth Form submission
  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = (passInput?.value || '').trim().toLowerCase();
      if (VALID_PASSCODES.includes(code)) {
        sessionStorage.setItem(AUTH_KEY, 'true');
        closeAuthModal();
        updateAuthUI();
        showToast('Dhanyawad Trustee Ji! Admin authentication verified.');
        openUploadModal();
      } else {
        if (authErrorMsg) {
          authErrorMsg.classList.remove('hidden');
          if (authErrorText) authErrorText.textContent = 'Incorrect passcode. Media uploading is restricted to authorized trustees only.';
        }
        if (passInput) {
          passInput.classList.add('border-red-500');
          setTimeout(() => passInput.classList.remove('border-red-500'), 2000);
        }
      }
    });
  }

  // Logout / Lock session
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem(AUTH_KEY);
      closeUploadModal();
      updateAuthUI();
      showToast('Trustee admin session locked.', 'info');
    });
  }

  // Media Type Switching (Photo vs Video)
  document.querySelectorAll('input[name="mediaType"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const isPhoto = radio.value === 'photo';
      if (photoSec) photoSec.classList.toggle('hidden', !isPhoto);
      if (videoSec) videoSec.classList.toggle('hidden', isPhoto);

      if (typePhotoLabel) {
        typePhotoLabel.classList.toggle('active', isPhoto);
        typePhotoLabel.classList.toggle('border-orange-500', isPhoto);
        typePhotoLabel.classList.toggle('bg-orange-50/50', isPhoto);
      }
      if (typeVideoLabel) {
        typeVideoLabel.classList.toggle('active', !isPhoto);
        typeVideoLabel.classList.toggle('border-orange-500', !isPhoto);
        typeVideoLabel.classList.toggle('bg-orange-50/50', !isPhoto);
      }
    });
  });

  // Photo File Dropzone & Selection
  if (photoDropzone && photoFileInput) {
    photoDropzone.addEventListener('click', (e) => {
      if (e.target !== removePhotoBtn && !e.target.closest('#remove-photo-btn')) {
        photoFileInput.click();
      }
    });

    ['dragover', 'dragenter'].forEach(ev => {
      photoDropzone.addEventListener(ev, (e) => {
        e.preventDefault();
        photoDropzone.classList.add('border-orange-500', 'bg-orange-50/50');
      });
    });

    ['dragleave', 'drop'].forEach(ev => {
      photoDropzone.addEventListener(ev, (e) => {
        e.preventDefault();
        photoDropzone.classList.remove('border-orange-500', 'bg-orange-50/50');
      });
    });

    photoDropzone.addEventListener('drop', (e) => {
      const files = e.dataTransfer?.files;
      if (files && files[0] && files[0].type.startsWith('image/')) {
        handlePhotoFile(files[0]);
      }
    });

    photoFileInput.addEventListener('change', () => {
      if (photoFileInput.files && photoFileInput.files[0]) {
        handlePhotoFile(photoFileInput.files[0]);
      }
    });
  }

  function handlePhotoFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      currentPhotoData = e.target.result;
      if (photoPreviewImg) photoPreviewImg.src = currentPhotoData;
      if (photoPreviewWrap) photoPreviewWrap.classList.remove('hidden');
      if (photoDropPrompt) photoDropPrompt.classList.add('hidden');
    };
    reader.readAsDataURL(file);
  }

  if (removePhotoBtn) {
    removePhotoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentPhotoData = null;
      if (photoFileInput) photoFileInput.value = '';
      if (photoPreviewWrap) photoPreviewWrap.classList.add('hidden');
      if (photoDropPrompt) photoDropPrompt.classList.remove('hidden');
    });
  }

  // Photo URL live preview
  if (photoUrlInput) {
    photoUrlInput.addEventListener('input', () => {
      const url = photoUrlInput.value.trim();
      if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
        currentPhotoData = url;
        if (photoPreviewImg) photoPreviewImg.src = url;
        if (photoPreviewWrap) photoPreviewWrap.classList.remove('hidden');
        if (photoDropPrompt) photoDropPrompt.classList.add('hidden');
      }
    });
  }

  // Video File Dropzone & Selection
  if (videoDropzone && videoFileInput) {
    videoDropzone.addEventListener('click', (e) => {
      if (e.target !== removeVideoBtn && !e.target.closest('#remove-video-btn')) {
        videoFileInput.click();
      }
    });

    ['dragover', 'dragenter'].forEach(ev => {
      videoDropzone.addEventListener(ev, (e) => {
        e.preventDefault();
        videoDropzone.classList.add('border-red-500', 'bg-red-50/50');
      });
    });

    ['dragleave', 'drop'].forEach(ev => {
      videoDropzone.addEventListener(ev, (e) => {
        e.preventDefault();
        videoDropzone.classList.remove('border-red-500', 'bg-red-50/50');
      });
    });

    videoDropzone.addEventListener('drop', (e) => {
      const files = e.dataTransfer?.files;
      if (files && files[0] && files[0].type.startsWith('video/')) {
        handleVideoFile(files[0]);
      }
    });

    videoFileInput.addEventListener('change', () => {
      if (videoFileInput.files && videoFileInput.files[0]) {
        handleVideoFile(videoFileInput.files[0]);
      }
    });
  }

  function handleVideoFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      currentVideoData = e.target.result;
      if (videoPreviewPlayer) {
        videoPreviewPlayer.src = currentVideoData;
        videoPreviewPlayer.load();
      }
      if (videoPreviewWrap) videoPreviewWrap.classList.remove('hidden');
      if (videoDropPrompt) videoDropPrompt.classList.add('hidden');
    };
    reader.readAsDataURL(file);
  }

  if (removeVideoBtn) {
    removeVideoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentVideoData = null;
      if (videoFileInput) videoFileInput.value = '';
      if (videoPreviewPlayer) {
        videoPreviewPlayer.src = '';
      }
      if (videoPreviewWrap) videoPreviewWrap.classList.add('hidden');
      if (videoDropPrompt) videoDropPrompt.classList.remove('hidden');
    });
  }

  // Helper to extract YouTube ID
  function extractYouTubeId(url) {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
    return match ? match[1] : null;
  }

  // Video URL live preview (YouTube or direct video)
  if (videoUrlInput) {
    videoUrlInput.addEventListener('input', () => {
      const url = videoUrlInput.value.trim();
      const ytId = extractYouTubeId(url);
      if (ytId) {
        currentVideoData = url;
        if (videoPreviewPlayer) {
          videoPreviewPlayer.poster = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
          videoPreviewPlayer.src = '';
        }
        if (videoPreviewWrap) videoPreviewWrap.classList.remove('hidden');
        if (videoDropPrompt) videoDropPrompt.classList.add('hidden');
      } else if (url && (url.endsWith('.mp4') || url.endsWith('.webm') || url.startsWith('http'))) {
        currentVideoData = url;
        if (videoPreviewPlayer) {
          videoPreviewPlayer.poster = '';
          videoPreviewPlayer.src = url;
        }
        if (videoPreviewWrap) videoPreviewWrap.classList.remove('hidden');
        if (videoDropPrompt) videoDropPrompt.classList.add('hidden');
      }
    });
  }

  function getCategoryLabel(cat) {
    const map = {
      kanwar: 'Kanwar Seva',
      food: 'Annadanam',
      health: 'Healthcare',
      education: 'Vidya Drive',
      welfare: 'Elderly & Women'
    };
    return map[cat] || 'Field Seva';
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Render card into grid
  function createGridCard(item) {
    const card = document.createElement('div');
    card.className = 'gallery-grid-item custom-user-media rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group flex flex-col relative';
    card.setAttribute('data-category', item.category);
    card.setAttribute('data-caption', item.caption);
    card.setAttribute('data-media-id', item.id);
    card.setAttribute('data-media-type', item.type);
    if (item.type === 'video') {
      card.setAttribute('data-video-src', item.src);
      if (item.youtubeId) card.setAttribute('data-youtube-id', item.youtubeId);
    }

    const isAuth = isAdminAuthenticated();
    const thumbUrl = item.thumbnail || item.src;

    card.innerHTML = `
      <button type="button" class="admin-delete-btn" title="Delete media" data-delete-id="${item.id}" style="display: ${isAuth ? 'flex' : 'none'};">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
      </button>
      <div class="relative aspect-[4/3] overflow-hidden bg-slate-900">
        <img src="${thumbUrl}" alt="${escapeHtml(item.caption)}" class="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500">
        ${item.type === 'video' ? `
          <div class="video-play-badge">
            <svg class="w-6 h-6 ml-0.5 fill-white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
        ` : ''}
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity"></div>
        <div class="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap pointer-events-none">
          <span class="text-[10px] font-bold uppercase tracking-wider bg-orange-600 text-white px-2.5 py-1 rounded-full shadow">
            ${getCategoryLabel(item.category)}
          </span>
          <span class="text-[9px] font-bold uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-full shadow animate-pulse">
            ${item.type === 'video' ? '🎥 Live Video' : '📸 New Seva'}
          </span>
        </div>
      </div>
      <div class="p-4 flex-grow flex flex-col justify-between bg-white">
        <h4 class="font-bold text-slate-900 text-sm font-hero-serif leading-snug group-hover:text-orange-600 transition-colors">
          ${escapeHtml(item.caption)}
        </h4>
        <p class="text-[11px] text-slate-500 mt-1">${escapeHtml(item.location || 'Noida Seva Corridor')} • ${item.date}</p>
      </div>
    `;

    return card;
  }

  // Render card into horizontal filmstrip track (index.html)
  function createTrackCard(item) {
    const card = document.createElement('div');
    card.className = 'gallery-card-item custom-user-media min-w-[240px] sm:min-w-[260px] lg:min-w-[280px] aspect-[4/3] rounded-sm overflow-hidden shadow-sm bg-slate-900 cursor-pointer relative group shrink-0';
    card.setAttribute('data-caption', item.caption);
    card.setAttribute('data-media-id', item.id);
    card.setAttribute('data-media-type', item.type);
    if (item.type === 'video') {
      card.setAttribute('data-video-src', item.src);
      if (item.youtubeId) card.setAttribute('data-youtube-id', item.youtubeId);
    }

    const isAuth = isAdminAuthenticated();
    const thumbUrl = item.thumbnail || item.src;

    card.innerHTML = `
      <button type="button" class="admin-delete-btn" title="Delete media" data-delete-id="${item.id}" style="display: ${isAuth ? 'flex' : 'none'};">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
      </button>
      <img src="${thumbUrl}" alt="${escapeHtml(item.caption)}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
      ${item.type === 'video' ? `
        <div class="video-play-badge">
          <svg class="w-6 h-6 ml-0.5 fill-white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </div>
      ` : ''}
      <div class="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold uppercase tracking-wider">
        <span>${item.type === 'video' ? 'Watch Video' : 'View Photo'}</span>
      </div>
      <span class="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider bg-orange-600 text-white px-2 py-0.5 rounded shadow pointer-events-none">
        ${item.type === 'video' ? '🎥 Video' : '📸 New'}
      </span>
    `;

    return card;
  }

  // Load stored custom media
  function loadCustomMedia() {
    try {
      const items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const grid = document.getElementById('gallery-grid');
      const track = document.getElementById('gallery-track');

      // Loop backwards to prepend in correct chronological order
      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        if (grid) {
          const card = createGridCard(item);
          grid.insertBefore(card, grid.firstChild);
        }
        if (track) {
          const card = createTrackCard(item);
          track.insertBefore(card, track.firstChild);
        }
      }
    } catch (e) {
      console.warn('Could not parse saved media:', e);
    }
  }

  // Delete media item
  window.deleteCustomMedia = (id) => {
    if (!isAdminAuthenticated()) {
      showToast('Authentication required to delete media.', 'error');
      return;
    }

    if (!confirm('Are you sure you want to delete this media from the gallery?')) {
      return;
    }

    try {
      let items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      items = items.filter(item => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }

    document.querySelectorAll(`[data-media-id="${id}"]`).forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'scale(0.9)';
      el.style.transition = 'all 0.3s ease';
      setTimeout(() => el.remove(), 300);
    });

    showToast('Media removed from live gallery.');
  };

  // Video modal handling
  window.openVideoModal = (src, title, isYouTube, youtubeId) => {
    if (!videoModal || !videoContainer) return;
    if (isYouTube && youtubeId) {
      videoContainer.innerHTML = `
        <iframe src="https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0" 
                title="${escapeHtml(title)}" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen 
                class="w-full h-full border-0">
        </iframe>
      `;
    } else {
      videoContainer.innerHTML = `
        <video src="${src}" controls autoplay class="w-full h-full object-contain bg-black"></video>
      `;
    }
    if (videoModalCaption) videoModalCaption.textContent = title || 'Mahadev Ashram Seva Video';
    videoModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };

  function closeVideoPlayer() {
    if (videoModal) videoModal.classList.add('hidden');
    if (videoContainer) videoContainer.innerHTML = '';
    document.body.style.overflow = '';
  }

  if (videoModalClose) videoModalClose.addEventListener('click', closeVideoPlayer);
  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) closeVideoPlayer();
    });
  }

  // Media Upload Form Submission
  if (uploadForm) {
    uploadForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!isAdminAuthenticated()) {
        closeUploadModal();
        openAuthModal();
        return;
      }

      const mediaType = document.querySelector('input[name="mediaType"]:checked')?.value || 'photo';
      const caption = document.getElementById('media-caption-input')?.value.trim();
      const category = document.getElementById('media-category-select')?.value || 'health';
      const location = document.getElementById('media-location-input')?.value.trim() || 'Noida Seva Corridor, UP';

      if (!caption) {
        showToast('Please enter a caption for the media.', 'error');
        return;
      }

      let mediaSrc = '';
      let youtubeId = null;
      let thumbnailSrc = '';

      if (mediaType === 'photo') {
        const urlInput = photoUrlInput?.value.trim();
        mediaSrc = currentPhotoData || urlInput;
        if (!mediaSrc) {
          showToast('Please select a photo file or enter an image URL.', 'error');
          return;
        }
        thumbnailSrc = mediaSrc;
      } else {
        const videoUrl = videoUrlInput?.value.trim();
        if (videoUrl) {
          youtubeId = extractYouTubeId(videoUrl);
          mediaSrc = videoUrl;
          if (youtubeId) {
            thumbnailSrc = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
          } else {
            thumbnailSrc = 'assets/images/work/fleet-inspection.jpg';
          }
        } else if (currentVideoData) {
          mediaSrc = currentVideoData;
          thumbnailSrc = 'assets/images/work/fleet-inspection.jpg';
        } else {
          showToast('Please select a video file or enter a YouTube/video link.', 'error');
          return;
        }
      }

      const newItem = {
        id: 'media_' + Date.now(),
        type: mediaType,
        src: mediaSrc,
        thumbnail: thumbnailSrc,
        youtubeId: youtubeId,
        caption: caption,
        category: category,
        location: location,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      };

      // Save to localStorage
      try {
        const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        existing.unshift(newItem);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      } catch (err) {
        console.warn('Storage limit warning:', err);
      }

      // Prepend to Grid
      const grid = document.getElementById('gallery-grid');
      if (grid) {
        const card = createGridCard(newItem);
        grid.insertBefore(card, grid.firstChild);
      }

      // Prepend to Track
      const track = document.getElementById('gallery-track');
      if (track) {
        const card = createTrackCard(newItem);
        track.insertBefore(card, track.firstChild);
      }

      // Reset Form and previews
      uploadForm.reset();
      currentPhotoData = null;
      currentVideoData = null;
      if (photoPreviewWrap) photoPreviewWrap.classList.add('hidden');
      if (photoDropPrompt) photoDropPrompt.classList.remove('hidden');
      if (videoPreviewWrap) videoPreviewWrap.classList.add('hidden');
      if (videoDropPrompt) videoDropPrompt.classList.remove('hidden');
      if (photoSec) photoSec.classList.remove('hidden');
      if (videoSec) videoSec.classList.add('hidden');
      if (typePhotoLabel) {
        typePhotoLabel.classList.add('active', 'border-orange-500', 'bg-orange-50/50');
      }
      if (typeVideoLabel) {
        typeVideoLabel.classList.remove('active', 'border-orange-500', 'bg-orange-50/50');
      }

      closeUploadModal();
      showToast('🎉 Ground seva media published successfully to live gallery!');
    });
  }

  // Initialize
  loadCustomMedia();
  updateAuthUI();
}
