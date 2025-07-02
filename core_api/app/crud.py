import json
from sqlalchemy.orm import Session
from . import models, schemas, auth

# --- Funkce pro UŽIVATELE (zůstávají stejné) ---
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = auth.pwd_context.hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- NOVÉ UNIVERZÁLNÍ FUNKCE PRO PŘIPOJENÍ ---
def get_connection_by_provider(db: Session, user_id: int, provider: str):
    return db.query(models.ConnectedAccount).filter(
        models.ConnectedAccount.user_id == user_id,
        models.ConnectedAccount.provider == provider
    ).first()

def get_all_connections(db: Session, user_id: int):
    return db.query(models.ConnectedAccount).filter(models.ConnectedAccount.user_id == user_id).all()

def create_or_update_connection(db: Session, user_id: int, conn: schemas.ConnectionCreate):
    # Převedeme slovník s přihlašovacími údaji na text (JSON string)
    credentials_json = json.dumps(conn.credentials)
    # Tento textový řetězec zašifrujeme
    encrypted_creds = auth.encrypt_data(credentials_json)

    # Zjistíme, jestli už pro tohoto providera připojení existuje
    existing_connection = get_connection_by_provider(db, user_id=user_id, provider=conn.provider)

    if existing_connection:
        # Pokud ano, aktualizujeme ho
        existing_connection.account_name = conn.account_name
        existing_connection.encrypted_credentials = encrypted_creds
        db_conn = existing_connection
    else:
        # Pokud ne, vytvoříme nový záznam
        db_conn = models.ConnectedAccount(
            user_id=user_id,
            provider=conn.provider,
            account_name=conn.account_name,
            encrypted_credentials=encrypted_creds
        )
        db.add(db_conn)
    
    db.commit()
    db.refresh(db_conn)
    return db_conn