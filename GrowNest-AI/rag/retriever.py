from rag.embedder import Embedder
from rag.vector_store import VectorStore
from rag.config import TOP_K


class Retriever:
    """
    Retrieves relevant chunks from the vector database.
    """

    def __init__(self):

        self.embedder = Embedder()

        self.vector_store = VectorStore()

    # ---------------------------------------------------------

    def retrieve(
        self,
        query: str,
        top_k: int = TOP_K,
        where: dict | None = None,
    ):
        """
        Retrieve relevant chunks for a query.
        """

        query_embedding = self.embedder.embed_query(query)

        results = self.vector_store.search(
            query_embedding=query_embedding,
            top_k=top_k,
            where=where,
        )

        formatted_results = []

        documents = results.get("documents", [[]])[0]
        metadatas = results.get("metadatas", [[]])[0]
        distances = results.get("distances", [[]])[0]

        for document, metadata, distance in zip(
            documents,
            metadatas,
            distances,
        ):

            formatted_results.append(
                {
                    "text": document,

                    "metadata": metadata,

                    "distance": round(1 - distance, 4),
                }
            )
            formatted_results.sort(
    key=lambda x: x["distance"]
)

        return formatted_results