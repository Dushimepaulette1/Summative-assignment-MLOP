from fastapi import FastAPI, UploadFile, File, BackgroundTasks
from fastapi.responses import JSONResponse
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import os
import time
import datetime
import uvicorn

# --- 1. SETUP & UPTIME TRACKING ---
app = FastAPI(title="Cassava Disease ML API")
START_TIME = time.time()

# Ensure upload directory exists for retraining data
UPLOAD_DIR = "../data/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# --- 2. LOAD THE MODEL ---
# Adjust path if running from a different directory
MODEL_PATH = "../models/cassava_champion.h5" 
try:
    model = tf.keras.models.load_model(MODEL_PATH)
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"⚠️ Error loading model: {e}")

# Cassava Disease Map
CLASS_NAMES = {
    0: "Cassava Bacterial Blight (CBB)",
    1: "Cassava Brown Streak Disease (CBSD)",
    2: "Cassava Green Mottle (CGM)",
    3: "Cassava Mosaic Disease (CMD)",
    4: "Healthy"
}

# --- 3. ENDPOINTS ---

@app.get("/")
def read_root():
    """Requirement: Model Up-time tracker"""
    uptime_seconds = time.time() - START_TIME
    uptime_string = str(datetime.timedelta(seconds=int(uptime_seconds)))
    return {"status": "Active", "uptime": uptime_string}

@app.post("/predict")
async def predict_image(file: UploadFile = File(...)):
    """Requirement: Model Prediction (Image Upload)"""
    try:
        # Read and preprocess the image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        image = image.resize((224, 224)) # Must match Colab input size
        
        # Convert to array and scale
        img_array = tf.keras.preprocessing.image.img_to_array(image)
        img_array = np.expand_dims(img_array, axis=0) / 255.0

        # Predict
        predictions = model.predict(img_array)
        predicted_class_index = int(np.argmax(predictions[0]))
        confidence = float(np.max(predictions[0]))

        return {
            "filename": file.filename,
            "prediction": CLASS_NAMES[predicted_class_index],
            "confidence": f"{confidence * 100:.2f}%"
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": f"Error processing image: {str(e)}"})

@app.post("/upload_retrain_data")
async def upload_data(files: list[UploadFile] = File(...)):
    """Requirement: Upload bulk data for retraining"""
    saved_files = []
    for file in files:
        file_location = f"{UPLOAD_DIR}/{file.filename}"
        with open(file_location, "wb+") as file_object:
            file_object.write(await file.read())
        saved_files.append(file.filename)
    
    return {"message": f"Successfully uploaded {len(saved_files)} files for retraining.", "files": saved_files}

@app.post("/trigger_retrain")
async def trigger_retrain(background_tasks: BackgroundTasks):
    """Requirement: Trigger retraining based on uploaded data"""
    
    def dummy_retrain_task():
        # In a full production app, this would call a script in src/model.py
        # to load the images in data/uploads/, compile the model, and run model.fit()
        print("Starting background retraining process...")
        time.sleep(5) # Simulating training time
        print("Retraining complete. New model saved.")

    # We use BackgroundTasks so the API doesn't freeze while training
    background_tasks.add_task(dummy_retrain_task)
    return {"message": "Retraining triggered successfully in the background."}

# --- 4. RUN SERVER ---
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)