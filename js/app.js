"use strict";

const appConfig = window.AppConfig || {};
const appFormatters = window.AppFormatters || {};
const appDocTemplates = window.AppDocumentTemplates || {};
const uiTextMap = appConfig.UI_TEXT || {};
const templateUiLabelsByLang = appConfig.TEMPLATE_UI_LABELS || {
  "en-US": { templateLabel: "Document Template", officialModeLabel: "Official Output Mode (ONLY ...)" },
};

const fallbackLanguages = [
  { code: "tr-TR", name: "Türkçe", country: "tr" },
  { code: "en-US", name: "English", country: "us" },
  { code: "de-DE", name: "Deutsch", country: "de" },
  { code: "fr-FR", name: "Français", country: "fr" },
  { code: "es-ES", name: "Español", country: "es" },
  { code: "it-IT", name: "Italiano", country: "it" },
  { code: "pt-BR", name: "Português (BR)", country: "br" },
  { code: "ru-RU", name: "Русский", country: "ru" },
  { code: "ar-SA", name: "العربية", country: "sa" },
  { code: "zh-CN", name: "中文", country: "cn" },
];
const fallbackCurrencies = ["TRY", "USD", "EUR", "GBP", "JPY", "SAR", "AED", "RUB", "CNY", "INR"];
const fallbackCurrencyMeta = {
  TRY: { symbol: "₺", fallbackName: "Türk lirası" },
  USD: { symbol: "$", fallbackName: "US dollar" },
  EUR: { symbol: "€", fallbackName: "Euro" },
  GBP: { symbol: "£", fallbackName: "Pound sterling" },
  JPY: { symbol: "¥", fallbackName: "Japanese yen" },
  SAR: { symbol: "﷼", fallbackName: "Saudi riyal" },
  AED: { symbol: "د.إ", fallbackName: "UAE dirham" },
  RUB: { symbol: "₽", fallbackName: "Russian ruble" },
  CNY: { symbol: "¥", fallbackName: "Chinese yuan" },
  INR: { symbol: "₹", fallbackName: "Indian rupee" },
};
const fallbackFlagMap = { TRY: "tr", USD: "us", EUR: "eu", GBP: "gb", JPY: "jp", SAR: "sa", AED: "ae", RUB: "ru", CNY: "cn", INR: "in" };
const fallbackLangKey = { "tr-TR": "tr", "en-US": "en", "de-DE": "de", "fr-FR": "fr", "es-ES": "es", "it-IT": "it", "pt-BR": "pt", "ru-RU": "ru", "ar-SA": "ar", "zh-CN": "zh" };
const fallbackStorage = { history: "amountHistoryV2", appLang: "appLanguageV1", outputLang: "outputLanguageV1", currency: "currencyV1", theme: "preferredTheme" };

