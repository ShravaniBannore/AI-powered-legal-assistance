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
            return faiss.IndexFlatL2(DIMENSION)
    except:
        # If file corrupted, create new index
        return faiss.IndexFlatL2(DIMENSION)


def save_index(index):
    faiss.write_index(index, INDEX_PATH)


def add_vectors(index, vectors: np.ndarray):
    index.add(vectors)
    save_index(index)


def search_vectors(index, query_vector: np.ndarray, top_k: int = 5):
    distances, indices = index.search(query_vector, top_k)
    return distances, indices