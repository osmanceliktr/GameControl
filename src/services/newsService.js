
export const getStaticNews = (appUrl) => {
  switch(appUrl) {
    case 'brawl-stars':
      return [
        {
          title: "Çocuklar için teknolojide ölçü ne olmalı?",
          link: "https://www.salom.com.tr/haber/121157/cocuklar-icin-teknolojide-olcu-ne-olmali",
          date: "27 Şubat 2022",
          source: "Oyun Haberleri",
          snippet: "Şimdiki çocuklar teknoloji ve ürünlerinin tam da ortasına doğdu. Ebeveyn olarak belirli bir yere kadar internet ile ilişkilerini takip..."
        },
        {
          title: "Öldüren oyun tehlikesi: Çocuklarımız çekiç ve bıçaklarla birbirini öldürmeye başladı",
          link: "https://www.sabah.com.tr/gundem/2020/11/18/son-dakika-haberleri-olduren-oyun-tehlikesi-cocuklarimiz-cekic-ve-bicaklarla-birbirini-oldurmeye-basladi",
          date: "18 Mart 2020",
          source: "Oyun Haberlerik",
          snippet: "Türkiye'yi sarsan ölüm olayının ardından şoke eden bir son dakika haberi çıktı. Geçtiğimiz cumartesi günü daha önce babası intihar eden 13 yaşındaki bir çocuğun evlerine gelen aynı yaştaki ikiz kardeşlere saldırarak birini çekiçle öldürmesi, diğerini ise yaralaması olayı Türkiye'yi sarsmıştı."
        },
        {
          title: "Uzman isim uyardı, nedenlerini sıraladı! İşte en tehlikeli oyunlar listesi 2024",
          link: "https://www.medyatava.com/teknoloji/brawl-stars-tehlikeli-bir-oyun-mu-uzman-isim-uyardi-nedenlerini-siraladi-iste-en-tehlikeli-oyunlar-listesi-2024-376224",
          date: "18 Mart 2024",
          source: "Eğitim Portalı",
          snippet: "Günümüz çağında çocuklar ne yazık ki sokakta koşturmak yerine bilgisayar başında neredeyse akşama kadar oyun oynamakla meşgul. Artık sokak oyunu tanımını bilmeyen çocuklar, kendilerine dijitalde yeni bir dünya yaratıyor. "
        }
      ];
    case 'snapchat':
      return [
        {
          title: "Araştırmaya Göre Snapchat, 'En Tehlikeli' Sosyal Medya Platformu",
          link: "https://www.marketingturkiye.com.tr/haberler/arastirmaya-gore-snapchat-en-tehlikeli-sosyal-medya-platformu/",
          date: "20 Mart 2024",
          source: "Teknoloji Haberleri",
          snippet: "İngiltere’nin Ulusal polis verilerine göre, 2023-2024 yıllarını kapsayan dönemde; çocuklara yönelik cinsel iletişim vakalarının yüzde 48’i Snapchat üzerinden gerçekleşti."
        },
        {
            title: "Dünyanın en tehlikeli sosyal medya uygulaması belli oldu",
            link: "https://www.egepostasi.com/haber/Dunyanin-en-tehlikeli-sosyal-medya-uygulamasi-belli-oldu/346109",
            date: "20 Mart 2024",
            source: "Teknoloji Haberleri",
            snippet: "Ulusal polis verilerine göre, 2023-2024 döneminde toplam 7,062 çocuklara yönelik cinsel iletişim vakası ortaya çıktı. Bu vakaların yüzde 48’inin Snapchat’te yaşandığı ifade edildi."
          }
          
        // ... diğer Snapchat haberleri
      ];
    case 'amongus':
      return [
        {
          title: "Among Us Oyununda Güvenlik Endişeleri",
          link: "https://www.tamindir.com/haber/among-us-uygulamalari-tehlike_63791/",
          date: "25 Mart 2020",
          source: "Güvenlik",
          snippet: "Siber güvenlik firmaları, Among Us uygulamaları ile oyuncuların bilgilerini ele geçirmek istendiğini tespit etti. Bu uygulamaları kesinlikle indirmemelisiniz."
        },
        {
            title: "Öldüren oyun tehlikesi: Çocuklarımız çekiç ve bıçaklarla birbirini öldürmeye başladı!",
            link: "https://www.sabah.com.tr/gundem/2020/11/18/son-dakika-haberleri-olduren-oyun-tehlikesi-cocuklarimiz-cekic-ve-bicaklarla-birbirini-oldurmeye-basladi6",
            date: "18 Kasım 2020",
            source: "Haberler",
            snippet: "Türkiye'yi sarsan ölüm olayının ardından şoke eden bir son dakika haberi çıktı. Geçtiğimiz cumartesi günü daha önce babası intihar eden 13 yaşındaki bir çocuğun evlerine gelen aynı yaştaki ikiz kardeşlere saldırarak birini çekiçle öldürmesi, diğerini ise yaralaması olayı Türkiye'yi sarsmıştı."
          },
          {
              title: "Çocuğu olanlar için büyük tehlike: Masum görünen bu uygulamalardan uzak tutun!",
              link: "https://www.gercekgundem.com/bilim-teknoloji/362993/cocugu-olanlar-icin-buyuk-tehlike-masum-gorunen-bu-uygulamalardan-uzak-tutun#google_vignette",
              date: "10 Ekim 2023",
              source: "Haberler",
              snippet: "Çocukların cep telefonu kullanımının sınırlı olması gerekliliğiyle birlikte, bazı uygulamalardaki büyük tehlike oraya çıktı. Çocukların bu uygulamalardan mutlaka uzak durması gerekiyor."
            }
      ];
    default:
      return [];
  }
};

export const fetchNews = async (appUrl) => {
  try {
    // Statik haberleri döndür
    return getStaticNews(appUrl);
  } catch (error) {
    console.error('Haberler alınırken hata:', error);
    return [
      {
        title: `${appUrl === 'brawl-stars' ? 'Brawl Stars' : appUrl === 'snapchat' ? 'Snapchat' : 'Among Us'} Uygulaması Hakkında Önemli Uyarı`,
        date: new Date().toLocaleDateString('tr-TR'),
        source: 'Örnek Haber',
        snippet: 'Şu anda haberlere erişilemiyor. Lütfen daha sonra tekrar deneyiniz.',
        link: '#'
      }
    ];
  }
}; 