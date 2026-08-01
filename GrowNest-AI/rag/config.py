from pathlib import Path

# -----------------------------
# Project Paths
# -----------------------------
# -----------------------------
# Chroma Collection
# -----------------------------
EMBED_BATCH_SIZE = 64

COLLECTION_NAME = "medical_knowledge"

# -----------------------------
# Embedding Settings
# -----------------------------

NORMALIZE_EMBEDDINGS = True

BASE_DIR = Path(__file__).resolve().parent.parent

MEDICAL_DOCS_DIR = BASE_DIR / "medical_docs"

VECTOR_DB_DIR = BASE_DIR / "chroma_db"

# -----------------------------
# Embedding Model
# -----------------------------

EMBEDDING_MODEL = "BAAI/bge-small-en-v1.5"

# -----------------------------
# Chunk Settings
# -----------------------------

CHUNK_SIZE = 700

CHUNK_OVERLAP = 150
# -----------------------------
# Context Filtering
# -----------------------------

MAX_CONTEXT_CHUNKS = 3

MAX_CONTEXT_CHARACTERS = 6000

DISTANCE_THRESHOLD = 0.45
# -----------------------------
# Retrieval
# -----------------------------

TOP_K = 5