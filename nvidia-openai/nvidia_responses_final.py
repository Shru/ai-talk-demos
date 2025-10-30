import requests
import json

def nvidia_responses_final(prompt):
    """Final working version of NVIDIA responses API"""
    
    url = "https://integrate.api.nvidia.com/v1/responses"
    headers = {
        "Authorization": "Bearer <API_KEY>",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": "openai/gpt-oss-120b",
        "input": [prompt],
        "max_output_tokens": 1000,
        "top_p": 1,
        "temperature": 1,
        "stream": True
    }
    
    print(f"Prompt: {prompt}")
    print("=" * 60)
    print("REASONING PROCESS:")
    print("-" * 30)
    
    try:
        response = requests.post(url, headers=headers, json=data, stream=True)
        
        if response.status_code != 200:
            print(f"HTTP Error: {response.status_code}")
            print(f"Response: {response.text}")
            return False
        
        reasoning_done = False
        for line in response.iter_lines():
            if line:
                try:
                    line_str = line.decode('utf-8')
                    if line_str.startswith('data: '):
                        try:
                            json_data = json.loads(line_str[6:])
                            
                            if 'type' in json_data:
                                if json_data['type'] == "response.reasoning_text.delta":
                                    delta_text = json_data.get('delta', '')
                                    print(delta_text, end="")
                                        
                                elif json_data['type'] == "response.output_text.delta":
                                    if not reasoning_done:
                                        print("\n" + "=" * 60)
                                        print("FINAL RESPONSE:")
                                        print("=" * 60)
                                        reasoning_done = True
                                    delta_text = json_data.get('delta', '')
                                    print(delta_text, end="")
                        except json.JSONDecodeError:
                            continue
                except UnicodeDecodeError:
                    continue
        
        print("\n" + "=" * 60)
        return True
        
    except Exception as e:
        print(f"Error: {e}")
        return False

def main():
    """Test the final working version"""
    print("NVIDIA Responses API - FINAL WORKING VERSION")
    print("=" * 60)
    print("This shows the AI's reasoning process + final response")
    print("=" * 60)
    
    # Test prompts
    test_prompts = [
        "What is 2+2?",
        "Explain quantum computing in one sentence",
        "Write a haiku about artificial intelligence"
    ]
    
    for i, prompt in enumerate(test_prompts, 1):
        print(f"\n--- Test {i} ---")
        nvidia_responses_final(prompt)
        print("\n" + "=" * 60)

if __name__ == "__main__":
    main()
