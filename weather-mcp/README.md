# Weather MCP Server

A Model Context Protocol (MCP) server that provides weather data for any city using the Open-Meteo API. Includes both MCP server and HTTP wrapper for easy integration with tools like n8n.

## Features

- 🌤️ Get current weather for any city worldwide
- 🌡️ Temperature in Celsius
- ☁️ Weather condition descriptions
- 📍 Geographic coordinates
- 🔌 MCP protocol support
- 🌐 HTTP API wrapper for easy integration

## Quick Start

### Prerequisites

- Python 3.7+
- pip package manager

### Installation

1. Clone or download this repository
2. Install dependencies:

```bash
pip install mcp requests flask
```

### Running the Servers

#### Option 1: MCP Server (for MCP clients)

```bash
python server.py
```

**Server Details:**
- **URL**: `http://127.0.0.1:8000`
- **MCP Endpoint**: `http://127.0.0.1:8000/mcp`
- **Transport**: streamable-http (Server-Sent Events)
- **Protocol**: MCP 2024-11-05

#### Option 2: HTTP Wrapper (for n8n, webhooks, etc.)

```bash
python http_wrapper.py
```

**API Endpoints:**
- `GET /weather/<city>` - Get weather for specific city
- `GET /weather?city=<city>` - Get weather with query parameter
- `GET /health` - Health check

**Example:**
```bash
curl http://localhost:5000/weather/London
```

### Stopping the Servers

#### Stop All Python Processes (Windows)
```bash
taskkill /F /IM python.exe
```

#### Stop Specific Servers
- **MCP Server**: Press `Ctrl+C` in the terminal running `server.py`
- **HTTP Wrapper**: Press `Ctrl+C` in the terminal running `http_wrapper.py`

#### Check Running Servers
```bash
# Check what's running on the ports
netstat -an | findstr :8000  # MCP server
netstat -an | findstr :5000  # HTTP wrapper

# List all Python processes
tasklist | findstr python
```

## Usage Examples

### MCP Client Integration

The MCP server provides a `get_weather` tool that can be used by MCP-compatible clients like Claude Desktop or Cursor.

**Tool Parameters:**
- `city` (string): Name of the city to get weather for

**Example Response:**
```json
{
  "city": "London",
  "temperature_celsius": 8.7,
  "condition": "Overcast"
}
```

### HTTP API Integration

#### Get Weather for a City

```bash
# Direct city in URL
curl http://localhost:5000/weather/London

# Using query parameter
curl "http://localhost:5000/weather?city=Paris"
```

#### Response Format

```json
{
  "city": "London",
  "temperature_celsius": 8.7,
  "condition": "Overcast",
  "latitude": 51.50853,
  "longitude": -0.12574
}
```

### n8n Integration

Use the HTTP Request node in n8n:

**Configuration:**
- **Method**: GET
- **URL**: `http://localhost:5000/weather/{{ $json.city }}`
- **Headers**: None required

**Example Workflow:**
1. Trigger node (webhook, schedule, etc.)
2. HTTP Request node → `http://localhost:5000/weather/London`
3. Process the weather data

## API Reference

### Weather Conditions

The API maps weather codes to human-readable descriptions:

| Code | Condition |
|------|-----------|
| 0 | Clear sky |
| 1 | Mainly clear |
| 2 | Partly cloudy |
| 3 | Overcast |
| 45 | Fog |
| 48 | Depositing rime fog |
| 51 | Light drizzle |
| 61 | Rain |
| 71 | Snow fall |
| 80 | Rain showers |
| 95 | Thunderstorm |

### Error Handling

The API returns error responses in the following format:

```json
{
  "error": "City 'InvalidCity' not found."
}
```

Common errors:
- City not found
- Network connectivity issues
- API rate limiting

## Development

### Project Structure

```
weather-mcp/
├── server.py          # MCP server implementation
├── http_wrapper.py    # HTTP API wrapper
├── manifest.json      # MCP server configuration
└── README.md         # This file
```

### Dependencies

- `mcp`: Model Context Protocol library
- `requests`: HTTP client for weather API calls
- `flask`: Web framework for HTTP wrapper

### Testing

Test the HTTP wrapper:

```bash
# Health check
curl http://localhost:5000/health

# Weather for London
curl http://localhost:5000/weather/London

# Weather for Paris
curl http://localhost:5000/weather/Paris
```

## Troubleshooting

### Common Issues

1. **Port already in use**: Stop other Python processes or change ports
2. **City not found**: Check spelling and try different city names
3. **Connection refused**: Ensure the server is running on the correct port

### Checking Server Status

```bash
# Check if servers are running
netstat -an | findstr :8000  # MCP server
netstat -an | findstr :5000  # HTTP wrapper

# Test endpoints
curl http://localhost:5000/health
```

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to submit issues and enhancement requests!
