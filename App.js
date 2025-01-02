import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Platform,
  PermissionsAndroid
} from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { icons } from './data/icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as opencv from 'opencv-react-native';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [matchedIcons, setMatchedIcons] = useState([]);
  const [isOpenCVReady, setIsOpenCVReady] = useState(false);
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      // Kamera izinlerini al
      if (Platform.OS === 'android') {
        const { status } = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );
        setHasPermission(status === 'granted');
      } else {
        const { status } = await Camera.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      }

      // OpenCV'yi başlat
      try {
        await opencv.initAsync();
        setIsOpenCVReady(true);
      } catch (error) {
        console.error('OpenCV başlatılamadı:', error);
      }
    })();
  }, []);

  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        await analyzePhoto(photo.uri);
      } catch (error) {
        console.error('Fotoğraf çekilemedi:', error);
        setError('Fotoğraf çekilemedi');
      }
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      await analyzePhoto(result.assets[0].uri);
    }
  };

  // ... matchImages fonksiyonu aynı kalacak ...

  const analyzePhoto = async (imageUri) => {
    if (!isOpenCVReady) {
      setError("OpenCV henüz hazır değil");
      return;
    }

    try {
      setScanning(true);
      setError('');
      
      const mat = await opencv.imread(imageUri);
      const detectedIcons = [];

      for (const icon of icons) {
        let bestScore = 0;

        for (const variant of icon.variants) {
          try {
            const iconMat = await opencv.imread(variant.path);
            const matchScore = matchImages(mat, iconMat);
            bestScore = Math.max(bestScore, matchScore);
            iconMat.delete();
          } catch (error) {
            console.error(`${icon.name} varyantı için hata:`, error);
          }
        }

        if (bestScore > 10) {
          detectedIcons.push({
            name: icon.name,
            score: bestScore
          });
        }
      }

      mat.delete();

      if (detectedIcons.length === 0) {
        setError("Hiçbir oyun ikonu tespit edilemedi!");
      }

      detectedIcons.sort((a, b) => b.score - a.score);
      setMatchedIcons(
        detectedIcons.map(icon => `${icon.name} (${Math.round(icon.score)}%)`)
      );

    } catch (error) {
      console.error("Analiz hatası:", error);
      setError("Analiz sırasında bir hata oluştu!");
    } finally {
      setScanning(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Oyun İkonu Tanıma</Text>

        {!isOpenCVReady && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0066ff" />
            <Text>OpenCV yükleniyor...</Text>
          </View>
        )}

        <View style={styles.cameraContainer}>
          {cameraActive ? (
            <Camera
              ref={cameraRef}
              style={styles.camera}
              type={Camera.Constants.Type.back}
            />
          ) : selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
              style={styles.selectedImage}
            />
          ) : null}
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, cameraActive ? styles.dangerButton : styles.primaryButton]}
            onPress={() => setCameraActive(!cameraActive)}
            disabled={!isOpenCVReady}
          >
            <Icon 
              name={cameraActive ? "stop" : "camera"} 
              size={20} 
              color="white" 
            />
            <Text style={styles.buttonText}>
              {cameraActive ? 'Kamerayı Kapat' : 'Kamerayı Aç'}
            </Text>
          </TouchableOpacity>

          {cameraActive && (
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={takePhoto}
              disabled={!isOpenCVReady}
            >
              <Icon name="camera-retro" size={20} color="white" />
              <Text style={styles.buttonText}>Fotoğraf Çek</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.button, styles.tertiaryButton]}
            onPress={pickImage}
            disabled={!isOpenCVReady}
          >
            <Icon name="image" size={20} color="white" />
            <Text style={styles.buttonText}>Galeri</Text>
          </TouchableOpacity>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Icon name="exclamation-circle" size={20} color="#d32f2f" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {scanning ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0066ff" />
            <Text>Görüntü analiz ediliyor...</Text>
          </View>
        ) : null}

        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Tespit Edilen Oyunlar</Text>
          {matchedIcons.length > 0 ? (
            matchedIcons.map((icon, index) => (
              <View key={index} style={styles.iconItem}>
                <Icon name="gamepad" size={20} color="#666" />
                <Text style={styles.iconText}>{icon}</Text>
              </View>
            ))
          ) : !error && !scanning ? (
            <Text style={styles.noResults}>Henüz bir oyun tespit edilmedi</Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  cameraContainer: {
    aspectRatio: 1,
    width: '100%',
    maxWidth: 300,
    alignSelf: 'center',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: '#0066ff',
  },
  secondaryButton: {
    backgroundColor: '#34c759',
  },
  tertiaryButton: {
    backgroundColor: '#6c757d',
  },
  dangerButton: {
    backgroundColor: '#dc3545',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#d32f2f',
    marginLeft: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  resultsContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  iconItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  iconText: {
    marginLeft: 8,
    fontSize: 16,
  },
  noResults: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
}); 