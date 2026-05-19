import pandas as pd
import joblib

model = joblib.load("lead_model.pkl")
platform_encoder = joblib.load("platform_encoder.pkl")
industry_encoder = joblib.load("industry_encoder.pkl")


def predict_score(platform, industry):

    platform_encoded = platform_encoder.transform([platform])[0]
    industry_encoded = industry_encoder.transform([industry])[0]

    input_df = pd.DataFrame({
        "platform_encoded": [platform_encoded],
        "industry_encoded": [industry_encoded]
    })

    prediction = model.predict(input_df)[0]

    return round(prediction, 2)