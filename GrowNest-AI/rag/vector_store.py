import chromadb

from rag.config import (
    VECTOR_DB_DIR,
    COLLECTION_NAME,
)


class VectorStore:
    """
    Handles all communication with ChromaDB.
    """

    def __init__(self):

        self.client = chromadb.PersistentClient(
            path=str(VECTOR_DB_DIR)
        )

        self.collection = self.client.get_or_create_collection(
            name=COLLECTION_NAME,
            metadata={
                "description": "Medical Knowledge Base"
            }
        )

    # -------------------------------------------------

    def add_documents(
        self,
        ids,
        documents,
        embeddings,
        metadatas,
    ):
        """
        Store documents inside Chroma.
        """

        self.collection.upsert(
            ids=ids,
            documents=documents,
            embeddings=embeddings,
            metadatas=metadatas,
        )

    # -------------------------------------------------

    def search(
        self,
        query_embedding,
        top_k=5,
        where=None,
    ):

        kwargs = {
            "query_embeddings": [query_embedding],
            "n_results": top_k,
        }

        if where is not None:
            kwargs["where"] = where

        return self.collection.query(**kwargs)

    # -------------------------------------------------

    def count(self):
        """
        Number of stored chunks.
        """

        return self.collection.count()

    # -------------------------------------------------

    def delete_collection(self):
        """
        Delete the complete collection.
        Useful when rebuilding embeddings.
        """

        self.client.delete_collection(COLLECTION_NAME)

    # -------------------------------------------------

    def reset(self):
        """
        Recreate an empty collection.
        """

        try:
            self.delete_collection()
        except Exception:
            pass

        self.collection = self.client.get_or_create_collection(
            name=COLLECTION_NAME
        )
