import random
from datetime import datetime

def scrape_leads():

    sample_names = [
        "Tesla AI",
        "OpenAI Research",
        "Creative Minds",
        "Future Tech",
        "Vision Analytics",
        "GrowthX",
        "Alpha Business",
        "Quantum Labs"
    ]

    categories = [
        "Business",
        "Creative",
        "General"
    ]

    leads = []

    for name in sample_names:

        lead = {
            "username": name,
            "category": random.choice(categories),
            "score": random.randint(40, 100),
            "lifecycle": "New Lead",
            "timestamp": datetime.now().isoformat()
        }

        leads.append(lead)

    return leads