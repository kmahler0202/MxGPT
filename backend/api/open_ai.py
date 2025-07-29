import os
from openai import OpenAI
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from project root .env
load_dotenv(dotenv_path=Path(__file__).resolve().parents[2] / ".env")

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def query(prompt: str) -> str:
    """Send a prompt to OpenAI and return the response text."""
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
    )
    return response.choices[0].message.content.strip()
