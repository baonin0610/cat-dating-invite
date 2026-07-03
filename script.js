// Cute Cat Dating Invitation JS

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const introScreen = document.getElementById('intro-screen');
  const plannerScreen = document.getElementById('planner-screen');
  const successScreen = document.getElementById('success-screen');
  
  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');
  const dateForm = document.getElementById('date-form');
  const btnRestart = document.getElementById('btn-restart');
  const btnSendMessage = document.getElementById('btn-send-message');
  
  // Settings & QR Elements
  const settingsBtn = document.getElementById('settings-btn');
  const printModal = document.getElementById('print-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const urlInput = document.getElementById('url-input');
  const btnUseCurrent = document.getElementById('btn-use-current');
  const btnPrintCard = document.getElementById('btn-print-card');
  const floatingContainer = document.getElementById('floating-container');
  
  // Summary fields
  const summaryDate = document.getElementById('summary-date');
  const summaryActivity = document.getElementById('summary-activity');
  const summaryTreat = document.getElementById('summary-treat');
  const summaryNote = document.getElementById('summary-note');
  const keyInput = document.getElementById('key-input');
  
  // Intro cat & text
  const introCat = document.getElementById('intro-cat');
  const proposalTitle = document.querySelector('.proposal-title');
  const proposalSubtitle = document.querySelector('.proposal-subtitle');

  // --- State Variables ---
  let noClickCount = 0;
  let yesScale = 1;
  let selectedActivity = 'Cà phê mèo ☕';
  let selectedTreat = 'Trà sữa béo ngậy 🧋';

  // Read URL parameters for notifications (with default fallback key)
  const urlParams = new URLSearchParams(window.location.search);
  const web3Key = urlParams.get('key') || '9f68c4bc-c89e-4cf2-bc28-33c66c04eebb';

  // --- Birthday Birthday Message Birthday ---
  const birthdayOverlay = document.getElementById('birthday-overlay');
  const btnBirthdayClose = document.getElementById('btn-birthday-close');
  
  const today = new Date();
  const isBirthday = (today.getDate() === 17 && today.getMonth() === 6); // July 17th (0-indexed month)
  const isTestBirthday = urlParams.has('test_birthday');

  if (birthdayOverlay && (isBirthday || isTestBirthday)) {
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
      
      // Smooth fade out
      birthdayOverlay.style.opacity = '0';
      setTimeout(() => {
        birthdayOverlay.classList.remove('active');
        birthdayOverlay.style.opacity = '1';
      }, 500);
    });
  }

  const sadPhrases = [
    "Ơ kìa...",
    "Suy nghĩ lại đi mà...",
    "Đi chơi vui lắm á!",
    "Bận thật luôn hả?",
    "Thôi mà...",
    "Đồng ý đi chứ nút không hỏng rồi 😂"
  ];

  // --- Background floating elements (Hearts & Paws) ---
  const emojis = ['❤️', '💖', '🐾', '🐱', '✨', '🌸', '🐾'];
  function createFloatingItem() {
    const item = document.createElement('div');
    item.classList.add('floating-item');
    item.innerText = emojis[Math.floor(Math.random() * emojis.length)];
    item.style.left = Math.random() * 100 + 'vw';
    item.style.animationDuration = Math.random() * 5 + 5 + 's'; // 5s - 10s
    item.style.fontSize = Math.random() * 20 + 15 + 'px';
    floatingContainer.appendChild(item);

    // Remove element after animation ends
    setTimeout(() => {
      item.remove();
    }, 10000);
  }

  // Spawn floating items periodically
  setInterval(createFloatingItem, 800);

  // --- Sad Cat Face Changer ---
  function changeCatToSad() {
    // Modify eyes in SVG to be sad/crying
    const eyesGroup = introCat.querySelector('.cat-eyes-group');
    if (eyesGroup) {
      eyesGroup.innerHTML = `
        <!-- Teary Left Eye -->
        <g>
          <circle cx="74" cy="92" r="13" fill="#1a1a1a" />
          <circle cx="70" cy="87" r="4.5" fill="#ffffff" />
          <circle cx="79" cy="98" r="2" fill="#ffffff" />
          <!-- Blue teardrop -->
          <path d="M 72 96 Q 66 112 66 118 Q 72 122 76 118 Q 78 114 74 100" fill="#2196f3" />
        </g>
        <!-- Teary Right Eye -->
        <g>
          <circle cx="126" cy="92" r="13" fill="#1a1a1a" />
          <circle cx="122" cy="87" r="4.5" fill="#ffffff" />
          <circle cx="131" cy="98" r="2" fill="#ffffff" />
          <!-- Blue teardrop -->
          <path d="M 128 96 Q 134 112 134 118 Q 128 122 124 118 Q 122 114 126 100" fill="#2196f3" />
        </g>
      `;
    }
    
    // Make mouth a sad curve
    const mouth = introCat.querySelector('.cat-mouth');
    if (mouth) {
      mouth.setAttribute('d', 'M 95 103 Q 100 97 105 103');
    }
  }

  // --- Fleeing No Button Logic ---
  function fleeNoButton() {
    try {
      noClickCount++;
      
      // Choose sad phrase
      const phraseIndex = Math.min(noClickCount - 1, sadPhrases.length - 1);
      if (proposalTitle) proposalTitle.innerText = sadPhrases[phraseIndex];
      if (proposalSubtitle) proposalSubtitle.innerText = "Ấn 'Đồng ý nè' đi chơi nha...";
      
      // Change cat to sad face
      changeCatToSad();

      // Scale up YES button
      yesScale += 0.22;
      if (btnYes) btnYes.style.transform = `scale(${yesScale})`;
      
      // If she clicked NO too many times, make it disappear
      if (noClickCount >= 7) {
        if (btnNo) btnNo.style.display = 'none';
        if (proposalTitle) proposalTitle.innerText = "Hết nút bận rồi nha! 😜";
        return;
      }

      // Get parent bounds to keep button within the card container
      const container = document.querySelector('.app-container');
      if (container && btnNo) {
        const containerRect = container.getBoundingClientRect();
        const btnRect = btnNo.getBoundingClientRect();

        // Calculate maximum top/left offsets relative to the container
        const margin = 20;
        const maxLeft = containerRect.width - btnRect.width - (margin * 2);
        const maxTop = containerRect.height - btnRect.height - (margin * 2);

        // Pick random position
        const randomLeft = margin + Math.floor(Math.random() * maxLeft);
        const randomTop = margin + Math.floor(Math.random() * maxTop);

        // Apply absolute positions
        btnNo.style.position = 'absolute';
        btnNo.style.left = `${randomLeft}px`;
        btnNo.style.top = `${randomTop}px`;
        btnNo.style.zIndex = '10';
      }
    } catch (err) {
      console.error('fleeNoButton error:', err);
    }
  }

  if (btnNo) {
    btnNo.addEventListener('mouseover', fleeNoButton);
    btnNo.addEventListener('touchstart', (e) => {
      e.preventDefault(); // Prevent double triggers on mobile touch
      fleeNoButton();
    });
  }

  // --- YES Button Trigger ---
  if (btnYes) {
    btnYes.addEventListener('click', () => {
      try {
        // Fire beautiful confetti
        fireConfetti();
      } catch (err) {
        console.warn('Confetti failed, skipping:', err);
      }

      try {
        // Fade screens
        if (introScreen) introScreen.classList.remove('active');
        setTimeout(() => {
          if (plannerScreen) plannerScreen.classList.add('active');
        }, 300);
      } catch (err) {
        console.error('Screen transition failed:', err);
      }
    });
  }

  // Confetti helper
  function fireConfetti() {
    if (typeof confetti === 'undefined') {
      console.warn('Confetti library not loaded.');
      return;
    }
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

  // --- Cards selection (Activity & Treat) ---
  function initSelector(selectorId, callback) {
    const selector = document.getElementById(selectorId);
    if (!selector) return;
    const cards = selector.querySelectorAll('.selector-card');
    
    cards.forEach(card => {
      card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        callback(card.dataset.value);
      });
    });
  }

  initSelector('activity-selector', (value) => {
    selectedActivity = value;
  });

  initSelector('treat-selector', (value) => {
    selectedTreat = value;
  });

  // Set default minimum date to today
  const dateInput = document.getElementById('date-input');
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0
    let dd = today.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    dateInput.min = `${yyyy}-${mm}-${dd}`;
    dateInput.value = `${yyyy}-${mm}-${dd}`; // Set today as default
  }

  // --- Planner Form Submit ---
  if (dateForm) {
    dateForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const rawDate = dateInput ? dateInput.value : '';
      const timeEl = document.getElementById('time-input');
      const rawTime = timeEl ? timeEl.value : '';
      const noteEl = document.getElementById('note-input');
      const notesVal = noteEl ? noteEl.value.trim() : '';

      // Format date beautifully (dd/mm/yyyy)
      let formattedDate = rawDate;
      if (rawDate) {
        const parts = rawDate.split('-');
        formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
      }

      // Set summary
      if (summaryDate) summaryDate.innerText = formattedDate;
      const summaryTimeEl = document.getElementById('summary-time');
      if (summaryTimeEl) summaryTimeEl.innerText = rawTime || "Chưa chọn";
      if (summaryActivity) summaryActivity.innerText = selectedActivity;
      if (summaryTreat) summaryTreat.innerText = selectedTreat;
      if (summaryNote) summaryNote.innerText = notesVal ? `"${notesVal}"` : "Không có lời nhắn nào.";

      // Send email notification if Web3Forms key is in the URL
      if (web3Key) {
        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            access_key: web3Key,
            subject: '🐱 Lịch hẹn hò mới từ bạn gái!',
            from_name: 'Dating Cat Invite',
            message: `Lịch hẹn hò của bạn đã được xác nhận!\n\n📅 Ngày hẹn: ${formattedDate}\n⏰ Giờ đón: ${rawTime || "Chưa chọn"}\n📍 Hoạt động: ${selectedActivity}\n😋 Ăn uống: ${selectedTreat}\n💌 Lời nhắn: ${notesVal || "Không có lời nhắn nào."}`
          })
        })
        .then(res => res.json())
        .then(data => console.log('Notification sent:', data))
        .catch(err => console.error('Error sending notification:', err));
      }

      // Show success screen
      if (plannerScreen) plannerScreen.classList.remove('active');
      setTimeout(() => {
        if (successScreen) successScreen.classList.add('active');
        // Fire celebration confetti again!
        if (typeof confetti !== 'undefined') {
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#ff8fa3', '#ffb3c1', '#ffe5ec', '#ff758f', '#ff4d6d']
          });
        }
      }, 300);
    });
  }



  // --- Restart Date Selector ---
  if (btnRestart) {
    btnRestart.addEventListener('click', () => {
      // Reset Proposal
      noClickCount = 0;
      yesScale = 1;
      if (btnYes) btnYes.style.transform = `scale(1)`;
      if (btnNo) {
        btnNo.style.display = 'block';
        btnNo.style.position = 'static';
        btnNo.style.left = 'auto';
        btnNo.style.top = 'auto';
      }
      
      // Reset form fields
      const timeInputEl = document.getElementById('time-input');
      if (timeInputEl) timeInputEl.value = "";
      
      // Reset proposal text & cat face
      if (proposalTitle) proposalTitle.innerText = "Đi chơi với anh nha? 🐱";
      if (proposalSubtitle) proposalSubtitle.innerText = "Cuối tuần này em rảnh không?";
      
      // Reset eyes
      if (introCat) {
        const eyesGroup = introCat.querySelector('.cat-eyes-group');
        if (eyesGroup) {
          eyesGroup.innerHTML = `
            <!-- Left Eye -->
            <g class="cat-eye-left">
              <circle cx="74" cy="92" r="13" fill="#1a1a1a" />
              <!-- Reflection Highlights -->
              <circle cx="70" cy="87" r="4.5" fill="#ffffff" />
              <circle cx="79" cy="98" r="2" fill="#ffffff" />
            </g>
            <!-- Right Eye -->
            <g class="cat-eye-right">
              <circle cx="126" cy="92" r="13" fill="#1a1a1a" />
              <!-- Reflection Highlights -->
              <circle cx="122" cy="87" r="4.5" fill="#ffffff" />
              <circle cx="131" cy="98" r="2" fill="#ffffff" />
            </g>
          `;
        }
        const mouth = introCat.querySelector('.cat-mouth');
        if (mouth) {
          mouth.setAttribute('d', 'M 94 99 Q 97 103 100 100 Q 103 103 106 99');
        }
      }

      // Switch screen
      if (successScreen) successScreen.classList.remove('active');
      setTimeout(() => {
        if (introScreen) introScreen.classList.add('active');
      }, 300);
    });
  }

  // --- Settings & Printable QR Card Generator ---
  let qrPreview = null;
  let qrPrint = null;

  // Initialize QR generator
  function updateQRCodes(url) {
    const keyVal = keyInput ? keyInput.value.trim() : '';
    let finalUrl = url;
    
    // Strip existing key from url if present to avoid double keys
    if (finalUrl.includes('key=')) {
      try {
        const urlObj = new URL(finalUrl);
        urlObj.searchParams.delete('key');
        finalUrl = urlObj.toString();
      } catch (e) {
        // Fallback for simple paths
        finalUrl = finalUrl.split('?')[0];
      }
    }
    
    if (keyVal) {
      const separator = finalUrl.includes('?') ? '&' : '?';
      finalUrl = `${finalUrl}${separator}key=${encodeURIComponent(keyVal)}`;
    }

    const qrConfig = {
      value: finalUrl,
      size: 250,
      background: 'white',
      foreground: '#c9184a',
      level: 'H'
    };

    if (typeof QRious === 'undefined') {
      console.warn('QRious library is not loaded.');
      const qrContainer = document.querySelector('.qr-container');
      if (qrContainer) {
        qrContainer.innerHTML = '<span style="font-size:10px;color:red;text-align:center;display:block;padding:10px;">Lỗi tải thư viện QR (Yêu cầu mạng)</span>';
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
      qrPreview.value = finalUrl;
      qrPrint.value = finalUrl;
    }
  }

  // Open settings
  if (settingsBtn && printModal) {
    settingsBtn.addEventListener('click', () => {
      printModal.classList.add('active');
      
      // Populate saved key
      if (keyInput) {
        let savedKey = '';
        try {
          savedKey = localStorage.getItem('web3FormsKey');
        } catch (e) {
          console.warn('localStorage read is blocked:', e);
        }
        keyInput.value = savedKey || '9f68c4bc-c89e-4cf2-bc28-33c66c04eebb';
      }
      
      // Default to current URL
      if (urlInput) {
        const currentURL = window.location.href;
        urlInput.value = currentURL;
        updateQRCodes(currentURL);
      }
    });
  }

  // Use current URL button
  if (btnUseCurrent && urlInput) {
    btnUseCurrent.addEventListener('click', () => {
      const currentURL = window.location.href;
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

  // Update QR on Key change
  if (keyInput && urlInput) {
    keyInput.addEventListener('input', () => {
      try {
        localStorage.setItem('web3FormsKey', keyInput.value.trim());
      } catch (e) {
        console.warn('localStorage write is blocked:', e);
      }
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

  // Close modal on click outside
  if (printModal) {
    printModal.addEventListener('click', (e) => {
      if (e.target === printModal) {
        printModal.classList.remove('active');
      }
    });
  }

  // Print Card Action
  if (btnPrintCard) {
    btnPrintCard.addEventListener('click', () => {
      // Trigger print dialog
      window.print();
    });
  }
});