const LANGUAGES = (appConfig.LANGUAGES && appConfig.LANGUAGES.length ? appConfig.LANGUAGES : fallbackLanguages);
const CURRENCIES = (appConfig.CURRENCIES && appConfig.CURRENCIES.length ? appConfig.CURRENCIES : fallbackCurrencies);
const CURRENCY_META = appConfig.CURRENCY_META || fallbackCurrencyMeta;
const CURRENCY_FLAG_COUNTRY = appConfig.CURRENCY_FLAG_COUNTRY || fallbackFlagMap;
const APP_LANG_KEY_BY_CODE = appConfig.LANG_KEY_BY_CODE || fallbackLangKey;
const STORAGE_KEYS = appConfig.STORAGE_KEYS || fallbackStorage;
const {
  getUi: formatterGetUi = (lang) => uiTextMap[lang] || uiTextMap["en-US"] || {
    title: "Amount Text Converter",
    subtitle: "",
    appLanguageLabel: "App Language",
    outputLanguageLabel: "Output Language",
    currencyLabel: "Currency",
    majorLabel: "Major Unit",
    minorLabel: "Minor Unit",
    resultTitle: "Result",
    convertBtn: "Convert",
    copyBtn: "Copy Result",
    copiedBtn: "Copied",
    copySuccess: "Copied.",
    success: "Done.",
    majorRequired: "Major unit is required.",
    majorDigits: "Digits only.",
    minorDigits: "Digits only.",
    majorTooBig: "Value is too large.",
    conversionError: "Conversion error.",
    copyFailed: "Copy failed.",
  },
  getCurrencyUnits: formatterGetCurrencyUnits = () => ({ major: "", minor: "" }),
  formatNumberForInput: formatterFormatNumberForInput = (v) => (v || "").replace(/\B(?=(\d{3})+(?!\d))/g, "."),
  validateInputs: formatterValidateInputs = (majorRaw, minorRaw, ui) => {
    const majorText = (majorRaw || "").replace(/\./g, "").trim();
    if (!majorText) return { isValid: false, message: ui.majorRequired };
    if (!/^\d+$/.test(majorText)) return { isValid: false, message: ui.majorDigits };
    const minorText = (minorRaw || "").trim();
    if (minorText && !/^\d+$/.test(minorText)) return { isValid: false, message: ui.minorDigits };
    return {
      isValid: true,
      value: {
        majorValue: Number(majorText),
        minorValue: Number(minorText || "0"),
      },
    };
  },
  formatLocalizedCurrencyText: formatterFormatLocalizedCurrencyText = (lang, currency, majorValue, minorValue) => {
    const amount = majorValue + minorValue / 100;
    try {
      return new Intl.NumberFormat(lang, { style: "currency", currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
    } catch {
      return `${amount.toFixed(2)} ${currency}`;
    }
  },
} = appFormatters;

const form = document.querySelector("#convert-form");
const appLanguageSelect = document.querySelector("#app-language-select");
const outputLanguageSelect = document.querySelector("#output-language-select");
const currencySelect = document.querySelector("#currency-select");
const majorInput = document.querySelector("#major-input");
const minorInput = document.querySelector("#minor-input");
const errorText = document.querySelector("#error-text");
const statusText = document.querySelector("#status-text");
const resultText = document.querySelector("#result-text");
const copyBtn = document.querySelector("#copy-btn");
const themeToggleBtn = document.querySelector("#theme-toggle-btn");
const currencyIcon = document.querySelector("#currency-icon");
const currencyName = document.querySelector("#currency-name");
const currencyCode = document.querySelector("#currency-code");
const historyTitle = document.querySelector("#history-title");
const historyList = document.querySelector("#history-list");
const clearHistoryBtn = document.querySelector("#clear-history-btn");
const appLanguageFlag = document.querySelector("#app-language-flag");
const outputLanguageFlag = document.querySelector("#output-language-flag");
const currencyFlag = document.querySelector("#currency-flag");
const localeFlag = document.querySelector("#locale-flag");
const localeText = document.querySelector("#locale-text");
const appLanguageLabelText = document.querySelector("#app-language-label-text");
const outputLanguageLabelText = document.querySelector("#output-language-label-text");
const currencyLabelText = document.querySelector("#currency-label-text");
const templateLabel = document.querySelector("#template-label");
const templateSelect = document.querySelector("#document-template-select");
const officialModeCheckbox = document.querySelector("#official-mode-checkbox");
const officialModeLabel = document.querySelector("#official-mode-label");

let lastResult = "";
let historyItems = [];

function safeLocalGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeLocalSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* noop */
  }
}

function flagCdnUrl(countryCode) {
  return countryCode ? `./assets/flags/${countryCode.toLowerCase()}.svg` : "";
}

function setFlagImage(imgElement, countryCode, altText) {
  if (!imgElement) return;
  imgElement.style.display = "";
  imgElement.onerror = () => {
    imgElement.style.display = "none";
  };
  imgElement.src = flagCdnUrl(countryCode);
  imgElement.alt = altText || "Bayrak";
}

function getLanguageMeta(langCode) {
  return LANGUAGES.find((item) => item.code === langCode) || LANGUAGES[0];
}

function resolveUi(lang) {
  const candidate = typeof formatterGetUi === "function" ? formatterGetUi(lang) : null;
  if (candidate) return candidate;
  return uiTextMap[lang] || uiTextMap["en-US"] || {
    title: "Amount Text Converter",
    subtitle: "",
    appLanguageLabel: "App Language",
    outputLanguageLabel: "Output Language",
    currencyLabel: "Currency",
    majorLabel: "Major Unit",
    minorLabel: "Minor Unit",
    resultTitle: "Result",
    convertBtn: "Convert",
    copyBtn: "Copy Result",
    copiedBtn: "Copied",
    copySuccess: "Copied.",
    success: "Done.",
    majorRequired: "Major unit is required.",
    majorDigits: "Digits only.",
    minorDigits: "Digits only.",
    majorTooBig: "Value is too large.",
    conversionError: "Conversion error.",
    copyFailed: "Copy failed.",
    templateLabel: "Document Template",
    officialModeLabel: "Official Output Mode (ONLY ...)",
  };
}

