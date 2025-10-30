import os
import openai
from flask import Flask, request, jsonify, render_template_string

app = Flask(__name__)

# Load environment variables
BASE_URL = os.getenv('BASE_URL', 'http://host.docker.internal:50000/engines/llama.cpp/v1/')
MODEL = os.getenv('MODEL', 'ai/smollm2')
API_KEY = os.getenv('API_KEY', 'dockermodelrunner')

# Initialize OpenAI client
client = openai.OpenAI(
    base_url=BASE_URL,
    api_key=API_KEY
)

@app.route('/chat', methods=['POST'])
def chat():
    """Chat endpoint that accepts messages and returns AI response"""
    try:
        data = request.get_json()
        user_message = data.get('message', 'Hello')
        
        messages = [
            {"role": "user", "content": user_message}
        ]
        
        response = client.chat.completions.create(
            model=MODEL,
            messages=messages
        )
        
        return jsonify({
            "response": response.choices[0].message.content
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "model": MODEL})

@app.route('/', methods=['GET'])
def home():
    """Chat interface"""
    return render_template_string('''
<!DOCTYPE html>
<html>
<head>
    <title>AI Chat</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px;
            background-color: #f5f5f5;
        }
        .chat-container { 
            background: white; 
            border-radius: 10px; 
            padding: 20px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .chat-messages { 
            height: 400px; 
            overflow-y: auto; 
            border: 1px solid #ddd; 
            padding: 15px; 
            margin-bottom: 15px; 
            background-color: #fafafa;
        }
        .message { 
            margin-bottom: 10px; 
            padding: 10px; 
            border-radius: 5px; 
        }
        .user-message { 
            background-color: #007bff; 
            color: white; 
            margin-left: 50px; 
        }
        .ai-message { 
            background-color: #e9ecef; 
            color: #333; 
            margin-right: 50px; 
        }
        .input-group { 
            display: flex; 
            gap: 10px; 
        }
        input[type="text"] { 
            flex: 1; 
            padding: 10px; 
            border: 1px solid #ddd; 
            border-radius: 5px; 
        }
        button { 
            padding: 10px 20px; 
            background-color: #007bff; 
            color: white; 
            border: none; 
            border-radius: 5px; 
            cursor: pointer; 
        }
        button:hover { 
            background-color: #0056b3; 
        }
        .loading { 
            color: #666; 
            font-style: italic; 
        }
    </style>
</head>
<body>
    <div class="chat-container">
        <h1>🤖 AI Chat - {{ model }}</h1>
        <div class="chat-messages" id="messages"></div>
        <div class="input-group">
            <input type="text" id="messageInput" placeholder="Type your message here..." onkeypress="handleKeyPress(event)">
            <button onclick="sendMessage()">Send</button>
        </div>
    </div>

    <script>
        function addMessage(content, isUser) {
            const messagesDiv = document.getElementById('messages');
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message ' + (isUser ? 'user-message' : 'ai-message');
            messageDiv.textContent = content;
            messagesDiv.appendChild(messageDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }

        function addLoading() {
            const messagesDiv = document.getElementById('messages');
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'message ai-message loading';
            loadingDiv.textContent = 'AI is thinking...';
            loadingDiv.id = 'loading';
            messagesDiv.appendChild(loadingDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }

        function removeLoading() {
            const loading = document.getElementById('loading');
            if (loading) loading.remove();
        }

        async function sendMessage() {
            const input = document.getElementById('messageInput');
            const message = input.value.trim();
            if (!message) return;

            addMessage(message, true);
            input.value = '';
            addLoading();

            try {
                const response = await fetch('/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: message })
                });

                const data = await response.json();
                removeLoading();
                
                if (data.error) {
                    addMessage('Error: ' + data.error, false);
                } else {
                    addMessage(data.response, false);
                }
            } catch (error) {
                removeLoading();
                addMessage('Error: ' + error.message, false);
            }
        }

        function handleKeyPress(event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        }
    </script>
</body>
</html>
    ''', model=MODEL)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
