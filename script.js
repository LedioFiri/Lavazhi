document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const body = document.body;
  const navigation = document.querySelector("#primary-navigation");
  const navLinks = document.querySelectorAll(".nav-menu a");

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
