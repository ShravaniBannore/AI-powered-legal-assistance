# utils/legal_filter.py

LEGAL_KEYWORDS = [
    # ⚖️ General Legal Terms
    "law", "legal", "legislation", "act", "bill", "statute",
    "jurisdiction", "liability", "justice", "legal notice",

    # 🏛️ Court & Judiciary
    "court", "judge", "judgement", "judgment", "tribunal",
    "supreme court", "high court", "district court",
    "hearing", "case", "petition", "appeal", "verdict",

    # 🚔 Criminal Law
    "crime", "criminal", "offence", "offense", "ipc",
    "section", "punishment", "penalty", "fine",
    "theft", "murder", "robbery", "assault", "kidnapping",
    "fraud", "forgery", "cybercrime", "harassment",
    "domestic violence", "rape", "abuse", "extortion",

    # 👮 Police & Investigation
    "police", "fir", "complaint", "investigation",
    "arrest", "warrant", "custody", "charge sheet",

    # 🧾 Civil Law
    "contract", "agreement", "breach", "damages",
    "negligence", "liability", "tort", "compensation",
    "settlement",

    # 👨‍👩‍👧 Family Law
    "divorce", "marriage", "alimony", "maintenance",
    "child custody", "adoption", "inheritance",

    # 🏠 Property Law
    "property", "ownership", "tenant", "landlord",
    "rent", "lease", "real estate", "eviction",

    # 🧑‍💼 Rights & Constitution
    "constitution", "rights", "fundamental rights",
    "human rights", "legal rights", "article",

    # 🏢 Corporate / Business Law
    "company law", "compliance", "regulation",
    "tax", "gst", "intellectual property", "trademark",
    "copyright", "patent",

    # 🔐 Cyber Law
    "hacking", "data breach", "privacy law",
    "it act", "cyber fraud", "online scam",

    # 📄 Legal Documents
    "affidavit", "notice", "agreement", "contract",
    "deed", "will", "power of attorney",

    "what is ipc", "what is law", "legal advice",
"punishment for", "is it legal", "is this illegal",
"file a case", "how to file fir", "legal action"
]

def is_legal_query(query: str) -> bool:
    query = query.lower()
    for keyword in LEGAL_KEYWORDS:
        if keyword in query:
            return True

    return False