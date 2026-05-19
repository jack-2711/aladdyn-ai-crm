import requests


def fetch_github_leads():

    url = "https://api.github.com/search/repositories?q=saas+startup+AI&sort=stars"

    response = requests.get(url)

    data = response.json()

    leads = []

    for repo in data.get("items", [])[:5]:

        lead = {

            "company_name": repo["name"],

            "platform": "GitHub API",

            "industry": "Open Source",

            "location": "Global",

            "website": repo["html_url"],

            "followers": repo["stargazers_count"]

        }

        leads.append(lead)

    return leads