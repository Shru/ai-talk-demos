## Using Hugging Face Models via the OpenAI Python Client

This demo shows how to call Hugging Face models from Python using the OpenAI‑compatible API.

This repo contains:
- `add_numbers.py`: simple function demo
- `test_huggingface.py`: calls Hugging Face models via the OpenAI-compatible API

### Before you start
1) Get a Hugging Face API key from your HF account.
   - In your Hugging Face account: Profile → Access Tokens → Create new token → select "Read" scope → Create.
2) Open `test_huggingface.py` and set your key in the `OpenAI` client initialization:

```python
client = OpenAI(
    base_url="https://router.huggingface.co/v1",
    api_key="<your_hf_api_key_here>",
)
```

### Requirements
- **Python** 3.9+
- **pip package**: `openai`
- Windows consoles may need UTF‑8; use the `-X utf8` flag when running Python

### Quick start (Windows PowerShell)
```powershell
# cd into the cloned repo folder (adjust the path as needed)
cd .\hf-free-model
pip install openai
```

### Run the scripts
```powershell
python .\add_numbers.py
python -X utf8 .\test_huggingface.py
```

### Notes
- If you encounter emoji/encoding errors, keep the `-X utf8` flag.


