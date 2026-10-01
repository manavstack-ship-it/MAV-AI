from brain.embeddings import embeddings

vector = embeddings.embed_query(
    "What is Gradient Descent?"
)

print(len(vector))

print(vector[:10])