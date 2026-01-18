from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from auth import router as auth_router, get_current_user
from database import get_db, Base, engine
from models import User, Message
from ai_client import ask_openrouter

Base.metadata.create_all(bind=engine)
app = FastAPI()

# CORS - THIS IS CRITICAL
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

class ChatRequest(BaseModel):
    message: str


@app.post("/chat")
def chat(
    req: ChatRequest,
    user_email: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == user_email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.add(Message(
        user_id=user.id,
        role="user",
        content=req.message
    ))
    db.commit()

    ai_messages = [
        {"role": "system", "content": "You are a helpful AI assistant."},
        {"role": "user", "content": req.message}
    ]

    try:
        ai_reply = ask_openrouter(ai_messages)

        db.add(Message(
            user_id=user.id,
            role="assistant",
            content=ai_reply
        ))
        db.commit()

        return {"reply": ai_reply}

    except ValueError as e:
        error_message = str(e)
        print(f"AI API Error: {error_message}")
        
        error_reply = f"Sorry, I encountered an error: {error_message}"
        db.add(Message(
            user_id=user.id,
            role="assistant",
            content=error_reply
        ))
        db.commit()
        
        return {"reply": error_reply}
        
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        error_reply = "Sorry, something went wrong. Please try again."
        
        db.add(Message(
            user_id=user.id,
            role="assistant",
            content=error_reply
        ))
        db.commit()
        
        return {"reply": error_reply}


@app.get("/history")
def get_history(
    user_email: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == user_email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    chat_history = (
        db.query(Message)
        .filter(Message.user_id == user.id)
        .order_by(Message.created_at)
        .all()
    )

    return {
        "history": [
            {"role": m.role, "content": m.content}
            for m in chat_history
        ]
    }