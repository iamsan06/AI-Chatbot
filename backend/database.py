import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Get DATABASE_URL from environment (Railway sets this automatically)
DATABASE_URL = os.getenv("DATABASE_URL")

# Railway PostgreSQL URLs start with postgres://, but SQLAlchemy needs postgresql://
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Fallback to localhost for local development
if not DATABASE_URL:
    DATABASE_URL = "postgresql://postgres:password@localhost:5432/ai_chat"
    print("⚠️ WARNING: Using localhost database. Make sure DATABASE_URL is set in production!")

print(f"🔗 Connecting to database: {DATABASE_URL[:30]}...")  # Print first 30 chars for debugging

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()