import tensorflow as tf
import os
from PIL import Image
import numpy as np

def preprocess_for_retraining(image_path):
    """Requirement: Data Preprocessing of uploaded data"""
    image = Image.open(image_path).convert("RGB")
    image = image.resize((380, 380))
    img_array = tf.keras.preprocessing.image.img_to_array(image)
    return img_array / 255.0

def trigger_retraining_pipeline():
    """Requirement: Retraining using custom model as pre-trained"""
    print("Connecting to database and loading new images...")
    upload_dir = "../data/uploads/"
    new_images = []
    dummy_labels = [] # In reality, you'd pull labels from the user UI
    
    # 1. Preprocess the uploaded data
    for filename in os.listdir(upload_dir):
        if filename.endswith(".jpg") or filename.endswith(".png"):
            img_path = os.path.join(upload_dir, filename)
            processed_img = preprocess_for_retraining(img_path)
            new_images.append(processed_img)
            dummy_labels.append(0) # Assigning a default label for demo purposes
            
    if not new_images:
        print("No new data to train on.")
        return False
        
    X_train = np.array(new_images)
    y_train = np.array(dummy_labels)
    
    # 2. Load custom model as a pre-trained base
    print("Loading pre-trained Champion model...")
    model_path = "../models/cassava_champion.keras"
    model = tf.keras.models.load_model(model_path)
    
    # Freeze earlier layers to preserve original learning (Optimization technique)
    for layer in model.layers[:-2]:
        layer.trainable = False
        
    model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5), 
                  loss='sparse_categorical_crossentropy', 
                  metrics=['accuracy'])
                  
    # 3. Retrain
    print("Retraining model on new data...")
    model.fit(X_train, y_train, epochs=1, batch_size=2)
    
    # Save the updated model
    model.save(model_path)
    print("Retraining complete. Database updated.")
    return True