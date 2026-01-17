from database import Base, engine
from models import User, Message

# Create all tables
Base.metadata.create_all(bind=engine)
print("✅ Database tables created successfully!")