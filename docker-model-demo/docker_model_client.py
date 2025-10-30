import requests
import json

# Use the correct URL for the Docker model runner
url = "http://localhost:50000/engines/llama.cpp/v1/chat/completions"

headers = {
    "Content-Type": "application/json"
}

data = {
    "model": "ai/smollm2",
    "messages": [
        {
            "role": "system",
            "content": "You are a helpful assistant."
        },
        {
            "role": "user",
            "content": "Please write 500 words about the fall of Rome."
        }
    ]
}

# Make the request
try:
    response = requests.post(url, headers=headers, json=data)
    response.raise_for_status()  # Raise an exception for bad status codes
    
    # Print the model's reply
    print(response.json()["choices"][0]["message"]["content"])
    
except requests.exceptions.ConnectionError:
    print("Connection failed!")
    print("The Docker model runner is not accessible on port 50000.")
    print("\nThe model might be running but not exposed for external access.")
    print("Try these solutions:")
    print("1. Check if the model is actually running in Docker Desktop")
    print("2. Enable TCP access in Docker Desktop Settings -> Model Runner")
    print("3. Try accessing the model through the Docker Desktop interface first")
    print("4. Check if you need to use a different endpoint or authentication")
except requests.exceptions.HTTPError as e:
    print(f"HTTP Error: {e}")
    print("Response:", response.text)
except KeyError as e:
    print(f"Unexpected response format: {e}")
    print("Full response:", response.json())
except Exception as e:
    print(f"Unexpected error: {e}")
