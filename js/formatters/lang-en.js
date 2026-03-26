"use strict";

(function () {
  function convertLessThan1000En(n) {
    const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
    const teens = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
    const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
    let out = "";
    if (n >= 100) {
      out += ones[Math.floor(n / 100)] + " hundred";
      n %= 100;
      if (n > 0) out += " ";
    }
    if (n >= 20) {
      out += tens[Math.floor(n / 10)];
      if (n % 10) out += "-" + ones[n % 10];
    } else if (n >= 10) out += teens[n - 10];
    else if (n > 0) out += ones[n];
    return out;
  }

  function numberToTextEn(value) {
    if (value === 0) return "Zero";
    const scales = ["", "thousand", "million", "billion", "trillion", "quadrillion"];
    const parts = [];
    let i = 0;
    let n = value;
    while (n > 0) {
      const group = n % 1000;
      if (group) {
        const gText = convertLessThan1000En(group);
        parts.unshift((gText + (scales[i] ? " " + scales[i] : "")).trim());
      }
      n = Math.floor(n / 1000);
      i += 1;
    }
    return parts.join(" ").replace(/\s+/g, " ").trim().replace(/^./, (c) => c.toUpperCase());
  }

  window.AppNumberTextRegistry.register("en-US", numberToTextEn);
})();
