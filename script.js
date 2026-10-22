// 1) CHANGE THIS to your real anniversary date: YYYY-MM-DD
const anniversaryDate = new Date(2024, 1, 22, 14, 22, 0);


// Update the time together every second.
function updateCounter() {
  const now = new Date();
  const difference = now - anniversaryDate;
  const counter = document.getElementById('counter');

  if (Number.isNaN(anniversaryDate.getTime())) {
    counter.innerHTML = '<p>Please enter your anniversary date in script.js.</p>';
    return;
  }
  if (difference < 0) {
    counter.innerHTML = '<p>Our special day is coming soon! ♡</p>';
    return;
  }

  const totalSeconds = Math.floor(difference / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  document.getElementById('days').textContent = days.toLocaleString();
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}
updateCounter();
setInterval(updateCounter, 1000);

// Open and close the personal letter.
const openLetterButton = document.getElementById('openLetter');
const letterMessage = document.getElementById('letterMessage');
openLetterButton.addEventListener('click', () => {
  const isHidden = letterMessage.hidden;
  letterMessage.hidden = !isHidden;
  openLetterButton.textContent = isHidden ? 'Close your letter ♡' : 'Open your letter ♡';
  openLetterButton.setAttribute('aria-expanded', String(isHidden));
});

// Music starts only after the visitor presses the button.
const music = document.getElementById('backgroundMusic');
const musicButton = document.getElementById('musicButton');
musicButton.addEventListener('click', async () => {
  if (music.paused) {
    try {
      await music.play();
      musicButton.textContent = '♫ Music: On';
      musicButton.setAttribute('aria-pressed', 'true');
    } catch (error) {
      musicButton.textContent = 'Add music.mp3 first';
      musicButton.setAttribute('aria-pressed', 'false');
    }
  } else {
    music.pause();
    musicButton.textContent = '♫ Music: Off';
    musicButton.setAttribute('aria-pressed', 'false');
  }
});

// Floating hearts are decorative.
const heartsLayer = document.getElementById('hearts');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function createHeart() {
  if (reducedMotion) return;
  const heart = document.createElement('span');
  heart.className = 'floating-heart';
  heart.textContent = Math.random() > 0.5 ? '♡' : '♥';
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.fontSize = `${14 + Math.random() * 20}px`;
  const duration = 7 + Math.random() * 6;
  heart.style.animationDuration = `${duration}s`;
  heartsLayer.appendChild(heart);
  setTimeout(() => heart.remove(), duration * 1000);
}
if (!reducedMotion) setInterval(createHeart, 650);


/* Handle gallery image loading, including lazy-loaded images. */
document.querySelectorAll('.photo-frame img').forEach((img) => {
  const frame = img.closest('.photo-frame');
  if (!frame) return;

  function checkImage() {
    if (img.complete && img.naturalWidth > 0) {
      frame.classList.add('has-photo');
    } else if (img.complete && img.naturalWidth === 0) {
      frame.classList.remove('has-photo');
    }
  }

  img.addEventListener('load', checkImage);
  img.addEventListener('error', () => {
    frame.classList.remove('has-photo');
    console.error('Image failed to load:', img.src);
  });

  // Check again when the browser starts loading a lazy image.
  img.addEventListener('load', () => {
    requestAnimationFrame(checkImage);
  });

  checkImage();
});


// Reveal cards as they enter the screen.
const revealCards = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  revealCards.forEach((card) => observer.observe(card));
} else {
  revealCards.forEach((card) => card.classList.add('visible'));
}

// Photo lightbox: supports all 30 gallery images.
const lightbox = document.getElementById('photoLightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
let currentPhoto = 0;
let photoItems = [];

function collectPhotos() {
  photoItems = Array.from(document.querySelectorAll('.memory-card .photo-frame img'))
    .filter((img) => img.complete && img.naturalWidth > 0);
}
function showPhoto(index) {
  if (!photoItems.length) return;
  currentPhoto = (index + photoItems.length) % photoItems.length;
  const img = photoItems[currentPhoto];
  lightboxImage.src = img.src;
  lightboxImage.alt = img.alt;
  const card = img.closest('.memory-card');
  const note = card?.querySelector('.memory-note');
  const date = card?.querySelector('time');
  lightboxCaption.textContent = [note?.textContent, date?.textContent].filter(Boolean).join(' · ');
}
function openLightbox(img) {
  collectPhotos();
  currentPhoto = photoItems.indexOf(img);
  if (currentPhoto < 0) return;
  showPhoto(currentPhoto);
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  lightbox.querySelector('.lightbox-close').focus();
}
function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImage.removeAttribute('src');
  document.body.style.overflow = '';
}
document.querySelectorAll('.memory-card .photo-frame img').forEach((img) => {
  img.addEventListener('click', () => openLightbox(img));
});
lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showPhoto(currentPhoto - 1));
lightbox.querySelector('.lightbox-next').addEventListener('click', () => showPhoto(currentPhoto + 1));
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (event) => {
  if (!lightbox.classList.contains('open')) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') showPhoto(currentPhoto - 1);
  if (event.key === 'ArrowRight') showPhoto(currentPhoto + 1);
});
