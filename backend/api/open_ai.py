import os
from openai import OpenAI
from dotenv import load_dotenv
from pathlib import Path
load_dotenv(dotenv_path=Path(__file__).resolve().parents[2] / ".env")

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def query(prompt):
    # Send query -- How many r's in the word strawberry?

    response = client.chat.completions.create(
        model="gpt-4o",
        messages = [
            {"role": "user", "content": prompt}
        ]
    )

    return response.choices[0].message.content.strip()