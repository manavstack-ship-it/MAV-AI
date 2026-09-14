import json
import os

MEMORY_FILE = "data/memory.json"
CHAT_FILE = "data/chat_history.json"


def load_memory():
    if not os.path.exists(MEMORY_FILE):
        return {}

    with open(MEMORY_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_memory(memory):
    with open(MEMORY_FILE, "w", encoding="utf-8") as f:
        json.dump(memory, f, indent=4)


def remember(key, value):
    memory = load_memory()
    memory[key] = value
    save_memory(memory)


def recall(key):
    memory = load_memory()
    return memory.get(key)


def load_chat():
    if not os.path.exists(CHAT_FILE):
        return []

    with open(CHAT_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_chat(chat):
    with open(CHAT_FILE, "w", encoding="utf-8") as f:
        json.dump(chat, f, indent=4)


def add_message(role, content):
    chat = load_chat()

    chat.append({
        "role": role,
        "content": content
    })

    # Keep only the last 20 messages
    chat = chat[-20:]

    save_chat(chat)