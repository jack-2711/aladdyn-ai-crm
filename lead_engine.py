from pymongo import MongoClient
from scrapers.news_scraper import fetch_news_leads
from scrapers.linkedin_scraper import fetch_linkedin_leads
from scrapers.crunchbase_scraper import fetch_crunchbase_leads
from scrapers.googlemaps_scraper import fetch_googlemaps_leads
from scrapers.producthunt_scraper import fetch_producthunt_leads
from scrapers.instagram_scraper import fetch_instagram_leads
from scrapers.github_api import fetch_github_leads
from ai_scoring import predict_score
from recommendation_engine import generate_recommendation

# MongoDB Connection
MONGO_URL = "mongodb+srv://aladdyn:aladdyn123@cluster0.p9pzhiy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(MONGO_URL)

db = client["aladdyn_ai"]

collection = db["multi_platform_leads"]


# Fetch All Leads
def fetch_all_leads():

    all_leads = []

    linkedin = fetch_linkedin_leads()
    crunchbase = fetch_crunchbase_leads()
    googlemaps = fetch_googlemaps_leads()
    producthunt = fetch_producthunt_leads()
    instagram = fetch_instagram_leads()

    all_leads.extend(linkedin)
    all_leads.extend(crunchbase)
    all_leads.extend(googlemaps)
    all_leads.extend(producthunt)
    all_leads.extend(instagram)
    all_leads.extend(fetch_news_leads())
    all_leads.extend(fetch_github_leads())
    return all_leads


# Insert Leads
def insert_leads():

    leads = fetch_all_leads()

    for lead in leads:

        existing = collection.find_one({
            "company_name": lead["company_name"]
        })

        if not existing:

            # AI Prediction
            score = predict_score(
                lead["platform"],
                lead["industry"]
            )

            lead["ai_score"] = score
            lead["recommendation"] = generate_recommendation( score,lead["platform"])

            # Priority Logic
            if score > 80:
                lead["priority"] = "HOT"

            elif score > 50:
                lead["priority"] = "WARM"

            else:
                lead["priority"] = "COLD"

            collection.insert_one(lead)

            print("Inserted:", lead["company_name"])

        else:

            print("Already Exists:", lead["company_name"])


# Main Runner
if __name__ == "__main__":

    print("Fetching Multi-Platform Leads...\n")

    insert_leads()

    print("\nLead Ingestion Completed!")