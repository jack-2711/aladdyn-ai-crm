import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import joblib

data = {

    "platform": [
        "LinkedIn",
        "Crunchbase",
        "Google Maps",
        "Instagram",
        "Product Hunt",
        "NewsAPI",
        "GitHub API",
        "LinkedIn API"
    ],

    "industry": [
        "AI",
        "Fintech",
        "Healthcare",
        "Fashion",
        "SaaS",
        "Startup",
        "Open Source",
        "Business"
    ],

    "score": [
        95,
        90,
        85,
        70,
        88,
        89,
        92,
        91
    ]
}

df = pd.DataFrame(data)

platform_encoder = LabelEncoder()
industry_encoder = LabelEncoder()

df["platform_encoded"] = platform_encoder.fit_transform(
    df["platform"]
)

df["industry_encoded"] = industry_encoder.fit_transform(
    df["industry"]
)

X = df[["platform_encoded", "industry_encoded"]]

y = df["score"]

model = RandomForestRegressor()

model.fit(X, y)

joblib.dump(model, "lead_model.pkl")

joblib.dump(platform_encoder, "platform_encoder.pkl")

joblib.dump(industry_encoder, "industry_encoder.pkl")

print("AI Model Trained Successfully!")