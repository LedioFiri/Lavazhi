document.addEventListener("DOMContentLoaded", () => {
  const consentStorageKey = "ad-car-care-cookie-consent";
  const menuToggle = document.querySelector(".menu-toggle");
  const body = document.body;
  const navigation = document.querySelector("#primary-navigation");
  const navLinks = document.querySelectorAll(".nav-menu a");

  const getConsent = () => {
    try {
      return localStorage.getItem(consentStorageKey);
    } catch {
      return null;
    }
  };

  const saveConsent = (choice) => {
    try {
      localStorage.setItem(consentStorageKey, choice);
    } catch {
      // The banner still closes when storage is unavailable.
    }
  };

  const enableAnalytics = () => {
    const measurementId = document.documentElement.dataset.googleAnalyticsId;

    // No ID is configured in this project, so analytics remains inactive.
    if (!measurementId || document.querySelector("script[data-consent-analytics]")) {
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", measurementId);

    const analyticsScript = document.createElement("script");
    analyticsScript.async = true;
    analyticsScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    analyticsScript.dataset.consentAnalytics = "true";
    document.head.append(analyticsScript);
  };

  const createCookieConsent = () => {
    if (getConsent()) {
      if (getConsent() === "accepted") {
        enableAnalytics();
      }
      return;
    }

    const banner = document.createElement("section");
    banner.className = "cookie-consent";
    banner.setAttribute("aria-label", "Cookie consent");
    banner.setAttribute("role", "region");

    const message = document.createElement("p");
    message.textContent = "We use essential cookies to keep this website working and optional analytics cookies to understand how visitors use it.";

    const actions = document.createElement("div");
    actions.className = "cookie-consent-actions";

    const acceptButton = document.createElement("button");
    acceptButton.type = "button";
    acceptButton.className = "cookie-consent-accept";
    acceptButton.textContent = "Accept All";

    const rejectButton = document.createElement("button");
    rejectButton.type = "button";
    rejectButton.className = "cookie-consent-reject";
    rejectButton.textContent = "Reject";

    const makeChoice = (choice) => {
      saveConsent(choice);
      if (choice === "accepted") {
        enableAnalytics();
      }
      banner.remove();
    };

    acceptButton.addEventListener("click", () => makeChoice("accepted"));
    rejectButton.addEventListener("click", () => makeChoice("rejected"));

    actions.append(acceptButton, rejectButton);
    banner.append(message, actions);
    document.body.append(banner);
  };

  createCookieConsent();

  const closeMenu = () => {
    body.classList.remove("menu-open");
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
    }
  };

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      const isOpen = body.classList.toggle("menu-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (body.classList.contains("menu-open")) {
        closeMenu();
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && body.classList.contains("menu-open")) {
      closeMenu();
      menuToggle?.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (
      body.classList.contains("menu-open") &&
      !menuToggle?.contains(event.target) &&
      !navigation?.contains(event.target)
    ) {
      closeMenu();
    }
  });
});
