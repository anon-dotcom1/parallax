import { useEffect, useState } from 'react';
import axios from 'axios';
import { Activity, DollarSign, Target, Plane } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard({ user }) {
  const [stats, setStats] = useState({
    recentWorkouts: 0,
    monthlyExpenses: 0,
    savingsGoals: 0,
    pets: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      // Get actual data from APIs
      const [workouts, transactions, goals, pets] = await Promise.all([
        axios.get('/api/health/workouts', config).catch(() => ({ data: [] })),
        axios.get('/api/budget/transactions', config).catch(() => ({ data: [] })),
        axios.get('/api/budget/savings-goals', config).catch(() => ({ data: [] })),
        axios.get('/api/escape-plan/pets', config).catch(() => ({ data: [] }))
      ]);

      // Calculate this month's expenses
      const thisMonth = new Date().getMonth();
      const thisYear = new Date().getFullYear();
      const monthlyExpenses = transactions.data
        .filter(t => {
          const date = new Date(t.date);
          return t.type === 'expense' && 
                 date.getMonth() === thisMonth && 
                 date.getFullYear() === thisYear;
        })
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      setStats({
        recentWorkouts: workouts.data.filter(w => {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return new Date(w.date) >= weekAgo;
        }).length,
        monthlyExpenses: monthlyExpenses,
        savingsGoals: goals.data.length,
        pets: pets.data.length
      });

      // Build recent activity from actual data
      const activity = [];
      
      // Add recent workouts (last 3)
      workouts.data.slice(0, 3).forEach(w => {
        activity.push({
          text: `Logged ${w.type} workout`,
          time: formatTimeAgo(w.created_at),
          icon: Activity,
          link: '/health'
        });
      });

      // Add recent transactions (last 3)
      transactions.data.slice(0, 3).forEach(t => {
        activity.push({
          text: `${t.type === 'income' ? 'Added income' : 'Added expense'} - ${t.category}`,
          time: formatTimeAgo(t.created_at),
          icon: DollarSign,
          link: '/budget'
        });
      });

      // Sort by most recent
      activity.sort((a, b) => new Date(b.time) - new Date(a.time));
      setRecentActivity(activity.slice(0, 5));

    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Here's what's happening with your goals
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/health" className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Workouts This Week</p>
              <p className="text-2xl font-bold">{stats.recentWorkouts}</p>
            </div>
          </div>
        </Link>

        <Link to="/budget" className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Expenses</p>
              <p className="text-2xl font-bold">${stats.monthlyExpenses.toFixed(0)}</p>
            </div>
          </div>
        </Link>

        <Link to="/budget" className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Savings Goals</p>
              <p className="text-2xl font-bold">{stats.savingsGoals}</p>
            </div>
          </div>
        </Link>

        <Link to="/escape-plan" className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Plane className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pets to Relocate</p>
              <p className="text-2xl font-bold">{stats.pets}</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        {recentActivity.length > 0 ? (
          <div className="space-y-3">
            {recentActivity.map((activity, idx) => {
              const Icon = activity.icon;
              return (
                <Link
                  key={idx}
                  to={activity.link}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.text}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No activity yet. Start tracking your health, budget, or escape plan!
          </p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link to="/health" className="btn-primary text-center">
            Log Workout
          </Link>
          <Link to="/budget" className="btn-primary text-center">
            Add Expense
          </Link>
          <Link to="/escape-plan" className="btn-primary text-center">
            Update Savings
          </Link>
          <Link to="/sports" className="btn-primary text-center">
            Log Training
          </Link>
        </div>
      </div>
    </div>
  );
}