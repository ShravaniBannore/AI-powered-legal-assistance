import faiss
import numpy as np
import os

INDEX_PATH = "faiss_index/index.bin"
DIMENSION = 384

# Create directory if not exists
os.makedirs("faiss_index", exist_ok=True)


def load_or_create_index():
    try:
        if os.path.exists(INDEX_PATH):
            return faiss.read_index(INDEX_PATH)
        else:
            # Use Inner Product for cosine similarity
            return faiss.IndexFlatIP(DIMENSION)
    except:
        # If file corrupted, create new index
        return faiss.IndexFlatIP(DIMENSION)


def save_index(index):
    faiss.write_index(index, INDEX_PATH)


def normalize_vectors(vectors: np.ndarray):
    faiss.normalize_L2(vectors)
    return vectors


def add_vectors(index, vectors: np.ndarray):
    # Normalize before adding
    vectors = normalize_vectors(vectors)
    index.add(vectors)
    save_index(index)


def search_vectors(index, query_vector: np.ndarray, top_k: int = 5):
    # Normalize query before searching
    query_vector = normalize_vectors(query_vector)
    distances, indices = index.search(query_vector, top_k)
    return distances, indices