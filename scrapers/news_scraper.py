import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("NEWS_API_KEY")


def fetch_news_leads():

    url = (
        f"https://newsapi.org/v2/everything?"
        f"q=AI startup OR SaaS OR fintech OR healthcare"
        f"&language=en"
        f"&sortBy=publishedAt"
        f"&apiKey={API_KEY}"
    )

    response = requests.get(url)

    data = response.json()

    leads = []

    if "articles" in data:

        for article in data["articles"][:10]:

            lead = {
                "company_name": article.get("source", {}).get("name", "Unknown"),
                "platform": "NewsAPI",
                "industry": "Startup",
                "location": "Global",
                "headline": article.get("title", ""),
                "website": article.get("url", ""),
                "ai_score": 88,
                "priority": "HOT"
            }

            leads.append(lead)

    return leads