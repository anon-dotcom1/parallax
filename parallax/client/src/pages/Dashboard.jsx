import { useEffect, useState } from 'react';
import { Heart, Trophy, Globe, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import axios from 'axios';

export default function Dashboard({ user }) {
  const [stats, setStats] = useState({
    recentWorkouts: 0,
    currentWeight: null,
    savingsProgress: 0,
    monthlySpent: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      // Load recent data from each module
      const [workouts, metrics, goals] = await Promise.all([
        axios.get('/api/health/workouts?limit=7', config),
        axios.get('/api/health/metrics?limit=1', config),
        axios.get('/api/budget/savings-goals', config)
      ]);

      setStats({
        recentWorkouts: workouts.data.length,
        currentWeight: metrics.data[0]?.weight,
        savingsProgress: calculateSavingsProgress(goals.data),
        monthlySpent: 0 // Will calculate from transactions
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  const calculateSavingsProgress = (goals) => {
    if (!goals.length) return 0;
    const total = goals.reduce((sum, g) => sum + parseFloat(g.current_amount), 0);
    const target = goals.reduce((sum, g) => sum + parseFloat(g.target_amount), 0);
    return target > 0 ? Math.round((total / target) * 100) : 0;
  };

  const quickStats = [
    {
      title: 'Health',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      value: stats.currentWeight ? `${stats.currentWeight} lbs` : '--',
      subtitle: 'Current weight',
      link: '/health'
    },
    {
      title: 'Sports',
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      value: stats.recentWorkouts,
      subtitle: 'Workouts this week',
      link: '/sports'
    },
    {
      title: 'Escape Plan',
      icon: Globe,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      value: `${stats.savingsProgress}%`,
      subtitle: 'Savings progress',
      link: '/escape-plan'
    },
    {
      title: 'Budget',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      value: `$${stats.monthlySpent}`,
      subtitle: 'Spent this month',
      link: '/budget'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Here's your overview for today
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <a
              key={stat.title}
              href={stat.link}
              className="card hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {stat.subtitle}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <ActivityItem
            icon={<Heart className="w-5 h-5 text-red-600" />}
            title="Logged workout"
            time="2 hours ago"
          />
          <ActivityItem
            icon={<DollarSign className="w-5 h-5 text-green-600" />}
            title="Added expense - Groceries"
            time="5 hours ago"
          />
          <ActivityItem
            icon={<Globe className="w-5 h-5 text-blue-600" />}
            title="Saved country comparison"
            time="Yesterday"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuickAction
            icon={<Heart />}
            label="Log Workout"
            href="/health"
          />
          <QuickAction
            icon={<TrendingUp />}
            label="Add Weight"
            href="/health"
          />
          <QuickAction
            icon={<DollarSign />}
            label="Add Expense"
            href="/budget"
          />
          <QuickAction
            icon={<Globe />}
            label="Compare Countries"
            href="/escape-plan"
          />
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ icon, title, time }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
      <div className="p-2 rounded-lg bg-white dark:bg-gray-800">
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{time}</p>
      </div>
    </div>
  );
}

function QuickAction({ icon, label, href }) {
  return (
    <a
      href={href}
      className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    >
      <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
        {icon}
      </div>
      <span className="text-sm font-medium text-center">{label}</span>
    </a>
  );
}