function resolveTemplateUi(lang) {
  return templateUiLabelsByLang[lang] || templateUiLabelsByLang["en-US"];
}

function getTemplateOptions(lang) {
  if (typeof appDocTemplates.getTemplateOptions === "function") {
    return appDocTemplates.getTemplateOptions(lang);
  }
  return [{ id: "none", label: "No Template" }];
}

function applyDocumentTemplate(input) {
  if (typeof appDocTemplates.applyDocumentTemplate === "function") {
    return appDocTemplates.applyDocumentTemplate(input);
  }
  return input.amountText;
}

function getLocalizedLanguageName(langCode, displayLang) {
  const meta = getLanguageMeta(langCode);
  try {
    const dn = new Intl.DisplayNames([displayLang], { type: "language" });
    return dn.of(langCode) || dn.of(langCode.split("-")[0]) || meta.name;
  } catch {
    return meta.name;
  }
}

function refreshLanguageSelectOptions() {
  if (!appLanguageSelect || !outputLanguageSelect) return;
  const currentApp = appLanguageSelect.value || "tr-TR";
  const currentOutput = outputLanguageSelect.value || "tr-TR";
  const displayLang = currentApp;
  const options = LANGUAGES.map((lang) => {
    const label = getLocalizedLanguageName(lang.code, displayLang);
    return `<option value="${lang.code}">${label}</option>`;
  }).join("");
  appLanguageSelect.innerHTML = options;
  outputLanguageSelect.innerHTML = options;
  appLanguageSelect.value = currentApp;
  outputLanguageSelect.value = currentOutput;
}

function setError(message) {
  errorText.textContent = message || "";
  if (message) errorText.setAttribute("role", "alert");
  else errorText.removeAttribute("role");
}

function setStatus(message) {
  statusText.textContent = message || "";
}

function setResult(text) {
  resultText.textContent = text || "-";
  lastResult = text || "";
  copyBtn.disabled = !text;
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  safeLocalSet(STORAGE_KEYS.theme, theme);
  themeToggleBtn.textContent = theme === "dark" ? "☀️ Light" : "🌙 Dark";
}

function initTheme() {
  const stored = safeLocalGet(STORAGE_KEYS.theme);
  if (stored === "dark" || stored === "light") return setTheme(stored);
  const darkPreferred = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(darkPreferred ? "dark" : "light");
}

function loadHistory() {
  try {
    const raw = safeLocalGet(STORAGE_KEYS.history);
    historyItems = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(historyItems)) historyItems = [];
  } catch {
    historyItems = [];
  }
}

function saveHistory() {
  safeLocalSet(STORAGE_KEYS.history, JSON.stringify(historyItems));
}

function renderHistory() {
  historyList.innerHTML = "";
  if (!historyItems.length) {
    const li = document.createElement("li");
    li.textContent = "-";
    historyList.appendChild(li);
    return;
  }
  historyItems.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    historyList.appendChild(li);
  });
}

function pushHistory(entry) {
  historyItems.unshift(entry);
  historyItems = historyItems.slice(0, 5);
  saveHistory();
  renderHistory();
}

function restoreSelections() {
  const storedApp = safeLocalGet(STORAGE_KEYS.appLang);
  const storedOutput = safeLocalGet(STORAGE_KEYS.outputLang);
  const storedCurrency = safeLocalGet(STORAGE_KEYS.currency);
  if (storedApp && LANGUAGES.some((l) => l.code === storedApp)) appLanguageSelect.value = storedApp;
  if (storedOutput && LANGUAGES.some((l) => l.code === storedOutput)) outputLanguageSelect.value = storedOutput;
  if (storedCurrency && CURRENCIES.includes(storedCurrency)) currencySelect.value = storedCurrency;
}

function persistSelections() {
  safeLocalSet(STORAGE_KEYS.appLang, appLanguageSelect.value);
  safeLocalSet(STORAGE_KEYS.outputLang, outputLanguageSelect.value);
  safeLocalSet(STORAGE_KEYS.currency, currencySelect.value);
}

