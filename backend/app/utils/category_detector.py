def detect_category(query: str):

    query = query.lower()

    category_keywords = {
        "Tenancy Law": ["tenant", "rent", "landlord", "eviction", "lease"],
        "Employment Law": ["job", "salary", "termination", "employee", "company"],
        "Consumer Protection": ["product", "refund", "defective", "consumer", "purchase"],
        "Cyber Law": ["hack", "online fraud", "cyber", "data breach", "internet"],
        "Family Law": ["divorce", "marriage", "custody", "alimony", "spouse"],
        "Criminal Law": ["arrest", "crime", "police", "theft", "assault"],
        "Contract Law": ["contract", "agreement", "breach", "terms", "obligation"]
    }

    scores = {}

    for category, keywords in category_keywords.items():
        score = 0
        for word in keywords:
            if word in query:
                score += 1
        scores[category] = score

    best_category = max(scores, key=scores.get)

    if scores[best_category] == 0:
        return None

    return best_category