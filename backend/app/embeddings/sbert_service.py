from sentence_transformers import SentenceTransformer
import numpy as np

# Load model once globally (important for performance)
model = SentenceTransformer("all-MiniLM-L6-v2")


def generate_embedding(text: str) -> np.ndarray:
    """
    Generates 384-dimensional embedding for given text
    """
    embedding = model.encode(text)
    return embedding