"""
Aladdyn Lead Demo – FastAPI Backend
LinkedIn Engagement Lead Extraction API
Task 2: Lead Extraction Pipeline + FastAPI Endpoints
"""

from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import asyncio
import random
import time
from datetime import datetime

# Import our monitor (works even without Playwright installed for demo)
try:
    from linkedin_monitor import run_linkedin_monitor, LinkedInMonitor
    PLAYWRIGHT_AVAILABLE = True
except ImportError:
    PLAYWRIGHT_AVAILABLE = False

app = FastAPI(
    title="Aladdyn Lead Intelligence API",
    description="LinkedIn engagement-based lead extraction prototype",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── In-memory lead store ──────────────────────────────────────────────────────
_lead_store: list[dict] = []
_monitoring_active: bool = False
_last_scan: Optional[str] = None


# ── Seed data so the dashboard is never empty ─────────────────────────────────
SEED_LEADS = [
    {"id":"li_001","name":"Priya Sharma","title":"Head of Growth @ TechCorp","source":"linkedin_engagement","engagement_action":"liked","keywords_matched":["AI","CRM"],"ai_score":90,"lead_tier":"HOT","extracted_at":"2026-05-27T07:10:00","status":"new"},
    {"id":"li_002","name":"Arjun Mehta","title":"Founder @ GrowthStack","source":"linkedin_engagement","engagement_action":"commented","keywords_matched":["lead gen","SaaS"],"ai_score":85,"lead_tier":"HOT","extracted_at":"2026-05-27T07:12:00","status":"contacted"},
    {"id":"li_003","name":"Sarah Chen","title":"VP Sales @ NovaSoft","source":"linkedin_engagement","engagement_action":"liked","keywords_matched":["AI","automation"],"ai_score":80,"lead_tier":"HOT","extracted_at":"2026-05-27T07:15:00","status":"new"},
    {"id":"li_004","name":"Ravi Kumar","title":"Product Manager @ Startify","source":"linkedin_engagement","engagement_action":"shared","keywords_matched":["CRM","pipeline"],"ai_score":75,"lead_tier":"WARM","extracted_at":"2026-05-27T07:18:00","status":"new"},
    {"id":"li_005","name":"Aisha Patel","title":"Growth Hacker @ LeadLabs","source":"linkedin_engagement","engagement_action":"commented","keywords_matched":["outbound","AI"],"ai_score":78,"lead_tier":"WARM","extracted_at":"2026-05-27T07:20:00","status":"qualified"},
    {"id":"li_006","name":"James Okonkwo","title":"CEO @ RevBoost","source":"linkedin_engagement","engagement_action":"liked","keywords_matched":["revenue","SaaS"],"ai_score":88,"lead_tier":"HOT","extracted_at":"2026-05-27T07:22:00","status":"new"},
    {"id":"li_007","name":"Lin Wei","title":"Marketing Director @ ScaleUp","source":"linkedin_engagement","engagement_action":"liked","keywords_matched":["B2B","automation"],"ai_score":65,"lead_tier":"WARM","extracted_at":"2026-05-27T07:25:00","status":"new"},
    {"id":"li_008","name":"Fatima Al-Rashid","title":"Business Dev @ PitchPerfect","source":"linkedin_engagement","engagement_action":"commented","keywords_matched":["outreach","leads"],"ai_score":72,"lead_tier":"WARM","extracted_at":"2026-05-27T07:28:00","status":"new"},
]

_lead_store.extend(SEED_LEADS)
_last_scan = "2026-05-27T07:28:00"


# ── Schemas ───────────────────────────────────────────────────────────────────
class LeadStatusUpdate(BaseModel):
    status: str   # new | contacted | qualified | disqualified


class ScanRequest(BaseModel):
    keywords: list[str] = ["AI CRM", "lead generation", "SaaS automation"]
    headless: bool = True


# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {
        "service": "Aladdyn Lead Intelligence API",
        "version": "1.0.0",
        "endpoints": [
            "GET  /linkedin/extracted-leads",
            "POST /linkedin/scan",
            "GET  /linkedin/monitoring-status",
            "GET  /linkedin/anti-bot-report",
            "GET  /linkedin/api-comparison",
            "PUT  /linkedin/leads/{lead_id}/status",
            "GET  /health",
        ]
    }


