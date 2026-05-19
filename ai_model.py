import pandas as pd

from sklearn.linear_model import LogisticRegression

import joblib

# Sample Training Data

data = {
    "score": [90, 85, 80, 70, 60, 50, 40, 30],
    "converted": [1, 1, 1, 1, 0, 0, 0, 0]
}

df = pd.DataFrame(data)

X = df[["score"]]

y = df["converted"]

model = LogisticRegression()

model.fit(X, y)

joblib.dump(model, "lead_model.pkl")

print("AI Model Trained Successfully")