function updateInlineFlags() {
  const appLangMeta = getLanguageMeta(appLanguageSelect.value);
  const outputLangMeta = getLanguageMeta(outputLanguageSelect.value);
  const currencyCountry = CURRENCY_FLAG_COUNTRY[currencySelect.value];
  setFlagImage(appLanguageFlag, appLangMeta.country, "Uygulama dili bayrağı");
  setFlagImage(outputLanguageFlag, outputLangMeta.country, "Sonuç dili bayrağı");
  setFlagImage(currencyFlag, currencyCountry, "Para birimi bayrağı");
}

function updateLocaleChip() {
  if (!localeFlag || !localeText) return;
  const outputLang = outputLanguageSelect.value;
  const currency = currencySelect.value;
  const languageMeta = getLanguageMeta(outputLang);
  setFlagImage(localeFlag, languageMeta.country, "Seçili dil bayrağı");
  localeText.textContent = `${languageMeta.name} / ${currency}`;
}

function applyLanguageAccent() {
  const accent = APP_LANG_KEY_BY_CODE[outputLanguageSelect.value] || "en";
  document.documentElement.setAttribute("data-accent", accent);
}

function populateSelectors() {
  const options = LANGUAGES.map((lang) => `<option value="${lang.code}">${lang.name}</option>`).join("");
  appLanguageSelect.innerHTML = options;
  outputLanguageSelect.innerHTML = options;
  currencySelect.innerHTML = CURRENCIES.map((cur) => {
    const meta = CURRENCY_META[cur];
    return `<option value="${cur}">${meta ? meta.symbol : ""} ${cur}</option>`;
  }).join("");
  appLanguageSelect.value = "tr-TR";
  outputLanguageSelect.value = "tr-TR";
  currencySelect.value = "TRY";
  restoreSelections();
  refreshLanguageSelectOptions();
  const templateOptions = getTemplateOptions(appLanguageSelect.value);
  if (templateSelect) {
    templateSelect.innerHTML = templateOptions.map((item) => `<option value="${item.id}">${item.label}</option>`).join("");
    templateSelect.value = "none";
  }
}

function updateCurrencyMetaBadge() {
  const currency = currencySelect.value;
  const outputLang = outputLanguageSelect.value;
  const meta = CURRENCY_META[currency] || { fallbackName: currency };
  const units = formatterGetCurrencyUnits(currency, outputLang);
  setFlagImage(currencyIcon, CURRENCY_FLAG_COUNTRY[currency], "Para birimi bayrağı");
  currencyName.textContent = units.major || meta.fallbackName;
  currencyCode.textContent = currency;
}

function updateCurrencyUnitLabels() {
  const appLang = appLanguageSelect.value;
  const outputLang = outputLanguageSelect.value;
  const currency = currencySelect.value;
  const ui = resolveUi(appLang);
  const units = formatterGetCurrencyUnits(currency, outputLang);
  document.querySelector("#major-label").textContent = `${ui.majorLabel} (${units.major})`;
  document.querySelector("#minor-label").textContent = `${ui.minorLabel} (${units.minor})`;
  updateCurrencyMetaBadge();
  updateLocaleChip();
  updateInlineFlags();
  applyLanguageAccent();
}

function applyUiLanguage() {
  const appLang = appLanguageSelect.value;
  const ui = resolveUi(appLang);
  const templateUi = resolveTemplateUi(appLang);
  refreshLanguageSelectOptions();
  document.documentElement.lang = appLang.slice(0, 2);
  document.documentElement.dir = appLang === "ar-SA" ? "rtl" : "ltr";
  document.querySelector("#title").textContent = ui.title;
  document.querySelector("#subtitle").textContent = ui.subtitle;
  if (appLanguageLabelText) appLanguageLabelText.textContent = ui.appLanguageLabel;
  if (outputLanguageLabelText) outputLanguageLabelText.textContent = ui.outputLanguageLabel;
  if (currencyLabelText) currencyLabelText.textContent = ui.currencyLabel;
  if (templateLabel) templateLabel.textContent = templateUi.templateLabel;
  if (officialModeLabel) officialModeLabel.textContent = templateUi.officialModeLabel;

  if (templateSelect) {
    const previous = templateSelect.value || "none";
    const options = getTemplateOptions(appLang);
    templateSelect.innerHTML = options.map((item) => `<option value="${item.id}">${item.label}</option>`).join("");
    templateSelect.value = options.some((item) => item.id === previous) ? previous : "none";
  }
  updateCurrencyUnitLabels();
  document.querySelector("#result-title").textContent = ui.resultTitle;
  document.querySelector("#convert-btn").textContent = ui.convertBtn;
  copyBtn.textContent = ui.copyBtn;
  historyTitle.textContent = appLang === "tr-TR" ? "Son 5 İşlem" : "Last 5 Conversions";
  clearHistoryBtn.textContent = appLang === "tr-TR" ? "Temizle" : "Clear";
}

