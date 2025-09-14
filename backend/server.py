from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import uuid
import json

load_dotenv()

app = FastAPI(title="OshiLive48 API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
MONGO_URL = os.getenv("MONGO_URL")
client = AsyncIOMotorClient(MONGO_URL)
db = client.get_database()

security = HTTPBearer()

# Pydantic models
class MembershipPackage(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    price: int
    period: str
    image_url: str
    features: List[str]
    is_active: bool = True
    created_at: Optional[datetime] = Field(default_factory=datetime.now)

class StreamingEvent(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    team: str
    date: datetime
    time: str
    youtube_url: str
    status: str = "upcoming"  # upcoming, live, ended
    description: Optional[str] = ""
    is_active: bool = True
    created_at: Optional[datetime] = Field(default_factory=datetime.now)

class PaymentMethod(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: str  # qris, ewallet, bank_transfer
    details: dict
    is_active: bool = True

# Authentication (simple for now)
async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    # Simple auth - in production use proper JWT
    if credentials.credentials != "admin_token_oshilive48":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"username": "admin"}

@app.get("/")
async def root():
    return {"message": "OshiLive48 API is running!", "version": "1.0.0"}

# Membership Packages API
@app.get("/api/packages", response_model=List[MembershipPackage])
async def get_packages():
    packages = await db.packages.find({"is_active": True}).to_list(100)
    return packages

@app.post("/api/packages", response_model=MembershipPackage)
async def create_package(package: MembershipPackage, admin = Depends(get_current_admin)):
    package_dict = package.dict()
    await db.packages.insert_one(package_dict)
    return package

@app.put("/api/packages/{package_id}", response_model=MembershipPackage)
async def update_package(package_id: str, package: MembershipPackage, admin = Depends(get_current_admin)):
    package_dict = package.dict()
    package_dict["id"] = package_id
    await db.packages.replace_one({"id": package_id}, package_dict)
    return package

@app.delete("/api/packages/{package_id}")
async def delete_package(package_id: str, admin = Depends(get_current_admin)):
    result = await db.packages.update_one({"id": package_id}, {"$set": {"is_active": False}})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Package not found")
    return {"message": "Package deleted successfully"}

# Streaming Events API
@app.get("/api/streams", response_model=List[StreamingEvent])
async def get_streams():
    streams = await db.streams.find({"is_active": True}).sort("date", 1).to_list(100)
    return streams

@app.post("/api/streams", response_model=StreamingEvent)
async def create_stream(stream: StreamingEvent, admin = Depends(get_current_admin)):
    stream_dict = stream.dict()
    await db.streams.insert_one(stream_dict)
    return stream

@app.put("/api/streams/{stream_id}", response_model=StreamingEvent)
async def update_stream(stream_id: str, stream: StreamingEvent, admin = Depends(get_current_admin)):
    stream_dict = stream.dict()
    stream_dict["id"] = stream_id
    await db.streams.replace_one({"id": stream_id}, stream_dict)
    return stream

@app.delete("/api/streams/{stream_id}")
async def delete_stream(stream_id: str, admin = Depends(get_current_admin)):
    result = await db.streams.update_one({"id": stream_id}, {"$set": {"is_active": False}})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Stream not found")
    return {"message": "Stream deleted successfully"}

# Payment Methods API
@app.get("/api/payment-methods", response_model=List[PaymentMethod])
async def get_payment_methods():
    methods = await db.payment_methods.find({"is_active": True}).to_list(100)
    return methods

@app.post("/api/payment-methods", response_model=PaymentMethod)
async def create_payment_method(method: PaymentMethod, admin = Depends(get_current_admin)):
    method_dict = method.dict()
    await db.payment_methods.insert_one(method_dict)
    return method

# Admin Dashboard Stats
@app.get("/api/admin/stats")
async def get_admin_stats(admin = Depends(get_current_admin)):
    total_packages = await db.packages.count_documents({"is_active": True})
    total_streams = await db.streams.count_documents({"is_active": True})
    live_streams = await db.streams.count_documents({"status": "live", "is_active": True})
    
    return {
        "total_packages": total_packages,
        "total_streams": total_streams,
        "live_streams": live_streams,
        "total_users": 0  # TODO: implement user system
    }

# Initialize default data
@app.on_event("startup")
async def startup_event():
    # Create default packages if none exist
    package_count = await db.packages.count_documents({"is_active": True})
    if package_count == 0:
        default_packages = [
            {
                "id": str(uuid.uuid4()),
                "name": "Basic",
                "price": 50000,
                "period": "/bulan",
                "image_url": "https://res.cloudinary.com/haymzm4wp/image/upload/v1746940686/gnzangtum7a8ygmk8hvj.jpg",
                "features": ["Akses 1 Device", "Kualitas HD", "Jadwal Terupdate"],
                "is_active": True,
                "created_at": datetime.now()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Premium",
                "price": 100000,
                "period": "/bulan",
                "image_url": "https://res.cloudinary.com/haymzm4wp/image/upload/v1746940686/gnzangtum7a8ygmk8hvj.jpg",
                "features": ["Akses 2 Device", "Kualitas FHD", "Jadwal Terupdate", "Rekaman Show"],
                "is_active": True,
                "created_at": datetime.now()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "VIP",
                "price": 200000,
                "period": "/bulan",
                "image_url": "https://res.cloudinary.com/haymzm4wp/image/upload/v1746940686/gnzangtum7a8ygmk8hvj.jpg",
                "features": ["Akses 4 Device", "Kualitas 4K", "Jadwal Terupdate", "Rekaman Show", "Bonus Content"],
                "is_active": True,
                "created_at": datetime.now()
            }
        ]
        await db.packages.insert_many(default_packages)
        print("✅ Default packages created")

    # Create default payment methods
    payment_count = await db.payment_methods.count_documents({"is_active": True})
    if payment_count == 0:
        default_payment_methods = [
            {
                "id": str(uuid.uuid4()),
                "name": "Saweria",
                "type": "donation",
                "details": {"url": "https://saweria.co/Oshilive48"},
                "is_active": True
            },
            {
                "id": str(uuid.uuid4()),
                "name": "QRIS",
                "type": "qris",
                "details": {"qr_code": "img/qr-code.png"},
                "is_active": True
            },
            {
                "id": str(uuid.uuid4()),
                "name": "GoPay",
                "type": "ewallet",
                "details": {"number": "081234567890"},
                "is_active": True
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Dana",
                "type": "ewallet", 
                "details": {"number": "081234567890"},
                "is_active": True
            },
            {
                "id": str(uuid.uuid4()),
                "name": "WhatsApp",
                "type": "manual",
                "details": {"number": "6285939105633", "url": "https://wa.me/6285939105633"},
                "is_active": True
            }
        ]
        await db.payment_methods.insert_many(default_payment_methods)
        print("✅ Default payment methods created")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)