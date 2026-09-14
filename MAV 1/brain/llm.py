import ollama

from config import MODEL
from brain.prompt import SYSTEM_PROMPT
from brain.memory import load_chat, add_message


def ask_mav(user_message: str) -> str:
    # Start with the system prompt
    messages = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT,
        }
    ]

    # Load previous conversation
    messages.extend(load_chat())

    # Add the current user message
    messages.append(
        {
            "role": "user",
            "content": user_message,
        }
    )

    # Send everything to Ollama
    response = ollama.chat(
        model=MODEL,
        messages=messages,
    )

    # Get the assistant's reply
    reply = response["message"]["content"]

    # Save this conversation
    add_message("user", user_message)
    add_message("assistant", reply)

    return reply