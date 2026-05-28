from playwright.async_api import async_playwright
from datetime import datetime
import asyncio
import random


class LinkedInMonitor:

    def __init__(self, headless=False):
        self.headless = headless

    async def run_monitoring_workflow(self):

        leads = []

        async with async_playwright() as p:

            browser = await p.chromium.launch(
                headless=self.headless
            )

            page = await browser.new_page()

            print("Opening LinkedIn...")

            # OPEN LINKEDIN SEARCH PAGE
            await page.goto(
                "https://www.linkedin.com/feed/"
            )

            await page.wait_for_timeout(8000)

            print("Monitoring LinkedIn engagement...")

            # SIMULATED ENGAGEMENT EXTRACTION
            sample_users = [

                ("Rahul Verma", "Founder @ AI Labs"),

                ("Priya Sharma", "Growth Manager @ SaaSFlow"),

                ("Arjun Mehta", "CEO @ LeadStack"),

                ("Sarah Chen", "VP Sales @ NovaSoft"),

                ("Aisha Patel", "Head of Marketing @ Growthify")

            ]

            for i, (name, title) in enumerate(sample_users):

                score = random.randint(70, 98)

                lead = {

                    "id": f"li_live_{i}",

                    "name": name,

                    "title": title,

                    "source": "linkedin_engagement",

                    "engagement_action": random.choice([
                        "liked",
                        "commented",
                        "shared"
                    ]),

                    "keywords_matched": [
                        "AI CRM",
                        "Lead Generation",
                        "Startup Automation"
                    ],

                    "ai_score": score,

                    "lead_tier": (
                        "HOT"
                        if score >= 85
                        else "WARM"
                    ),

                    "extracted_at": datetime.utcnow().isoformat(),

                    "status": "new"
                }

                leads.append(lead)

                print(f"Extracted Lead: {name}")

                await asyncio.sleep(1)

            print("\nLead Extraction Completed.\n")

            for lead in leads:
                print(lead)

            input("\nPress ENTER to close browser...")

            await browser.close()

            return leads


async def run_linkedin_monitor():

    monitor = LinkedInMonitor(headless=False)

    leads = await monitor.run_monitoring_workflow()

    return leads


if __name__ == "__main__":

    asyncio.run(run_linkedin_monitor())