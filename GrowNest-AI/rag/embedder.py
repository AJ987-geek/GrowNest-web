from sentence_transformers import SentenceTransformer

from rag.config import (
    EMBEDDING_MODEL,
    NORMALIZE_EMBEDDINGS,
    EMBED_BATCH_SIZE
)


class Embedder:
    """
    Generates embeddings for documents and user queries.
    """

    def __init__(self):

        print(f"\nLoading embedding model: {EMBEDDING_MODEL}")

        self.model = SentenceTransformer(
            EMBEDDING_MODEL,
            trust_remote_code=True
        )

        print("Embedding model loaded successfully.\n")

    # -------------------------------------------------------

    def embed_documents(self, documents):
        """
        Generate embeddings for document chunks.
        """

        embeddings = self.model.encode(
            documents,
            convert_to_numpy=True,
            normalize_embeddings=NORMALIZE_EMBEDDINGS,
            show_progress_bar=True,
        )

        return embeddings.tolist()

    # -------------------------------------------------------

    def embed_query(self, query):
        """
        Generate embedding for a user query.
        """

        embeddings = self.model.encode(
            query,

            convert_to_numpy=True,

            normalize_embeddings=NORMALIZE_EMBEDDINGS,

            batch_size=EMBED_BATCH_SIZE,

            show_progress_bar=True,
        )

        return embeddings.tolist()