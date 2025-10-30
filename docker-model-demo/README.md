## Docker Model Runner Demo

Simple ways to call your local Docker Model Runner (DMR) and a minimal containerized web chat.

### Prerequisites
- Python 3.11+
- Docker Desktop with Model Runner enabled and TCP on your chosen port (e.g., 50000 or 12434)
- Model available, e.g. `ai/smollm2`

### Install deps
```bash
pip install -r requirements.txt
```

### Run the model locally with Docker Model Runner (required)
Without Docker Model Runner enabled and a local model running, this repo won't work.

1) Install Docker Desktop

2) Enable Model Runner and host access
- Open Docker Desktop → Settings → AI
- Enable "Model Runner"
- Enable "Host-side TCP support" and set the port to 50000
- Set CORS Allowed Origin to "All" (select all)
- (Optional) Enable GPU-backed inference
- Click Apply

3) Download and run a model
- Go to the Models tab
- Open Docker Hub inside Docker Desktop
- Search and download `smollm2`
- Go to the Local tab
- Click the Play button in Actions to start the model
- You can chat with it inside Docker Desktop, or if you run this repo, open the Requests section in Docker Desktop to see requests appear as you interact

Note: If you chose a different port than 50000, update:
- `BASE_URL` in `simple_openai_client.py`
- `BASE_URL` in `backend.env`

### Option A: Simple OpenAI-compatible local script
```bash
python simple_openai_client.py
```
- Edits:
  - Change `BASE_URL` if your DMR port differs
  - Change `MODEL_NAME` and prompt as desired

### Option B: Raw requests client
```bash
python docker_model_client.py
```

### Option C: Containerized API + Web Chat UI
1) Build and run
```bash
docker compose up --build
```
2) Open the chat UI
```text
http://localhost:8080
```
3) Test endpoints
```bash
python test_api.py
```
PowerShell alternative to curl:
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/chat" -Method POST -ContentType "application/json" -Body '{"message":"Hello!"}'
```

4) Stop and clean up
- In the terminal running `docker compose up`, press Ctrl+C to stop the app
- Then bring the stack down and remove containers/networks:
```bash
docker compose down
```

### Advanced examples
- Completions (non-chat)
```python
from openai import OpenAI
client = OpenAI(base_url="http://localhost:50000/engines/llama.cpp/v1", api_key="x")
r = client.completions.create(model="ai/smollm2", prompt="Write a haiku about Docker.")
print(r.choices[0].text)
```

- Embeddings (if supported)
```python
from openai import OpenAI
client = OpenAI(base_url="http://localhost:50000/engines/llama.cpp/v1", api_key="x")
r = client.embeddings.create(model="ai/smollm2", input="Hello world")
print(len(r.data[0].embedding))
```

- Multi-turn chat (keep context)
```python
from openai import OpenAI
client = OpenAI(base_url="http://localhost:50000/engines/llama.cpp/v1", api_key="x")
messages = [{"role":"system","content":"You are helpful."}]
messages.append({"role":"user","content":"Who won the 2018 World Cup?"})
r = client.chat.completions.create(model="ai/smollm2", messages=messages)
messages.append({"role":"assistant","content": r.choices[0].message.content})
messages.append({"role":"user","content":"What about 2022?"})
r2 = client.chat.completions.create(model="ai/smollm2", messages=messages)
print(r2.choices[0].message.content)
```

### Configuration
- `backend.env`
  - `BASE_URL` (default used by the Flask app inside the container): `http://host.docker.internal:50000/engines/llama.cpp/v1/`
  - `MODEL` (default `ai/smollm2`)
  - `API_KEY` (DMR accepts any token; kept for compatibility)

### Troubleshooting
- If requests fail from PowerShell using `curl`, use `Invoke-RestMethod` instead
- Ensure Docker Model Runner TCP is enabled on the port you set
- If using a different port, update:
  - `BASE_URL` in `simple_openai_client.py`
  - `BASE_URL` in `backend.env`
- Health check (containerized API): `http://localhost:8080/health`

### Reference
- Docker Model Runner API docs: `https://docs.docker.com/ai/model-runner/api-reference/`


