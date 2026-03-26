"use strict";

(function () {
  function numberToTextZh(value) {
    if (value === 0) return "零";
    const nums = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    const small = ["", "十", "百", "千"];
    const big = ["", "万", "亿", "兆"];
    function fourToZh(n) {
      let out = "";
      let zero = false;
      for (let i = 3; i >= 0; i -= 1) {
        const unit = 10 ** i;
        const d = Math.floor(n / unit) % 10;
        if (d === 0) zero = out !== "";
        else {
          if (zero) out += nums[0];
          out += nums[d] + small[i];
          zero = false;
        }
      }
      return out.replace(/^一十/, "十");
    }
    const groups = [];
    let n = value;
    while (n > 0) {
      groups.push(n % 10000);
      n = Math.floor(n / 10000);
    }
    const parts = [];
    for (let i = groups.length - 1; i >= 0; i -= 1) {
      const g = groups[i];
      if (!g) continue;
      parts.push(fourToZh(g) + big[i]);
    }
    return parts.join("").replace(/零+/g, "零").replace(/零$/g, "");
  }

  window.AppNumberTextRegistry.register("zh-CN", numberToTextZh);
})();
