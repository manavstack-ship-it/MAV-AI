from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

from brain.llm import ask_mav
from brain.memory import (
    create_conversation,
    get_conversation,
    list_conversations,
    delete_conversation,
)


app = FastAPI(title="MAV API")


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# STATUS
# --------------------------------------------------

@app.get("/status")
def status():
    return {
        "status": "online",
        "assistant": "MAV"
    }


# --------------------------------------------------
# CREATE CONVERSATION
# --------------------------------------------------

@app.post("/chats")
def create_chat():
    conversation = create_conversation()
    return conversation


# --------------------------------------------------
# LIST CONVERSATIONS
# --------------------------------------------------

@app.get("/chats")
def get_chats():
    conversations = list_conversations()

    return [
        {
            "id": chat["id"],
            "title": chat["title"],
            "created_at": chat["created_at"],
            "updated_at": chat["updated_at"],
        }
        for chat in conversations
    ]


# --------------------------------------------------
# GET CONVERSATION
# --------------------------------------------------

@app.get("/chats/{chat_id}")
def get_chat(chat_id: str):
    conversation = get_conversation(chat_id)

    if conversation is None:
        return {
            "error": "Conversation not found"
        }

    return conversation


# --------------------------------------------------
# DELETE CONVERSATION
# --------------------------------------------------

@app.delete("/chats/{chat_id}")
def remove_chat(chat_id: str):
    deleted = delete_conversation(chat_id)

    return {
        "success": deleted
    }


# --------------------------------------------------
# CHAT WITH MAV
# --------------------------------------------------

@app.post("/chat")
def chat(data: dict):

    user_message = data.get("message", "").strip()
    chat_id = data.get("chat_id")

    if not user_message:
        return {
            "response": "Please enter a message.",
            "chat_id": chat_id
        }

    # Create a conversation when no ID was supplied.
    if not chat_id:
        conversation = create_conversation()
        chat_id = conversation["id"]

    # If the supplied ID doesn't exist, create a new
    # backend conversation and return its real ID.
    else:
        conversation = get_conversation(chat_id)

        if conversation is None:
            conversation = create_conversation()
            chat_id = conversation["id"]

    # Built-in time command.
    if user_message.lower() == "time":
        response = datetime.now().strftime("%I:%M:%S %p")

    # Normal MAV/Ollama request.
    else:
        response = ask_mav(
            user_message,
            chat_id=chat_id
        )

    return {
        "response": response,
        "chat_id": chat_id
    }