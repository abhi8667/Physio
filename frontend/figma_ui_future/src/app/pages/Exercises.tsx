import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Layout } from '../components/layout/Layout';
import { ExerciseCard } from '../components/cards/ExerciseCard';
import { Exercise, useRehabStore } from '../store/useRehabStore';
import { Search, Filter } from 'lucide-react';
import { motion } from 'motion/react';

export function Exercises() {
  const navigate = useNavigate();
  const { setCurrentExercise, catalogueExercises, fetchExercises } = useRehabStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  useEffect(() => {
    fetchExercises();
  }, []);

  // Map catalogue exercises to the Exercise interface
  const exercises: Exercise[] = catalogueExercises.map((e) => ({
    id: e.id,
    name: e.name,
    description: e.description,
    targetMuscle: e.description.split('.')[0] || 'General',
    difficulty: 'beginner' as const, // catalogue doesn't have difficulty levels
    sets: e.default_sets,
    reps: e.default_reps,
    camera: e.camera,
    type: e.type,
  }));

  // Fallback static exercises if API hasn't loaded yet
  const fallbackExercises: Exercise[] = [
    { id: 'squat', name: 'Squat', targetMuscle: 'Quadriceps & Glutes', difficulty: 'beginner', sets: 3, reps: 10 },
    { id: 'shoulder_flexion', name: 'Shoulder Flexion', targetMuscle: 'Rotator Cuff', difficulty: 'intermediate', sets: 3, reps: 10 },
    { id: 'bicep_curl', name: 'Bicep Curl', targetMuscle: 'Biceps', difficulty: 'beginner', sets: 3, reps: 12 },
    { id: 'lunge', name: 'Lunge', targetMuscle: 'Quads & Glutes', difficulty: 'intermediate', sets: 3, reps: 10 },
    { id: 'wall_pushup', name: 'Wall Push-Up', targetMuscle: 'Upper Body', difficulty: 'beginner', sets: 3, reps: 10 },
    { id: 'cat_cow', name: 'Cat-Cow Stretch', targetMuscle: 'Lower Back', difficulty: 'beginner', sets: 2, reps: 10 },
  ];

  const displayExercises = exercises.length > 0 ? exercises : fallbackExercises;

  const filteredExercises = displayExercises.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.targetMuscle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || exercise.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  const handleStartExercise = (exercise: Exercise) => {
    setCurrentExercise(exercise);
    navigate('/session');
  };

  return (
    <Layout>
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Exercise Library</h1>
          <p className="text-muted-foreground">Browse and start personalized rehabilitation exercises</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-card border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="pl-12 pr-8 py-3 bg-card border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
            >
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredExercises.map((exercise, index) => (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              <ExerciseCard
                exercise={exercise}
                onStart={() => handleStartExercise(exercise)}
              />
            </motion.div>
          ))}
        </motion.div>

        {filteredExercises.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No exercises found matching your criteria</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