@app.get("/linkedin/extracted-leads")
def get_extracted_leads(
    tier: Optional[str] = None,
    status: Optional[str] = None,
    min_score: int = 0
):
    """
    Returns all LinkedIn-extracted leads.
    Supports filtering by tier (HOT/WARM/COLD), status, and minimum AI score.
    """
    results = _lead_store

    if tier:
        results = [l for l in results if l.get("lead_tier", "").upper() == tier.upper()]
    if status:
        results = [l for l in results if l.get("status", "") == status]
    if min_score:
        results = [l for l in results if l.get("ai_score", 0) >= min_score]

    return {
        "total": len(results),
        "last_scan": _last_scan,
        "monitoring_active": _monitoring_active,
        "leads": sorted(results, key=lambda x: x.get("ai_score", 0), reverse=True)
    }


@app.post("/linkedin/scan")
async def trigger_scan(req: ScanRequest, background_tasks: BackgroundTasks):
    """
    Trigger a LinkedIn engagement scan.
    Runs the Playwright monitor in background and populates the lead store.
    """
    global _monitoring_active
    if _monitoring_active:
        raise HTTPException(status_code=409, detail="Scan already in progress.")

    background_tasks.add_task(_run_scan_background, req.keywords, req.headless)
    return {"message": "LinkedIn scan started.", "keywords": req.keywords}


async def _run_scan_background(keywords: list[str], headless: bool):
    global _monitoring_active, _last_scan, _lead_store
    _monitoring_active = True
    try:
        if PLAYWRIGHT_AVAILABLE:
            monitor = LinkedInMonitor(headless=headless)
            new_leads = await monitor.run_monitoring_workflow()
        else:
            # Simulation fallback when Playwright not installed
            await asyncio.sleep(3)
            new_leads = _generate_simulated_leads(keywords)

        # Deduplicate by name
        existing_names = {l["name"] for l in _lead_store}
        added = [l for l in new_leads if l["name"] not in existing_names]
        _lead_store.extend(added)
        _last_scan = datetime.utcnow().isoformat()
    finally:
        _monitoring_active = False


def _generate_simulated_leads(keywords: list[str]) -> list[dict]:
    """Fallback simulation when Playwright unavailable."""
    names = ["Dev Anand", "Meera Nair", "Tom Bradley", "Zara Hussain"]
    titles = ["CTO @ Launchpad", "Sales Lead @ Orbit", "Founder @ Nexus", "Head of BD @ PivotCo"]
    actions = ["liked", "commented", "shared"]
    leads = []
    for i, (name, title) in enumerate(zip(names, titles)):
        score = random.randint(60, 95)
        leads.append({
            "id": f"li_sim_{int(time.time())}_{i}",
            "name": name,
            "title": title,
            "source": "linkedin_engagement",
            "engagement_action": random.choice(actions),
            "keywords_matched": random.sample(keywords, min(2, len(keywords))),
            "ai_score": score,
            "lead_tier": "HOT" if score >= 85 else "WARM" if score >= 65 else "COLD",
            "extracted_at": datetime.utcnow().isoformat(),
            "status": "new",
        })
    return leads


@app.get("/linkedin/monitoring-status")
def monitoring_status():
    return {
        "active": _monitoring_active,
        "total_leads": len(_lead_store),
        "last_scan": _last_scan,
        "hot_leads": sum(1 for l in _lead_store if l.get("lead_tier") == "HOT"),
        "warm_leads": sum(1 for l in _lead_store if l.get("lead_tier") == "WARM"),
        "playwright_available": PLAYWRIGHT_AVAILABLE,
    }


