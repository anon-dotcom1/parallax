export default function EscapePlan({ user }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Escape Plan</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Compare countries, track savings, and plan your relocation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EscapeCard 
          title="Country Comparison" 
          description="Compare cost of living, visa requirements, and quality of life across 195 countries"
          highlight
        />
        <EscapeCard 
          title="Savings Calculator" 
          description="Track progress toward your move goal with timeline projections"
        />
        <EscapeCard 
          title="Pet Relocation" 
          description="Requirements and costs for moving 3 cats and 1 dog internationally"
        />
        <EscapeCard 
          title="Research Notes" 
          description="Save comparisons, links, and notes about potential destinations"
        />
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Your Relocation Plan</h2>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-bold mb-2">Savings Progress</h3>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div className="bg-blue-600 h-4 rounded-full" style={{width: '0%'}}></div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              $0 of $0 saved (Set up your first goal!)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatBox label="Countries Compared" value="0" />
            <StatBox label="Target Date" value="Not set" />
            <StatBox label="Monthly Savings" value="$0" />
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Coming Soon</h2>
        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
          <li>• Side-by-side comparison of up to 4 countries</li>
          <li>• Real-time cost of living data from Numbeo</li>
          <li>• Detailed pet import requirements per country</li>
          <li>• Visa and immigration information</li>
          <li>• Savings timeline calculator</li>
          <li>• Relocation checklist tracker</li>
        </ul>
      </div>
    </div>
  );
}

function EscapeCard({ title, description, highlight }) {
  return (
    <div className={`card hover:shadow-lg transition-shadow cursor-pointer ${highlight ? 'border-2 border-blue-500' : ''}`}>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      {highlight && (
        <span className="inline-block mt-3 text-xs font-semibold text-blue-600 dark:text-blue-400">
          Core Feature
        </span>
      )}
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
