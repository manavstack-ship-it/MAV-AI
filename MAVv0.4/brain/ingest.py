from pathlib import Path

from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma

from brain.embeddings import embeddings

# Load all markdown files
documents = []

knowledge_path = Path("knowledge")

for file in knowledge_path.rglob("*.md"):
    loader = TextLoader(str(file), encoding="utf-8")
    documents.extend(loader.load())

print(f"Loaded {len(documents)} documents")

# Split into chunks
splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=100
)

chunks = splitter.split_documents(documents)

print(f"Created {len(chunks)} chunks")

# Create vector database
vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="vectorstore"
)

print(f"\nStored {len(chunks)} chunks inside ChromaDB.")