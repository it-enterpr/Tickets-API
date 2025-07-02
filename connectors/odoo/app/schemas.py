from pydantic import BaseModel

# Základní přihlašovací údaje k Odoo
class OdooCredentials(BaseModel):
    url: str
    db: str
    username: str
    password: str

# Pro požadavek na detail jízdy (pasažéři)
class TripDetailRequest(OdooCredentials):
    trip_id: int

# Pro požadavek na jízdenky konkrétního klienta
class MyTicketsRequest(OdooCredentials):
    user_email: str

# Pro změnu viditelnosti jízdy
class SetVisibilityRequest(OdooCredentials):
    trip_id: int
    is_visible: bool

# Pro vyhledání jízd podle data
class TripsByDateRequest(OdooCredentials):
    date: str

# Pro vyhledávání spojů klientem
class TripSearchRequest(OdooCredentials):
    from_location_id: int
    to_location_id: int
    date: str