(function () {
  "use strict";

  /* Replace only the values marked PLACEHOLDER before publishing. */
  window.EXIT_CLOCK_CONFIG = {
    price: 999,
    listPrice: 1499,
    checkoutUrl: "CHECKOUT_URL_PLACEHOLDER",
    formEndpoint: "FORM_ENDPOINT_PLACEHOLDER",
    changelogUrl: "CHANGELOG_URL_PLACEHOLDER",
    sources: [
      "SOURCE_PLACEHOLDER",
      "SOURCE_PLACEHOLDER",
      "SOURCE_PLACEHOLDER",
      "SOURCE_PLACEHOLDER",
      "SOURCE_PLACEHOLDER"
    ],
    analytics: "ANALYTICS_PLACEHOLDER",
    contactEmail: "exitclock2026@gmail.com",
    instagram: "https://instagram.com/exit.clock"
  };

  var config = window.EXIT_CLOCK_CONFIG;
  var announcement = document.querySelector("[data-announcement]");
  var header = document.querySelector(".site-header");
  var menuButton = document.querySelector("[data-menu-toggle]");
  var nav = document.querySelector(".main-nav");

  if (announcement && sessionStorage.getItem("exitclock-announcement-dismissed") === "1") announcement.hidden = true;
  document.querySelectorAll("[data-dismiss-announcement]").forEach(function (button) {
    button.addEventListener("click", function () {
      if (announcement) announcement.hidden = true;
      sessionStorage.setItem("exitclock-announcement-dismissed", "1");
    });
  });

  if (menuButton && nav) {
    menuButton.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("menu-open", open);
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
      });
    });
  }
  function shadowHeader() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 40);
  }
  shadowHeader();
  window.addEventListener("scroll", shadowHeader, { passive: true });

  function unset(value) { return !value || value.indexOf("PLACEHOLDER") !== -1; }

  var checkoutLinks = document.querySelectorAll("[data-checkout]");
  if (unset(config.checkoutUrl)) {
    /* No storefront URL yet: keep the buttons on the page but never send anyone to a dead link. */
    checkoutLinks.forEach(function (link) {
      link.setAttribute("href", "#pricing");
      link.setAttribute("data-pending", "");
      link.setAttribute("aria-disabled", "true");
    });
    var card = document.querySelector(".price-card");
    if (card) {
      var note = document.createElement("p");
      note.className = "setup-note";
      note.textContent = "Checkout not connected yet — set checkoutUrl in assets/js/site.js";
      card.appendChild(note);
    }
  } else {
    checkoutLinks.forEach(function (link) {
      link.href = config.checkoutUrl;
      link.target = "_blank";
      link.rel = "noopener";
      link.removeAttribute("data-pending");
      link.removeAttribute("aria-disabled");
    });
  }

  document.querySelectorAll("[data-changelog]").forEach(function (link) {
    if (unset(config.changelogUrl)) {
      /* Replace the dead anchor with its own text so the sentence still reads correctly. */
      var text = document.createTextNode(link.textContent);
      if (link.parentNode) link.parentNode.replaceChild(text, link);
      return;
    }
    link.href = config.changelogUrl;
  });
  document.querySelectorAll("[data-contact]").forEach(function (link) {
    link.href = "mailto:" + config.contactEmail;
    if (link.textContent.indexOf("@") === -1) link.textContent = config.contactEmail;
  });
  document.querySelectorAll("[data-instagram]").forEach(function (link) {
    link.href = config.instagram;
  });
  document.querySelectorAll("[data-price]").forEach(function (node) { node.textContent = "₹" + config.price.toLocaleString("en-IN"); });
  document.querySelectorAll("[data-list-price]").forEach(function (node) { node.textContent = "₹" + config.listPrice.toLocaleString("en-IN"); });

  /* Privacy-friendly analytics can be wired here later. No cookies or Google Analytics. */
  // ANALYTICS_PLACEHOLDER: load Plausible or Umami here if desired.

  document.addEventListener("click", function (event) {
    var cta = event.target.closest("[data-cta]");
    if (!cta) return;
    window.dispatchEvent(new CustomEvent("exitclock:cta", { detail: { name: cta.dataset.cta } }));
  });
})();