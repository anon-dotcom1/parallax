import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trophy, Activity, Heart } from 'lucide-react';

export default function Sports({ user }) {
  const [activeTab, setActiveTab] = useState('training');
  const [training, setTraining] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [recovery, setRecovery] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    try {
      if (activeTab === 'training') {
        const res = await axios.get('/api/sports/training', config);
        setTraining(res.data);
      } else if (activeTab === 'competitions') {
        const res = await axios.get('/api/sports/competitions', config);
        setCompetitions(res.data);
      } else if (activeTab === 'recovery') {
        const res = await axios.get('/api/sports/recovery', config);
        setRecovery(res.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const tabs = [
    { id: 'training', label: 'Training Sessions', icon: Activity },
    { id: 'competitions', label: 'Competitions', icon: Trophy },
    { id: 'recovery', label: 'Recovery', icon: Heart },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sports Tracking</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Log training sessions, track competitions, and monitor recovery
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add {activeTab === 'training' ? 'Session' : activeTab === 'competitions' ? 'Competition' : 'Recovery Log'}
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

      {showForm && activeTab === 'training' && <TrainingForm onSave={() => { setShowForm(false); loadData(); }} />}
      {showForm && activeTab === 'competitions' && <CompetitionForm onSave={() => { setShowForm(false); loadData(); }} />}
      {showForm && activeTab === 'recovery' && <RecoveryForm onSave={() => { setShowForm(false); loadData(); }} />}

      {!showForm && (
        <div className="space-y-4">
          {activeTab === 'training' && <TrainingList data={training} />}
          {activeTab === 'competitions' && <CompetitionsList data={competitions} />}
          {activeTab === 'recovery' && <RecoveryList data={recovery} />}
        </div>
      )}
    </div>
  );
}

function TrainingForm({ onSave }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    sport: '',
    duration: '',
    intensity: 'moderate',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('/api/sports/training', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSave();
    } catch (error) {
      alert('Failed to save training session');
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Log Training Session</h2>
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
            <label className="block text-sm font-medium mb-1">Sport / Activity</label>
            <input
              type="text"
              className="input"
              value={formData.sport}
              onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
              placeholder="Running, Cycling, Swimming..."
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div>
            <label className="block text-sm font-medium mb-1">Intensity</label>
            <select
              className="input"
              value={formData.intensity}
              onChange={(e) => setFormData({ ...formData, intensity: e.target.value })}
            >
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="hard">Hard</option>
              <option value="max">Maximum</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Notes / Performance</label>
          <textarea
            className="input"
            rows="3"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="How did it feel? Any PRs? What worked well?"
          />
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary">Save Session</button>
          <button type="button" onClick={onSave} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}

function CompetitionForm({ onSave }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    event: '',
    location: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('/api/sports/competitions', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSave();
    } catch (error) {
      alert('Failed to save competition');
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Log Competition</h2>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Event Name</label>
            <input
              type="text"
              className="input"
              value={formData.event}
              onChange={(e) => setFormData({ ...formData, event: e.target.value })}
              placeholder="Marathon, Tournament, Race..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              className="input"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="City, Venue..."
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Results / Notes</label>
          <textarea
            className="input"
            rows="4"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Placement, time, how you felt, what you learned..."
          />
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary">Save Competition</button>
          <button type="button" onClick={onSave} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}

function RecoveryForm({ onSave }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    sleep_hours: '',
    sleep_quality: '3',
    soreness: '3',
    energy: '3',
    stress: '3',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('/api/sports/recovery', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSave();
    } catch (error) {
      alert('Failed to save recovery log');
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Log Recovery Metrics</h2>
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
        <div>
          <label className="block text-sm font-medium mb-1">
            Sleep Hours: {formData.sleep_hours || '0'}h
          </label>
          <input
            type="number"
            step="0.5"
            className="input"
            value={formData.sleep_hours}
            onChange={(e) => setFormData({ ...formData, sleep_hours: e.target.value })}
            placeholder="7.5"
          />
        </div>
        
        {[
          { key: 'sleep_quality', label: 'Sleep Quality', low: 'Poor', high: 'Excellent' },
          { key: 'soreness', label: 'Muscle Soreness', low: 'None', high: 'Very Sore' },
          { key: 'energy', label: 'Energy Level', low: 'Low', high: 'High' },
          { key: 'stress', label: 'Stress Level', low: 'Low', high: 'High' },
        ].map(({ key, label, low, high }) => (
          <div key={key}>
            <label className="block text-sm font-medium mb-2">
              {label}: {formData[key]}/5
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 dark:text-gray-400">{low}</span>
              <input
                type="range"
                min="1"
                max="5"
                className="flex-1"
                value={formData[key]}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">{high}</span>
            </div>
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            className="input"
            rows="2"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="How do you feel today?"
          />
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary">Save Recovery Log</button>
          <button type="button" onClick={onSave} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}

function TrainingList({ data }) {
  if (!data.length) return <div className="card text-center text-gray-500">No training sessions yet. Log your first session!</div>;

  return (
    <div className="space-y-3">
      {data.map((session) => (
        <div key={session.id} className="card">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">{session.sport}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(session.date).toLocaleDateString()} • {session.duration} min
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              session.intensity === 'max' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
              session.intensity === 'hard' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' :
              session.intensity === 'moderate' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
              'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
            }`}>
              {session.intensity}
            </span>
          </div>
          {session.notes && <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{session.notes}</p>}
        </div>
      ))}
    </div>
  );
}

function CompetitionsList({ data }) {
  if (!data.length) return <div className="card text-center text-gray-500">No competitions logged yet. Add your first event!</div>;

  return (
    <div className="space-y-3">
      {data.map((comp) => (
        <div key={comp.id} className="card">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="flex-1">
              <p className="font-bold">{comp.event}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(comp.date).toLocaleDateString()}
                {comp.location && ` • ${comp.location}`}
              </p>
              {comp.notes && <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{comp.notes}</p>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function RecoveryList({ data }) {
  if (!data.length) return <div className="card text-center text-gray-500">No recovery logs yet. Start tracking your recovery!</div>;

  return (
    <div className="space-y-3">
      {data.map((log) => (
        <div key={log.id} className="card">
          <div className="flex justify-between items-start mb-3">
            <p className="font-medium">{new Date(log.date).toLocaleDateString()}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{log.sleep_hours}h sleep</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-500">Sleep Quality</p>
              <p className="font-medium">{log.sleep_quality}/5</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-500">Soreness</p>
              <p className="font-medium">{log.soreness}/5</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-500">Energy</p>
              <p className="font-medium">{log.energy}/5</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-500">Stress</p>
              <p className="font-medium">{log.stress}/5</p>
            </div>
          </div>
          {log.notes && <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{log.notes}</p>}
        </div>
      ))}
    </div>
  );
}