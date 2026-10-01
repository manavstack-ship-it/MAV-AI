import json
import os
import uuid
from datetime import datetime

MEMORY_FILE = "data/memory.json"
CHAT_FILE = "data/chat_history.json"
CONVERSATIONS_FILE = "data/conversations.json"


# ---------- General MAV Memory ----------

def load_memory():
    if not os.path.exists(MEMORY_FILE):
        return {}

    with open(MEMORY_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_memory(memory):
    os.makedirs(os.path.dirname(MEMORY_FILE), exist_ok=True)

    with open(MEMORY_FILE, "w", encoding="utf-8") as f:
        json.dump(memory, f, indent=4)


def remember(key, value):
    memory = load_memory()
    memory[key] = value
    save_memory(memory)


def recall(key):
    memory = load_memory()
    return memory.get(key)


# ---------- Legacy Chat History ----------

def load_chat():
    if not os.path.exists(CHAT_FILE):
        return []

    with open(CHAT_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_chat(chat):
    os.makedirs(os.path.dirname(CHAT_FILE), exist_ok=True)

    with open(CHAT_FILE, "w", encoding="utf-8") as f:
        json.dump(chat, f, indent=4)


def add_message(role, content):
    chat = load_chat()

    chat.append({
        "role": role,
        "content": content
    })

    chat = chat[-20:]

    save_chat(chat)


# ---------- Conversations ----------

def load_conversations():
    if not os.path.exists(CONVERSATIONS_FILE):
        return {}

    with open(CONVERSATIONS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_conversations(conversations):
    os.makedirs(os.path.dirname(CONVERSATIONS_FILE), exist_ok=True)

    with open(CONVERSATIONS_FILE, "w", encoding="utf-8") as f:
        json.dump(conversations, f, indent=4)


def create_conversation(title="New Chat"):
    conversations = load_conversations()

    chat_id = str(uuid.uuid4())

    now = datetime.now().isoformat()

    conversations[chat_id] = {
        "id": chat_id,
        "title": title,
        "messages": [],
        "created_at": now,
        "updated_at": now
    }

    save_conversations(conversations)

    return conversations[chat_id]


def get_conversation(chat_id):
    conversations = load_conversations()
    return conversations.get(chat_id)


def list_conversations():
    conversations = load_conversations()

    chats = list(conversations.values())

    chats.sort(
        key=lambda chat: chat.get("updated_at", ""),
        reverse=True
    )

    return chats


def add_conversation_message(chat_id, role, content):
    conversations = load_conversations()

    if chat_id not in conversations:
        return None

    conversations[chat_id]["messages"].append({
        "role": role,
        "content": content
    })

    # Keep the conversation reasonably sized
    conversations[chat_id]["messages"] = \
        conversations[chat_id]["messages"][-50:]

    conversations[chat_id]["updated_at"] = datetime.now().isoformat()

    # Automatically create a title from the first user message
    if (
        role == "user"
        and conversations[chat_id]["title"] == "New Chat"
    ):
        title = content.strip().replace("\n", " ")

        if len(title) > 40:
            title = title[:40] + "..."

        conversations[chat_id]["title"] = title

    save_conversations(conversations)

    return conversations[chat_id]


def delete_conversation(chat_id):
    conversations = load_conversations()

    if chat_id not in conversations:
        return False

    del conversations[chat_id]

    save_conversations(conversations)

    return True