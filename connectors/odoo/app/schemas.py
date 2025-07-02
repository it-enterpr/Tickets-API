from pydantic import BaseModel

class OdooCredentials(BaseModel):
    url: str
    db: str
    username: str
    password: str