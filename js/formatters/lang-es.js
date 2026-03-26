"use strict";

(function () {
  function convertLessThan1000Es(n) {
    const ones = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
    const teens = { 10: "diez", 11: "once", 12: "doce", 13: "trece", 14: "catorce", 15: "quince", 16: "dieciséis", 17: "diecisiete", 18: "dieciocho", 19: "diecinueve" };
    const tens = ["", "", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
    const hundreds = ["", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];
    if (n === 100) return "cien";
    let out = "";
    if (n >= 100) {
      out += hundreds[Math.floor(n / 100)];
      n %= 100;
      if (n > 0) out += " ";
    }
    if (n >= 30) {
      const t = Math.floor(n / 10);
      const o = n % 10;
      out += tens[t];
      if (o) out += " y " + ones[o];
    } else if (n >= 20) out += n === 20 ? "veinte" : "veinti" + ones[n - 20];
    else if (n >= 10) out += teens[n];
    else if (n > 0) out += ones[n];
    return out.trim();
  }

  function numberToTextEs(value) {
    if (value === 0) return "Cero";
    const scalesSing = ["", "mil", "millón", "mil millones", "billón", "mil billones"];
    const scalesPlur = ["", "mil", "millones", "mil millones", "billones", "mil billones"];
    const parts = [];
    let i = 0;
    let n = value;
    while (n > 0) {
      const g = n % 1000;
      if (g) {
        if (i === 0) parts.unshift(convertLessThan1000Es(g));
        else if (i === 1) parts.unshift(g === 1 ? "mil" : convertLessThan1000Es(g) + " mil");
        else parts.unshift((g === 1 ? "un " + scalesSing[i] : convertLessThan1000Es(g) + " " + scalesPlur[i]).trim());
      }
      n = Math.floor(n / 1000);
      i += 1;
    }
    return parts.join(" ").replace(/\s+/g, " ").trim().replace(/^./, (c) => c.toUpperCase());
  }

  window.AppNumberTextRegistry.register("es-ES", numberToTextEs);
})();
