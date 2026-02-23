import json
import os

CHUNK_PATH = "faiss_index/chunks.json"

# Ensure directory exists
os.makedirs("faiss_index", exist_ok=True)


def load_chunks():
    if os.path.exists(CHUNK_PATH):
        with open(CHUNK_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


def save_chunks(chunks):
    with open(CHUNK_PATH, "w", encoding="utf-8") as f:
        json.dump(chunks, f, indent=4)


def add_chunk(text: str):
    chunks = load_chunks()
    chunks.append(text)
    save_chunks(chunks)
    return len(chunks) - 1  # return index position


def get_chunks_by_indices(indices):
    chunks = load_chunks()
    return [chunks[i] for i in indices if i < len(chunks)]