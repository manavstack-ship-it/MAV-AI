import ollama

from config import MODEL
from brain.prompt import SYSTEM_PROMPT
from brain.memory import (
    load_chat,
    add_message,
    get_conversation,
    add_conversation_message,
)
from tools.web_search import web_search


def needs_web_search(user_message: str) -> bool:
    text = user_message.lower()

    keywords = [
        "latest",
        "current",
        "today",
        "tonight",
        "now",
        "news",
        "recent",
        "recently",
        "this week",
        "this month",
        "2026",
        "price",
        "prices",
        "weather",
        "score",
        "scores",
        "update",
        "updates",
        "what happened",
        "who won",
        "stock",
        "stocks",
    ]

    return any(keyword in text for keyword in keywords)


def ask_mav(user_message: str, chat_id: str | None = None) -> str:

    # Get conversation history
    if chat_id:
        conversation = get_conversation(chat_id)

        if conversation is None:
            return "I couldn't find that conversation."

        history = conversation.get("messages", [])
    else:
        history = load_chat()

    messages = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT
        }
    ]

    messages.extend(history)

    # Use web search for current-information questions
    if needs_web_search(user_message):

        search_results = web_search(user_message)

        web_context = f"""
The user is asking for current information.

You have access to the following web search results:

{search_results}

Use these search results to answer the user's question.

Important:
- Prefer the information from the search results over your old knowledge.
- Do not claim information is current unless it is supported by the search results.
- If the search results are insufficient, say so.
- Do not invent facts.
- When useful, mention the source URLs provided in the search results.
"""

        messages.append({
            "role": "system",
            "content": web_context
        })

    messages.append({
        "role": "user",
        "content": user_message
    })

    response = ollama.chat(
        model=MODEL,
        messages=messages
    )

    reply = response["message"]["content"]

    # Save conversation
    if chat_id:
        add_conversation_message(
            chat_id,
            "user",
            user_message
        )

        add_conversation_message(
            chat_id,
            "assistant",
            reply
        )
    else:
        add_message("user", user_message)
        add_message("assistant", reply)

    return reply