# NVIDIA API Client

A Python client for interacting with NVIDIA's AI models through their API.

## Configuration

To get API keys and set up the code:
- Visit the model page: [openai/gpt-oss-120b on NVIDIA Build](https://build.nvidia.com/openai/gpt-oss-120b)
- Click "View Code" in the top-right
- Choose either "Chat Completions" or "Responses API"
- Click "Generate API Key"
- Copy only the base URL and API key portion from the generated code and update the respective Python script:
  - For `nvidia_api_client.py`, set the base URL and API key used by the Chat Completions client
  - For `nvidia_responses_final.py`, set the `url` and the `Authorization: Bearer <API_KEY>` header for the Responses API


## Setup

1. Install the required dependencies:
```bash
pip install -r requirements.txt
```

2. Run the clients:
```bash
# Interactive chatbot (CLI)
python nvidia_api_client.py

# Programmatic streaming example (reasoning + final response)
python nvidia_responses_final.py
```

## Usage

`nvidia_api_client.py` provides an interactive interface where you can:
- Enter prompts to get AI responses
- Type 'quit', 'exit', or 'q' to exit the program

Two ways to use this repo:
- `nvidia_api_client.py`: Interactive chatbot (CLI) for chatting with the model.
- `nvidia_responses_final.py`: Programmatic usage example that streams reasoning and the final response.

For `nvidia_responses_final.py`, the request body and headers are defined inline in the script; adjust them as needed for your environment.

## Features

- Streams responses in real-time
- Uses the `openai/gpt-oss-120b` model by default
- Configurable parameters (temperature, max_tokens, etc.)
- Interactive command-line interface

## API Parameters

- **model**: The AI model to use (default: "openai/gpt-oss-120b")
- **max_tokens**: Maximum number of tokens to generate (default: 4096)
- **temperature**: Controls randomness (default: 1)
- **top_p**: Controls diversity (default: 1)
