from fastapi import APIRouter, Depends
import numpy as np
from app.retrieval.ranking import keyword_score
from app.utils.source_links import generate_source_links

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

from app.utils.category_detector import detect_category
from app.utils.legal_filter import is_legal_query


router = APIRouter()

# ==============================
# CONFIG
# ==============================



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
def debug_embedding(content: str):
    vector = generate_embedding(content)

    return {
         "dimension": int(len(vector)),
        "sample_values": vector[:5].tolist()
    }


# ============================================================
# 4️⃣ DEBUG — SEARCH ONLY
# ============================================================
@router.post("/debug/faiss-search")
def debug_search(content: str):

    index = load_or_create_index()

    vector = generate_embedding(content)
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
                "content": matched_chunks[i],
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

TOP_K = 5
SIMILARITY_THRESHOLD = 0.50
@router.post("/chat")
def chat(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = request.query

    # Check if legal
    if not is_legal_query(query):
        return {
        "response": {
            "summary": "This assistant is designed to answer legal-related questions only.",
            "detected_issue": "Non-legal query",
            "risk_level": "None",
            "explanation": "Please ask a question related to law, legal rights, or legal procedures.",
            "advice": [],
            "citations": []
        }
    }
    
    predicted_category = detect_category(query)
    if not predicted_category:
       predicted_category = "General"

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
    seen = set()

    for i in range(len(matched_chunks)):
        distance = float(distances[0][i])
        semantic_similarity = 1 / (1 + distance)

        chunk = matched_chunks[i]
        # Keyword score
        content = chunk.get("content")

        if not content:
            continue
     
               

        kw_score = keyword_score(query, content)

        # Hybrid score
        final_score = (0.7 * semantic_similarity) + (0.3 * kw_score)

        if final_score >= 0.50:
            if content not in seen:
                results.append({
                    "content": content,
                    "category": chunk.get("category", "General"),
                    "title": chunk.get("title", "Unknown"),
                    "score": round(final_score, 4)
                })
                seen.add(content)
    
    for item in results:
        if current_user.role.name == "Student" and item["category"] == "Tenancy Law":
            item["score"] += 0.05

        if current_user.role.name == "Employee" and item["category"] == "Employment Law":
            item["score"] += 0.05

        if predicted_category and item["category"] == predicted_category:
            item["score"] += 0.10

    # Sort explicitly by similarity score (safety layer)
    results = sorted(results, key=lambda x: x["score"], reverse=True)
    # Keep only top 3 for cleaner response
    results = results[:3]
    confidence_score = round(results[0]["score"], 2) if results else 0
    # Extract content only for response engine
    clean_chunks = [item["content"] for item in results]
    citations = []

    for item in results:
        citations.append({
            "title": item["title"],
            "category": item["category"]
        })  

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
    query,
    clean_chunks,
    current_user.role.name,
    confidence_score,
    citations,   
)
    sources = generate_source_links(query, predicted_category)

    return {
        "user_id": str(current_user.id),
        "role": current_user.role.name,
        "query": query,
        "predicted_category": predicted_category,
        "response": final_response,
        "confidence_score": confidence_score,
        "sources": sources
    }