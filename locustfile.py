from locust import HttpUser, task, between
import io
from PIL import Image

# Helper function to create a dummy image in memory for testing
def create_dummy_image():
    img = Image.new('RGB', (224, 224), color='green')
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='JPEG')
    img_byte_arr.seek(0)
    return img_byte_arr

class MLUser(HttpUser):
    # Simulates a user waiting 1 to 2 seconds between clicks
    wait_time = between(1, 2)

    @task(1)
    def check_uptime(self):
        """Task 1: Pings the base URL to check uptime"""
        self.client.get("/")

    @task(5)
    def test_prediction(self):
        """Task 2: Floods the /predict endpoint with an image (Happens 5x more often)"""
        img_bytes = create_dummy_image()
        self.client.post(
            "/predict", 
            files={"file": ("dummy_leaf.jpg", img_bytes, "image/jpeg")}
        )