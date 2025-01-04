import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { icons } from '../data/icons';

function AppDetail() {
  const { url } = useParams();
  const navigate = useNavigate();
  const app = icons.find(icon => icon.url === url);

  const getAppDescription = () => {
    switch(url) {
      case 'brawl-stars':
        return {
          description: "<p>Brawl Stars, çeşitli oyun modları -Savaş Topu, Elmas Kapmaca, Nakavt, Ödül Avı, Kuşatma, Kupayı Koru, Yalnız Yıldız, Alaşağı, Tek ve Çift Hesaplaşma, Sürpriz, Son Savunma, Büyük Oyun, Robot İşgali - ve diğerlerinde karakterler aracılığıyla rakip takımı veya oyuncuları alt etmek üzerine kurulmuş bir oynanışa sahiptir. Oyunda ayrıca çeşitli savaşçılar vardır. Savaşçıların kendine özgü saldırı özellikleri bulunmaktadır. Oyuncular, her biri kendi ana saldırısına sahip olan birkaç savaşçı arasından seçim yapabilir ve düşman savaşçılarına saldırıp hasar verirken, daha çok hasar veren süper güçlerini doldururlar. Savaşçıları güç puanları ile yükselterek onları güçlendirebilir, savaşçılar altın ile yükseltme yapılmaktadır, savaşçıyı yükselttikçe yeni öğeler açılır, Bunlar Aksesuar, Yıldız Gücü, Eşya ve Hiperşarj'dır. Bunlar ile de Karakteri güçlendirmek mümkündür. Oyunda ayrıca kulüpler vardır, kulüplere katılarak yeni arkadaşlar edinebilir, onlarla oynanabilmektedir, onun Dışında Kulüp Oyunları'na katılarak ilerlemeyi hızlandıracak ödüller veya özel kostümler alabilmek mümkündür. Bu kulüplerde sohbet özelliği bulunmaktadır.  Oyun içi dükkân da bulunmaktadır. Dükkânda teklifler, günlük ücretsiz ödül, savaşçılar için güç puanı, kostümler, krediler, elmas ve altın alınabilmektedir.</p> <p>Bu çizgi film benzeri gerçek zamanlı strateji oyunu, genç oyunculara tam anlamıyla hitap etmektedir. Daha küçük yaşta çocuklar tarafından da oynanmaktadır. Oyunda bunun için bir kontrol bulunmamaktadır. Oyunun kendisi ücretsiz olarak indirilebilirken uygulama içi satın alma yoluyla ek ekipman satın alınabilir. </p>",
          zarariTitle:"Oyunun Zararları",
          zarari:"<p>Birçok video oyunu gibi Brawl Stars da belirli yaş grupları için risk içeriyor. Oyun her ne kadar düşük grafikli, eğlenceli, arkadaşlarla oynanan bir oyun olsa da, oyun içerisinde elimine etme animasyonları, öldürme animasyonları vahşet sahneleri yer alıyor. Bunların özellikle 13 yaşından küçük yaş grupları için uygunsuz olduğunu belirtmek gerek. Oyunda bulunan karakterlerin özellikleri de oldukça rahatsız edici olabiliyor.</p><p>Ayrıca oyunda bulunan sohbet kısmı ne yazık ki her yaş kitlesinden çocuk oyuncular için risk taşıyor. Uygunsuz ifade ve bilgilendirmeler, ebeveyn kontrolü altında olmadığı takdirde çocukları olumsuz yönde etkileyebiliyor. Bu özellik aktif olduğunda çocuklar oyun esnasında uygunsuz kelimeleri okuyabiliyor ya da olumsuz ifadelere maruz kalabiliyor. Oyunun sohbet kısmı, şiddet içeren tema ve imgeleri, yalan söyleme ve suçlama gibi olumsuz durumları içerebiliyor.</p><p>Ayrıca oyun içinde oyuncular çevrimiçi olarak kostüm, kredi, elmas, güç puanı satın alabiliyorlar. Bu durumda bazı olumsuzluklara neden olabilir.</p>"
        };
      case 'amongus':
        return {
          description: "<p>Among Us, 4 – 10 oyuncuyu destekleyen çok oyunculu bir oyun. 1 ila 3 arasında oyuncu her oyunda rastgele olarak Impostor seçilirken geri kalanlar Crewmate olarak seçiliyor.</p><p>Oyunda oyuncuların yer alabileceği iki rol mevcut. Crewmate (mürettebat arkadaşı) olabilirler ya da önceden belirlenmiş bir sayıda (en az bir, en fazla 3) Impostor (sahtekar, hain) olabilirler. Bu rol seçimleri tamamen rastgele meydana geliyor ve oyuncular oyunda hangi rolün kendilerine geleceğini bilmiyor.</p><p>Oyun uzay temalı bir ortamda gerçekleşiyor. Crewmate takımının temel amacı oyunda belirlenmiş görevleri tamamlamak ve Impostor olanları tespit ederek yapılan oylamada onları diskalifiye etmek. Impostor’ların amacı ise, Crewmate takımını çeşitli yöntemlerle öldürerek ortadan kaldırmak ve onların görev yapmalarını engellemek.<p><strong>Nasıl Oynanır?</strong></p><p>Oyunda üç farklı harita bulunuyor: The Skeld (uzay gemisi), Mira HQ (Karargah binası) ve Polus (gezegen üssü). Crewmate’e, elektrik kablolarını yeniden birleştirme ve motorlara yakıt doldurma gibi bakım çalışmalarından oluşan mini oyunlar biçiminde harita üzerinde tamamlamaları için görevler veriliyor. Impostor’lara ise; Crewmate ile uyum sağlayıp haritanın sistemlerini sabote etmek ve Crewmate üyelerini öldürmek için sahte bir görev listesi veriliyor.</p><p>Bir oyuncu ölürse hayalet oluyor. Duvarlardan geçme yeteneğine sahip olan bu hayaletler, dünyayla yalnızca sınırlı şekillerde etkileşime girebiliyor ve diğer hayaletler dışında kimse tarafından görülemiyor. Bunun yanı sıra oy kullanamıyorlar. Hayaletler dahil tüm oyuncuların sınırlı bir görüş aralığı var,  bu da oyunun yukarıdan aşağıya bakış açısına sahip olmasına rağmen oyuncuların diğer oyuncuların görüşünden saklanmasına izin veriyor.</p>",
          zarariTitle:"Oyunun Zararları",
          zarari: "<p>Birçok video oyunu gibi Among Us da belirli yaş grupları için risk içeriyor. Oyun her ne kadar düşük grafikli, eğlenceli, arkadaşlarla oynanan bir oyun olsa da, oyun içerisinde elimine etme animasyonları, öldürme animasyonları vahşet sahneleri yer alıyor. Bunların özellikle 13 yaşından küçük yaş grupları için uygunsuz olduğunu belirtmek gerek.</p><p>Ayrıca oyunda bulunan sohbet kısmı ne yazık ki her yaş kitlesinden çocuk oyuncular için risk taşıyor. Uygunsuz ifade ve bilgilendirmeler, ebeveyn kontrolü altında olmadığı takdirde çocukları olumsuz yönde etkileyebiliyor. Bu özellik aktif olduğunda çocuklar oyun esnasında uygunsuz kelimeleri okuyabiliyor ya da olumsuz ifadelere maruz kalabiliyor. Oyunun sohbet kısmı, şiddet içeren tema ve imgeleri, yalan söyleme ve suçlama gibi olumsuz durumları içerebiliyor.</p><p>Ayrıca oyun içinde oyuncular çevrimiçi olarak evcil hayvan ya da kostüm satın alabiliyorlar. Bu durumda bazı olumsuzluklara neden olabilir.</p>"
                  };
      case 'snapchat':
        return {
          description: "SnapChat, kişilerinize fotoğraf, video ve mesaj göndermenizi sağlayan popüler bir sosyal medya mesajlaşma uygulamasıdır. Snapchat ile ilgili eğlenceli olan şey, kaybolan mesaj özelliğidir. Mesaj veya fotoğraf açıldıktan sonra, alıcı artık mesaja veya fotoğrafa erişemez. Yani, sadece bir kez görüntülenebilen bir mesajlaşma sistemidir.",
          zarariTitle:"Snapchat'in Zararları",
          zarari: "<p>Fotoğrafların açıldıktan sonra siliniyor olması yanlış bir güvenlik hissi yaratır. Gerçekte, gönderilen fotoğraf veya mesajlar, kişiler tarafından ekran görüntüsü veya ekran kaydı alınabilir. Yapılan paylaşımlar daha sonra siber zorbalık, şantaj ve taciz vb. için kullanılabilir. </p><p>Snapchat'te bulunan uygunsuz veya müstehcen materyaller, bu tür içeriklerin çocuklar için oluşturduğu ciddi sorunları ve tehlikeleri artırmaktadır. Pornografik ve uygunsuz içeriklere maruz kalan çocuklar ve gençlerin duygusal ve psikolojik gelişimleri olumsuz etkilenir. Ayrıca maruz kalınan bir diğer durumda şiddet, taciz gibi zararlı davranışların normalleştirilmesi olabilir. </p><p>Kullanılan filtreler gerçekçi olmayan güzellik standartlarını ortaya çıkarmaya neden olmaktadır. Bu durumda ergenlerde sadece fiziksel görünümü ön plana çıkarmaya ve bedene karşı memnuniyetsizliğe neden olmaktadır. Snapchat'in artırılmış gerçeklik filtreleri ve düzenleme araçları, gençlerin fiziksel görünümlerini kendi gerçekliklerine göre değiştirmeye karar vermelerinin başlangıç noktası olabilir.</p><p>Kullanılan filtrelerin çok çeşitli ve farklı olması, sürekli paylaşım yapma kullanıcıyı sürekli kullanmaya iterken dolayısıyla bağımlılığa neden olmaktadır. Beğenmeler, indirmeler ve galibiyet serileri yüzünden dikkatinizin dağılması kolaydır; bu da sonunda çocukların özgüvenlerini kendilerinden ziyade başkalarının onlara bakış açısına göre bulmalarına yol açar. Ayrıca akran baskısını ortaya çıkarabilir. Sürekli kullanım depresyon ve anksiyete de artışa neden olur. </p><p>Snap Haritası, bir coğrafi konum-paylaşım özelliği, potansiyel saldırganların araçtan yararlanmasına ve çocukların, ergenlerin konumunu uzaktan tespit etmesine olanak tanıyarak gerçek ve acil riskler sunması nedeniyle önemli gizlilik endişelerini gündeme getirmektedir. Veri toplama. Snap Inc., Snap anlamına gelir. Snap Inc., tarama geçmişini, arama geçmişini, adres defterini ve daha birçoklarını içeren büyük miktarda kullanıcı verisini saklar. Bireysel verilerin reklamlarda kullanılması, özellikle çevrimiçi gizliliklerini nasıl yöneteceklerini bilmeyen ergenlik çağının altındaki kullanıcılar için siber güvenlik tehditlerine ve istismara yol açmıştır.</p>"
        };
      default:
        return null;
    }
  };

  if (!app) {
    return (
      <div className="app-card">
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          Uygulama bulunamadı
        </div>
      </div>
    );
  }

  const content = getAppDescription();

  return (
    <div className="app-card">
      <div className="navigation-buttons">
        <button onClick={() => navigate('/')} className="back-button">
          <i className="fas fa-arrow-left"></i>
          Yeni Tarama
        </button>
        <Link to={`/app/${url}/news`} className="news-button">
          <i className="fas fa-newspaper"></i>
          Haberler
        </Link>
      </div>

      <div className="app-header">
        <div className="app-info">
          <img src={app.variants[0].path} alt={app.name} className="app-icon" />
          <h1>{app.name}</h1>
        </div>
      </div>

      <div className="app-content">
        <div className="content-with-icon">
          <div className="content-text">
            <div 
            className="risks-content"
            dangerouslySetInnerHTML={{ __html: content.description }}
          />
          </div>
        </div>

        <div className="info-section risks">
          <h2 className="risks-title">
              {content.zarariTitle}
          </h2>
          <div 
            className="risks-content"
            dangerouslySetInnerHTML={{ __html: content.zarari }}
          />
        </div>
      </div>
    </div>
  );
}

export default AppDetail; 