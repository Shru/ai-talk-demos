from flask import Flask, request, jsonify
import requests
import json

app = Flask(__name__)

def get_weather_simple(city: str) -> dict:
    """Simple weather function that n8n can call directly"""
    try:
        # Step 1: Convert city to coordinates
        geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1"
        geo_resp = requests.get(geo_url).json()
        if not geo_resp.get("results"):
            return {"error": f"City '{city}' not found."}

        lat = geo_resp["results"][0]["latitude"]
        lon = geo_resp["results"][0]["longitude"]

        # Step 2: Get current weather
        weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,weathercode"
        weather_resp = requests.get(weather_url).json()
        current = weather_resp.get("current", {})

        temperature = current.get("temperature_2m")
        weather_code = current.get("weathercode")

        # Step 3: Map weather codes to descriptions
        conditions = {
            0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
            45: "Fog", 48: "Depositing rime fog", 51: "Light drizzle", 61: "Rain",
            71: "Snow fall", 80: "Rain showers", 95: "Thunderstorm"
        }
        description = conditions.get(weather_code, "Unknown")

        return {
            "city": city,
            "temperature_celsius": temperature,
            "condition": description,
            "latitude": lat,
            "longitude": lon
        }

    except Exception as e:
        return {"error": str(e)}

@app.route('/')
def home():
    return jsonify({
        "message": "Weather API for n8n",
        "endpoints": {
            "/weather/<city>": "Get weather for a city",
            "/health": "Health check"
        }
    })

@app.route('/weather/<city>')
def weather(city):
    result = get_weather_simple(city)
    return jsonify(result)

@app.route('/weather')
def weather_query():
    city = request.args.get('city', 'London')
    result = get_weather_simple(city)
    return jsonify(result)

@app.route('/health')
def health():
    return jsonify({"status": "healthy", "service": "weather-api"})

if __name__ == '__main__':
    print("Starting Weather API for n8n...")
    print("Available endpoints:")
    print("  GET /weather/<city> - Get weather for specific city")
    print("  GET /weather?city=<city> - Get weather with query parameter")
    print("  GET /health - Health check")
    print("Server will be available at http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
