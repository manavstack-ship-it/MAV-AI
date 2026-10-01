from ddgs import DDGS


def web_search(query: str) -> str:
    try:
        results = DDGS().text(
            query,
            max_results=5
        )

        results = list(results)

        if not results:
            return "No web results found."

        output = []

        for result in results:
            output.append(
                f"Title: {result.get('title', '')}\n"
                f"Snippet: {result.get('body', '')}\n"
                f"URL: {result.get('href', '')}"
            )

        return "\n\n".join(output)

    except Exception as e:
        return f"Web search failed: {e}"


def news_search(query: str) -> str:
    try:
        results = DDGS().news(
            query=query,
            region="in-en",
            timelimit="d",
            max_results=10
        )

        results = list(results)

        if not results:
            return "No recent news results found."

        output = []

        for result in results:
            output.append(
                f"Date: {result.get('date', '')}\n"
                f"Title: {result.get('title', '')}\n"
                f"Source: {result.get('source', '')}\n"
                f"Summary: {result.get('body', '')}\n"
                f"URL: {result.get('url', '')}"
            )

        return "\n\n".join(output)

    except Exception as e:
        return f"News search failed: {e}"