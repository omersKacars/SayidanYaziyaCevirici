"use strict";

(function () {
  function convertLessThan1000It(n) {
    const ones = ["", "uno", "due", "tre", "quattro", "cinque", "sei", "sette", "otto", "nove"];
    const teens = ["dieci", "undici", "dodici", "tredici", "quattordici", "quindici", "sedici", "diciassette", "diciotto", "diciannove"];
    const tens = ["", "", "venti", "trenta", "quaranta", "cinquanta", "sessanta", "settanta", "ottanta", "novanta"];
    let out = "";
    if (n >= 100) {
      const h = Math.floor(n / 100);
      out += h === 1 ? "cento" : ones[h] + "cento";
      n %= 100;
    }
    if (n >= 20) {
      const t = Math.floor(n / 10);
      const o = n % 10;
      let tWord = tens[t];
      if (o === 1 || o === 8) tWord = tWord.slice(0, -1);
      out += tWord + (o ? ones[o] : "");
    } else if (n >= 10) out += teens[n - 10];
    else if (n > 0) out += ones[n];
    return out;
  }

  function numberToTextIt(value) {
    if (value === 0) return "Zero";
    const scalesSing = ["", "mille", "milione", "miliardo", "bilione", "biliardo"];
    const scalesPlur = ["", "mila", "milioni", "miliardi", "bilioni", "biliardi"];
    const parts = [];
    let i = 0;
    let n = value;
    while (n > 0) {
      const g = n % 1000;
      if (g) {
        if (i === 0) parts.unshift(convertLessThan1000It(g));
        else if (i === 1) parts.unshift(g === 1 ? "mille" : convertLessThan1000It(g) + "mila");
        else parts.unshift((g === 1 ? "un " + scalesSing[i] : convertLessThan1000It(g) + " " + scalesPlur[i]).trim());
      }
      n = Math.floor(n / 1000);
      i += 1;
    }
    return parts.join(" ").replace(/\s+/g, " ").trim().replace(/^./, (c) => c.toUpperCase());
  }

  window.AppNumberTextRegistry.register("it-IT", numberToTextIt);
})();
