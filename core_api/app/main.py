import os
import requests
from typing import List
from fastapi import FastAPI, Depends, HTTPException, status, APIRouter
from sqlalchemy.orm import Session
from . import crud, models, schemas, auth, database

models.Base.metadata.create_all(bind=database.engine)
app = FastAPI(title="Tickets-API Core")
api_router = APIRouter(prefix="/api/v1")

def get_db():
    db = database.SessionLocal()
    try: yield db
    finally: db.close()

# Zde jsou všechny funkční endpointy
@api_router.get("/users/me/role", tags=["Users"])
def get_my_role(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    credentials = {"url": os.getenv("ODOO_URL"),"db": os.getenv("ODOO_DB"),"username": os.getenv("ODOO_USER"),"password": os.getenv("ODOO_PASSWORD"), "user_email": current_user.email}
    try:
        response = requests.post("http://tickets_api_odoo_connector:8001/get_user_role", json=credentials, timeout=20)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Odoo Connector service unavailable: {e}")

@api_router.get("/trips_by_date", tags=["Dashboard"])
def get_trips_by_date(date: str, current_user: models.User = Depends(auth.get_current_user)):
    credentials = {"url": os.getenv("ODOO_URL"),"db": os.getenv("ODOO_DB"),"username": os.getenv("ODOO_USER"),"password": os.getenv("ODOO_PASSWORD")}
    payload = credentials.copy()
    payload['date'] = date
    try:
        response = requests.post("http://tickets_api_odoo_connector:8001/get_trips_by_date", json=payload, timeout=20)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Odoo Connector service unavailable: {e}")

@api_router.get("/trips/{trip_id}/passengers", tags=["Dashboard"])
def get_trip_passengers_from_odoo(trip_id: int, current_user: models.User = Depends(auth.get_current_user)):
    credentials = {"url": os.getenv("ODOO_URL"),"db": os.getenv("ODOO_DB"),"username": os.getenv("ODOO_USER"),"password": os.getenv("ODOO_PASSWORD")}
    payload = credentials.copy()
    payload['trip_id'] = trip_id
    try:
        response = requests.post(f"http://tickets_api_odoo_connector:8001/get_trip_passengers", json=payload, timeout=20)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Odoo Connector service is unavailable: {e}")

@api_router.put("/trips/{trip_id}/visibility", tags=["Dashboard"])
def set_trip_visibility_in_odoo(trip_id: int, visibility_data: schemas.TripVisibilityUpdate, current_user: models.User = Depends(auth.get_current_user)):
    credentials = {"url": os.getenv("ODOO_URL"),"db": os.getenv("ODOO_DB"),"username": os.getenv("ODOO_USER"),"password": os.getenv("ODOO_PASSWORD")}
    payload = credentials.copy()
    payload['trip_id'] = trip_id
    payload['is_visible'] = visibility_data.is_visible
    try:
        response = requests.post("http://tickets_api_odoo_connector:8001/set_trip_visibility", json=payload, timeout=20)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Odoo Connector service is unavailable: {e}")

@api_router.get("/my-tickets", tags=["Clients"])
def get_my_tickets(current_user: models.User = Depends(auth.get_current_user)):
    credentials = {"url": os.getenv("ODOO_URL"),"db": os.getenv("ODOO_DB"),"username": os.getenv("ODOO_USER"),"password": os.getenv("ODOO_PASSWORD")}
    payload = credentials.copy()
    payload['user_email'] = current_user.email
    try:
        response = requests.post("http://tickets_api_odoo_connector:8001/get_my_tickets", json=payload, timeout=20)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Odoo Connector service is unavailable: {e}")

@api_router.get("/bus_points", tags=["Public"])
def get_all_bus_points():
    credentials = {"url": os.getenv("ODOO_URL"), "db": os.getenv("ODOO_DB"), "username": os.getenv("ODOO_USER"), "password": os.getenv("ODOO_PASSWORD")}
    try:
        response = requests.post("http://tickets_api_odoo_connector:8001/get_bus_points", json=credentials, timeout=20)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Odoo Connector service is unavailable: {e}")
        
app.include_router(api_router)