from rag.config import (
    DISTANCE_THRESHOLD,
    MAX_CONTEXT_CHUNKS,
    MAX_CONTEXT_CHARACTERS,
)


class ContextFilter:
    """
    Filters retrieved chunks before they are
    sent to the prompt builder.
    """

    def __init__(self):
        pass

    # ---------------------------------------------------------

    def filter(self, retrieved_chunks):
        """
        Apply filtering pipeline.
        """

        filtered_chunks = []

        seen_texts = set()

        current_characters = 0

        for chunk in retrieved_chunks:

            text = chunk["text"].strip()

            distance = chunk["distance"]

            # -----------------------------------------
            # Skip empty chunks
            # -----------------------------------------

            if not text:
                continue

            # -----------------------------------------
            # Skip weak matches
            # -----------------------------------------

            if distance > DISTANCE_THRESHOLD:
                continue

            # -----------------------------------------
            # Remove duplicates
            # -----------------------------------------

            normalized = " ".join(text.lower().split())

            if normalized in seen_texts:
                continue

            seen_texts.add(normalized)

            # -----------------------------------------
            # Respect context budget
            # -----------------------------------------

            if current_characters + len(text) > MAX_CONTEXT_CHARACTERS:
                break

            filtered_chunks.append(chunk)

            current_characters += len(text)

            # -----------------------------------------
            # Maximum chunk count
            # -----------------------------------------

            if len(filtered_chunks) >= MAX_CONTEXT_CHUNKS:
                break

        return filtered_chunks