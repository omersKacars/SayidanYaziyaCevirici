"use strict";

(function () {
  const cfg = window.AppConfig || {};
  const registry = window.AppNumberTextRegistry || { get: () => null };
  const linguistics = window.AppCurrencyLinguistics || {
    resolveUnitByValue: (_lang, _currency, _unitType, _value, fallbackUnit) => fallbackUnit,
    applyStyleGuide: (_lang, text) => text,
  };

  const UI_TEXT = cfg.UI_TEXT || {};
  const LANG_KEY_BY_CODE = cfg.LANG_KEY_BY_CODE || {};
  const MINOR_FALLBACK_BY_LANG = cfg.MINOR_FALLBACK_BY_LANG || { tr: "kurus", en: "cent" };
  const CURRENCY_UNITS = cfg.CURRENCY_UNITS || {};

  function getUi(lang) {
    return UI_TEXT[lang] || UI_TEXT["en-US"];
  }

  function getCurrencyDisplayName(currency, lang) {
    try {
      const display = new Intl.DisplayNames([lang], { type: "currency" });
      return display.of(currency) || currency;
    } catch {
      return currency;
    }
  }

  function getCurrencyUnits(currency, lang) {
    const langKey = LANG_KEY_BY_CODE[lang] || "en";
    const info = CURRENCY_UNITS[currency];
    if (!info) return { major: currency, minor: "minor" };
    if (info[langKey]) return info[langKey];
    if (lang === "tr-TR" && info.tr) return info.tr;
    return {
      major: getCurrencyDisplayName(currency, lang),
      minor: (info.default && info.default.minor) || MINOR_FALLBACK_BY_LANG[langKey] || "minor",
    };
  }

  function composeCurrencyTextByLanguage(lang, units, majorValue, majorWords, minorValue, minorWords) {
    const majorUnit = linguistics.resolveUnitByValue(lang, units.currency, "major", majorValue, units.major);
    const minorUnit = linguistics.resolveUnitByValue(lang, units.currency, "minor", minorValue, units.minor);
    let out = "";
    if (lang === "ar-SA") out = `${majorWords} ${majorUnit} و${minorWords} ${minorUnit}`;
    else if (lang === "zh-CN") out = `${majorWords}${majorUnit}${minorWords}${minorUnit}`;
    else out = `${majorWords} ${majorUnit} ${minorWords} ${minorUnit}`;
    return linguistics.applyStyleGuide(lang, out);
  }

  function numberToTextByLanguage(value, lang) {
    const converter = registry.get(lang);
    return converter ? converter(value) : null;
  }

  function formatNumberForInput(digits) {
    if (!digits) return "";
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function normalizeMinor(rawMinor) {
    const raw = (rawMinor || "").trim();
    if (!raw) return { majorCarry: 0, minorValue: 0 };
    if (!/^\d+$/.test(raw)) return { error: "minorDigits" };
    if (raw.length <= 2) return { majorCarry: 0, minorValue: Number(raw) };
    const firstTwo = Number(raw.slice(0, 2));
    const third = Number(raw.charAt(2));
    const rounded = firstTwo + (third >= 5 ? 1 : 0);
    if (rounded === 100) return { majorCarry: 1, minorValue: 0 };
    return { majorCarry: 0, minorValue: rounded };
  }

  function validateInputs(majorRaw, minorRaw, ui) {
    const majorText = (majorRaw || "").replace(/\./g, "").trim();
    if (!majorText) return { isValid: false, message: ui.majorRequired };
    if (!/^\d+$/.test(majorText)) return { isValid: false, message: ui.majorDigits };
    let majorValue = Number(majorText);
    if (!Number.isSafeInteger(majorValue)) return { isValid: false, message: ui.majorTooBig };
    const normalizedMinor = normalizeMinor(minorRaw);
    if (normalizedMinor.error) return { isValid: false, message: ui.minorDigits };
    majorValue += normalizedMinor.majorCarry;
    if (!Number.isSafeInteger(majorValue)) return { isValid: false, message: ui.majorTooBig };
    return { isValid: true, value: { majorValue, minorValue: normalizedMinor.minorValue } };
  }

  function formatLocalizedCurrencyText(lang, currency, majorValue, minorValue) {
    const units = getCurrencyUnits(currency, lang);
    units.currency = currency;
    const wordMajor = numberToTextByLanguage(majorValue, lang);
    const wordMinor = numberToTextByLanguage(minorValue, lang);
    if (wordMajor && wordMinor) {
      return composeCurrencyTextByLanguage(lang, units, majorValue, wordMajor, minorValue, wordMinor);
    }
    const amount = majorValue + minorValue / 100;
    const localizedNumeric = new Intl.NumberFormat(lang, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
    return localizedNumeric + " (" + units.major + " / " + units.minor + ")";
  }

  window.AppFormatters = {
    getUi,
    getCurrencyUnits,
    formatNumberForInput,
    validateInputs,
    formatLocalizedCurrencyText,
  };
})();
