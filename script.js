/**
 * OG FAMILY SALON - LUXURY INTERACTIVE SCRIPT
 * Handles global configuration hydration, themes, animations, and form logic.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Ensure SITE_CONFIG is loaded
  const config = window.SITE_CONFIG;
  if (!config) {
    console.error("SITE_CONFIG configuration block is missing.");
    return;
  }

  // --- 1. CONFIGURATION HYDRATION ---
  hydrateConfigElements(config);

  // --- 2. THEME MANAGER ---
  initThemeManager();

  // --- 3. CUSTOM CURSOR TRACKER ---
  initCustomCursor();

  // --- 4. PRELOADER SHIELD ---
  initPreloader();

  // --- 5. MOBILE NAVIGATION ---
  initMobileMenu();

  // --- 6. STATS COUNT-UP INTERSECTION OBSERVER ---
  initStatsObserver();

  // --- 7. SERVICES TAB & MATRIX INJECTION ---
  initServicesMatrix(config);

  // --- 8. LUXURY GALLERY LIGHTBOX ---
  initGalleryLightbox();

  // --- 9. INFINITE TESTIMONIAL MARQUEE & REVIEW MODAL ---
  initTestimonialsMarquee();

  // --- 10. ACCORDION FAQ PACK ---
  initFaqAccordion();

  // --- 11. LEAD BOOKING FORM HANDLER ---
  initLeadFormHandler(config);

  // --- 12. FLOATING BACK TO TOP TRIGGER ---
  initBackToTop();

  // --- 13. NAV ACCENT SCROLLSPY ---
  initScrollSpy();
});

/**
 * Injects meta tags and text placeholders based on global site config.
 */
function hydrateConfigElements(config) {
  // Hydrate Head Metadata if on main page (only update if elements exist)
  if (document.title && config.meta) {
    document.title = config.meta.title;
    
    // Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', config.meta.description);

    // Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', config.meta.keywords);
  }

  // Hydrate Text Bindings [data-config-key]
  document.querySelectorAll("[data-config-key]").forEach((element) => {
    const key = element.getAttribute("data-config-key");
    if (config[key]) {
      element.textContent = config[key];
    } else if (key.includes(".")) {
      // Handle nested configuration strings (e.g. meta.domain, workingHours.mon)
      const keys = key.split(".");
      let val = config;
      for (const k of keys) {
        val = val[k];
        if (!val) break;
      }
      if (val) element.textContent = val;
    }
  });

  // Hydrate Href Bindings [data-config-href]
  document.querySelectorAll("[data-config-href]").forEach((element) => {
    const key = element.getAttribute("data-config-href");
    let val = config[key];
    if (key.includes(".")) {
      const keys = key.split(".");
      val = config;
      for (const k of keys) {
        val = val[k];
        if (!val) break;
      }
    }
    if (val) {
      element.setAttribute("href", val);
    }
  });
}

/**
 * Handles Dark/Light theme toggle actions.
 */
function initThemeManager() {
  const themeToggleBtn = document.getElementById("theme-toggle");
  if (!themeToggleBtn) return;

  const currentTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", currentTheme);
  updateThemeToggleIcon(themeToggleBtn, currentTheme);

  themeToggleBtn.addEventListener("click", () => {
    const activeTheme = document.documentElement.getAttribute("data-theme");
    const nextTheme = activeTheme === "dark" ? "light" : "dark";
    
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
    updateThemeToggleIcon(themeToggleBtn, nextTheme);
  });
}

function updateThemeToggleIcon(btn, theme) {
  if (theme === "dark") {
    // Show Sun Icon for light option
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
      </svg>
    `;
  } else {
    // Show Moon Icon for dark option
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    `;
  }
}

/**
 * Handles smooth custom cursor dot element.
 */
function initCustomCursor() {
  const dot = document.querySelector(".custom-cursor-dot");
  if (!dot) return;

  let mouseX = 0, mouseY = 0;

  // Track coordinates
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Position target dot instantly
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  // Hover states classes trigger
  const clickables = document.querySelectorAll("a, button, input, select, textarea, .gallery-item, .faq-trigger, .star-input");
  clickables.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      document.body.classList.add("custom-cursor-hover");
    });
    item.addEventListener("mouseleave", () => {
      document.body.classList.remove("custom-cursor-hover");
    });
  });
}

/**
 * Manages full-screen loading screen preloader overlay.
 */
function initPreloader() {
  const loader = document.getElementById("preloader");
  if (!loader) return;

  document.body.classList.add("loading");

  // Keep screen minimum 2.2 seconds to showcase branding luxury animation
  setTimeout(() => {
    loader.classList.add("fade-out");
    document.body.classList.remove("loading");
  }, 2200);
}

