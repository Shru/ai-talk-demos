import os
from openai import OpenAI

# Set up the Hugging Face client
client = OpenAI(
    base_url="https://router.huggingface.co/v1",
    api_key="<your_hf_api_key_here>",
)

print("🤖 Testing Hugging Face API with different models...")
print("=" * 60)

# Test 1: Qwen model
print("\n1. Testing Qwen/Qwen3-VL-8B-Instruct:novita")
try:
    completion = client.chat.completions.create(
        model="Qwen/Qwen3-VL-8B-Instruct:novita",
        messages=[
            {
                "role": "user",
                "content": "Hello! What model are you? Please respond briefly."
            }
        ],
        max_tokens=100
    )
    print(f"✅ Success! Response: {completion.choices[0].message.content}")
    print(f"📊 Tokens used: {completion.usage.total_tokens}")
except Exception as e:
    print(f"❌ Error: {e}")

# Test 2: Llama model
print("\n2. Testing meta-llama/Llama-3.1-8B-Instruct")
try:
    completion = client.chat.completions.create(
        model="meta-llama/Llama-3.1-8B-Instruct",
        messages=[
            {
                "role": "user",
                "content": "Hello! What model are you? Please respond briefly."
            }
        ],
        max_tokens=100
    )
    print(f"✅ Success! Response: {completion.choices[0].message.content}")
    print(f"📊 Tokens used: {completion.usage.total_tokens}")
except Exception as e:
    print(f"❌ Error: {e}")

# Test 3: Code generation task
print("\n3. Testing code generation with Qwen")
try:
    completion = client.chat.completions.create(
        model="Qwen/Qwen3-VL-8B-Instruct:novita",
        messages=[
            {
                "role": "user",
                "content": "Write a simple Python function to add two numbers and return the sum."
            }
        ],
        max_tokens=200
    )
    print(f"✅ Success! Code generated:")
    print(f"```python")
    print(completion.choices[0].message.content)
    print(f"```")
    print(f"📊 Tokens used: {completion.usage.total_tokens}")
except Exception as e:
    print(f"❌ Error: {e}")

print("\n" + "=" * 60)
print("🎉 Hugging Face API testing complete!")
