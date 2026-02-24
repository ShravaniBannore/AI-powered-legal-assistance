import json
import os

CHUNK_FILE = "faiss_index/chunks.json"

os.makedirs("faiss_index", exist_ok=True)

def load_chunks():
    if not os.path.exists(CHUNK_FILE):
        return []

    with open(CHUNK_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_chunks(chunks):
    with open(CHUNK_FILE, "w", encoding="utf-8") as f:
        json.dump(chunks, f, indent=4)


def add_chunk(chunk_data: dict):
    """
    chunk_data = {
        "id": int,
        "category": str,
        "title": str,
        "content": str
    }
    """
    chunks = load_chunks()
    chunks.append(chunk_data)
    save_chunks(chunks)
    return len(chunks) - 1


def get_chunks_by_indices(indices: list):
    chunks = load_chunks()
    results = []

    for idx in indices:
        if 0 <= idx < len(chunks):
            results.append(chunks[idx])

    return results