from fastapi import FastAPI, UploadFile, File, BackgroundTasks
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from model import trigger_retraining_pipeline
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import os
import time
import datetime
import uvicorn
import json
import urllib.request

# --- 1. PATHS ---
BASE_DIR   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "cassava_champion.keras")
UPLOAD_DIR = os.path.join(BASE_DIR, "data", "uploads")
DB_PATH    = os.path.join(BASE_DIR, "data", "database.json")

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)

# --- 2. DOWNLOAD MODEL IF NOT PRESENT ---
MODEL_URL = "https://huggingface.co/paulette12344545/cassava-champion/resolve/main/best_model.keras"

if not os.path.exists(MODEL_PATH):
    print(f"Model not found locally. Downloading from Hugging Face...")
    urllib.request.urlretrieve(MODEL_URL, MODEL_PATH)
    print("Model downloaded successfully.")
else:
    print(f"Model found at: {MODEL_PATH}")

# --- 3. LOAD MODEL ---
model = None
try:
    model = tf.keras.models.load_model(MODEL_PATH)
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")

# --- 4. APP SETUP ---
app = FastAPI(title="Cassava Disease ML API")
START_TIME = time.time()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CLASS_NAMES = {
    0: "Cassava Bacterial Blight (CBB)",
    1: "Cassava Brown Streak Disease (CBSD)",
    2: "Cassava Green Mottle (CGM)",
    3: "Cassava Mosaic Disease (CMD)",
    4: "Healthy"
}

# --- 5. ENDPOINTS ---

@app.get("/")
def read_root():
    uptime_seconds = time.time() - START_TIME
    uptime_string  = str(datetime.timedelta(seconds=int(uptime_seconds)))
    return {"status": "Active", "uptime": uptime_string}

@app.post("/predict")
async def predict_image(file: UploadFile = File(...)):
    if model is None:
        return JSONResponse(status_code=503, content={"message": "Model not loaded. Check server logs."})
    try:
        contents  = await file.read()
        image     = Image.open(io.BytesIO(contents)).convert("RGB")
        image     = image.resize((380, 380))
        img_array = np.array(image, dtype=np.float32) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        predictions         = model.predict(img_array)
        predicted_class_idx = int(np.argmax(predictions[0]))
        confidence          = float(np.max(predictions[0]))

        all_probabilities = {
            CLASS_NAMES[i]: round(float(predictions[0][i]) * 100, 2)
            for i in range(len(CLASS_NAMES))
        }

        return {
            "filename":          file.filename,
            "prediction":        CLASS_NAMES[predicted_class_idx],
            "confidence":        round(confidence * 100, 2),
            "all_probabilities": all_probabilities
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": f"Error processing image: {str(e)}"})

@app.post("/upload_retrain_data")
async def upload_data(files: list[UploadFile] = File(...)):
    saved_files = []
    for file in files:
        dest = os.path.join(UPLOAD_DIR, file.filename)
        with open(dest, "wb+") as f:
            f.write(await file.read())
        saved_files.append({"filename": file.filename, "status": "uploaded"})

    db_data = []
    if os.path.exists(DB_PATH):
        with open(DB_PATH, "r") as f:
            db_data = json.load(f)
    db_data.extend(saved_files)
    with open(DB_PATH, "w") as f:
        json.dump(db_data, f, indent=4)

    return {"message": f"Uploaded and logged {len(saved_files)} files.", "files": saved_files}

@app.post("/trigger_retrain")
async def trigger_retrain(background_tasks: BackgroundTasks):
    background_tasks.add_task(trigger_retraining_pipeline)
    return {"message": "Retraining triggered successfully in the background."}

# --- 6. RUN ---
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
