import openai

# Configuration for local Docker Model Runner
BASE_URL = "http://localhost:50000/engines/llama.cpp/v1"

# Instantiate the OpenAI client
client = openai.OpenAI(
    base_url=BASE_URL,
    api_key="anything"  # Docker Model Runner doesn't require a real API key
)

# Define the model and prompt
MODEL_NAME = "ai/smollm2"
PROMPT = "Explain quantum computing in simple terms."

# Prepare the chat messages
messages = [
    {"role": "user", "content": PROMPT}
]

# Create a chat completion
try:
    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=messages
    )
    
    # Print the model's reply
    print(response.choices[0].message.content)

except openai.APIConnectionError as e:
    print(f"Connection failed: {e}")
    print("Make sure Docker Model Runner is running on port 50000")
except Exception as e:
    print(f"Error: {e}")
