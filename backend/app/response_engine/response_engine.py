def build_legal_response(question: str, retrieved_chunks: list, role: str):
    if not retrieved_chunks:
        return {
            "summary": "No relevant legal information found.",
            "advice": [],
            "role_note": f"As a {role}, you may consult a legal professional."
        }

    summary = "Based on retrieved legal information:\n"

    for chunk in retrieved_chunks:
        summary += f"- {chunk}\n"

    return {
        "summary": summary.strip(),
        "advice": [
            "Review official legal documents.",
            "Consult a qualified legal professional."
        ],
        "role_note": f"This guidance is tailored for a {role}."
    }