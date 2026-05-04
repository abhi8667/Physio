import { create } from 'zustand';
import * as api from '../services/api';

export interface Exercise {
  id: string;
  name: string;
  description?: string;
  targetMuscle: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  sets?: number;
  reps?: number;
  duration?: number;
  imageUrl?: string;
  camera?: string;
  type?: string;
}

export interface Session {
  id: string;
  date: string;
  exerciseName: string;
  duration: number;
  accuracy: number;
  repsCompleted: number;
}

export interface PainArea {
  joint: string;
  intensity: number;
}

export interface RecoveryPlan {
  exercises: Exercise[];
  schedule: { [day: string]: Exercise[] };
  startDate: string;
  insights: string[];
}

interface RehabState {
  // Auth / user
  userId: number | null;
  userName: string | null;

  // Data
  sessions: Session[];
  recoveryPlan: RecoveryPlan | null;
  painAreas: PainArea[];
  currentExercise: Exercise | null;
  exercisePlans: api.ExercisePlanItem[];
  catalogueExercises: api.CatalogueExercise[];
  userStats: {
    totalSessions: number;
    averageAccuracy: number;
    recoveryScore: number;
    streak: number;
  };

  // Loading / error
  isLoading: boolean;
  error: string | null;

  // Actions – local
  addSession: (session: Session) => void;
  setRecoveryPlan: (plan: RecoveryPlan) => void;
  setPainAreas: (areas: PainArea[]) => void;
  setCurrentExercise: (exercise: Exercise | null) => void;
  updateUserStats: () => void;

  // Actions – API
  loginOrRegister: (name: string) => Promise<void>;
  fetchExercises: () => Promise<void>;
  submitAssessment: (complaint: string, painLevel: number) => Promise<void>;
  fetchExercisePlans: () => Promise<void>;
  fetchSessions: () => Promise<void>;
  fetchReports: () => Promise<api.ReportData | null>;
}

export const useRehabStore = create<RehabState>((set, get) => ({
  // Auth
  userId: null,
  userName: null,

  // Data defaults
  sessions: [
    {
      id: '1',
      date: '2026-05-01',
      exerciseName: 'Knee Flexion',
      duration: 15,
      accuracy: 87,
      repsCompleted: 12,
    },
    {
      id: '2',
      date: '2026-05-02',
      exerciseName: 'Shoulder Rotation',
      duration: 10,
      accuracy: 92,
      repsCompleted: 15,
    },
    {
      id: '3',
      date: '2026-05-03',
      exerciseName: 'Hip Extension',
      duration: 12,
      accuracy: 85,
      repsCompleted: 10,
    },
  ],
  recoveryPlan: null,
  painAreas: [],
  currentExercise: null,
  exercisePlans: [],
  catalogueExercises: [],
  userStats: {
    totalSessions: 24,
    averageAccuracy: 88,
    recoveryScore: 72,
    streak: 5,
  },

  isLoading: false,
  error: null,

  // ── Local actions ──────────────────────────────────────────────────────

  addSession: (session) =>
    set((state) => ({
      sessions: [session, ...state.sessions],
    })),

  setRecoveryPlan: (plan) =>
    set({ recoveryPlan: plan }),

  setPainAreas: (areas) =>
    set({ painAreas: areas }),

  setCurrentExercise: (exercise) =>
    set({ currentExercise: exercise }),

  updateUserStats: () => {
    const { sessions } = get();
    const totalSessions = sessions.length;
    const averageAccuracy = sessions.reduce((sum, s) => sum + s.accuracy, 0) / totalSessions;

    set((state) => ({
      userStats: {
        ...state.userStats,
        totalSessions,
        averageAccuracy: Math.round(averageAccuracy),
      },
    }));
  },

  // ── API actions ────────────────────────────────────────────────────────

  loginOrRegister: async (name: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await api.createUser(name);
      set({ userId: user.id, userName: user.name, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchExercises: async () => {
    try {
      const exercises = await api.getExercises();
      set({ catalogueExercises: exercises });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  submitAssessment: async (complaint: string, painLevel: number) => {
    const { userId } = get();
    if (!userId) return;
    set({ isLoading: true, error: null });
    try {
      await api.createAssessment(userId, complaint, painLevel);
      // After assessment, fetch the generated plans
      const plans = await api.getExercisePlans(userId);
      set({ exercisePlans: plans, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchExercisePlans: async () => {
    const { userId } = get();
    if (!userId) return;
    try {
      const plans = await api.getExercisePlans(userId);
      set({ exercisePlans: plans });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  fetchSessions: async () => {
    const { userId } = get();
    if (!userId) return;
    try {
      const sessions = await api.getSessions(userId);
      const mapped: Session[] = sessions.map((s) => ({
        id: s.id.toString(),
        date: new Date(s.date).toISOString().split('T')[0],
        exerciseName: s.exercise_id,
        duration: Math.floor(s.duration_seconds / 60),
        accuracy: 100, // CV engine doesn't track accuracy directly
        repsCompleted: s.reps_completed,
      }));
      set({ sessions: mapped });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  fetchReports: async () => {
    const { userId } = get();
    if (!userId) return null;
    try {
      return await api.getReports(userId);
    } catch (err: any) {
      set({ error: err.message });
      return null;
    }
  },
}));
