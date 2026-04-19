from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import random
import uuid

# Flat imports - ensure these files are in the same folder
import schemas
import database

app = FastAPI(title="LoadMate OTP API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

otp_storage = {}

@app.post("/auth/request-otp")
async def request_otp(request: schemas.OTPRequest):
    otp_code = str(random.randint(100000, 999999))
    otp_storage[request.phone_number] = otp_code
    print(f"\n[OTP DEBUG] Phone: {request.phone_number} | Code: {otp_code}\n")
    return {"message": "OTP sent successfully"}

# In main.py
@app.post("/auth/verify-otp")
async def verify_otp(data: schemas.OTPVerify):
    # Skip OTP check if finalized from the profile screen
    if data.otp_code != "ALREADY_VERIFIED":
        if data.phone_number not in otp_storage or otp_storage[data.phone_number] != data.otp_code:
            raise HTTPException(status_code=400, detail="Invalid OTP")
    
    # Check if user exists or create new one with the name and role provided
    user = await database.users_collection.find_one({"phone_number": data.phone_number})
    if not user:
        user = {
            "_id": str(uuid.uuid4()),
            "phone_number": data.phone_number,
            "full_name": data.full_name,
            "role": data.role
        }
        await database.users_collection.insert_one(user)
    
    return {"access_token": f"token_{data.phone_number}", "user": user}

@app.on_event("startup")
async def startup_db_client():
    # This makes searching for a phone number nearly instant
    import database
    await database.users_collection.create_index("phone_number", unique=True)