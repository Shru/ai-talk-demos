import requests
import json

# Test the containerized API
API_URL = "http://localhost:8080"

def test_health():
    """Test health endpoint"""
    try:
        response = requests.get(f"{API_URL}/health")
        print("Health Check:")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        print()
    except Exception as e:
        print(f"Health check failed: {e}")

def test_chat():
    """Test chat endpoint"""
    try:
        data = {"message": "What is the capital of France?"}
        response = requests.post(f"{API_URL}/chat", json=data)
        print("Chat Test:")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        print()
    except Exception as e:
        print(f"Chat test failed: {e}")

if __name__ == "__main__":
    print("Testing Docker Model Runner API...")
    print("=" * 50)
    
    test_health()
    test_chat()
