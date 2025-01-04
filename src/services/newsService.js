import axios from 'axios';

const API_KEY = 'your_api_key';
const BASE_URL = 'https://newsapi.org/v2/everything';

export const fetchNews = async (appUrl) => {
  const searchQueries = {
    'brawl-stars': 'Brawl Stars tehlikeli',
    'snapchat': 'snapchat tehlikeli',
    'amongus': 'among us tehlikeli'
  };

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: searchQueries[appUrl],
        language: 'tr',
        sortBy: 'relevancy',
        apiKey: API_KEY
      }
    });

    return response.data.articles.map(article => ({
      title: article.title,
      link: article.url,
      date: article.publishedAt,
      source: article.source.name,
      snippet: article.description
    }));
  } catch (error) {
    console.error('Haberler alınırken hata:', error);
    throw error;
  }
}; 