from langchain_chroma import Chroma

from brain.embeddings import embeddings

# Load existing vector database
vectorstore = Chroma(
    persist_directory="vectorstore",
    embedding_function=embeddings
)

# Create retriever
retriever = vectorstore.as_retriever(
    search_kwargs={"k": 3}
)


def retrieve_context(question: str) -> str:
    """
    Retrieve the most relevant chunks for a question.
    """

    docs = retriever.invoke(question)

    context = "\n\n".join(doc.page_content for doc in docs)

    return context