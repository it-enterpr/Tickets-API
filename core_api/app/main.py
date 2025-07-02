import json
import requests
from typing import List
from fastapi import FastAPI, Depends, HTTPException, status, APIRouter
from fastapi.security import OAuth2PasswordRequestForm # <-- ZMĚNA ZDE
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import crud, models, schemas, auth
from .database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="API-Man")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

api_router = APIRouter(prefix="/api/v1")

# --- Autentizace a Uživatelé ---
@api_router.post("/token", response_model=schemas.Token, tags=["Authentication"])
# ZMĚNA ZDE: Používáme přímo OAuth2PasswordRequestForm, ne auth.OAuth2PasswordRequestForm
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = auth.authenticate_user(db, email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@api_router.post("/users/", response_model=schemas.User, status_code=201, tags=["Users"])
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    return crud.create_user(db=db, user=user)

# ... (ostatní endpointy zůstávají stejné) ...
@api_router.get("/users/me/", response_model=schemas.User, tags=["Users"])
def read_users_me(current_user: schemas.User = Depends(auth.get_current_user)):
    return current_user

@api_router.post("/connections", response_model=schemas.Connection, tags=["Connections"])
def create_or_update_connection(conn_data: schemas.ConnectionCreate, current_user: schemas.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    return crud.create_or_update_connection(db=db, user_id=current_user.id, conn=conn_data)

@api_router.get("/connections", response_model=List[schemas.Connection], tags=["Connections"])
def read_all_connections(current_user: schemas.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    return crud.get_all_connections(db=db, user_id=current_user.id)

@api_router.get("/tasks/odoo", tags=["Data Fetching"])
def get_odoo_tasks(current_user: schemas.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    account = crud.get_connection_by_provider(db, user_id=current_user.id, provider="odoo")
    if not account:
        raise HTTPException(status_code=404, detail="Odoo account not connected.")
    decrypted_creds_json = auth.decrypt_data(account.encrypted_credentials)
    credentials = json.loads(decrypted_creds_json)
    try:
        response = requests.post("http://odoo_connector:8001/fetch-tasks", json=credentials, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Odoo Connector service unavailable: {e}")

@api_router.get("/invoices/pohoda", tags=["Data Fetching"])
def get_pohoda_invoices(current_user: schemas.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    try:
        response = requests.get("http://pohoda_connector:8002/invoices", timeout=20)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Pohoda Connector service failed: {e}")

app.include_router(api_router)