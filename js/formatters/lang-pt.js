"use strict";

(function () {
  function convertLessThan1000Pt(n) {
    const ones = ["", "um", "dois", "tres", "quatro", "cinco", "seis", "sete", "oito", "nove"];
    const teens = ["dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
    const tens = ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
    const hundreds = ["", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"];
    if (n === 100) return "cem";
    let out = "";
    const h = Math.floor(n / 100);
    const r = n % 100;
    if (h > 0) {
      out += hundreds[h];
      if (r > 0) out += " e ";
    }
    if (r >= 20) {
      const t = Math.floor(r / 10);
      const o = r % 10;
      out += tens[t];
      if (o > 0) out += " e " + ones[o];
    } else if (r >= 10) out += teens[r - 10];
    else if (r > 0) out += ones[r];
    return out.trim();
  }

  function numberToTextPt(value) {
    if (value === 0) return "Zero";
    const scalesSing = ["", "mil", "milhao", "bilhao", "trilhao", "quadrilhao"];
    const scalesPlur = ["", "mil", "milhoes", "bilhoes", "trilhoes", "quadrilhoes"];
    const parts = [];
    let i = 0;
    let n = value;
    while (n > 0) {
      const g = n % 1000;
      if (g) {
        if (i === 0) parts.unshift(convertLessThan1000Pt(g));
        else if (i === 1) parts.unshift(g === 1 ? "mil" : convertLessThan1000Pt(g) + " mil");
        else parts.unshift((g === 1 ? "um " + scalesSing[i] : convertLessThan1000Pt(g) + " " + scalesPlur[i]).trim());
      }
      n = Math.floor(n / 1000);
      i += 1;
    }
    return parts.join(" ").replace(/\s+/g, " ").trim().replace(/^./, (c) => c.toUpperCase());
  }

  window.AppNumberTextRegistry.register("pt-BR", numberToTextPt);
})();