@app.get("/linkedin/anti-bot-report")
def anti_bot_report():
    """
    Task 3: Documents LinkedIn anti-bot protections observed during testing.
    """
    return {
        "title": "LinkedIn Anti-Bot Protection Analysis",
        "observations": [
            {"type": "AUTH_WALL", "description": "Login wall triggered immediately for unauthenticated requests", "risk": "HIGH"},
            {"type": "CAPTCHA", "description": "CAPTCHA verification on repeated automated navigation", "risk": "HIGH"},
            {"type": "FINGERPRINT", "description": "Browser fingerprint detection (headless Chromium detected)", "risk": "MEDIUM"},
            {"type": "RATE_LIMIT", "description": "IP-based rate limiting after 5+ requests/minute", "risk": "MEDIUM"},
            {"type": "SESSION_MONITOR", "description": "Session invalidation on suspicious scroll patterns", "risk": "MEDIUM"},
            {"type": "ACCOUNT_RESTRICT", "description": "Temporary account restriction for bulk profile visits", "risk": "HIGH"},
        ],
        "selenium_vs_playwright": {
            "selenium": {
                "detection_risk": "VERY HIGH",
                "notes": "navigator.webdriver flag exposed, older fingerprint evasion",
            },
            "playwright": {
                "detection_risk": "HIGH",
                "notes": "Better fingerprint masking, stealth plugins available, still detectable at scale",
            },
        },
        "recommendation": (
            "For production: Use LinkedIn OAuth 2.0 API + Organization API. "
            "Browser automation is suitable only for controlled prototype demos."
        )
    }


@app.get("/linkedin/api-comparison")
def api_comparison():
    """
    Task 4: Scalable alternatives comparison table.
    """
    return {
        "title": "Lead Intelligence API Comparison",
        "approaches": [
            {"name": "LinkedIn OAuth API", "type": "Official API", "cost": "Free (w/ app approval)", "risk": "LOW", "scalability": "HIGH", "use_case": "Profile data, connections, job info"},
            {"name": "LinkedIn Organization API", "type": "Official API", "cost": "Enterprise", "risk": "LOW", "scalability": "HIGH", "use_case": "Post engagement, follower analytics"},
            {"name": "LinkedIn Social Actions API", "type": "Official API", "cost": "Enterprise", "risk": "LOW", "scalability": "HIGH", "use_case": "Likes, comments, shares on posts"},
            {"name": "Apollo.io API", "type": "Third-party", "cost": "Paid ($49+/mo)", "risk": "LOW", "scalability": "VERY HIGH", "use_case": "B2B contact enrichment, email finder"},
            {"name": "Clearbit API", "type": "Third-party", "cost": "Paid ($99+/mo)", "risk": "LOW", "scalability": "VERY HIGH", "use_case": "Company/person enrichment"},
            {"name": "Crunchbase API", "type": "Third-party", "cost": "Paid ($29+/mo)", "risk": "LOW", "scalability": "HIGH", "use_case": "Startup/funding data"},
            {"name": "Playwright Automation", "type": "Browser Automation", "cost": "Free", "risk": "HIGH", "scalability": "LOW", "use_case": "Prototype demo, controlled testing only"},
            {"name": "Selenium Scraping", "type": "Browser Automation", "cost": "Free", "risk": "VERY HIGH", "scalability": "VERY LOW", "use_case": "Not recommended for production"},
        ],
        "recommended_architecture": {
            "production": ["LinkedIn OAuth API", "Apollo.io API", "Clearbit API"],
            "prototype_demo": ["Playwright (controlled)", "Crunchbase API (free tier)"],
            "avoid_at_scale": ["Selenium scraping", "Unauth Playwright scraping"],
        }
    }


@app.put("/linkedin/leads/{lead_id}/status")
def update_lead_status(lead_id: str, update: LeadStatusUpdate):
    """Update CRM status of an extracted lead."""
    for lead in _lead_store:
        if lead["id"] == lead_id:
            lead["status"] = update.status
            return {"success": True, "lead": lead}
    raise HTTPException(status_code=404, detail=f"Lead {lead_id} not found.")


@app.get("/health")
def health():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}