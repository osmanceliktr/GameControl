import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { icons } from './data/icons';

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [matchedIcons, setMatchedIcons] = useState([]);
  const [isOpenCVReady, setIsOpenCVReady] = useState(false);
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);


  useEffect(() => {
    // OpenCV.js'in yüklenmesini bekle
    const loadOpenCV = async () => {
      try {
        if (!window.cv || !window.cv.imread) {
          console.log("OpenCV.js yükleniyor...");
          await new Promise(resolve => {
            // Global onOpenCVReady fonksiyonunu tanımla
            window.onOpenCVReady = () => {
              // OpenCV.js başarıyla yüklendi
              if (window.cv && typeof window.cv.imread === 'function') {
                setIsOpenCVReady(true);
                resolve();
              } else {
                console.error("OpenCV.js yüklendi ama imread fonksiyonu bulunamadı");
              }
            };
          });
        } else {
          setIsOpenCVReady(true); // OpenCV.js zaten yüklü
        }
      } catch (error) {
        console.error("OpenCV.js yüklenirken hata:", error);
      }
    };

    loadOpenCV();

    // Cleanup function
    return () => {
      window.onOpenCVReady = null;
    };
  }, []);

  useEffect(() => {
    
    return () => {
      // Kamera stream'ini kapat
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
      setCameraActive(false);
    };
  }, []);

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'environment'
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const video = videoRef.current;
      video.srcObject = stream;
      
      // Video yüklendiğinde çalışacak
      video.onloadedmetadata = () => {
        video.play().then(() => {
          setCameraActive(true);
          // Seçili dosyayı temizle
          setSelectedImage(null);
        }).catch(error => {
          console.error("Video oynatılırken hata:", error);
          setCameraActive(false);
        });
      };
    } catch (error) {
      console.error("Kamera başlatılırken hata:", error);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    try {
      if (videoRef.current?.srcObject) {
        // Tüm medya parçalarını durdur
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setCameraActive(false);
      console.log("Kamera kapatıldı");
    } catch (error) {
      console.error("Kamera kapatılırken hata:", error);
    }
  };

  const takePhoto = async () => {
    try {
      if (!isOpenCVReady || !window.cv) {
        console.error("OpenCV.js henüz hazır değil!");
        return;
      }

      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      // Video akışının başlatılıp başlatılmadığını kontrol et
      if (!video.srcObject || !video.srcObject.active) {
        console.error("Kamera akışı başlatılmamış!");
        return;
      }

      // Video hazır olana kadar bekle
      if (video.readyState !== video.HAVE_ENOUGH_DATA) {
        console.log("Video hazır değil, bekleniyor...");
        return;
      }

      console.log("Fotoğraf çekiliyor...");

      // Canvas boyutlarını ayarla
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Debug için canvas'ı görünür yap
      canvas.style.display = "block";
      canvas.style.maxWidth = "300px";
      canvas.style.marginTop = "10px";

      
      // Çekilen fotoğrafı analiz et
      await analyzePhoto(canvas);
      
      console.log("Analiz tamamlandı");
    } catch (error) {
      console.error("Fotoğraf çekerken hata:", error);
    }
  };

  const analyzePhoto = async (canvas) => {
    if (!isOpenCVReady || !window.cv) {
      setError("OpenCV.js henüz hazır değil");
      return;
    }

    try {
      setScanning(true);
      setError('');
      console.log("Görüntü analizi başlıyor...");
      
      const context = canvas.getContext('2d');
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const mat = window.cv.matFromImageData(imageData);
      
      const detectedIcons = [];

      for (const icon of icons) {
        console.log(`${icon.name} için analiz başlıyor...`);
        let bestScore = 0;

        // Her varyant için kontrol et
        for (const variant of icon.variants) {
          try {
            const iconImg = await loadImage(variant.path);
            const matchScore = matchImages(mat, iconImg);
            console.log(`${icon.name} (varyant) için benzerlik skoru: ${matchScore}%`);
            
            // En yüksek skoru sakla
            bestScore = Math.max(bestScore, matchScore);
            
            iconImg.delete();
          } catch (variantError) {
            console.error(`${icon.name} varyantı için hata:`, variantError);
          }
        }

        // En iyi skor eşik değerini geçiyorsa ekle
        if (bestScore > 10) {
          detectedIcons.push({
            name: icon.name,
            score: bestScore
          });
          console.log(`${icon.name} tespit edildi! (En iyi skor: ${bestScore}%)`);
        }
      }

      mat.delete();

      if (detectedIcons.length === 0) {
        setError("Hiçbir oyun ikonu tespit edilemedi!");
      }

      // Sonuçları skora göre sırala
      detectedIcons.sort((a, b) => b.score - a.score);
      
      // Sonuçları formatlayarak state'e kaydet
      setMatchedIcons(
        detectedIcons.map(icon => `${icon.name} (${Math.round(icon.score)}%)`)
      );

      console.log("Analiz tamamlandı, bulunan ikonlar:", detectedIcons);
    } catch (error) {
      console.error("Fotoğraf analizi hatası:", error);
      setError("Analiz sırasında bir hata oluştu!");
      setMatchedIcons([]);
    } finally {
      setScanning(false);
    }
  };

  const loadImage = (src) => {
    if (!isOpenCVReady || !window.cv) {
      return Promise.reject("OpenCV.js henüz yüklenmedi");
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const mat = window.cv.imread(canvas);
          resolve(mat);
        } catch (error) {
          reject(`İkon yüklenirken hata: ${error.message}`);
        }
      };

      img.onerror = () => {
        reject(`İkon yüklenemedi: ${src}`);
      };

      // Import edilen dosyayı doğrudan kullan
      img.src = src; // process.env.PUBLIC_URL + src yerine sadece src
    });
  };

  const matchImages = (img1, img2) => {
    if (!isOpenCVReady) {
      console.log("OpenCV.js henüz yüklenmedi");
      return 0;
    }

    let resized1, resized2, gray1, gray2, normalized1, normalized2,
        kp1, des1, kp2, des2, orb, bf, matches;

    try {
      // Görüntüleri aynı boyuta getir
      const targetSize = new window.cv.Size(200, 200);
      resized1 = new window.cv.Mat();
      resized2 = new window.cv.Mat();
      window.cv.resize(img1, resized1, targetSize, 0, 0, window.cv.INTER_LINEAR);
      window.cv.resize(img2, resized2, targetSize, 0, 0, window.cv.INTER_LINEAR);

      // Görüntüleri gri tonlamaya çevir
      gray1 = new window.cv.Mat();
      gray2 = new window.cv.Mat();
      window.cv.cvtColor(resized1, gray1, window.cv.COLOR_RGBA2GRAY);
      window.cv.cvtColor(resized2, gray2, window.cv.COLOR_RGBA2GRAY);

      // Görüntüleri normalleştir
      normalized1 = new window.cv.Mat();
      normalized2 = new window.cv.Mat();
      window.cv.normalize(gray1, normalized1, 0, 255, window.cv.NORM_MINMAX);
      window.cv.normalize(gray2, normalized2, 0, 255, window.cv.NORM_MINMAX);

      // ORB dedektörü - basit parametrelerle
      orb = new window.cv.ORB(500);

      // Özellik tespiti
      kp1 = new window.cv.KeyPointVector();
      des1 = new window.cv.Mat();
      kp2 = new window.cv.KeyPointVector();
      des2 = new window.cv.Mat();

      orb.detectAndCompute(normalized1, new window.cv.Mat(), kp1, des1);
      orb.detectAndCompute(normalized2, new window.cv.Mat(), kp2, des2);

      // Özellik eşleştirme
      bf = new window.cv.BFMatcher(window.cv.NORM_HAMMING, true);
      matches = new window.cv.DMatchVector();

      if (des1.rows > 0 && des2.rows > 0) {
        bf.match(des1, des2, matches);

        // Eşleşmeleri mesafeye göre sırala
        const matchesArray = Array.from({ length: matches.size() }, (_, i) => matches.get(i))
          .sort((a, b) => a.distance - b.distance);

        // En iyi eşleşmeleri seç
        const goodMatches = matchesArray.filter(match => match.distance < 50).length;

        // Skor hesapla
        const keypointCount = Math.min(kp1.size(), kp2.size());
        const score = keypointCount > 0 ? (goodMatches / keypointCount) * 100 : 0;

        return Math.round(score);
      }
      return 0;
    } catch (error) {
      console.error("Görüntü eşleştirme hatası:", error);
      return 0;
    } finally {
      // Bellek temizliği - try/finally bloğunda yapılıyor
      [resized1, resized2, gray1, gray2, normalized1, normalized2,
       kp1, des1, kp2, des2, matches].forEach(mat => {
        if (mat) mat.delete();
      });
      if (orb) orb.delete();
      if (bf) bf.delete();
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      // Dosya seçildiğinde kamerayı kapat
      stopCamera();
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        analyzeImageFile(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setError('Lütfen geçerli bir resim dosyası seçin');
    }
  };

  const analyzeImageFile = async (imageUrl) => {
    if (!isOpenCVReady || !window.cv) {
      setError("OpenCV.js henüz hazır değil");
      return;
    }

    try {
      setScanning(true);
      setError('');
      
      // Görüntüyü yükle
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });

      // Canvas'a çiz
      const canvas = canvasRef.current;
      canvas.width = img.width;
      canvas.height = img.height;
      const context = canvas.getContext('2d');
      context.drawImage(img, 0, 0);
      
      // Canvas'ı görünür yap
      canvas.style.display = "block";
      canvas.style.maxWidth = "200px";
      canvas.style.marginTop = "10px";

      // Analiz et
      await analyzePhoto(canvas);
    } catch (error) {
      console.error("Dosya analizi hatası:", error);
      setError("Dosya analiz edilirken bir hata oluştu!");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="container">
      <div className="app-card">
        <h1>Oyun İkonu Tanıma</h1>
        {!isOpenCVReady && (
          <div className="loading-message">
            <div className="spinner"></div>
            <p>OpenCV.js yükleniyor, lütfen bekleyin...</p>
          </div>
        )}
        
        <div className="camera-container">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="camera-view"
            style={{ display: selectedImage ? 'none' : 'block' }}
          />
          
          {selectedImage && (
            <img 
              src={selectedImage} 
              alt="Seçilen resim" 
              className="selected-image"
            />
          )}

          <div className="button-group">
            <button 
              className={`action-button ${cameraActive ? 'danger' : 'primary'}`}
              onClick={cameraActive ? stopCamera : startCamera} 
              disabled={!isOpenCVReady}
            >
              <i className={`fas ${cameraActive ? 'fa-stop' : 'fa-camera'}`}></i>
              {cameraActive ? 'Kamerayı Kapat' : 'Kamerayı Başlat'}
            </button>
            <button 
              className="action-button secondary"
              onClick={takePhoto} 
              disabled={!isOpenCVReady || !cameraActive}
            >
              <i className="fas fa-camera-retro"></i>
              Fotoğraf Çek
            </button>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
            <button 
              className="action-button tertiary"
              onClick={() => fileInputRef.current.click()}
              disabled={!isOpenCVReady}
            >
              <i className="fas fa-file-upload"></i>
              Dosya Seç
            </button>
          </div>

          <canvas 
            ref={canvasRef} 
            className="preview-canvas"
          />
        </div>

        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}

        {scanning && (
          <div className="scanning-message">
            <div className="spinner"></div>
            <p>Görüntü analiz ediliyor...</p>
          </div>
        )}

        <div className="results-container">
          <h3>Tespit Edilen Oyunlar</h3>
          {matchedIcons.length > 0 ? (
            <ul className="icons-list">
              {matchedIcons.map((icon, index) => (
                <li key={index} className="icon-item">
                  <i className="fas fa-gamepad"></i>
                  {icon}
                </li>
              ))}
            </ul>
          ) : !error && !scanning && (
            <p className="no-results">Henüz bir oyun tespit edilmedi</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
