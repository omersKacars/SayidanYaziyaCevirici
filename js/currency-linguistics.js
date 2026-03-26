"use strict";

(function () {
  const cfg = window.AppConfig || {};
  const FORMS = cfg.CURRENCY_UNIT_FORMS || {};
  const STYLE_GUIDE_TERMS = cfg.STYLE_GUIDE_TERMS || {};

  function chooseRuForm(n, one, few, many) {
    const n10 = n % 10;
    const n100 = n % 100;
    if (n10 === 1 && n100 !== 11) return one;
    if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return few;
    return many;
  }

  function resolveUnitByValue(lang, currency, unitType, value, fallbackUnit) {
    const byCurrency = FORMS[currency];
    const byLang = byCurrency && byCurrency[lang];
    const forms = byLang && byLang[unitType];
    if (!forms || !forms.length) return fallbackUnit;

    if (lang === "ru-RU" && forms.length >= 3) {
      return chooseRuForm(value, forms[0], forms[1], forms[2]);
    }

    if (forms.length === 1) return forms[0];
    return value === 1 ? forms[0] : forms[1];
  }

  function applyStyleGuide(lang, text) {
    const dict = STYLE_GUIDE_TERMS[lang];
    if (!dict) return text;
    let out = text;
    Object.keys(dict).forEach((from) => {
      out = out.split(from).join(dict[from]);
    });
    return out;
  }

  window.AppCurrencyLinguistics = {
    resolveUnitByValue,
    applyStyleGuide,
  };
})();
