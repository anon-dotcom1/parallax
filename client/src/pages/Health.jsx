export default function Health({ user }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Health Tracking</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track your body metrics, workouts, meals, and habits
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <HealthCard title="Body Metrics" description="Weight, body fat %, measurements" />
        <HealthCard title="Workouts" description="Log strength, cardio, sports" />
        <HealthCard title="Meals" description="Track nutrition and macros" />
        <HealthCard title="Habits" description="Daily habits and streaks" />
        <HealthCard title="Progress Photos" description="Visual progress tracking" />
        <HealthCard title="Reports" description="View trends and charts" />
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Coming Soon</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Full health tracking interface will be available here. You can add metrics, log workouts,
          track meals, and monitor your progress over time.
        </p>
      </div>
    </div>
  );
}

function HealthCard({ title, description }) {
  return (
    <div className="card hover:shadow-lg transition-shadow cursor-pointer">
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
