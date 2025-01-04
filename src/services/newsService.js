import { load } from 'cheerio';
import axios from 'axios';

const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';

const NEWS_URLS = {
  'brawl-stars': 'https://www.google.com/search?q=Brawl+Stars+tehlikeli&tbm=nws',
  'snapchat': 'https://www.google.com/search?q=snapchat+tehlikeli&tbm=nws',
  'amongus': 'https://www.google.com/search?q=among+us+tehlikeli&tbm=nws'
};

export const fetchNews = async (appUrl) => {
  try {
    const newsUrl = NEWS_URLS[appUrl];
    if (!newsUrl) {
      throw new Error('Bu uygulama için haber kaynağı tanımlanmamış');
    }

    const response = await axios.get(PROXY_URL + newsUrl);
    const html = response.data;
    const $ = load(html);
    const newsItems = [];

    // Google News sonuçlarını parse et
    $('.g').each((i, element) => {
      const title = $(element).find('.mCBkyc').text();
      const link = $(element).find('a').attr('href');
      const date = $(element).find('.ZE0LJd').text();
      const source = $(element).find('.NUnG9d span').text();
      const snippet = $(element).find('.GI74Re').text();

      if (title && link) {
        newsItems.push({
          title,
          link,
          date,
          source,
          snippet
        });
      }
    });

    return newsItems;
  } catch (error) {
    console.error('Haberler alınırken hata:', error);
    throw error;
  }
}; 