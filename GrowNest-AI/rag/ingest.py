from rag.config import MEDICAL_DOCS_DIR

from rag.pdf_loader import load_all_documents
from rag.chunker import split_into_chunks
from rag.embedder import Embedder
from rag.vector_store import VectorStore


def build_knowledge_base():
    """
    Complete ingestion pipeline:
    1. Load PDFs
    2. Extract pages
    3. Create chunks
    4. Generate embeddings
    5. Store everything in ChromaDB
    """

    print("=" * 60)
    print("Building Medical Knowledge Base")
    print("=" * 60)

    # ---------------------------------------------------------
    # Load PDF Pages
    # ---------------------------------------------------------

    pages = load_all_documents(MEDICAL_DOCS_DIR)

    print(f"\nLoaded {len(pages)} pages.")

    # ---------------------------------------------------------
    # Chunk Pages
    # ---------------------------------------------------------

    chunks = split_into_chunks(pages)

    print(f"Generated {len(chunks)} chunks.")

    # ---------------------------------------------------------
    # Remove Empty Chunks
    # ---------------------------------------------------------

    valid_chunks = [
        chunk
        for chunk in chunks
        if chunk["text"].strip()
    ]

    print(f"Valid Chunks : {len(valid_chunks)}")

    # ---------------------------------------------------------
    # Prepare Data
    # ---------------------------------------------------------

    documents = [
        chunk["text"]
        for chunk in valid_chunks
    ]

    ids = [
        chunk["id"]
        for chunk in valid_chunks
    ]

    metadatas = [
        {
            "source": chunk["source"],
            "document": chunk["document"],
            "page": chunk["page"],
            "chunk_number": chunk["chunk_number"],
        }
        for chunk in valid_chunks
    ]

    # ---------------------------------------------------------
    # Generate Embeddings
    # ---------------------------------------------------------

    embedder = Embedder()

    embeddings = embedder.embed_documents(documents)

    # ---------------------------------------------------------
    # Store in ChromaDB
    # ---------------------------------------------------------

    store = VectorStore()

    store.add_documents(
        ids=ids,
        documents=documents,
        embeddings=embeddings,
        metadatas=metadatas,
    )

    # ---------------------------------------------------------
    # Summary
    # ---------------------------------------------------------

    print("\n" + "=" * 60)
    print("Knowledge Base Built Successfully!")
    print("=" * 60)

    print(f"Pages Loaded      : {len(pages)}")
    print(f"Chunks Generated  : {len(chunks)}")
    print(f"Chunks Stored     : {store.count()}")

    print("=" * 60)


if __name__ == "__main__":
    build_knowledge_base()