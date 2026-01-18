# create_tables.py
from database import Base, engine
from models import User, Message

print("Creating database tables...")
try:
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully!")
except Exception as e:
    print(f"❌ Error creating tables: {e}")