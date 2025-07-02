from sqlalchemy import Boolean, Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# Nový, univerzální model pro VŠECHNA připojení
class ConnectedAccount(Base):
    __tablename__ = "connected_accounts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    provider = Column(String, index=True, nullable=False) # 'odoo', 'pohoda', 'postgresql'
    account_name = Column(String, nullable=False) # např. 'Moje firma s.r.o.'
    # Všechny údaje (url, db, user, pass, atd.) budou zde, zašifrované jako jeden text
    encrypted_credentials = Column(Text, nullable=False) 
    created_at = Column(DateTime(timezone=True), server_default=func.now())