/**
 * Toggle responsive menu sidebar triggers.
 */
function initMobileMenu() {
  const navbar = document.getElementById("navbar");
  const menuToggle = document.getElementById("menu-toggle");
  if (!navbar || !menuToggle) return;

  menuToggle.addEventListener("click", () => {
    navbar.classList.toggle("mobile-menu-active");
    // Change menu icon to X if active
    if (navbar.classList.contains("mobile-menu-active")) {
      menuToggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    } else {
      menuToggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    }
  });

  // Close menu on selecting item
  const menuLinks = navbar.querySelectorAll(".navbar-links a");
  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navbar.classList.remove("mobile-menu-active");
      menuToggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    });
  });

  // Scroll effect style update
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("navbar-scrolled");
    } else {
      navbar.classList.remove("navbar-scrolled");
    }
  });
}

/**
 * Handles count-up counters triggers via IntersectionObserver.
 */
function initStatsObserver() {
  const statNumbers = document.querySelectorAll(".stat-number");
  if (statNumbers.length === 0) return;

  const observerOptions = {
    root: null,
    threshold: 0.15,
  };

  const startCountUp = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetValAttr = target.getAttribute("data-target");
        
        // Parse float/ints (e.g. 494 or 4.9)
        const isFloat = targetValAttr.includes(".");
        const targetValue = parseFloat(targetValAttr);
        const duration = 2000; // 2 seconds
        const startTime = performance.now();

        const countAction = (currentTime) => {
          const elapsedTime = currentTime - startTime;
          const progress = Math.min(elapsedTime / duration, 1);
          
          // Easing easeOutQuad
          const easeProgress = progress * (2 - progress);
          const currentValue = easeProgress * targetValue;

          if (isFloat) {
            target.textContent = currentValue.toFixed(1) + "★";
          } else {
            // Check suffix
            const suffix = target.id === "stat-reviews" ? "+" : "";
            target.textContent = Math.floor(currentValue) + suffix;
          }

          if (progress < 1) {
            requestAnimationFrame(countAction);
          } else {
            // Ensure precise landing value matches config strings
            if (target.id === "stat-reviews") target.textContent = "494+";
            else if (target.id === "stat-rating") target.textContent = "4.9★";
            else if (target.id === "stat-days") target.textContent = "7 Days";
            else target.textContent = targetValAttr;
          }
        };

        requestAnimationFrame(countAction);
        observer.unobserve(target); // Animate once
      }
    });
  };

  const observer = new IntersectionObserver(startCountUp, observerOptions);
  statNumbers.forEach((num) => observer.observe(num));
}

/**
 * Dynamically builds service tab menu list grids and WhatsApp bookings links.
 */
function initServicesMatrix(config) {
  const tabsContainer = document.getElementById("services-tabs");
  const panesContainer = document.getElementById("services-panes");
  if (!tabsContainer || !panesContainer) return;

  tabsContainer.innerHTML = "";
  panesContainer.innerHTML = "";

  config.services.forEach((categoryBlock, index) => {
    // Generate Tab Buttons
    const activeClass = index === 0 ? "active" : "";
    const tabBtn = document.createElement("button");
    tabBtn.className = `tab-btn ${activeClass}`;
    tabBtn.setAttribute("data-target", categoryBlock.id);
    
    // Choose inline svg icons
    let iconSvg = "";
    if (categoryBlock.icon === "scissors") {
      iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-scissors"><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><line x1="9.8" y1="8.2" x2="21" y2="19.4"></line><line x1="21" y1="4.6" x2="10.96" y2="14.64"></line></svg>`;
    } else if (categoryBlock.icon === "sparkles") {
      iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707"></path><path d="m9.06 11.94 1.4-1.4a2 2 0 0 0 0-2.83L9.06 6.31a2 2 0 0 0-2.83 0l-1.4 1.4a2 2 0 0 0 0 2.83l1.4 1.4a2 2 0 0 0 2.83 0Z"></path><path d="m19.06 19.94 1.4-1.4a2 2 0 0 0 0-2.83l-1.4-1.4a2 2 0 0 0-2.83 0l-1.4 1.4a2 2 0 0 0 0 2.83l1.4 1.4a2 2 0 0 0 2.83 0Z"></path></svg>`;
    } else if (categoryBlock.icon === "heart") {
      iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>`;
    } else {
      iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flower2"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`;
    }

    tabBtn.innerHTML = `${iconSvg} <span>${categoryBlock.category}</span>`;
    tabsContainer.appendChild(tabBtn);

    // Generate Cards Panel
    const pane = document.createElement("div");
    pane.id = categoryBlock.id;
    pane.className = `services-pane ${activeClass}`;

    let cardsHtml = "";
    categoryBlock.items.forEach((serviceItem) => {
      // Build WhatsApp custom trigger URI
      const encodedWaHref = `${config.whatsappBase}${categoryBlock.whatsappSuffix}`;

      cardsHtml += `
        <div class="service-card">
          <div class="service-header">
            <h3 class="service-name">${serviceItem.name}</h3>
            <span class="service-price">${serviceItem.price}</span>
          </div>
          <p class="service-desc">${serviceItem.desc}</p>
          <div class="service-cta">
            <a href="${encodedWaHref}" target="_blank" class="service-book-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              Book Now
            </a>
          </div>
        </div>
      `;
    });

    pane.innerHTML = cardsHtml;
    panesContainer.appendChild(pane);
  });

  // Attach tab triggers click action
  const tabButtons = tabsContainer.querySelectorAll(".tab-btn");
  const panes = panesContainer.querySelectorAll(".services-pane");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("active"));
      panes.forEach((p) => p.classList.remove("active"));

      btn.classList.add("active");
      const targetId = btn.getAttribute("data-target");
      const activePane = document.getElementById(targetId);
      if (activePane) activePane.classList.add("active");
    });
  });
}

