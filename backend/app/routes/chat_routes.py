from fastapi import APIRouter, Depends
import numpy as np

# Auth
from app.auth.jwt_handler import get_current_user
from app.database.models import User  # IMPORTANT

# Embeddings
from app.embeddings.sbert_service import generate_embedding

# Retrieval
from app.retrieval.faiss_index import (
    load_or_create_index,
    add_vectors
)
from app.retrieval.chunk_store import (
    add_chunk,
    get_chunks_by_indices
)

# Response Engine
from app.response_engine.response_engine import build_legal_response
from app.database.connection import Session,get_db
from app.schemas.chat_schema import ChatRequest


router = APIRouter()

# ==============================
# CONFIG
# ==============================
TOP_K = 5
SIMILARITY_THRESHOLD = 0.60


# ============================================================
# 1️⃣ PROTECTED TEST ROUTE
# ============================================================
@router.get("/protected-test")
def protected_route(current_user: User = Depends(get_current_user)):
    return {
        "message": "You are authenticated",
        "user_id": str(current_user.id),
        "role": current_user.role.name
    }


# ============================================================
# 2️⃣ DEBUG — EMBEDDING
# ============================================================
@router.post("/debug/embedding")
def debug_embedding(text: str):
    vector = generate_embedding(text)

    return {
         "dimension": int(len(vector)),
        "sample_values": vector[:5].tolist()
    }


# ============================================================
# 3️⃣ DEBUG — ADD VECTOR + CHUNK
# ============================================================
@router.post("/debug/faiss-add")
def debug_add_vector(text: str):

    index = load_or_create_index()

    vector = generate_embedding(text)
    vector = np.array([vector]).astype("float32")

    add_vectors(index, vector)
    chunk_id = add_chunk(text)

    return {
        "message": "Vector + chunk added",
        "chunk_id": chunk_id,
        "total_vectors": index.ntotal
    }


# ============================================================
# 4️⃣ DEBUG — SEARCH ONLY
# ============================================================
@router.post("/debug/faiss-search")
def debug_search(text: str):

    index = load_or_create_index()

    vector = generate_embedding(text)
    vector = np.array([vector]).astype("float32")

    distances, indices = index.search(vector, TOP_K)

    flat_indices = indices[0].tolist()
    matched_chunks = get_chunks_by_indices(flat_indices)

    results = []

    for i in range(len(matched_chunks)):
        distance = float(distances[0][i])
        similarity = 1 / (1 + distance)

        if similarity >= SIMILARITY_THRESHOLD:
            results.append({
                "text": matched_chunks[i],
                "similarity": round(similarity, 4)
            })

    if not results:
        return {
            "message": "No relevant legal information found.",
            "results": []
        }

    return {
        "results": results
    }


# ============================================================
# 5️⃣ MAIN CHAT ENDPOINT (JWT PROTECTED)
# ============================================================
@router.post("/chat")
def chat(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = request.query

    # Generate embedding
    vector = generate_embedding(query)
    vector = np.array([vector]).astype("float32")

    # Load FAISS index
    index = load_or_create_index()

    # Search
    distances, indices = index.search(vector, TOP_K)

    flat_indices = indices[0].tolist()
    matched_chunks = get_chunks_by_indices(flat_indices)

    results = []

    for i in range(len(matched_chunks)):
        distance = float(distances[0][i])
        similarity = 1 / (1 + distance)

        if similarity >= SIMILARITY_THRESHOLD:
            results.append(matched_chunks[i])

    if not results:
        return {
            "user_id": str(current_user.id),
            "role": current_user.role.name,
            "query": query,
            "response": {
                "summary": "No relevant legal information found.",
                "advice": [],
                "role_note": f"As a {current_user.role.name}, you may consult a legal professional."
            }
        }

    # Build structured response
    final_response = build_legal_response(
    question=query,
    retrieved_chunks=results,
    role=current_user.role.name
)

    return {
        "user_id": str(current_user.id),
        "role": current_user.role.name,
        "query": query,
        "response": final_response
    }