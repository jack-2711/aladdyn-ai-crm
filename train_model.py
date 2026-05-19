import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import joblib

# Sample Training Data
data = {

    "platform": [
        "LinkedIn",
        "Crunchbase",
        "Instagram",
        "Google Maps",
        "Product Hunt"
    ],

    "industry": [
        "AI",
        "Fintech",
        "Fashion",
        "Healthcare",
        "SaaS"
    ],

    "score": [
        95,
        90,
        60,
        70,
        85
    ]
}

df = pd.DataFrame(data)

# Encode Text Data
platform_encoder = LabelEncoder()
industry_encoder = LabelEncoder()

df["platform"] = platform_encoder.fit_transform(df["platform"])
df["industry"] = industry_encoder.fit_transform(df["industry"])

# Features
X = df[["platform", "industry"]]

# Target
y = df["score"]

# Train Model
model = RandomForestRegressor()

model.fit(X, y)

# Save Model
joblib.dump(model, "lead_model.pkl")

# Save Encoders
joblib.dump(platform_encoder, "platform_encoder.pkl")
joblib.dump(industry_encoder, "industry_encoder.pkl")

print("AI Model Trained Successfully!")