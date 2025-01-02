import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras import layers, models
import os

# 1. Veri Setini Hazırlama
data_dir = "data/"  # Veri setinizin yolu
batch_size = 32
img_height = 224
img_width = 224

train_datagen = ImageDataGenerator(
    rescale=1.0/255,
    validation_split=0.2,  # %20 doğrulama seti
    rotation_range=15,
    zoom_range=0.2,
    horizontal_flip=True
)

train_generator = train_datagen.flow_from_directory(
    data_dir,
    target_size=(img_height, img_width),
    batch_size=batch_size,
    class_mode="categorical",
    subset="training"
)

validation_generator = train_datagen.flow_from_directory(
    data_dir,
    target_size=(img_height, img_width),
    batch_size=batch_size,
    class_mode="categorical",
    subset="validation"
)

# 2. Modeli Tanımlama (MobileNetV2 ile Transfer Öğrenimi)
base_model = MobileNetV2(input_shape=(img_height, img_width, 3), include_top=False, weights="imagenet")
base_model.trainable = False  # Önceden eğitilmiş katmanlar sabitlenir

model = models.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dropout(0.2),
    layers.Dense(train_generator.num_classes, activation="softmax")  # Sınıf sayısına göre çıktı
])

model.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])

# 3. Modeli Eğitme
epochs = 10
history = model.fit(
    train_generator,
    validation_data=validation_generator,
    epochs=epochs
)

# 4. Modeli Kaydetme
model.save("icon_classifier_model")
