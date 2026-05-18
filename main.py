import pandas as pd
from datetime import datetime

users = [
    {"username": "startupgrow", "bio": "Startup Founder"},
    {"username": "ai_marketer", "bio": "Digital Marketing Expert"},
    {"username": "salesgenius", "bio": "Sales Consultant"},
    {"username": "startupgrow", "bio": "Startup Founder"}  # duplicate
]

processed_users = []

seen_users = set()

for user in users:

    username = user["username"]

    # Duplicate Reduction
    if username in seen_users:
        continue

    seen_users.add(username)

    bio = user["bio"].lower()

    score = 0
    category = "General Lead"

    # AI Classification + Scoring
    if "startup" in bio:
        category = "Business Lead"
        score = 90

    elif "marketing" in bio:
        category = "Marketing Lead"
        score = 80

    elif "sales" in bio:
        category = "Sales Lead"
        score = 70

    else:
        category = "Low Potential Lead"
        score = 30

    # Timestamp
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Lead Lifecycle
    lifecycle = "New Lead"

    processed_users.append({
        "username": username,
        "bio": user["bio"],
        "category": category,
        "score": score,
        "timestamp": timestamp,
        "lifecycle": lifecycle
    })

# Save to CSV
df = pd.DataFrame(processed_users)

df.to_csv("leads.csv", index=False)

print(df)
print("Lead Pipeline Completed Successfully!")