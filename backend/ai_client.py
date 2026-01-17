import requests
import os
from dotenv import load_dotenv

load_dotenv()

# Using Groq instead of OpenRouter (it's free!)
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY not found in .env file")

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL = "llama-3.3-70b-versatile"  # Change from llama-3.1 to llama-3.3  # Fast and free model

def ask_openrouter(messages):
    """
    Send messages to Groq AI and get response
    """
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": MODEL,
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 1024
    }

    try:
        response = requests.post(
            GROQ_URL,
            headers=headers,
            json=payload,
            timeout=30
        )

        # Debug: print response for 400 errors
        if response.status_code == 400:
            print(f"400 Error Response: {response.text}")
        
        response.raise_for_status()
        
        data = response.json()
        return data["choices"][0]["message"]["content"]
        
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 401:
            raise ValueError("Invalid Groq API key. Please check your .env file")
        elif e.response.status_code == 429:
            raise ValueError("Rate limit exceeded. Please try again in a moment")
        elif e.response.status_code == 400:
            try:
                error_detail = e.response.json()
                raise ValueError(f"Bad request: {error_detail}")
            except:
                raise ValueError(f"Bad request: {e.response.text}")
        else:
            raise ValueError(f"Groq API error {e.response.status_code}: {e.response.text}")
    except requests.exceptions.Timeout:
        raise ValueError("Request timed out. Please try again")
    except Exception as e:
        raise ValueError(f"Error calling AI: {str(e)}")