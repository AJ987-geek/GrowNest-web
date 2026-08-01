from rag.retriever import Retriever
from rag.context_filter import ContextFilter
from rag.prompt_builder import PromptBuilder

from services import ask_ai


class RAGService:
    """
    Complete Retrieval-Augmented Generation pipeline.
    """

    def __init__(self):

        self.retriever = Retriever()

        self.context_filter = ContextFilter()

        self.prompt_builder = PromptBuilder()

    # ---------------------------------------------------------

    def chat(
        self,
        user_question: str,
        child_context: str | None = None
    ):

        # ---------------------------------------------
        # Step 1
        # Retrieve candidate chunks
        # ---------------------------------------------

        retrieved_chunks = self.retriever.retrieve(
            query=user_question
        )

        # ---------------------------------------------
        # Step 2
        # Filter chunks
        # ---------------------------------------------

        filtered_chunks = self.context_filter.filter(
            retrieved_chunks
        )

        # ---------------------------------------------
        # Step 3
        # Build final prompt
        # ---------------------------------------------

        prompt = self.prompt_builder.build(
            user_question=user_question,
            retrieved_chunks=filtered_chunks,
            child_context=child_context,
        )

        # ---------------------------------------------
        # Step 4
        # Stream response
        # ---------------------------------------------

        return ask_ai(prompt)