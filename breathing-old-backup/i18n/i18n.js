/* /i18n/i18n.js
   Breath24 shared i18n logic (global)
*/
(function () {
  "use strict";

  const STR = window.B24_STRINGS || {};
  if (!STR || !STR.en) return;

  const LS_LANG = "b24_lang";
  const LS_MANUAL = "b24_lang_manual";

  function detectLang() {
    const qp = new URL(location.href).searchParams.get("lang");
    const q = (qp || "").toLowerCase();
    if (q && STR[q]) return q;

    const manual = localStorage.getItem(LS_MANUAL) === "1";
    const saved = localStorage.getItem(LS_LANG);
    if (manual && saved && STR[saved]) return saved;

    const nav = (navigator.language || "").toLowerCase();
    if (nav.startsWith("ko")) return "ko";
    if (nav.startsWith("ja")) return "ja";
    if (nav.startsWith("es")) return "es";
    return "en";
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function setText(id, text) {
    const el = byId(id);
    if (!el || typeof text !== "string") return;
    el.textContent = text;
  }

  function applyLang(lang, isManual) {
    if (!STR[lang]) lang = "en";
    const t = STR[lang];

    document.documentElement.lang = lang;

    if (isManual) {
      localStorage.setItem(LS_LANG, lang);
      localStorage.setItem(LS_MANUAL, "1");
    } else {
      localStorage.setItem(LS_LANG, lang);
    }

    const sel = byId("langSelect");
    if (sel) sel.value = lang;

    // Header
    setText("brand_sub", t.brandSub);
    setText("nav_library", t.navLibrary);
    setText("nav_guide", t.navGuide);
    setText("nav_about", t.navAbout);

    // Hero
    setText("hero_title", t.heroTitle);
    setText("hero_sub", t.heroSub);

    // Cards
    setText("c1_title", t.c1?.title || "");
    setText("c1_desc", t.c1?.desc || "");
    setText("c1_btn", t.start);
    setText("c1_tag", t.c1?.tag || "");

    setText("c2_title", t.c2?.title || "");
    setText("c2_desc", t.c2?.desc || "");
    setText("c2_btn", t.start);
    setText("c2_tag", t.c2?.tag || "");

    setText("c3_title", t.c3?.title || "");
    setText("c3_desc", t.c3?.desc || "");
    setText("c3_btn", t.start);
    setText("c3_tag", t.c3?.tag || "");

    setText("c4_title", t.c4?.title || "");
    setText("c4_desc", t.c4?.desc || "");
    setText("c4_btn", t.start);
    setText("c4_tag", t.c4?.tag || "");

    setText("c5_title", t.c5?.title || "");
    setText("c5_desc", t.c5?.desc || "");
    setText("c5_btn", t.start);
    setText("c5_tag", t.c5?.tag || "");

    setText("c6_title", t.c6?.title || "");
    setText("c6_desc", t.c6?.desc || "");
    setText("c6_btn", t.start);
    setText("c6_tag", t.c6?.tag || "");

    // Footer
    setText("footer_brand", t.footerBrand);
    setText("footer_privacy", t.footerPrivacy);
    setText("footer_terms", t.footerTerms);
    setText("footer_about", t.footerAbout);
  }

  // Init
  applyLang(detectLang(), false);

  // Bind select change
  const sel = byId("langSelect");
  if (sel) {
    sel.addEventListener("change", (e) => {
      applyLang(e.target.value, true);
    });
  }

  window.B24_I18N = {
    apply: (lang) => applyLang(lang, true),
    current: () => document.documentElement.lang || "en",
  };
})();