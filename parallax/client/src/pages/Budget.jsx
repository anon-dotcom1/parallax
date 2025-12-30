export default function Budget({ user }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Budget Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track expenses, set budgets, and manage savings goals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BudgetSummary label="This Month" amount="$0" color="text-blue-600" />
        <BudgetSummary label="Income" amount="$0" color="text-green-600" />
        <BudgetSummary label="Savings" amount="$0" color="text-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            No transactions yet. Start tracking your expenses!
          </p>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">Budget Categories</h2>
          <div className="space-y-3">
            <CategoryItem name="Groceries" spent={0} budget={0} />
            <CategoryItem name="Rent" spent={0} budget={0} />
            <CategoryItem name="Transportation" spent={0} budget={0} />
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FeatureItem 
            title="Expense Tracking" 
            description="Log all expenses with categories, receipts, and notes"
          />
          <FeatureItem 
            title="Shared Expenses" 
            description="Track expenses shared between you and your sister"
          />
          <FeatureItem 
            title="Budget Limits" 
            description="Set monthly limits for each category and get alerts"
          />
          <FeatureItem 
            title="Savings Goals" 
            description="Create multiple savings goals with progress tracking"
          />
          <FeatureItem 
            title="Reports & Charts" 
            description="Visualize spending patterns over time"
          />
          <FeatureItem 
            title="Export Data" 
            description="Export transactions to CSV for analysis"
          />
        </div>
      </div>
    </div>
  );
}

function BudgetSummary({ label, amount, color }) {
  return (
    <div className="card">
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
      <p className={`text-3xl font-bold mt-2 ${color}`}>{amount}</p>
    </div>
  );
}

function CategoryItem({ name, spent, budget }) {
  const percentage = budget > 0 ? (spent / budget) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{name}</span>
        <span className="text-gray-600 dark:text-gray-400">
          ${spent} / ${budget}
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className="bg-primary-600 h-2 rounded-full" 
          style={{width: `${percentage}%`}}
        ></div>
      </div>
    </div>
  );
}

function FeatureItem({ title, description }) {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <h3 className="font-bold mb-1">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
