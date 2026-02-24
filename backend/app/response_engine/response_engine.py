from app.response_engine.issue_detector import detect_issue, estimate_risk_level

def build_legal_response(question: str, retrieved_chunks: list, role: str, confidence: float):
    
    detected_issue = detect_issue(question)
    risk_level = estimate_risk_level(detected_issue, confidence, question)

    if not retrieved_chunks:
        return {
            "detected_issue": detected_issue,
            "risk_level": risk_level,
            "summary": "No relevant legal information found.",
            "advice": [],
            "role_note": f"As a {role}, you may consult a legal professional."
        }

    summary = "Based on retrieved legal information:\n"

    for chunk in retrieved_chunks:
        summary += f"- {chunk}\n"

    return {
        "detected_issue": detected_issue,
        "risk_level": risk_level,
        "summary": summary.strip(),
        "advice": [
            "Review official legal documents.",
            "Consult a qualified legal professional."
        ],
        "role_note": f"This guidance is tailored for a {role}."
    }