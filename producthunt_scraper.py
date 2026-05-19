import requests
import random

def fetch_real_leads():

    url = "https://dummyjson.com/users"

    response = requests.get(url)

    data = response.json()

    leads = []

    for user in data["users"][:10]:

        random_number = random.randint(1, 1000)

        lead = {
            "company_name": user["company"]["name"] + str(random_number),
            "website": user.get("domain", "No Website"),
            "email": f"{random_number}_{user['email']}",
            "source": "Dummy API"
        }

        leads.append(lead)

    return leads