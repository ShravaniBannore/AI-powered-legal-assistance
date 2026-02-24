def detect_issue(query: str):
    query_lower = query.lower()

    if "evict" in query_lower or "landlord" in query_lower:
        return "Tenant Eviction Dispute"

    elif "terminate" in query_lower or "fired" in query_lower:
        return "Employment Termination Issue"

    elif "deposit" in query_lower:
        return "Security Deposit Dispute"

    elif "harass" in query_lower:
        return "Workplace Harassment Issue"

    return "General Legal Inquiry"

def estimate_risk_level(issue: str, confidence: float, query: str):
    query_lower = query.lower()

    if "illegal" in query_lower or "immediate" in query_lower:
        return "High"

    if confidence >= 0.80:
        return "High"

    if confidence >= 0.65:
        return "Medium"

    return "Low"