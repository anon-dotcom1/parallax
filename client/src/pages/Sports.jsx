export default function Sports({ user }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Sports & Training</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track training sessions, competitions, and recovery
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SportsCard title="Training Calendar" description="Schedule and track your training sessions" />
        <SportsCard title="Performance Metrics" description="Monitor your progress and PRs" />
        <SportsCard title="Competitions" description="Track upcoming events and results" />
        <SportsCard title="Recovery" description="Log sleep, soreness, and energy levels" />
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Training Overview</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Complete sports tracking interface coming soon. Track all your training sessions,
          monitor performance metrics, and optimize your recovery.
        </p>
      </div>
    </div>
  );
}

function SportsCard({ title, description }) {
  return (
    <div className="card hover:shadow-lg transition-shadow cursor-pointer">
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
