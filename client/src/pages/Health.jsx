import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, TrendingUp, Dumbbell, Apple, Target } from 'lucide-react';

export default function Health({ user }) {
  const [activeTab, setActiveTab] = useState('metrics');
  const [metrics, setMetrics] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [meals, setMeals] = useState([]);
  const [habits, setHabits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    try {
      if (activeTab === 'metrics') {
        const res = await axios.get('/api/health/metrics', config);
        setMetrics(res.data);
      } else if (activeTab === 'workouts') {
        const res = await axios.get('/api/health/workouts', config);
        setWorkouts(res.data);
      } else if (activeTab === 'meals') {
        const res = await axios.get('/api/health/meals', config);
        setMeals(res.data);
      } else if (activeTab === 'habits') {
        const res = await axios.get('/api/health/habits', config);
        setHabits(res.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const tabs = [
    { id: 'metrics', label: 'Body Metrics', icon: TrendingUp },
    { id: 'workouts', label: 'Workouts', icon: Dumbbell },
    { id: 'meals', label: 'Meals', icon: Apple },
    { id: 'habits', label: 'Habits', icon: Target },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Health Tracking</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor your body metrics, workouts, nutrition, and habits
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add {activeTab === 'metrics' ? 'Metrics' : activeTab === 'workouts' ? 'Workout' : activeTab === 'meals' ? 'Meal' : 'Habit'}
        </button>
      </div>

      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setShowForm(false);
              }}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {showForm && activeTab === 'metrics' && <MetricsForm onSave={() => { setShowForm(false); loadData(); }} />}
      {showForm && activeTab === 'workouts' && <WorkoutForm onSave={() => { setShowForm(false); loadData(); }} />}
      {showForm && activeTab === 'meals' && <MealForm onSave={() => { setShowForm(false); loadData(); }} />}
      {showForm && activeTab === 'habits' && <HabitForm onSave={() => { setShowForm(false); loadData(); }} />}

      {!showForm && (
        <div className="space-y-4">
          {activeTab === 'metrics' && <MetricsList data={metrics} onRefresh={loadData} />}
          {activeTab === 'workouts' && <WorkoutsList data={workouts} onRefresh={loadData} />}
          {activeTab === 'meals' && <MealsList data={meals} onRefresh={loadData} />}
          {activeTab === 'habits' && <HabitsList data={habits} onRefresh={loadData} />}
        </div>
      )}
    </div>
  );
}

function MetricsForm({ onSave }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    body_fat: '',
    muscle_mass: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('/api/health/metrics', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSave();
    } catch (error) {
      alert('Failed to save metrics');
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Add Body Metrics</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            className="input"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Weight (lbs)</label>
            <input
              type="number"
              step="0.1"
              className="input"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Body Fat %</label>
            <input
              type="number"
              step="0.1"
              className="input"
              value={formData.body_fat}
              onChange={(e) => setFormData({ ...formData, body_fat: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Muscle Mass (lbs)</label>
            <input
              type="number"
              step="0.1"
              className="input"
              value={formData.muscle_mass}
              onChange={(e) => setFormData({ ...formData, muscle_mass: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            className="input"
            rows="3"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary">Save Metrics</button>
          <button type="button" onClick={onSave} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}

function WorkoutForm({ onSave }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'strength',
    duration: '',
    exercises: [],
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('/api/health/workouts', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSave();
    } catch (error) {
      alert('Failed to save workout');
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Log Workout</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              className="input"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              className="input"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="strength">Strength</option>
              <option value="cardio">Cardio</option>
              <option value="sports">Sports</option>
              <option value="flexibility">Flexibility</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
            <input
              type="number"
              className="input"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Notes / Exercises</label>
          <textarea
            className="input"
            rows="4"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Bench press 3x10, Squats 4x8..."
          />
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary">Save Workout</button>
          <button type="button" onClick={onSave} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}

function MealForm({ onSave }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    meal_type: 'breakfast',
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
    notes: ''
  });

  const calories = Math.round((formData.protein * 4) + (formData.carbs * 4) + (formData.fat * 9));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('/api/health/meals', { ...formData, calories }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSave();
    } catch (error) {
      alert('Failed to save meal');
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Log Meal</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              className="input"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Meal Type</label>
            <select
              className="input"
              value={formData.meal_type}
              onChange={(e) => setFormData({ ...formData, meal_type: e.target.value })}
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Protein (g)</label>
            <input
              type="number"
              className="input"
              value={formData.protein}
              onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Carbs (g)</label>
            <input
              type="number"
              className="input"
              value={formData.carbs}
              onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fat (g)</label>
            <input
              type="number"
              className="input"
              value={formData.fat}
              onChange={(e) => setFormData({ ...formData, fat: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fiber (g)</label>
            <input
              type="number"
              className="input"
              value={formData.fiber}
              onChange={(e) => setFormData({ ...formData, fiber: e.target.value })}
            />
          </div>
        </div>
        <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
          <p className="text-sm font-medium">Estimated Calories: <span className="text-primary-600 dark:text-primary-400 text-lg">{calories || 0}</span></p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">What did you eat?</label>
          <textarea
            className="input"
            rows="3"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Chicken breast, rice, broccoli..."
          />
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary">Save Meal</button>
          <button type="button" onClick={onSave} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}

function HabitForm({ onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    frequency: 'daily'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('/api/health/habits', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSave();
    } catch (error) {
      alert('Failed to create habit');
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Create Habit</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Habit Name</label>
          <input
            type="text"
            className="input"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Drink 8 glasses of water"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Frequency</label>
          <select
            className="input"
            value={formData.frequency}
            onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary">Create Habit</button>
          <button type="button" onClick={onSave} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}

function MetricsList({ data, onRefresh }) {
  if (!data.length) return <div className="card text-center text-gray-500">No metrics yet. Add your first entry!</div>;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((metric) => (
        <div key={metric.id} className="card">
          <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(metric.date).toLocaleDateString()}</p>
          <div className="mt-2 space-y-1">
            {metric.weight && <p><span className="font-medium">Weight:</span> {metric.weight} lbs</p>}
            {metric.body_fat && <p><span className="font-medium">Body Fat:</span> {metric.body_fat}%</p>}
            {metric.muscle_mass && <p><span className="font-medium">Muscle:</span> {metric.muscle_mass} lbs</p>}
            {metric.notes && <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{metric.notes}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

function WorkoutsList({ data }) {
  if (!data.length) return <div className="card text-center text-gray-500">No workouts yet. Log your first workout!</div>;
  
  return (
    <div className="space-y-3">
      {data.map((workout) => (
        <div key={workout.id} className="card">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium capitalize">{workout.type} • {workout.duration} min</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(workout.date).toLocaleDateString()}</p>
            </div>
          </div>
          {workout.notes && <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{workout.notes}</p>}
        </div>
      ))}
    </div>
  );
}

function MealsList({ data }) {
  if (!data.length) return <div className="card text-center text-gray-500">No meals logged yet. Track your first meal!</div>;
  
  return (
    <div className="space-y-3">
      {data.map((meal) => (
        <div key={meal.id} className="card">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium capitalize">{meal.meal_type}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(meal.date).toLocaleDateString()}</p>
            </div>
            <p className="text-lg font-bold text-primary-600 dark:text-primary-400">{meal.calories} cal</p>
          </div>
          <div className="mt-2 flex gap-4 text-sm">
            <span>P: {meal.protein}g</span>
            <span>C: {meal.carbs}g</span>
            <span>F: {meal.fat}g</span>
          </div>
          {meal.notes && <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{meal.notes}</p>}
        </div>
      ))}
    </div>
  );
}

function HabitsList({ data, onRefresh }) {
  const markComplete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(`/api/health/habits/${id}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onRefresh();
    } catch (error) {
      alert('Failed to update habit');
    }
  };

  if (!data.length) return <div className="card text-center text-gray-500">No habits yet. Create your first habit!</div>;
  
  return (
    <div className="space-y-3">
      {data.map((habit) => (
        <div key={habit.id} className="card flex justify-between items-center">
          <div>
            <p className="font-medium">{habit.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {habit.streak} day streak • {habit.frequency}
            </p>
          </div>
          <button
            onClick={() => markComplete(habit.id)}
            className="btn-primary"
          >
            Complete Today
          </button>
        </div>
      ))}
    </div>
  );
}