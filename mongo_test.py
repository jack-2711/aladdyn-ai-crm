from pymongo import MongoClient

client = MongoClient("mongodb+srv://aladdyn:aladdyn123@cluster0.p9pzhiy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

db = client["aladdyn"]

collection = db["leads"]

lead = {
    "username": "startupgrow",
    "score": 90,
    "category": "Business Lead"
}

collection.insert_one(lead)

print("Lead inserted successfully!")