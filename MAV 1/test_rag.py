from brain.rag import retrieve_context

question = "What does Embeddings doS ?"

context = retrieve_context(question)

print("=" * 50)
print("QUESTION")
print("=" * 50)

print(question)

print("\n")

print("=" * 50)
print("RETRIEVED CONTEXT")
print("=" * 50)

print(context)