"use strict";

(function () {
  const scope = window.AppNumberTextRegistry || {};
  scope.converters = scope.converters || {};
  scope.register = function register(lang, converterFn) {
    if (!lang || typeof converterFn !== "function") return;
    scope.converters[lang] = converterFn;
  };
  scope.get = function get(lang) {
    return scope.converters[lang] || null;
  };
  window.AppNumberTextRegistry = scope;
})();
