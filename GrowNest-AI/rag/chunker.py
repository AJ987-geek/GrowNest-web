from uuid import uuid4

from rag.config import CHUNK_SIZE


def clean_text(text: str) -> str:
    """
    Remove unnecessary whitespace while preserving paragraphs.
    """

    lines = []

    for line in text.splitlines():

        line = line.strip()

        if line:

            lines.append(line)

        else:
            lines.append("")

    return "\n".join(lines)


def split_paragraphs(text: str):
    """
    Split text into paragraphs.
    """

    paragraphs = []

    for paragraph in text.split("\n\n"):

        paragraph = paragraph.strip()

        if paragraph:

            paragraphs.append(paragraph)

    return paragraphs


def split_into_chunks(pages):

    chunks = []

    chunk_counter = 0

    for page in pages:

        cleaned = clean_text(page["text"])

        paragraphs = split_paragraphs(cleaned)

        current_chunk = []

        current_size = 0

        previous_paragraph = ""

        for paragraph in paragraphs:

            paragraph_length = len(paragraph)

            if current_size + paragraph_length <= CHUNK_SIZE:

                current_chunk.append(paragraph)

                current_size += paragraph_length

            else:

                chunk_counter += 1

                chunks.append(
                    {
                        "id": str(uuid4()),

                        "text": "\n\n".join(current_chunk),

                        "page": page["page"],

                        "document": page["document"],

                        "source": page["source"],

                        "chunk_number": chunk_counter,
                    }
                )

                current_chunk = []

                if previous_paragraph:
                    current_chunk.append(previous_paragraph)

                current_chunk.append(paragraph)

                current_size = sum(len(x) for x in current_chunk)

            previous_paragraph = paragraph

        if current_chunk:

            chunk_counter += 1

            chunks.append(
                {
                    "id": str(uuid4()),

                    "text": "\n\n".join(current_chunk),

                    "page": page["page"],

                    "document": page["document"],

                    "source": page["source"],

                    "chunk_number": chunk_counter,
                }
            )

    return chunks