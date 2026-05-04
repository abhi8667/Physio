import { Exercise } from '../../store/useRehabStore';
import { Target, Zap } from 'lucide-react';

interface ExerciseCardProps {
  exercise: Exercise;
  onStart?: () => void;
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
};

export function ExerciseCard({ exercise, onStart }: ExerciseCardProps) {
  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border/50 overflow-hidden hover:shadow-lg transition-all group">
      <div className="h-48 bg-gradient-to-br from-primary/20 to-purple-600/20 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center">
            <Target className="w-10 h-10 text-primary" />
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-lg">{exercise.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{exercise.targetMuscle}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[exercise.difficulty]}`}>
            {exercise.difficulty}
          </span>
        </div>

        {(exercise.sets || exercise.reps || exercise.duration) && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            {exercise.sets && <span>{exercise.sets} sets</span>}
            {exercise.reps && <span>{exercise.reps} reps</span>}
            {exercise.duration && <span>{exercise.duration} min</span>}
          </div>
        )}

        {onStart && (
          <button
            onClick={onStart}
            className="w-full bg-primary text-white py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Start Session
          </button>
        )}
      </div>
    </div>
  );
}
