import urllib.parse

def generate_source_links(query: str, category: str):
    # Encode query (VERY IMPORTANT)
    query_encoded = urllib.parse.quote(query)

    links = []

    # Common trusted sources
    links.append(f"https://indiankanoon.org/search/?formInput={query_encoded}")
    links.append(f"https://lawrato.com/search?q={query_encoded}")

    # Category-based extra source
    if category == "Criminal Law":
        links.append(f"https://www.legalserviceindia.com/search.php?cx=partner-pub&q={query_encoded}")

    elif category == "Constitutional Law":
        links.append(f"https://legislative.gov.in/search?title={query_encoded}")

    # Limit links (important for UI)
    return links[:3]