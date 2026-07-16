// Cute Cat Birthday Photo Gallery & Video Website JS

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const videoScreen = document.getElementById('video-screen');
  const galleryScreen = document.getElementById('gallery-screen');
  
  const btnRestart = document.getElementById('btn-restart');
  
  // Settings & QR Elements
  const settingsBtn = document.getElementById('settings-btn');
  const printModal = document.getElementById('print-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const urlInput = document.getElementById('url-input');
  const btnUseCurrent = document.getElementById('btn-use-current');
  const btnPrintCard = document.getElementById('btnPrintCard'); // matches print button ID if needed, wait let's look at index.html
  const floatingContainer = document.getElementById('floating-container');
  
  // --- Birthday Overlay Message ---
  const birthdayOverlay = document.getElementById('birthday-overlay');
  const btnBirthdayClose = document.getElementById('btn-birthday-close');
  
  // Always display birthday overlay on load
  if (birthdayOverlay) {
    birthdayOverlay.classList.add('active');
  }

  if (btnBirthdayClose && birthdayOverlay) {
    btnBirthdayClose.addEventListener('click', () => {
      // Fire celebration confetti!
      if (typeof confetti !== 'undefined') {
        confetti({
          particleCount: 180,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#ff8fa3', '#ffb3c1', '#ffe5ec', '#ff758f', '#ff4d6d']
        });
      }
      
      // Smooth fade out overlay
      birthdayOverlay.style.opacity = '0';
      setTimeout(() => {
        birthdayOverlay.classList.remove('active');
        birthdayOverlay.style.opacity = '1';
        
        // Autoplay the birthday video when overlay closes
        const birthdayVideo = document.getElementById('birthday-video');
        if (birthdayVideo) {
          try {
            birthdayVideo.play();
          } catch (playErr) {
            console.warn('Video autoplay failed:', playErr);
          }
        }
      }, 500);
    });
  }

  // --- Background floating elements (Hearts & Paws) ---
  const emojis = ['❤️', '💖', '🐾', '🐱', '✨', '🌸', '🐾'];
  function createFloatingItem() {
    if (!floatingContainer) return;
    const item = document.createElement('div');
    item.classList.add('floating-item');
    item.innerText = emojis[Math.floor(Math.random() * emojis.length)];
    item.style.left = Math.random() * 100 + 'vw';
    item.style.animationDuration = Math.random() * 5 + 5 + 's';
    item.style.fontSize = Math.random() * 20 + 15 + 'px';
    floatingContainer.appendChild(item);

    // Remove element after animation ends
    setTimeout(() => {
      item.remove();
    }, 10000);
  }

  // Spawn floating items periodically
  setInterval(createFloatingItem, 800);

  // Confetti helper
  function fireConfetti() {
    if (typeof confetti === 'undefined') return;
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff8fa3', '#ffb3c1', '#ffe5ec', '#ff758f']
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff8fa3', '#ffb3c1', '#ffe5ec', '#ff758f']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }

  // --- Dynamic Image Loader for Heart Grid ---
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(item => {
    const index = item.getAttribute('data-index');
    const img = document.createElement('img');
    img.alt = `Photo ${index}`;
    
    // Attempt to load JPG first
    img.src = `photos/photo${index}.jpg`;
    
    img.onload = () => {
      item.appendChild(img);
    };
    
    img.onerror = () => {
      // If JPG fails, try PNG
      if (img.src.endsWith('.jpg')) {
        // Change src to trigger a new load event
        img.src = `photos/photo${index}.png`;
      } else {
        // If PNG also fails, fallback to SVG heart icon
        item.innerHTML = `
          <svg class="fallback-icon" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        `;
      }
    };
  });

  // --- Restart Action ---
  if (btnRestart) {
    btnRestart.addEventListener('click', () => {
      if (galleryScreen) galleryScreen.classList.remove('active');
      setTimeout(() => {
        if (videoScreen) {
          videoScreen.classList.add('active');
          const birthdayVideo = document.getElementById('birthday-video');
          if (birthdayVideo) {
            try {
              birthdayVideo.currentTime = 0;
              birthdayVideo.play();
            } catch (playErr) {
              console.warn('Video replay failed:', playErr);
            }
          }
        }
      }, 300);
    });
  }

  // --- Printable QR Card Generator ---
  let qrPreview = null;
  let qrPrint = null;

  function updateQRCodes(url) {
    const qrConfig = {
      value: url,
      size: 250,
      background: 'white',
      foreground: '#c9184a',
      level: 'H'
    };

    if (typeof QRious === 'undefined') {
      console.warn('QRious library is not loaded.');
      const qrContainer = document.querySelector('.qr-container');
      if (qrContainer) {
        qrContainer.innerHTML = '<span style="font-size:10px;color:red;display:block;padding:10px;">Lỗi tải thư viện QR (Yêu cầu mạng)</span>';
      }
      const printQrWrapper = document.querySelector('.print-qr-wrapper');
      if (printQrWrapper) {
        printQrWrapper.innerHTML = '<span style="font-size:12px;color:red;display:block;padding:10px;">Lỗi tải thư viện QR (Yêu cầu mạng)</span>';
      }
      return;
    }

    if (!qrPreview) {
      qrPreview = new QRious({
        element: document.getElementById('qr-canvas'),
        ...qrConfig,
        size: 150
      });
      
      qrPrint = new QRious({
        element: document.getElementById('print-qr-canvas'),
        ...qrConfig,
        size: 250
      });
    } else {
      qrPreview.value = url;
      qrPrint.value = url;
    }
  }

  // Open settings
  if (settingsBtn && printModal) {
    settingsBtn.addEventListener('click', () => {
      printModal.classList.add('active');
      
      if (urlInput) {
        let currentURL = window.location.href;
        try {
          const urlObj = new URL(currentURL);
          urlObj.searchParams.set('t', Date.now());
          currentURL = urlObj.toString();
        } catch (e) {
          console.warn('URL parsing failed:', e);
        }
        urlInput.value = currentURL;
        updateQRCodes(currentURL);
      }
    });
  }

  // Use current URL button
  if (btnUseCurrent && urlInput) {
    btnUseCurrent.addEventListener('click', () => {
      let currentURL = window.location.href;
      try {
        const urlObj = new URL(currentURL);
        urlObj.searchParams.set('t', Date.now());
        currentURL = urlObj.toString();
      } catch (e) {
        console.warn('URL parsing failed:', e);
      }
      urlInput.value = currentURL;
      updateQRCodes(currentURL);
    });
  }

  // Update QR on URL change
  if (urlInput) {
    urlInput.addEventListener('input', () => {
      const val = urlInput.value.trim() || window.location.href;
      updateQRCodes(val);
    });
  }

  // Close modal
  if (modalCloseBtn && printModal) {
    modalCloseBtn.addEventListener('click', () => {
      printModal.classList.remove('active');
    });
  }

  if (printModal) {
    printModal.addEventListener('click', (e) => {
      if (e.target === printModal) {
        printModal.classList.remove('active');
      }
    });
  }

  // Print Card Action
  const printActionBtn = document.getElementById('btn-print-card');
  if (printActionBtn) {
    printActionBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Video screen transition button
  const btnNextPlanner = document.getElementById('btn-next-planner');
  if (btnNextPlanner) {
    btnNextPlanner.addEventListener('click', () => {
      // Pause video when leaving screen
      const birthdayVideo = document.getElementById('birthday-video');
      if (birthdayVideo) {
        try {
          birthdayVideo.pause();
        } catch (e) {
          console.warn('Video pause failed:', e);
        }
      }
      
      if (videoScreen) videoScreen.classList.remove('active');
      setTimeout(() => {
        if (galleryScreen) {
          galleryScreen.classList.add('active');
          fireConfetti();
        }
      }, 300);
    });
  }
});
