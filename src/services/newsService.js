import axios from 'axios';

const RSS_URLS = {
  'brawl-stars': 'https://news.google.com/rss/search?q=Brawl+Stars+tehlikeli&hl=tr&gl=TR&ceid=TR:tr',
  'snapchat': 'https://news.google.com/rss/search?q=snapchat+tehlikeli&hl=tr&gl=TR&ceid=TR:tr',
  'amongus': 'https://news.google.com/rss/search?q=among+us+tehlikeli&hl=tr&gl=TR&ceid=TR:tr'
};

export const fetchNews = async (appUrl) => {
  try {
    const response = await axios.get(`${RSS_URLS[appUrl]}`, {
      headers: {
        'Accept': 'application/rss+xml, application/xml, text/xml',
        'Content-Type': 'application/xml'
      }
    });

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(response.data, "text/xml");
    const items = xmlDoc.getElementsByTagName("item");
    
    const newsItems = Array.from(items).map(item => {
      const pubDate = new Date(item.getElementsByTagName("pubDate")[0]?.textContent);
      const formattedDate = pubDate.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      return {
        title: item.getElementsByTagName("title")[0]?.textContent || '',
        link: item.getElementsByTagName("link")[0]?.textContent || '',
        date: formattedDate,
        source: item.getElementsByTagName("source")[0]?.textContent || '',
        snippet: item.getElementsByTagName("description")[0]?.textContent || ''
      };
    });

    return newsItems.filter(item => item.title && item.link);
  } catch (error) {
    console.error('Haberler alınırken hata:', error);
    
    // Hata durumunda örnek haberler gösterelim
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