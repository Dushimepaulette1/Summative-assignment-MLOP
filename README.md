# Agri-Predict: Cassava Leaf Disease Detection

## Project Description
This project demonstrates an end-to-end Machine Learning Operations (MLOps) pipeline for detecting diseases in Cassava leaves (Non-tabular/Image data). It features a Convolutional Neural Network (Xception) deployed via a FastAPI backend and a Streamlit frontend, with background retraining capabilities and scalable Docker containerization.

## Video Demo
[Insert Your YouTube Link Here]

## Directory Structure
```text
Project_name/
│
├── README.md
├── docker-compose.yml
├── Dockerfile
├── nginx.conf
├── locustfile.py
├── requirements.txt
├── frontend.py
│
├── notebook/
│   └── cassava_leaf_rust_analysis.ipynb
│
├── src/
│   └── app.py
│
├── data/
│   ├── train/
│   └── uploads/
│
└── models/
    └── cassava_champion.h5
```

## How to Set It Up
1. **Clone the repository.**
2. **Ensure your model exists:** Place the trained `cassava_champion.h5` inside the `models/` directory.
3. **Run the API (Local):** `cd src` -> `uvicorn app:app --reload`
4. **Run the UI:** Open a new terminal and run `streamlit run frontend.py`
5. **Run via Docker:** `docker-compose up --build` (Spins up 3 API replicas + Nginx Load Balancer).

## Results from Flood Request Simulation (Locust)
We simulated a flood of 50 concurrent users hitting the `/predict` endpoint to test model scalability.

| Deployment Strategy | Average Latency | Failure Rate under Load |
| :--- | :--- | :--- |
| **1 Docker Container (Baseline)** | ~9,977 ms (10 seconds) | High (90% failure) |
| **3 Docker Containers + Load Balancer** | ~19 ms (API rejected requests due to load test payload) | Setup proved successful routing |

*Conclusion:* The single instance was easily overwhelmed by concurrent image processing tasks. Scaling to 3 containers via Docker Compose successfully distributed the traffic load, though the endpoints require further tuning for heavy payload concurrency.
```