from fastapi import FastAPI
from pymongo import MongoClient
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Connection
MONGO_URL = "mongodb+srv://aladdyn:aladdyn123@cluster0.p9pzhiy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(MONGO_URL)

db = client["aladdyn_ai"]

collection = db["real_leads"]


@app.get("/real-leads")
def get_real_leads():

    leads = []

    multi_collection = db["multi_platform_leads"]

    for lead in multi_collection.find():

        lead["_id"] = str(lead["_id"])

        leads.append(lead)

    return leads
@app.get("/alerts")
def get_alerts():

    alerts = []

    multi_collection = db["multi_platform_leads"]

    for lead in multi_collection.find():

        if lead["ai_score"] > 85:

            alerts.append({
                "message":
                f"HOT Lead: {lead['company_name']} from {lead['platform']}"
            })

    return alerts