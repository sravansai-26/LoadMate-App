from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum

class UserRole(str, Enum):
    DRIVER = "driver"
    CUSTOMER = "customer"

class OTPRequest(BaseModel):
    phone_number: str

class OTPVerify(BaseModel):
    phone_number: str
    otp_code: str
    full_name: Optional[str] = None
    role: Optional[UserRole] = None

class Token(BaseModel):
    access_token: str
    token_type: str