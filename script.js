document.addEventListener("DOMContentLoaded", () => {
  const consentKey = "ad-car-wash-cookie-consent";
  const body = document.body;
  const toggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#primary-navigation");
  const closeMenu = () => {
    body.classList.remove("menu-open");
    if (toggle) { toggle.setAttribute("aria-expanded", "false"); toggle.setAttribute("aria-label", "Open menu"); }
  };
  if (toggle) toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const open = body.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  document.querySelectorAll(".nav-menu a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && body.classList.contains("menu-open")) { closeMenu(); toggle?.focus(); }
  });
  document.addEventListener("click", (event) => {
    if (body.classList.contains("menu-open") && !toggle?.contains(event.target) && !navigation?.contains(event.target)) closeMenu();
  });
  const getConsent = () => { try { return localStorage.getItem(consentKey); } catch { return null; } };
  const saveConsent = (choice) => { try { localStorage.setItem(consentKey, choice); } catch { /* Banner still closes. */ } };
  const loadAnalytics = () => {
    const id = document.documentElement.dataset.googleAnalyticsId;
    if (!id || document.querySelector("[data-consent-analytics]")) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", id);
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    script.dataset.consentAnalytics = "true";
    document.head.append(script);
  };
  if (getConsent() === "accepted") { loadAnalytics(); return; }
  if (getConsent()) return;
  const banner = document.createElement("section");
  banner.className = "cookie-consent";
  banner.setAttribute("aria-label", "Cookie choices");
  banner.setAttribute("role", "region");
  banner.innerHTML = '<p>We use essential storage to remember this choice. Optional analytics help us understand site use. Read our <a href="privacy-policy.html">Privacy Policy</a>.</p><div class="cookie-consent-actions"><button class="accept" type="button">Accept all</button><button class="reject" type="button">Reject optional</button></div>';
  const choose = (choice) => { saveConsent(choice); if (choice === "accepted") loadAnalytics(); banner.remove(); };
  banner.querySelector(".accept").addEventListener("click", () => choose("accepted"));
  banner.querySelector(".reject").addEventListener("click", () => choose("rejected"));
  body.append(banner);
});