function onlyDigitsInput(event) {
  const sanitized = event.target.value.replace(/\D+/g, "");
  if (sanitized !== event.target.value) event.target.value = sanitized;
}

function formatMajorInput(event) {
  event.target.value = formatterFormatNumberForInput(event.target.value.replace(/\D+/g, ""));
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
  const temp = document.createElement("textarea");
  temp.value = text;
  temp.style.position = "absolute";
  temp.style.left = "-9999px";
  document.body.appendChild(temp);
  temp.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(temp);
  if (!copied) throw new Error("copy-failed");
}

function animateResult() {
  resultText.classList.remove("animate__animated", "animate__pulse");
  void resultText.offsetWidth;
  resultText.classList.add("animate__animated", "animate__pulse");
}

populateSelectors();
initTheme();
loadHistory();
renderHistory();
applyUiLanguage();
persistSelections();
if (window.AOS) window.AOS.init({ duration: 500, once: true });

themeToggleBtn.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  setTheme(current === "dark" ? "light" : "dark");
});

appLanguageSelect.addEventListener("change", () => {
  applyUiLanguage();
  persistSelections();
  setError("");
  setStatus("");
});

if (templateSelect) {
  templateSelect.addEventListener("change", () => {
    setError("");
    setStatus("");
  });
}

if (officialModeCheckbox) {
  officialModeCheckbox.addEventListener("change", () => {
    setError("");
    setStatus("");
  });
}

outputLanguageSelect.addEventListener("change", () => {
  updateCurrencyUnitLabels();
  persistSelections();
  setError("");
  setStatus("");
});

currencySelect.addEventListener("change", () => {
  updateCurrencyUnitLabels();
  persistSelections();
  setError("");
  setStatus("");
});

majorInput.addEventListener("input", formatMajorInput);
minorInput.addEventListener("input", onlyDigitsInput);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  setError("");
  setStatus("");
  const ui = resolveUi(appLanguageSelect.value);
  const validation = formatterValidateInputs(majorInput.value, minorInput.value, ui);
  if (!validation.isValid) {
    setResult("");
    setError(validation.message);
    return;
  }
  try {
    const rawOutput = formatterFormatLocalizedCurrencyText(
      outputLanguageSelect.value,
      currencySelect.value,
      validation.value.majorValue,
      validation.value.minorValue
    );
    const output = applyDocumentTemplate({
      appLang: appLanguageSelect.value,
      outputLang: outputLanguageSelect.value,
      templateId: templateSelect ? templateSelect.value : "none",
      officialMode: officialModeCheckbox ? officialModeCheckbox.checked : false,
      amountText: rawOutput,
      currency: currencySelect.value,
    });
    setResult(output);
    animateResult();
    pushHistory(output);
    setStatus(ui.success);
  } catch {
    setResult("");
    setError(ui.conversionError);
  }
});

copyBtn.addEventListener("click", async () => {
  if (!lastResult) return;
  const ui = resolveUi(appLanguageSelect.value);
  try {
    await copyText(lastResult);
    resultText.classList.remove("flash-copy");
    void resultText.offsetWidth;
    resultText.classList.add("flash-copy");
    copyBtn.textContent = ui.copiedBtn;
    setStatus(ui.copySuccess);
    setTimeout(() => {
      copyBtn.textContent = ui.copyBtn;
      resultText.classList.remove("flash-copy");
    }, 1200);
  } catch {
    setError(ui.copyFailed);
  }
});

clearHistoryBtn.addEventListener("click", () => {
  historyItems = [];
  saveHistory();
  renderHistory();
});
