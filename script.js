// script.js
// Purpose: theme toggle (light/dark), reveal-on-scroll animation, small accessibility helpers.

// ----- Theme toggle -----
// Toggling adds/removes `dark` class on body and remembers preference in localStorage.
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const LS_KEY = 'portfolio-theme';

// apply stored theme on load
(function applyStoredTheme() {
  try {
    const saved = localStorage.getItem(LS_KEY);
    if (saved === 'dark') body.classList.add('dark');
    if (saved === 'dark') {
      themeToggle.setAttribute('aria-pressed', 'true');
      themeToggle.textContent = 'Light Theme';
    } else {
      themeToggle.setAttribute('aria-pressed', 'false');
      themeToggle.textContent = 'Dark Theme';
    }
  } catch (e) {
    // localStorage may be unavailable; ignore
  }
})();

themeToggle.addEventListener('click', () => {
  const isDark = body.classList.toggle('dark');
  try {
    localStorage.setItem(LS_KEY, isDark ? 'dark' : 'light');
  } catch (e) {}
  themeToggle.setAttribute('aria-pressed', String(isDark));
  themeToggle.textContent = isDark ? 'Light Theme' : 'Dark Theme';
});

// ----- Reveal on scroll -----
// Simple IntersectionObserver that toggles .show on elements with .reveal
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => io.observe(el));
} else {
  // fallback: show all
  reveals.forEach(el => el.classList.add('show'));
}

// ----- Download CV fallback -----
// If the CV link is missing, fallback to creating a small text CV and prompt download.
// (This is optional; only runs if the anchor points to a missing/placeholder href)
const cvLink = document.getElementById('downloadCv');
if (cvLink && cvLink.tagName === 'A') {
  fetch(cvLink.href, { method: 'HEAD' }).then(resp => {
    if (!resp.ok) {
      // file missing — create a small text CV for user to download
      const fallback = `Rizwan Bhatti - CV\nEmail: rizwanbhatti.dev@gmail.com\nSkills: HTML, CSS, JS, Java, C++\nProjects: Portfolio, Quiz App, Task Manager`;
      const blob = new Blob([fallback], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      cvLink.href = url;
      cvLink.download = 'Rizwan_Bhatti_CV.txt';
    }
  }).catch(() => {
    // network or CORS issue — do nothing
  });
}