/**
 * Image Lightbox Modal popups for salon interior preview grids.
 */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector("img");
  const lightboxClose = lightbox.querySelector(".lightbox-close");
  const lightboxCaption = lightbox.querySelector(".lightbox-caption");

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const img = item.querySelector(".gallery-img-placeholder");
      const title = item.querySelector(".gallery-title").textContent;
      const category = item.querySelector(".gallery-category").textContent;

      if (img && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxCaption.textContent = `${category} - ${title}`;
        lightbox.classList.add("active");
        document.body.classList.add("loading"); // Lock scroll
      }
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove("active");
    document.body.classList.remove("loading");
  };

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
}

/**
 * Helper to escape HTML characters for security.
 */
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

/**
 * Handles custom local reviews rendering and submission into testimonials marquee.
 */
function initTestimonialsMarquee() {
  const marqueeTrack = document.getElementById("marquee-track");
  if (!marqueeTrack) return;

  // Save the original static reviews HTML on load (before duplication)
  const defaultReviews = Array.from(marqueeTrack.querySelectorAll(".review-card")).map(card => card.outerHTML);

  // Helper to load custom reviews from local storage
  function getCustomReviews() {
    const data = localStorage.getItem("og_custom_reviews");
    return data ? JSON.parse(data) : [];
  }

  // Render combined reviews into the marquee track
  function renderReviews() {
    const customReviews = getCustomReviews();
    
    // Build custom reviews cards HTML
    const customCardsHTML = customReviews.map(rev => {
      const stars = "★".repeat(rev.rating) + "☆".repeat(5 - rev.rating);
      return `
        <div class="review-card">
          <div class="review-header">
            <span class="reviewer-name">${escapeHTML(rev.name)}</span>
            <span class="review-rating">${stars}</span>
          </div>
          <p class="review-text">"${escapeHTML(rev.text)}"</p>
        </div>
      `;
    });

    const allOriginalHTML = [...defaultReviews, ...customCardsHTML];

    // Double the list content for a seamless infinite scroll loop (-50% translation)
    marqueeTrack.innerHTML = [...allOriginalHTML, ...allOriginalHTML].join("");
  }

  // Initial render
  renderReviews();

  // Review Modal triggers
  const openModalBtn = document.getElementById("btn-write-review");
  const modal = document.getElementById("review-modal");
  if (!modal || !openModalBtn) return;

  const closeModalBtn = modal.querySelector(".modal-close");
  const starsInputs = modal.querySelectorAll(".star-input");
  const reviewForm = document.getElementById("review-form");

  openModalBtn.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.add("active");
    document.body.classList.add("loading");
  });

  const closeModal = () => {
    modal.classList.remove("active");
    document.body.classList.remove("loading");
  };

  if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Star selector selection highlight
  let selectedRating = 5;
  starsInputs.forEach((star) => {
    star.addEventListener("click", () => {
      selectedRating = parseInt(star.getAttribute("data-rating"));
      starsInputs.forEach((s) => {
        const ratingVal = parseInt(s.getAttribute("data-rating"));
        if (ratingVal <= selectedRating) {
          s.classList.add("active");
        } else {
          s.classList.remove("active");
        }
      });
    });
  });

  // Submit action logic storing to LocalStorage
  if (reviewForm) {
    reviewForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const name = document.getElementById("rev-name").value.trim();
      const text = document.getElementById("rev-text").value.trim();
      
      if (!name || !text) return;
      
      const submitBtn = reviewForm.querySelector("button[type='submit']");
      submitBtn.classList.add("submitting");
      
      setTimeout(() => {
        submitBtn.classList.remove("submitting");
        
        // Save to local storage
        const newReview = {
          name: name,
          rating: selectedRating,
          text: text,
          timestamp: Date.now()
        };
        
        const reviews = getCustomReviews();
        reviews.push(newReview);
        localStorage.setItem("og_custom_reviews", JSON.stringify(reviews));
        
        // Re-render reviews
        renderReviews();
        
        alert("Thank you! Your review has been posted successfully.");
        
        // Reset form
        reviewForm.reset();
        selectedRating = 5;
        starsInputs.forEach(s => s.classList.add("active"));
        closeModal();
      }, 800);
    });
  }
}

