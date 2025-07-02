from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, Dict, Any, List

# --- Schémata pro UŽIVATELE a TOKENY (zůstávají stejná) ---
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: int
    email: EmailStr
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None


# --- NOVÁ UNIVERZÁLNÍ SCHÉMATA PRO PŘIPOJENÍ ---
# Tato schémata nahrazují OdooAccountBase, OdooAccountCreate, atd.

class ConnectionBase(BaseModel):
    provider: str               # např. "odoo", "pohoda", "postgresql"
    account_name: str           # např. "Moje firma s.r.o." nebo "Hlavní databáze"
    credentials: Dict[str, Any] # Slovník s údaji: {"url": "...", "db": "...", "username": "..."}

class ConnectionCreate(ConnectionBase):
    pass

# Schéma pro odpověď - nikdy neobsahuje citlivé údaje
class Connection(BaseModel):
    id: int
    user_id: int
    provider: str
    account_name: str

    class Config:
        from_attributes = True