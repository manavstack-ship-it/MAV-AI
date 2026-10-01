from pathlib import Path

from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

documents = []

knowledge_path = Path("knowledge")

# Load every .md file
for file in knowledge_path.rglob("*.md"):
    loader = TextLoader(str(file), encoding="utf-8")
    documents.extend(loader.load())

print(f"Loaded {len(documents)} documents")

# Split documents into chunks
splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=100
)

chunks = splitter.split_documents(documents)

print(f"Created {len(chunks)} chunks")

print("\nFirst Chunk:\n")
print(chunks[0].page_content)