"use strict";

(function () {
  function numberToTextAr(value) {
    if (value === 0) return "صفر";
    const ones = ["", "واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة"];
    const teens = ["عشرة", "أحد عشر", "اثنا عشر", "ثلاثة عشر", "أربعة عشر", "خمسة عشر", "ستة عشر", "سبعة عشر", "ثمانية عشر", "تسعة عشر"];
    const tens = ["", "", "عشرون", "ثلاثون", "أربعون", "خمسون", "ستون", "سبعون", "ثمانون", "تسعون"];
    const hundreds = ["", "مائة", "مائتان", "ثلاثمائة", "أربعمائة", "خمسمائة", "ستمائة", "سبعمائة", "ثمانمائة", "تسعمائة"];
    const scales = ["", "ألف", "مليون", "مليار", "تريليون", "كوادريليون"];
    function lt1000(n) {
      const p = [];
      const h = Math.floor(n / 100);
      const r = n % 100;
      if (h) p.push(hundreds[h]);
      if (r >= 20) {
        const t = Math.floor(r / 10);
        const o = r % 10;
        if (o) p.push(ones[o] + " و" + tens[t]);
        else p.push(tens[t]);
      } else if (r >= 10) p.push(teens[r - 10]);
      else if (r > 0) p.push(ones[r]);
      return p.join(" و");
    }
    const parts = [];
    let i = 0;
    let n = value;
    while (n > 0) {
      const g = n % 1000;
      if (g) {
        const gText = lt1000(g);
        parts.unshift((gText + (scales[i] ? " " + scales[i] : "")).trim());
      }
      n = Math.floor(n / 1000);
      i += 1;
    }
    return parts.join(" و");
  }

  window.AppNumberTextRegistry.register("ar-SA", numberToTextAr);
})();
