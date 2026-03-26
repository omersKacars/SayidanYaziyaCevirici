"use strict";

(function () {
  function convertLessThan1000De(n) {
    const ones = ["", "ein", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun"];
    const onesStandalone = ["", "eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun"];
    const teens = { 10: "zehn", 11: "elf", 12: "zwölf", 13: "dreizehn", 14: "vierzehn", 15: "fünfzehn", 16: "sechzehn", 17: "siebzehn", 18: "achtzehn", 19: "neunzehn" };
    const tens = ["", "", "zwanzig", "dreißig", "vierzig", "fünfzig", "sechzig", "siebzig", "achtzig", "neunzig"];
    let out = "";
    if (n >= 100) {
      const h = Math.floor(n / 100);
      out += h === 1 ? "einhundert" : ones[h] + "hundert";
      n %= 100;
    }
    if (n >= 20) {
      const t = Math.floor(n / 10);
      const o = n % 10;
      out += o ? ones[o] + "und" + tens[t] : tens[t];
    } else if (n >= 10) out += teens[n];
    else if (n > 0) out += out ? ones[n] : onesStandalone[n];
    return out;
  }

  function numberToTextDe(value) {
    if (value === 0) return "Null";
    const scales = ["", "tausend", "Million", "Milliarde", "Billion", "Billiarde"];
    const plural = ["", "tausend", "Millionen", "Milliarden", "Billionen", "Billiarden"];
    const parts = [];
    let i = 0;
    let n = value;
    while (n > 0) {
      const group = n % 1000;
      if (group) {
        if (i === 0) parts.unshift(convertLessThan1000De(group));
        else if (i === 1) parts.unshift(group === 1 ? "tausend" : convertLessThan1000De(group) + "tausend");
        else parts.unshift((group === 1 ? "eine " + scales[i] : convertLessThan1000De(group) + " " + plural[i]).trim());
      }
      n = Math.floor(n / 1000);
      i += 1;
    }
    return parts.join(" ").replace(/\s+/g, " ").trim().replace(/^./, (c) => c.toUpperCase());
  }

  window.AppNumberTextRegistry.register("de-DE", numberToTextDe);
})();
