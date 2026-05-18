from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from bson import ObjectId
from jose import jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
import pandas as pd

# =========================
# FASTAPI APP
# =========================

app = FastAPI()

# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# MONGODB CONNECTION
# =========================

client = MongoClient(
    "mongodb+srv://aladdyn:aladdyn123@cluster0.p9pzhiy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
)

db = client["aladdyn_db"]

leads_collection = db["leads"]
users_collection = db["users"]

# =========================
# JWT SETTINGS
# =========================

SECRET_KEY = "aladdyn_secret_key"

ALGORITHM = "HS256"

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

# =========================
# MODELS
# =========================

class Lead(BaseModel):
    username: str
    category: str
    score: int
    lifecycle: str
    timestamp: str


class LifecycleUpdate(BaseModel):
    lifecycle: str


class UserSignup(BaseModel):
    username: str
    password: str


class UserLogin(BaseModel):
    username: str
    password: str

# =========================
# PASSWORD FUNCTIONS
# =========================

def hash_password(password):

    return pwd_context.hash(password)


def verify_password(
    plain_password,
    hashed_password
):

    return pwd_context.verify(
        plain_password,
        hashed_password
    )

# =========================
# JWT TOKEN FUNCTION
# =========================

def create_access_token(data: dict):

    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(hours=2)

    to_encode.update(
        {
            "exp": expire
        }
    )

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt

# =========================
# HOME ROUTE
# =========================

@app.get("/")
def home():

    return {
        "message": "Aladdyn AI CRM Backend Running"
    }

# =========================
# SIGNUP ROUTE
# =========================

@app.post("/signup")
def signup(user: UserSignup):

    existing_user = users_collection.find_one(
        {
            "username": user.username
        }
    )

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="User already exists"
        )

    hashed_password = hash_password(
        user.password
    )

    users_collection.insert_one(
        {
            "username": user.username,
            "password": hashed_password
        }
    )

    return {
        "message": "User created successfully"
    }

# =========================
# LOGIN ROUTE
# =========================

@app.post("/login")
def login(user: UserLogin):

    db_user = users_collection.find_one(
        {
            "username": user.username
        }
    )

    if not db_user:

        raise HTTPException(
            status_code=401,
            detail="Invalid username"
        )

    password_valid = verify_password(
        user.password,
        db_user["password"]
    )

    if not password_valid:

        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    access_token = create_access_token(
        {
            "sub": user.username
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

# =========================
# GET LEADS
# =========================

@app.get("/leads")
def get_leads():

    leads = []

    for lead in leads_collection.find():

        lead["_id"] = str(lead["_id"])

        leads.append(lead)

    return leads

# =========================
# ADD LEAD
# =========================

@app.post("/add-lead")
def add_lead(lead: Lead):

    leads_collection.insert_one(
        lead.dict()
    )

    return {
        "message": "Lead added successfully"
    }

# =========================
# UPDATE LIFECYCLE
# =========================

@app.put("/update-lifecycle/{lead_id}")
def update_lifecycle(
    lead_id: str,
    data: LifecycleUpdate
):

    result = leads_collection.update_one(
        {
            "_id": ObjectId(lead_id)
        },
        {
            "$set": {
                "lifecycle": data.lifecycle
            }
        }
    )

    if result.modified_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Lead not found"
        )

    return {
        "message": "Lifecycle updated"
    }

# =========================
# DELETE LEAD
# =========================

@app.delete("/delete-lead/{lead_id}")
def delete_lead(lead_id: str):

    result = leads_collection.delete_one(
        {
            "_id": ObjectId(lead_id)
        }
    )

    if result.deleted_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Lead not found"
        )

    return {
        "message": "Lead deleted"
    }

# =========================
# RUN SCRAPER
# =========================

@app.post("/run-scraper")
def run_scraper():

    try:

        df = pd.read_csv("auto_leads.csv")

        inserted_count = 0

        for _, row in df.iterrows():

            lead_data = {
                "username": row["username"],
                "category": row["category"],
                "score": int(row["score"]),
                "lifecycle": row["lifecycle"],
                "timestamp": row["timestamp"]
            }

            existing_lead = leads_collection.find_one(
                {
                    "username": row["username"]
                }
            )

            if not existing_lead:

                leads_collection.insert_one(
                    lead_data
                )

                inserted_count += 1

        return {
            "message": "Scraper completed",
            "new_leads_added": inserted_count
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )