def keyword_score(query: str, text: str) -> float:
    query_words = set(query.lower().split())
    text_words = set(text.lower().split())

    if not query_words:
        return 0.0

    overlap = query_words.intersection(text_words)

    return len(overlap) / len(query_words)