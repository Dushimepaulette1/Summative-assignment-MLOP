# This file handles data transformations before inference
from PIL import Image
import tensorflow as tf
import numpy as np

def preprocess_image(image_bytes):
    """Resizes and scales images for the Xception model."""
    import io
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((224, 224))
    img_array = tf.keras.preprocessing.image.img_to_array(image)
    return np.expand_dims(img_array, axis=0) / 255.0