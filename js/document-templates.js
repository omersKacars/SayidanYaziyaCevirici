"use strict";

(function () {
  const LABELS = {
    "tr-TR": {
      none: "Şablon Yok",
      invoice: "Fatura Açıklaması",
      check: "Çek Metni",
      receipt: "Tahsilat Makbuzu",
      officialPrefix: "YALNIZ",
    },
    "en-US": {
      none: "No Template",
      invoice: "Invoice Note",
      check: "Check Text",
      receipt: "Collection Receipt",
      officialPrefix: "ONLY",
    },
    "de-DE": {
      none: "Keine Vorlage",
      invoice: "Rechnungstext",
      check: "Schecktext",
      receipt: "Zahlungsbeleg",
      officialPrefix: "NUR",
    },
    "fr-FR": {
      none: "Aucun modèle",
      invoice: "Note de facture",
      check: "Texte du chèque",
      receipt: "Reçu d'encaissement",
      officialPrefix: "SEULEMENT",
    },
    "es-ES": {
      none: "Sin plantilla",
      invoice: "Nota de factura",
      check: "Texto del cheque",
      receipt: "Recibo de cobro",
      officialPrefix: "SOLO",
    },
    "it-IT": {
      none: "Nessun modello",
      invoice: "Nota fattura",
      check: "Testo assegno",
      receipt: "Ricevuta di incasso",
      officialPrefix: "SOLO",
    },
    "pt-BR": {
      none: "Sem modelo",
      invoice: "Observação da fatura",
      check: "Texto do cheque",
      receipt: "Recibo de cobrança",
      officialPrefix: "SOMENTE",
    },
    "ru-RU": {
      none: "Без шаблона",
      invoice: "Текст счета",
      check: "Текст чека",
      receipt: "Квитанция о получении",
      officialPrefix: "ТОЛЬКО",
    },
    "ar-SA": {
      none: "بدون قالب",
      invoice: "ملاحظة الفاتورة",
      check: "نص الشيك",
      receipt: "إيصال التحصيل",
      officialPrefix: "فقط",
    },
    "zh-CN": {
      none: "无模板",
      invoice: "发票说明",
      check: "支票文本",
      receipt: "收款凭证",
      officialPrefix: "仅限",
    },
  };

  const TEMPLATE_BUILDERS_BY_LANG = {
    "tr-TR": {
      none: (amountText) => amountText,
      invoice: (amountText) => `Fatura açıklaması: ${amountText}`,
      check: (amountText) => `İşbu çek bedeli: ${amountText}`,
      receipt: (amountText) => `Tahsil edilen tutar: ${amountText}`,
    },
    "en-US": {
      none: (amountText) => amountText,
      invoice: (amountText) => `Invoice note: ${amountText}`,
      check: (amountText) => `This check amount is: ${amountText}`,
      receipt: (amountText) => `Collected amount: ${amountText}`,
    },
    "de-DE": {
      none: (amountText) => amountText,
      invoice: (amountText) => `Rechnungshinweis: ${amountText}`,
      check: (amountText) => `Scheckbetrag: ${amountText}`,
      receipt: (amountText) => `Eingezogener Betrag: ${amountText}`,
    },
    "fr-FR": {
      none: (amountText) => amountText,
      invoice: (amountText) => `Note de facture : ${amountText}`,
      check: (amountText) => `Montant du chèque : ${amountText}`,
      receipt: (amountText) => `Montant encaissé : ${amountText}`,
    },
    "es-ES": {
      none: (amountText) => amountText,
      invoice: (amountText) => `Nota de factura: ${amountText}`,
      check: (amountText) => `Importe del cheque: ${amountText}`,
      receipt: (amountText) => `Importe cobrado: ${amountText}`,
    },
    "it-IT": {
      none: (amountText) => amountText,
      invoice: (amountText) => `Nota fattura: ${amountText}`,
      check: (amountText) => `Importo dell'assegno: ${amountText}`,
      receipt: (amountText) => `Importo riscosso: ${amountText}`,
    },
    "pt-BR": {
      none: (amountText) => amountText,
      invoice: (amountText) => `Observação da fatura: ${amountText}`,
      check: (amountText) => `Valor do cheque: ${amountText}`,
      receipt: (amountText) => `Valor recebido: ${amountText}`,
    },
    "ru-RU": {
      none: (amountText) => amountText,
      invoice: (amountText) => `Примечание к счету: ${amountText}`,
      check: (amountText) => `Сумма чека: ${amountText}`,
      receipt: (amountText) => `Полученная сумма: ${amountText}`,
    },
    "ar-SA": {
      none: (amountText) => amountText,
      invoice: (amountText) => `ملاحظة الفاتورة: ${amountText}`,
      check: (amountText) => `قيمة الشيك: ${amountText}`,
      receipt: (amountText) => `المبلغ المحصّل: ${amountText}`,
    },
    "zh-CN": {
      none: (amountText) => amountText,
      invoice: (amountText) => `发票说明：${amountText}`,
      check: (amountText) => `支票金额：${amountText}`,
      receipt: (amountText) => `已收金额：${amountText}`,
    },
  };

  function getLocaleLabels(lang) {
    return LABELS[lang] || LABELS["en-US"];
  }

  function getTemplateOptions(lang) {
    const labels = getLocaleLabels(lang);
    return [
      { id: "none", label: labels.none },
      { id: "invoice", label: labels.invoice },
      { id: "check", label: labels.check },
      { id: "receipt", label: labels.receipt },
    ];
  }

  function applyDocumentTemplate(input) {
    const lang = input.outputLang || input.appLang || "tr-TR";
    const templateId = input.templateId || "none";
    const officialMode = !!input.officialMode;
    const amountText = input.amountText || "";

    const labels = getLocaleLabels(lang);
    const builders = TEMPLATE_BUILDERS_BY_LANG[lang] || TEMPLATE_BUILDERS_BY_LANG["en-US"];
    const builder = builders[templateId] || builders.none;
    const renderedAmountText = officialMode ? `${labels.officialPrefix} ${amountText}` : amountText;
    const text = builder(renderedAmountText, input);

    return text.trim();
  }

  window.AppDocumentTemplates = {
    getTemplateOptions,
    applyDocumentTemplate,
  };
})();
