import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { icons } from '../data/icons';
import { fetchNews } from '../services/newsService';

function News() {
  const { url } = useParams();
  const navigate = useNavigate();
  const app = icons.find(icon => icon.url === url);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        const newsData = await fetchNews(url);
        setNews(newsData);
      } catch (err) {
        setError('Haberler yüklenirken bir hata oluştu');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [url]);

  if (!app) return null;

  return (
    <div className="app-card">
      <div className="navigation-buttons">
        <button onClick={() => navigate(`/app/${url}`)} className="back-button">
          <i className="fas fa-arrow-left"></i>
          Geri Dön
        </button>
      </div>

      <div className="news-header">
        <h1>{app.name} Haberleri</h1>
      </div>

      {loading ? (
        <div className="loading-message">
          <div className="spinner"></div>
          <p>Haberler yükleniyor...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      ) : news.length === 0 ? (
        <div className="no-results">
          <i className="fas fa-newspaper"></i>
          <p>Henüz haber bulunmuyor</p>
        </div>
      ) : (
        <div className="news-list">
          {news.map((item, index) => (
            <div key={index} className="news-item">
              <div className="news-content">
                <h2>{item.title}</h2>
                <div className="news-meta">
                  <div className="news-date">
                    <i className="far fa-calendar-alt"></i>
                    {item.date}
                  </div>
                  <div className="news-source">
                    <i className="far fa-newspaper"></i>
                    {item.source}
                  </div>
                </div>
                <p>{item.snippet}</p>
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="read-more"
                >
                  Devamını Oku
                  <i className="fas fa-chevron-right"></i>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default News; 