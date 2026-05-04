import json
import os
from typing import List, Optional
import base64
import numpy as np
import cv2
from fastapi import FastAPI, Depends, HTTPException, Body, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime

import database
import llm_client

# Lazy import for CV engine – may fail due to mediapipe/tensorflow dependency conflicts
ExerciseEvaluator = None
try:
    from cv_engine.evaluator import ExerciseEvaluator
except Exception as _cv_err:
    print(f"[WARN] CV engine not available: {_cv_err}. WebSocket sessions will be disabled.")

# Initialize database
database.init_db()

app = FastAPI(title="PhysioTracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Models

class UserCreate(BaseModel):
    name: str

class UserResponse(BaseModel):
    id: int
    name: str
    created_at: datetime
    class Config:
        from_attributes = True

class AssessmentCreate(BaseModel):
    complaint: str
    pain_level: int

class ExercisePlanItem(BaseModel):
    exercise_id: str
    confidence: float
    target_sets: int
    target_reps: int
    caution: Optional[str] = ""
    priority: int
    class Config:
        from_attributes = True

class AssessmentResponse(BaseModel):
    id: int
    complaint: str
    pain_level: int
    llm_raw_response: str
    created_at: datetime
    class Config:
        from_attributes = True

class SessionLogCreate(BaseModel):
    exercise_id: str
    reps_completed: int
    duration_seconds: int
    form_errors: dict

class SessionLogResponse(BaseModel):
    id: int
    exercise_id: str
    date: datetime
    reps_completed: int
    duration_seconds: int
    form_errors: str
    class Config:
        from_attributes = True

# Load Exercises Catalogue once
def load_exercises():
    try:
        with open(os.path.join("frontend", "exercises.json"), "r") as f:
            return json.load(f)
    except Exception as e:
        print(f"Failed to load exercises.json: {e}")
        return []

EXERCISES_CATALOGUE = load_exercises()

# Endpoints

@app.get("/")
def read_root():
    return {"message": "Welcome to the PhysioTracker API. Go to /docs to view the available endpoints."}

@app.post("/users", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(database.User).filter(database.User.name == user.name).first()
    if db_user:
        return db_user
    new_user = database.User(name=user.name)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.get("/users/{user_name}", response_model=UserResponse)
def get_user(user_name: str, db: Session = Depends(database.get_db)):
    db_user = db.query(database.User).filter(database.User.name == user_name).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.get("/exercises")
def get_exercises():
    return EXERCISES_CATALOGUE

@app.post("/users/{user_id}/assessments", response_model=AssessmentResponse)
def create_assessment(user_id: int, assessment: AssessmentCreate, db: Session = Depends(database.get_db)):
    # Verify user exists
    db_user = db.query(database.User).filter(database.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Generate exercise plan
    plan_dict = llm_client.generate_exercise_plan(
        complaint=assessment.complaint,
        pain_level=assessment.pain_level,
        exercises_catalogue=EXERCISES_CATALOGUE
    )

    if not plan_dict:
        raise HTTPException(status_code=500, detail="Failed to generate exercise plan")

    raw_response = plan_dict.get("_raw_json", json.dumps(plan_dict))

    # Save Assessment
    db_assessment = database.Assessment(
        user_id=user_id,
        complaint=assessment.complaint,
        pain_level=assessment.pain_level,
        llm_raw_response=raw_response
    )
    db.add(db_assessment)
    db.commit()
    db.refresh(db_assessment)

    # Save generated plans
    programme = plan_dict.get("programme", [])
    for item in programme:
        db_plan = database.ExercisePlan(
            assessment_id=db_assessment.id,
            user_id=user_id,
            exercise_id=item["exercise_id"],
            confidence=item.get("confidence", 1.0),
            target_sets=item.get("sets", 3),
            target_reps=item.get("reps", 10),
            caution=item.get("caution", ""),
            priority=item.get("priority", 99)
        )
        db.add(db_plan)
    db.commit()

    return db_assessment

@app.get("/users/{user_id}/exercise-plans", response_model=List[ExercisePlanItem])
def get_exercise_plans(user_id: int, db: Session = Depends(database.get_db)):
    plans = db.query(database.ExercisePlan).filter(database.ExercisePlan.user_id == user_id).all()
    return plans

@app.post("/users/{user_id}/sessions", response_model=SessionLogResponse)
def log_session(user_id: int, session: SessionLogCreate, db: Session = Depends(database.get_db)):
    db_log = database.SessionLog(
        user_id=user_id,
        exercise_id=session.exercise_id,
        reps_completed=session.reps_completed,
        duration_seconds=session.duration_seconds,
        form_errors=json.dumps(session.form_errors)
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

@app.get("/users/{user_id}/sessions", response_model=List[SessionLogResponse])
def get_sessions(user_id: int, db: Session = Depends(database.get_db)):
    sessions = db.query(database.SessionLog).filter(database.SessionLog.user_id == user_id).order_by(database.SessionLog.date.desc()).all()
    return sessions

@app.get("/users/{user_id}/reports")
def get_reports(user_id: int, db: Session = Depends(database.get_db)):
    sessions = db.query(database.SessionLog).filter(database.SessionLog.user_id == user_id).all()
    
    total_sessions = len(sessions)
    total_reps = sum(s.reps_completed for s in sessions)
    total_duration = sum(s.duration_seconds for s in sessions)
    
    form_errors_summary = {}
    for s in sessions:
        if s.form_errors:
            try:
                errors = json.loads(s.form_errors)
                for err, count in errors.items():
                    form_errors_summary[err] = form_errors_summary.get(err, 0) + count
            except json.JSONDecodeError:
                pass
                
    return {
        "total_sessions": total_sessions,
        "total_reps": total_reps,
        "total_duration_seconds": total_duration,
        "form_errors_summary": form_errors_summary
    }

class MockExercisePlanRow:
    def __init__(self, exercise_id, target_reps, target_sets, caution):
        self.exercise_id = exercise_id
        self.target_reps = target_reps
        self.target_sets = target_sets
        self.caution = caution

@app.websocket("/ws/session/{user_id}/{exercise_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int, exercise_id: str, reps: int = 10, sets: int = 3, caution: str = ""):
    await websocket.accept()
    
    if ExerciseEvaluator is None:
        await websocket.send_json({"error": "CV engine not available. Please fix mediapipe dependencies."})
        await websocket.close()
        return
    
    plan_row = MockExercisePlanRow(exercise_id, reps, sets, caution)
    evaluator = ExerciseEvaluator(plan_row)
    
    try:
        while True:
            data = await websocket.receive_text()
            # Expecting base64 encoded image
            if data.startswith("data:image"):
                data = data.split(",")[1]
            
            img_data = base64.b64decode(data)
            np_arr = np.frombuffer(img_data, np.uint8)
            frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
            
            if frame is not None:
                annotated_frame = evaluator.process_frame(frame)
                _, buffer = cv2.imencode('.jpg', annotated_frame)
                b64_img = base64.b64encode(buffer).decode('utf-8')
                
                response_data = {
                    "image": f"data:image/jpeg;base64,{b64_img}",
                    "reps_completed": evaluator.reps_completed,
                    "phase": evaluator._phase,
                    "feedback": evaluator._feedback,
                    "is_complete": evaluator.is_complete()
                }
                await websocket.send_json(response_data)
            else:
                await websocket.send_json({"error": "Failed to decode frame"})
                
    except WebSocketDisconnect:
        print(f"Client disconnected. Session log: {evaluator.get_session_log()}")
