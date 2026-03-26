# Tutarı Yazıya Çevir

Çok dilli, çok para birimli, modern arayüze sahip bir **tutarı yazıya çevirme** uygulaması.  
Muhasebe, finans, fatura süreçleri ve resmi metin üretimi için hızlı ve pratik kullanım sunar.

---

## Neden Bu Proje?

- Sayısal tutarı anında metne çevirir
- Uygulama dili ve sonuç dili bağımsız seçilebilir
- Birden fazla para birimi ve alt birim desteği sunar
- Mobil ve masaüstü tarayıcılarda akıcı çalışır
- GitHub Pages ile dakikalar içinde yayınlanır

---

## Öne Çıkan Özellikler

- `10+ dil` desteği
- `10 para birimi` desteği
- Canlı dil/para birimi seçimleri
- Koyu/Açık tema
- Son işlem geçmişi (localStorage)
- Kopyalama desteği ve görsel geri bildirim
- Modüler mimari (dil bazlı formatter dosyaları)
- Lokal bayrak varlıkları (`assets/flags`) ile CDN bağımsız kullanım

---

## Proje Mimarisi

```text
.
├─ index.html
├─ styles.css
├─ assets/
│  └─ flags/
└─ js/
   ├─ config.js
   ├─ app.js
   ├─ formatters.js
   └─ formatters/
      ├─ registry.js
      ├─ lang-tr.js
      ├─ lang-en.js
      ├─ lang-de.js
      ├─ lang-fr.js
      ├─ lang-es.js
      ├─ lang-it.js
      ├─ lang-pt.js
      ├─ lang-ru.js
      ├─ lang-ar.js
      └─ lang-zh.js
```

### Modülerlik Faydası

- Her dil için ayrı dosya: dil kuralları tek noktadan yönetilir
- Yeni dil eklemek kolaydır
- Hata ayıklama ve bakım süreçleri hızlanır
- Proje disiplini için kurallar `ANAYASA.md` dosyasında tutulur

---

## Teknik Notlar

- Tema, seçili dil/para birimi ve geçmiş tarayıcıda saklanır
- Sayı girişleri doğrulanır ve güvenli şekilde normalize edilir
- Dönüşüm katmanı dil bazlı modüllere bölünmüştür

---

## Katkı

Katkıya açıktır. İyileştirme önerileri, yeni dil desteği ve hata düzeltmeleri için PR gönderebilirsiniz.

---

## Lisans

Bu proje kişisel/kurumsal kullanım için uygundur. İsterseniz buraya tercih ettiğiniz lisansı (`MIT` vb.) ekleyebiliriz.