/**
 * Accordion panel toggle behavior with precise scrollHeight animation.
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const trigger = item.querySelector(".faq-trigger");
    const panel = item.querySelector(".faq-panel");
    
    if (trigger && panel) {
      trigger.addEventListener("click", () => {
        const isActive = item.classList.contains("active");

        // Close other items
        faqItems.forEach((otherItem) => {
          if (otherItem !== item) {
            otherItem.classList.remove("active");
            otherItem.querySelector(".faq-panel").style.maxHeight = null;
          }
        });

        // Toggle active state
        if (isActive) {
          item.classList.remove("active");
          panel.style.maxHeight = null;
        } else {
          item.classList.add("active");
          panel.style.maxHeight = `${panel.scrollHeight}px`;
        }
      });
    }
  });
}

/**
 * Intercept Lead Booking form and redirect user to WhatsApp with reservation details.
 */
function initLeadFormHandler(config) {
  const form = document.getElementById("booking-lead-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("client-name").value.trim();
    const phone = document.getElementById("client-phone").value.trim();
    const service = document.getElementById("client-service").value;
    const date = document.getElementById("client-date").value;
    const time = document.getElementById("client-time").value;
    const notes = document.getElementById("client-notes").value.trim();

    const submitBtn = form.querySelector(".form-submit-btn");
    submitBtn.classList.add("submitting");

    // Micro-delay for smooth luxury UI response feedback
    setTimeout(() => {
      submitBtn.classList.remove("submitting");

      // Construct formatted message
      let waMsg = `New Appointment Request\n\n`;
      waMsg += `Name:\n${name}\n\n`;
      waMsg += `Phone:\n${phone}\n\n`;
      waMsg += `Service:\n${service}\n\n`;
      waMsg += `Date:\n${date}\n\n`;
      waMsg += `Time:\n${time}`;
      
      if (notes !== "") {
        waMsg += `\n\nSpecial Requests:\n${notes}`;
      }

      const waRedirectUrl = `https://wa.me/919029091111?text=${encodeURIComponent(waMsg)}`;
      
      // Redirect
      window.open(waRedirectUrl, "_blank");

      // Reset form
      form.reset();
    }, 600);
  });
}

/**
 * Handle Back to top button fading visibility and clicking events.
 */
function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  });

  btn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

/**
 * ScrollSpy implementation to highlight active menu section as user scrolls.
 */
function initScrollSpy() {
  const navLinks = document.querySelectorAll(".navbar-links a");
  const sections = Array.from(navLinks).map(link => {
    const href = link.getAttribute("href");
    if (href.startsWith("#")) {
      const id = href.substring(1);
      return document.getElementById(id);
    }
    return null;
  }).filter(el => el !== null);

  function highlightNav() {
    let scrollPos = window.scrollY || document.documentElement.scrollTop;
    const offset = 120; // Header offset height

    // Check if user scrolled to the very bottom
    if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50) {
      navLinks.forEach(link => {
        if (link.getAttribute("href") === "#contact") {
          link.classList.add("active-nav");
        } else {
          link.classList.remove("active-nav");
        }
      });
      return;
    }

    let activeSection = null;
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      if (scrollPos >= section.offsetTop - offset) {
        activeSection = section;
      }
    }

    // Default to Home if at the very top
    if (!activeSection && sections.length > 0) {
      activeSection = sections[0];
    }

    if (activeSection) {
      const activeId = activeSection.getAttribute("id");
      navLinks.forEach(link => {
        if (link.getAttribute("href") === `#${activeId}`) {
          link.classList.add("active-nav");
        } else {
          link.classList.remove("active-nav");
        }
      });
    }
  }

  window.addEventListener("scroll", highlightNav);
  highlightNav();
}
