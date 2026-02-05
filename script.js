// =====================
// DOM READY
// =====================
document.addEventListener("DOMContentLoaded", () => {

  /* =====================
     SCROLL REVEAL
  ===================== */
  const revealEls = document.querySelectorAll(".fade-up");

  if (revealEls.length) {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      revealEls.forEach(el => el.classList.add("show"));
    } else {
      const revealObserver = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add("show");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );

      revealEls.forEach(el => revealObserver.observe(el));
    }
  }

  /* =====================
     NAVBAR SCROLL STYLE
  ===================== */
  const header = document.querySelector(".site-header");

  if (header) {
    window.addEventListener(
      "scroll",
      () => {
        header.classList.toggle("scrolled", window.scrollY > 10);
      },
      { passive: true }
    );
  }

  /* =====================
     FOOTER YEAR
  ===================== */
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* =====================
     THEME SYSTEM
  ===================== */
  const root = document.documentElement;
  const toggle = document.querySelector(".theme-toggle");
  const savedTheme = localStorage.getItem("theme");

  const setTheme = theme => {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    if (toggle) toggle.setAttribute("aria-pressed", theme === "dark");
  };

  if (savedTheme === "dark" || savedTheme === "light") {
    setTheme(savedTheme);
  } else {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setTheme(prefersDark ? "dark" : "light");
  }

  if (toggle) {
    toggle.addEventListener("click", () => {
      const current = root.getAttribute("data-theme");
      setTheme(current === "dark" ? "light" : "dark");
    });
  }

  /* =====================
     ADVANCED NAVBAR
  ===================== */

  const navLinks = document.querySelectorAll(".nav-links a");
  const indicator = document.querySelector(".nav-indicator");

  const sections = [...navLinks].map(link =>
    document.querySelector(link.getAttribute("href"))
  );

  function setActiveLink(link) {
    navLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");

    if (!indicator) return;

    const rect = link.getBoundingClientRect();
    const parentRect = link.parentElement.getBoundingClientRect();

    indicator.style.width = `${rect.width}px`;
    indicator.style.transform =
      `translateX(${rect.left - parentRect.left}px)`;
  }

  // Scroll spy
  window.addEventListener(
    "scroll",
    () => {
      let currentSection = null;

      sections.forEach(section => {
        if (!section) return;
        const top = section.getBoundingClientRect().top;
        if (top <= window.innerHeight * 0.3) {
          currentSection = section;
        }
      });

      if (currentSection) {
        const activeLink = document.querySelector(
          `.nav-links a[href="#${currentSection.id}"]`
        );
        if (activeLink) setActiveLink(activeLink);
      }
    },
    { passive: true }
  );

  // Click sync
  navLinks.forEach(link => {
    link.addEventListener("click", () => setActiveLink(link));
  });

  // Initial indicator
  if (navLinks[0]) setActiveLink(navLinks[0]);

  /* =====================
     HIDE NAVBAR ON SCROLL
  ===================== */
  let lastScroll = 0;

  window.addEventListener(
    "scroll",
    () => {
      const current = window.scrollY;

      if (current > lastScroll && current > 100) {
        header.classList.add("hide");
      } else {
        header.classList.remove("hide");
      }

      lastScroll = current;
    },
    { passive: true }
  );

});

