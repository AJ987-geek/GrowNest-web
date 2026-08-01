from rag.retriever import Retriever
from rag.context_filter import ContextFilter
from rag.prompt_builder import PromptBuilder

from services import ask_ai


import urllib.request
import json
from datetime import datetime

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
        child_id: int | str | None = None
    ):
        child_context = ""
        if child_id:
            try:
                base_url = "https://grownest-backend-5xa2.onrender.com/api"
                
                # Fetch profile
                prof_req = urllib.request.Request(f"{base_url}/children/{child_id}")
                with urllib.request.urlopen(prof_req) as response:
                    child_data = json.loads(response.read().decode())
                
                # Fetch vaccines
                vac_req = urllib.request.Request(f"{base_url}/children/{child_id}/vaccinations")
                with urllib.request.urlopen(vac_req) as response:
                    vac_data = json.loads(response.read().decode())
                
                dob_formatted = child_data.get('dob', '')[:10]
                child_context = f"Child Name: {child_data.get('name')}\nDate of Birth: {dob_formatted}\nGender: {child_data.get('gender')}"
                
                if isinstance(vac_data, list):
                    missed = [v['name'] for v in vac_data if v.get('status') == 'missed']
                    completed = [v['name'] for v in vac_data if v.get('status') == 'completed']
                    child_context += f"\nCompleted Vaccines: {', '.join(completed) if completed else 'None'}"
                    child_context += f"\nMissed/Overdue Vaccines: {', '.join(missed) if missed else 'None'}"
            except Exception as e:
                print("Error fetching context from Node backend:", e)
                child_context = ""

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