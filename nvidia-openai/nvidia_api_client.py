from openai import OpenAI

def create_nvidia_client():
    """Create and return an OpenAI client configured for NVIDIA API"""
    return OpenAI(
        base_url="https://integrate.api.nvidia.com/v1",
        api_key="<API_KEY>"
    )

def generate_response(client, prompt, model="openai/gpt-oss-120b", max_tokens=4096, temperature=1, top_p=1):
    """Generate a response using the NVIDIA API"""
    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=max_tokens,
        temperature=temperature,
        top_p=top_p,
        stream=True
    )
    
    reasoning_done = False
    for chunk in response:
        if hasattr(chunk.choices[0].delta, 'content') and chunk.choices[0].delta.content:
            if not reasoning_done:
                print("\n--- Response ---")
                reasoning_done = True
            print(chunk.choices[0].delta.content, end="")
    
    print("\n")  # Add newline at the end

def main():
    """Main function to demonstrate the API usage"""
    client = create_nvidia_client()
    
    print("NVIDIA API Client Ready!")
    print("Enter your prompt (type 'quit' to exit):")
    
    while True:
        user_input = input("\n> ")
        if user_input.lower() in ['quit', 'exit', 'q']:
            break
        
        if user_input.strip():
            print("\n--- Processing ---")
            generate_response(client, user_input)
        else:
            print("Please enter a valid prompt.")

if __name__ == "__main__":
    main()
