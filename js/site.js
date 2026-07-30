/* RIPE — comportements du site (navigation mobile + formulaire de contact) */

(function () {
  "use strict";

  /* Navigation mobile */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      var label = toggle.querySelector(".nav-toggle__label");
      if (label) label.textContent = open ? "Fermer" : "Menu";
    });
  }

  /* Année courante dans le pied de page */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* Révélation à l'approche : les éléments d'une même série se posent dans
     l'ordre, plafonné pour qu'aucun visiteur n'attende. La classe « motion »
     est posée en amont ; sans elle, rien n'est masqué ni animé.
     Le calcul se fait à partir de la position réelle des éléments : si le
     script s'interrompt, un filet de sécurité affiche tout. Une page blanche
     n'est jamais une option. */
  if (document.documentElement.classList.contains("motion")) {
    var pending = [].slice.call(document.querySelectorAll(".reveal, .section-head"));

    ["timeline", "presta-items", "spec-list"].forEach(function (groupClass) {
      [].forEach.call(document.querySelectorAll("." + groupClass), function (group) {
        [].forEach.call(group.querySelectorAll(".reveal"), function (el, index) {
          el.style.setProperty("--reveal-delay", Math.min(index, 4) * 70 + "ms");
        });
      });
    });

    var reveal = function (el) {
      el.classList.add("in-view");
    };

    var revealVisible = function () {
      var limit = window.innerHeight * 0.92;
      pending = pending.filter(function (el) {
        var box = el.getBoundingClientRect();
        if (box.top < limit && box.bottom > 0) {
          reveal(el);
          return false;
        }
        return true;
      });
    };

    var queued = false;
    var onScroll = function () {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(function () {
        queued = false;
        revealVisible();
      });
    };

    revealVisible();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("load", revealVisible);

    /* Filet de sécurité : quoi qu'il arrive, rien ne reste masqué. */
    window.setTimeout(function () {
      pending.forEach(reveal);
      pending = [];
    }, 6000);
  }

  /* Formulaire de contact : les demandes partent vers la boîte de l'entreprise
     via Formspree. Si l'envoi échoue, le visiteur est renvoyé vers le téléphone
     et l'e-mail affichés en haut de page. */
  var FORM_ENDPOINT = "https://formspree.io/f/mrendwyk";

  var form = document.querySelector("#contact-form");
  if (!form) return;

  var alertBox = form.querySelector(".form-alert");
  var successBox = document.querySelector("#form-success");
  var submitBtn = form.querySelector("button[type=submit]");

  function setError(row, message) {
    row.classList.add("invalid");
    var msg = row.querySelector(".field-error");
    if (msg) msg.textContent = message;
  }

  function clearErrors() {
    form.querySelectorAll(".form-row.invalid").forEach(function (row) {
      row.classList.remove("invalid");
    });
    if (alertBox) alertBox.hidden = true;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearErrors();

    var valid = true;
    var focusTarget = null;

    form.querySelectorAll("[required]").forEach(function (input) {
      var row = input.closest(".form-row");
      var value = input.value.trim();
      if (!value) {
        setError(row, "Ce champ est nécessaire pour traiter votre demande.");
        valid = false;
        if (!focusTarget) focusTarget = input;
      } else if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setError(row, "Cette adresse e-mail semble incomplète (exemple : nom@domaine.fr).");
        valid = false;
        if (!focusTarget) focusTarget = input;
      }
    });

    if (!valid) {
      if (focusTarget) focusTarget.focus();
      return;
    }

    if (!FORM_ENDPOINT) {
      if (alertBox) {
        alertBox.hidden = false;
        alertBox.focus();
      }
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Envoi en cours…";

    fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form)
    })
      .then(function (response) {
        if (!response.ok) throw new Error("send-failed");
        form.hidden = true;
        if (successBox) {
          successBox.hidden = false;
          successBox.focus();
        }
      })
      .catch(function () {
        if (alertBox) {
          alertBox.hidden = false;
          alertBox.focus();
        }
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = "Envoyer la demande";
      });
  });
})();
