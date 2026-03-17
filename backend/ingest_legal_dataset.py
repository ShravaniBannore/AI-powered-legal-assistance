import json
import numpy as np
from app.embeddings.sbert_service import generate_embedding
from app.retrieval.faiss_index import (
    load_or_create_index,
    add_vectors
)
from app.retrieval.chunk_store import add_chunk
import os

DATASET_PATH = "legal_dataset.json"

def ingest_dataset():
    if not os.path.exists(DATASET_PATH):
        print("Dataset file not found.")
        return

    with open(DATASET_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    index = load_or_create_index()

    for item in data:
        definition = item.get("definition", "")
        explanation = item.get("explanation", "")
        punishment = item.get("punishment", "")

        content = f"""
        Definition: {definition}

        Explanation: {explanation}

        Punishment: {punishment}
        """

        embedding = generate_embedding(content)
        vector = np.array([embedding]).astype("float32")

        add_vectors(index, vector)

        add_chunk({
            "id": item["id"],
            "category": item["category"],
            "title": item["title"],
            "content": content.strip()
        })

    print("Dataset ingestion complete.")


if __name__ == "__main__":
    ingest_dataset()