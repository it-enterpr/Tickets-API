import os
import requests
import base64
from fastapi import FastAPI, HTTPException

app = FastAPI(title="API-Man Pohoda Connector (Direct Cloud Mode)")

CLIENT_ID = os.getenv("POHODA_CLIENT_ID")
CLIENT_SECRET = os.getenv("POHODA_CLIENT_SECRET")
POHODA_TOKEN_URL = "https://ucet.pohoda.cz/connect/token"
POHODA_API_BASE_URL = "https://api.mpohoda.sk/api/v3"

def get_access_token():
    if not CLIENT_ID or not CLIENT_SECRET:
        raise HTTPException(status_code=500, detail="Pohoda ClientID or ClientSecret is not configured.")
    auth_string = f"{CLIENT_ID}:{CLIENT_SECRET}"
    base64_auth_string = base64.b64encode(auth_string.encode('utf-8')).decode('utf-8')
    headers = {"Authorization": f"Basic {base64_auth_string}", "Content-Type": "application/x-www-form-urlencoded"}
    body = {"grant_type": "client_credentials"}
    try:
        response = requests.post(POHODA_TOKEN_URL, headers=headers, data=body)
        response.raise_for_status()
        return response.json().get("access_token")
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Error getting token from Pohoda: {e.response.text if e.response else e}")

@app.get("/invoices")
def get_pohoda_invoices():
    access_token = get_access_token()
    if not access_token:
        raise HTTPException(status_code=500, detail="Failed to get access token from Pohoda.")
    try:
        headers = { "Authorization": f"Bearer {access_token}" }
        response = requests.get(f"{POHODA_API_BASE_URL}/invoices", headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Error calling Pohoda API for invoices: {e.response.text if e.response else e}")