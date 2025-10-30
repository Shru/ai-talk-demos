import requests
from mcp.server import FastMCP

mcp = FastMCP("weather-mcp")

@mcp.tool()
def get_weather(city: str) -> dict:
    """
    Returns current temperature and weather conditions for a given city.
    Uses Open-Meteo's free API.
    """
    try:
        # Step 1: Convert city to coordinates using Open-Meteo geocoding
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

        # Step 3: Map weather codes to simple descriptions
        conditions = {
            0: "Clear sky",
            1: "Mainly clear",
            2: "Partly cloudy",
            3: "Overcast",
            45: "Fog",
            48: "Depositing rime fog",
            51: "Light drizzle",
            61: "Rain",
            71: "Snow fall",
            80: "Rain showers",
            95: "Thunderstorm"
        }
        description = conditions.get(weather_code, "Unknown")

        return {
            "city": city,
            "temperature_celsius": temperature,
            "condition": description
        }

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    print("Starting Weather MCP Server...")
    print("Transport: streamable-http")
    print("Server will be available at http://127.0.0.1:8000")
    print("MCP endpoint: http://127.0.0.1:8000/mcp")
    mcp.run(transport="streamable-http")
