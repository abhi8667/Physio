/**
 * api.ts – Service layer for communicating with the FastAPI backend.
 * All fetch calls to the PhysioTracker API are centralised here.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// ── User endpoints ─────────────────────────────────────────────────────────

export interface UserResponse {
  id: number;
  name: string;
  created_at: string;
}

export async function createUser(name: string): Promise<UserResponse> {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error(`Failed to create user: ${res.statusText}`);
  return res.json();
}

export async function getUser(userName: string): Promise<UserResponse> {
  const res = await fetch(`${API_BASE}/users/${encodeURIComponent(userName)}`);
  if (!res.ok) throw new Error(`User not found: ${res.statusText}`);
  return res.json();
}

// ── Exercise catalogue ─────────────────────────────────────────────────────

export interface CatalogueExercise {
  id: string;
  name: string;
  description: string;
  camera: string;
  default_sets: number;
  default_reps: number;
  type: string;
  hold_seconds?: number;
}

export async function getExercises(): Promise<CatalogueExercise[]> {
  const res = await fetch(`${API_BASE}/exercises`);
  if (!res.ok) throw new Error(`Failed to fetch exercises: ${res.statusText}`);
  return res.json();
}

// ── Assessment / Plan generation ───────────────────────────────────────────

export interface AssessmentResponse {
  id: number;
  complaint: string;
  pain_level: number;
  llm_raw_response: string;
  created_at: string;
}

export async function createAssessment(
  userId: number,
  complaint: string,
  painLevel: number,
): Promise<AssessmentResponse> {
  const res = await fetch(`${API_BASE}/users/${userId}/assessments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ complaint, pain_level: painLevel }),
  });
  if (!res.ok) throw new Error(`Failed to create assessment: ${res.statusText}`);
  return res.json();
}

// ── Exercise plans ─────────────────────────────────────────────────────────

export interface ExercisePlanItem {
  exercise_id: string;
  confidence: number;
  target_sets: number;
  target_reps: number;
  caution: string;
  priority: number;
}

export async function getExercisePlans(userId: number): Promise<ExercisePlanItem[]> {
  const res = await fetch(`${API_BASE}/users/${userId}/exercise-plans`);
  if (!res.ok) throw new Error(`Failed to fetch plans: ${res.statusText}`);
  return res.json();
}

// ── Session logging ────────────────────────────────────────────────────────

export interface SessionLogResponse {
  id: number;
  exercise_id: string;
  date: string;
  reps_completed: number;
  duration_seconds: number;
  form_errors: string;
}

export async function logSession(
  userId: number,
  exerciseId: string,
  repsCompleted: number,
  durationSeconds: number,
  formErrors: Record<string, number>,
): Promise<SessionLogResponse> {
  const res = await fetch(`${API_BASE}/users/${userId}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      exercise_id: exerciseId,
      reps_completed: repsCompleted,
      duration_seconds: durationSeconds,
      form_errors: formErrors,
    }),
  });
  if (!res.ok) throw new Error(`Failed to log session: ${res.statusText}`);
  return res.json();
}

export async function getSessions(userId: number): Promise<SessionLogResponse[]> {
  const res = await fetch(`${API_BASE}/users/${userId}/sessions`);
  if (!res.ok) throw new Error(`Failed to fetch sessions: ${res.statusText}`);
  return res.json();
}

// ── Reports ────────────────────────────────────────────────────────────────

export interface ReportData {
  total_sessions: number;
  total_reps: number;
  total_duration_seconds: number;
  form_errors_summary: Record<string, number>;
}

export async function getReports(userId: number): Promise<ReportData> {
  const res = await fetch(`${API_BASE}/users/${userId}/reports`);
  if (!res.ok) throw new Error(`Failed to fetch reports: ${res.statusText}`);
  return res.json();
}

// ── WebSocket for CV session ───────────────────────────────────────────────

export function createSessionWebSocket(
  userId: number,
  exerciseId: string,
  reps: number = 10,
  sets: number = 3,
): WebSocket {
  const wsBase = API_BASE.replace(/^http/, 'ws');
  return new WebSocket(
    `${wsBase}/ws/session/${userId}/${exerciseId}?reps=${reps}&sets=${sets}`,
  );
}
