"use strict";

(function () {
  const ONES = (window.AppConfig && window.AppConfig.ONES) || ["", "bir", "iki", "üç", "dört", "beş", "altı", "yedi", "sekiz", "dokuz"];
  const TENS = (window.AppConfig && window.AppConfig.TENS) || ["", "on", "yirmi", "otuz", "kırk", "elli", "altmış", "yetmiş", "seksen", "doksan"];
  const SCALES = (window.AppConfig && window.AppConfig.SCALES) || ["", "bin", "milyon", "milyar", "trilyon", "katrilyon"];

  function capitalizeTr(value) {
    if (!value) return value;
    return value.charAt(0).toLocaleUpperCase("tr-TR") + value.slice(1);
  }

  function convertThreeDigitsCompact(group) {
    const hundreds = Math.floor(group / 100);
    const tens = Math.floor((group % 100) / 10);
    const ones = group % 10;
    let text = "";
    if (hundreds > 0) text += hundreds === 1 ? "yüz" : ONES[hundreds] + "yüz";
    if (tens > 0) text += TENS[tens];
    if (ones > 0) text += ONES[ones];
    return text;
  }

  function numberToTextTr(value) {
    if (!Number.isSafeInteger(value) || value < 0) throw new Error("Invalid integer");
    if (value === 0) return "Sıfır";
    const groups = [];
    let current = value;
    while (current > 0) {
      groups.push(current % 1000);
      current = Math.floor(current / 1000);
    }
    const parts = [];
    for (let i = groups.length - 1; i >= 0; i -= 1) {
      const groupValue = groups[i];
      if (groupValue === 0) continue;
      const groupText = i === 1 && groupValue === 1 ? "bin" : convertThreeDigitsCompact(groupValue) + SCALES[i];
      parts.push(capitalizeTr(groupText));
    }
    return parts.join(" ").trim();
  }

  window.AppNumberTextRegistry.register("tr-TR", numberToTextTr);
})();
