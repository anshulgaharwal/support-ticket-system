import os
import json
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

PROMPT_TEMPLATE = """
You are a support ticket classifier.

Classify the following support ticket description into:
Category (one of: billing, technical, account, general)
Priority (one of: low, medium, high, critical)

Respond ONLY in JSON format:
{
  "category": "...",
  "priority": "..."
}

Description:
{description}
"""

def classify_ticket(description: str):
    try:
        prompt = PROMPT_TEMPLATE.format(description=description)

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0
        )

        content = response.choices[0].message.content
        data = json.loads(content)

        return {
            "suggested_category": data.get("category"),
            "suggested_priority": data.get("priority"),
        }

    except Exception:
        return None
