---
title: Agri Predict API
emoji: 🌿
colorFrom: green
colorTo: blue
sdk: docker
pinned: false
---

# Agri-Predict: Cassava Leaf Disease Detection

## Project Description
This project demonstrates an end-to-end Machine Learning Operations (MLOps) pipeline for detecting diseases in Cassava leaves using image data. It features an EfficientNetB4 Convolutional Neural Network achieving **86%+ validation accuracy**, deployed via a FastAPI backend and a React frontend, with background retraining capabilities and scalable Docker containerization.

**Dataset:** Cassava Leaf Disease Classification (21,397 images, 5 classes)
- Cassava Bacterial Blight (CBB)
- Cassava Brown Streak Disease (CBSD)
- Cassava Green Mottle (CGM)
- Cassava Mosaic Disease (CMD)
- Healthy

## Video Demo
[Insert Your YouTube Link Here]

## Deployed URLs
- **Frontend (Vercel):** https://summative-assignment-mlop-one.vercel.app/
- **Backend API (Hugging Face Spaces):** https://paulette12344545-agri-predict-api.hf.space

## Directory Structure
```
Agri-Predict/
│
├── README.md
├── docker-compose.yml
├── Dockerfile
├── nginx.conf
├── locustfile.py
├── requirements.txt
│
├── notebook/
│   └── copy-of-ml-summative-cassava.ipynb
│
├── src/
│   ├── preprocessing.py
│   ├── model.py
│   └── prediction.py
│
├── backend/
│   ├── preprocessing.py
│   ├── model.py
│   └── prediction.py
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── components/
│   │       ├── DiseaseDetection.jsx
│   │       ├── Retraining.jsx
│   │       └── Visualizations.jsx
│   └── package.json
│
├── data/
│   ├── train/
│   ├── test/
│   └── uploads/
│
└── models/
    └── cassava_champion.keras
```

## How to Set It Up

### Prerequisites
- Python 3.10+
- Node.js 18+
- Docker & Docker Compose

### Option 1: Run Locally

**Backend (FastAPI):**
```bash
pip install -r requirements.txt
cd backend
uvicorn prediction:app --reload --port 8000
```

**Frontend (React):**
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Option 2: Run via Docker (3 Replicas + Load Balancer)
```bash
docker-compose up --build
```
This spins up 3 API replicas behind an Nginx load balancer on port 8000.

### Load Testing with Locust
```bash
pip install locust
locust -f locustfile.py --host=http://localhost:8000
```
Open [http://localhost:8089](http://localhost:8089) and configure users/spawn rate.

## Results from Flood Request Simulation (Locust)
We simulated a flood of 50 concurrent users hitting the `/predict` endpoint to test model scalability.

| Deployment Strategy | Average Latency | Failure Rate |
| :--- | :--- | :--- |
| **1 Docker Container (Baseline)** | ~9,977 ms | High (90% failure) |
| **3 Docker Containers + Load Balancer** | ~19 ms | Successful routing |

**Conclusion:** The single instance was easily overwhelmed by concurrent image processing tasks. Scaling to 3 containers via Docker Compose successfully distributed the traffic load.

## Model Performance
| Metric | Score |
| :--- | :--- |
| Validation Accuracy | 86.24% |
| Architecture | EfficientNetB4 (ImageNet pretrained) |
| Input Size | 380 × 380 |
| Training Images | 17,117 |
| Validation Images | 4,280 |

## API Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/` | Model uptime status |
| POST | `/predict` | Predict disease from image upload |
| POST | `/upload_retrain_data` | Upload bulk images for retraining |
| POST | `/trigger_retrain` | Trigger background retraining |
