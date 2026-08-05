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

  /* Agrandissement des photos de chantier.
     Sur un téléphone, une photo de fiche fait cinq centimètres de large : celui
     qui veut juger une finition doit pouvoir s'approcher. Le déclencheur est un
     vrai bouton posé par-dessus l'image — l'image garde son texte alternatif,
     la mise en page n'est pas touchée, et sans JavaScript aucune promesse
     d'agrandissement n'est affichée. */
  var photos = [].slice.call(document.querySelectorAll(".fiche .plate-photo--img img, .fiche .duo-item img"));

  if (photos.length) {
    var box = null;
    var boxImg = null;
    var boxTitle = null;
    var closeBtn = null;
    var opener = null;
    var current = 0;

    var legend = function (img) {
      var article = img.closest(".fiche");
      var kicker = article ? article.querySelector(".kicker") : null;
      var caption = img.parentNode.querySelector("figcaption");
      var parts = [];
      if (kicker) parts.push(kicker.textContent.trim());
      if (caption) parts.push(caption.textContent.trim());
      return parts.join(" — ");
    };

    var build = function () {
      box = document.createElement("div");
      box.className = "lightbox";
      box.hidden = true;
      box.innerHTML =
        '<div class="lightbox__panel" role="dialog" aria-modal="true" aria-label="Photo de chantier agrandie">' +
        '<div class="lightbox__head">' +
        '<span class="kicker lightbox__title"></span>' +
        '<button class="lightbox__close" type="button">Fermer</button>' +
        "</div>" +
        '<img class="lightbox__img" alt="">' +
        "</div>";
      document.body.appendChild(box);

      boxImg = box.querySelector(".lightbox__img");
      boxTitle = box.querySelector(".lightbox__title");
      closeBtn = box.querySelector(".lightbox__close");

      closeBtn.addEventListener("click", close);
      box.addEventListener("click", function (event) {
        if (event.target === box) close();
      });
    };

    var show = function (index) {
      current = (index + photos.length) % photos.length;
      var img = photos[current];
      boxImg.src = img.currentSrc || img.src;
      boxImg.alt = img.alt;
      boxTitle.textContent = legend(img);
    };

    var open = function (index) {
      if (!box) build();
      opener = document.activeElement;
      show(index);
      box.hidden = false;
      document.documentElement.classList.add("lightbox-open");
      closeBtn.focus();
    };

    function close() {
      if (!box || box.hidden) return;
      box.hidden = true;
      document.documentElement.classList.remove("lightbox-open");
      if (opener && opener.focus) opener.focus();
      opener = null;
    }

    /* Le clavier ne doit jamais sortir de la fenêtre ouverte, et Échap la ferme
       toujours — un visiteur au clavier ne doit pas se retrouver piégé. */
    document.addEventListener("keydown", function (event) {
      if (!box || box.hidden) return;
      if (event.key === "Escape") {
        close();
      } else if (event.key === "Tab") {
        event.preventDefault();
        closeBtn.focus();
      } else if (event.key === "ArrowRight") {
        show(current + 1);
      } else if (event.key === "ArrowLeft") {
        show(current - 1);
      }
    });

    photos.forEach(function (img, index) {
      var holder = img.parentNode;
      var trigger = document.createElement("button");
      trigger.type = "button";
      trigger.className = "zoom-btn";
      trigger.setAttribute("aria-label", "Agrandir la photo : " + img.alt);
      trigger.addEventListener("click", function () {
        open(index);
      });
      holder.appendChild(trigger);
    });
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
