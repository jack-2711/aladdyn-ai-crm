import requests

def fetch_real_linkedin_leads():

    url = "YOUR_RAPIDAPI_URL"

    headers = {
        "X-RapidAPI-Key": "YOUR_KEY",
        "X-RapidAPI-Host": "YOUR_HOST"
    }

    response = requests.get(url, headers=headers)

    data = response.json()

    leads = []

    for item in data:

        lead = {
            "company_name": item.get("companyName", "Unknown"),
            "platform": "LinkedIn API",
            "industry": "Business",
            "location": "Global"
        }

        leads.append(lead)

    return leads