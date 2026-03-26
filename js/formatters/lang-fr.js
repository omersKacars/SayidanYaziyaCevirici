"use strict";

(function () {
  function convertLessThan1000Fr(n) {
    const ones = ["", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf"];
    const teens = ["dix", "onze", "douze", "treize", "quatorze", "quinze", "seize"];
    const tens = ["", "", "vingt", "trente", "quarante", "cinquante", "soixante"];
    if (n === 0) return "";
    let out = "";
    const h = Math.floor(n / 100);
    let r = n % 100;
    if (h > 0) {
      out += h === 1 ? "cent" : ones[h] + " cent";
      if (r === 0 && h > 1) out += "s";
      if (r > 0) out += " ";
    }
    if (r < 10) out += ones[r];
    else if (r < 17) out += teens[r - 10];
    else if (r < 20) out += "dix-" + ones[r - 10];
    else if (r < 70) {
      const t = Math.floor(r / 10);
      const o = r % 10;
      out += tens[t];
      if (o === 1) out += "-et-un";
      else if (o > 0) out += "-" + ones[o];
    } else if (r < 80) {
      const rem = r - 60;
      out += "soixante";
      if (rem === 11) out += "-et-onze";
      else if (rem < 17) out += "-" + teens[rem - 10];
      else out += "-dix-" + ones[rem - 10];
    } else {
      const rem = r - 80;
      out += rem === 0 ? "quatre-vingts" : "quatre-vingt";
      if (rem < 10) out += rem ? "-" + ones[rem] : "";
      else if (rem < 17) out += "-" + teens[rem - 10];
      else out += "-dix-" + ones[rem - 10];
    }
    return out.trim();
  }

  function numberToTextFr(value) {
    if (value === 0) return "Zéro";
    const scales = ["", "mille", "million", "milliard", "billion", "billiard"];
    const parts = [];
    let i = 0;
    let n = value;
    while (n > 0) {
      const group = n % 1000;
      if (group) {
        if (i === 0) parts.unshift(convertLessThan1000Fr(group));
        else if (i === 1) parts.unshift(group === 1 ? "mille" : convertLessThan1000Fr(group) + " mille");
        else parts.unshift((group === 1 ? "un " + scales[i] : convertLessThan1000Fr(group) + " " + scales[i] + "s").trim());
      }
      n = Math.floor(n / 1000);
      i += 1;
    }
    return parts.join(" ").replace(/\s+/g, " ").trim().replace(/^./, (c) => c.toUpperCase());
  }

  window.AppNumberTextRegistry.register("fr-FR", numberToTextFr);
})();
