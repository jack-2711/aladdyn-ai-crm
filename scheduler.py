from apscheduler.schedulers.blocking import BlockingScheduler
from producthunt_scraper import fetch_real_leads
from pymongo import MongoClient

MONGO_URL = "mongodb+srv://aladdyn:aladdyn123@cluster0.p9pzhiy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(MONGO_URL)

db = client["aladdyn_ai"]

collection = db["real_leads"]


def auto_fetch_leads():

    print("Fetching new leads...")

    leads = fetch_real_leads()

    for lead in leads:

        # Avoid duplicates
        existing = collection.find_one({
            "email": lead["email"]
        })

        if not existing:

            collection.insert_one(lead)

            print("Inserted:", lead["company_name"])

        else:

            print("Already exists:", lead["company_name"])


scheduler = BlockingScheduler()

# Every 1 minute
scheduler.add_job(auto_fetch_leads, "interval", minutes=1)

print("Scheduler running...")

scheduler.start()