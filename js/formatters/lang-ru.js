"use strict";

(function () {
  function chooseRuFormLocal(n, one, few, many) {
    const n10 = n % 10;
    const n100 = n % 100;
    if (n10 === 1 && n100 !== 11) return one;
    if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return few;
    return many;
  }

  function convertLessThan1000Ru(n, feminine) {
    const onesM = ["", "один", "два", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять"];
    const onesF = ["", "одна", "две", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять"];
    const teens = ["десять", "одиннадцать", "двенадцать", "тринадцать", "четырнадцать", "пятнадцать", "шестнадцать", "семнадцать", "восемнадцать", "девятнадцать"];
    const tens = ["", "", "двадцать", "тридцать", "сорок", "пятьдесят", "шестьдесят", "семьдесят", "восемьдесят", "девяносто"];
    const hundreds = ["", "сто", "двести", "триста", "четыреста", "пятьсот", "шестьсот", "семьсот", "восемьсот", "девятьсот"];
    const out = [];
    const h = Math.floor(n / 100);
    const r = n % 100;
    if (h) out.push(hundreds[h]);
    if (r >= 20) {
      out.push(tens[Math.floor(r / 10)]);
      const o = r % 10;
      if (o) out.push((feminine ? onesF : onesM)[o]);
    } else if (r >= 10) out.push(teens[r - 10]);
    else if (r > 0) out.push((feminine ? onesF : onesM)[r]);
    return out.join(" ");
  }

  function numberToTextRu(value) {
    if (value === 0) return "Ноль";
    const scales = [
      null,
      ["тысяча", "тысячи", "тысяч", true],
      ["миллион", "миллиона", "миллионов", false],
      ["миллиард", "миллиарда", "миллиардов", false],
      ["триллион", "триллиона", "триллионов", false],
      ["квадриллион", "квадриллиона", "квадриллионов", false],
    ];
    const parts = [];
    let i = 0;
    let n = value;
    while (n > 0) {
      const g = n % 1000;
      if (g) {
        if (i === 0) parts.unshift(convertLessThan1000Ru(g, false));
        else {
          const s = scales[i];
          const gText = convertLessThan1000Ru(g, s[3]);
          parts.unshift((gText + " " + chooseRuFormLocal(g, s[0], s[1], s[2])).trim());
        }
      }
      n = Math.floor(n / 1000);
      i += 1;
    }
    return parts.join(" ").replace(/\s+/g, " ").trim();
  }

  window.AppNumberTextRegistry.register("ru-RU", numberToTextRu);
})();
