import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Načteme URL k databázi z proměnné prostředí, kterou jsme nastavili v docker-compose.yml
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@postgresserver/db")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Funkce pro poskytnutí databázové session každému API requestu
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()