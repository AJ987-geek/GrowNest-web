import fitz
from pathlib import Path

SUPPORTED_EXTENSIONS = [".pdf"]


def extract_text_from_pdf(pdf_path: Path):
    """
    Reads a PDF and returns one dictionary per page.
    """

    document = fitz.open(pdf_path)

    pages = []

    for page_number, page in enumerate(document):

        text = page.get_text("text")

        if text.strip():

            pages.append(
                {
                    "text": text,
                    "page": page_number + 1,
                    "document": pdf_path.name,
                    "source": pdf_path.parent.name,
                }
            )

    document.close()

    return pages


def load_all_documents(root_folder: Path):

    all_pages = []

    for pdf in root_folder.rglob("*"):

        if pdf.suffix.lower() not in SUPPORTED_EXTENSIONS:
            continue

        print(f"Loading {pdf.name}")

        pages = extract_text_from_pdf(pdf)

        all_pages.extend(pages)

    return all_pages