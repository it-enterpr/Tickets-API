from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from passlib.context import CryptContext
import os
from cryptography.fernet import Fernet # <-- PŘIDAT


# Importujeme moduly z našeho projektu
from . import crud, schemas
from .database import get_db

# --- KONSTANTY A NASTAVENÍ ---
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY")
ALGORITHM = "HS256"

# Toto vytvoří schéma, které bude FastAPI hledat v požadavcích
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

fernet = Fernet(ENCRYPTION_KEY.encode()) # <-- PŘIDAT


# Kontext pro práci s hesly
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# --- FUNKCE ---
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Ověří, zda se zadané heslo shoduje s uloženým hashem."""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    """Vytvoří nový JWT přístupový token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def encrypt_data(data: str) -> str: # <-- PŘIDAT CELOU FUNKCI
    """Zašifruje textová data."""
    return fernet.encrypt(data.encode()).decode()

def decrypt_data(encrypted_data: str) -> str: # <-- PŘIDAT CELOU FUNKCI
    """Dešifruje zašifrovaná data."""
    return fernet.decrypt(encrypted_data.encode()).decode()

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    """Dekóduje token, najde uživatele a vrátí ho."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception

    user = crud.get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user