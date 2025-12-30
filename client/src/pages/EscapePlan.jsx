import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Globe, Calculator, Plane, Dog, Cat } from 'lucide-react';

export default function EscapePlan({ user }) {
  const [activeTab, setActiveTab] = useState('calculator');
  const [countries, setCountries] = useState([]);
  const [pets, setPets] = useState([]);
  const [relocationPlan, setRelocationPlan] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState([]);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    try {
      if (activeTab === 'countries') {
        const res = await axios.get('/api/escape-plan/countries', config);
        setCountries(res.data);
      } else if (activeTab === 'pets') {
        const res = await axios.get('/api/escape-plan/pets', config);
        setPets(res.data);
      } else if (activeTab === 'plan') {
        const res = await axios.get('/api/escape-plan/relocation-plans', config);
        setRelocationPlan(res.data[0] || null);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const tabs = [
    { id: 'calculator', label: 'Savings Calculator', icon: Calculator },
    { id: 'pets', label: 'Pet Relocation', icon: Dog },
    { id: 'countries', label: 'Country Info', icon: Globe },
    { id: 'plan', label: 'My Plan', icon: Plane },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Escape Plan</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Plan your move, track savings, and manage pet relocation
          </p>
        </div>
        {(activeTab === 'pets' || activeTab === 'plan') && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            {activeTab === 'pets' ? 'Add Pet' : 'Create Plan'}
          </button>
        )}
      </div>

      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setShowForm(false);
              }}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
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

      {showForm && activeTab === 'pets' && <PetForm onSave={() => { setShowForm(false); loadData(); }} />}
      {showForm && activeTab === 'plan' && <PlanForm countries={countries} onSave={() => { setShowForm(false); loadData(); }} />}

      {!showForm && (
        <div>
          {activeTab === 'calculator' && <SavingsCalculator />}
          {activeTab === 'pets' && <PetsList pets={pets} onRefresh={loadData} />}
          {activeTab === 'countries' && <CountryInfo />}
          {activeTab === 'plan' && <RelocationPlanView plan={relocationPlan} onRefresh={loadData} />}
        </div>
      )}
    </div>
  );
}

function SavingsCalculator() {
  const [targetAmount, setTargetAmount] = useState(20000);
  const [currentSavings, setCurrentSavings] = useState(0);
  const [monthlyContribution, setMonthlyContribution] = useState(1000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(3000);

  const remaining = targetAmount - currentSavings;
  const monthsNeeded = remaining > 0 ? Math.ceil(remaining / monthlyContribution) : 0;
  const targetDate = new Date();
  targetDate.setMonth(targetDate.getMonth() + monthsNeeded);

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Relocation Savings Calculator</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Target Amount Needed: ${targetAmount.toLocaleString()}
            </label>
            <input
              type="range"
              min="5000"
              max="100000"
              step="1000"
              value={targetAmount}
              onChange={(e) => setTargetAmount(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Current Savings: ${currentSavings.toLocaleString()}
            </label>
            <input
              type="range"
              min="0"
              max="50000"
              step="500"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Monthly Contribution: ${monthlyContribution.toLocaleString()}
            </label>
            <input
              type="range"
              min="100"
              max="5000"
              step="100"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Monthly Living Expenses: ${monthlyExpenses.toLocaleString()}
            </label>
            <input
              type="range"
              min="500"
              max="10000"
              step="100"
              value={monthlyExpenses}
              onChange={(e) => setMonthlyExpenses(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-primary-50 dark:bg-primary-900/20">
          <p className="text-sm text-gray-600 dark:text-gray-400">Amount Remaining</p>
          <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 mt-2">
            ${remaining.toLocaleString()}
          </p>
        </div>
        <div className="card bg-green-50 dark:bg-green-900/20">
          <p className="text-sm text-gray-600 dark:text-gray-400">Months Until Goal</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
            {monthsNeeded}
          </p>
        </div>
        <div className="card bg-blue-50 dark:bg-blue-900/20">
          <p className="text-sm text-gray-600 dark:text-gray-400">Target Date</p>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-2">
            {targetDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="card">
        <h3 className="font-bold mb-3">First 6 Months in New Country</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Estimated expenses while settling in (living costs × 6 months)
        </p>
        <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
          ${(monthlyExpenses * 6).toLocaleString()}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
          Recommended buffer: +20% = ${Math.round(monthlyExpenses * 6 * 1.2).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

function PetForm({ onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'cat',
    breed: '',
    age: '',
    weight: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('/api/escape-plan/pets', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSave();
    } catch (error) {
      alert('Failed to add pet');
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Add Pet</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Pet Name</label>
            <input
              type="text"
              className="input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              <option value="cat">Cat</option>
              <option value="dog">Dog</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Breed</label>
            <input
              type="text"
              className="input"
              value={formData.breed}
              onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Age</label>
            <input
              type="number"
              className="input"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Weight (lbs)</label>
            <input
              type="number"
              className="input"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary">Add Pet</button>
          <button type="button" onClick={onSave} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}

function PetsList({ pets, onRefresh }) {
  if (!pets.length) {
    return (
      <div className="card text-center">
        <p className="text-gray-500 mb-4">No pets added yet.</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Add your 3 cats and 1 dog to track relocation requirements.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {pets.map(pet => {
        const Icon = pet.type === 'cat' ? Cat : Dog;
        return (
          <div key={pet.id} className="card">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{pet.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{pet.type}</p>
              </div>
            </div>
            <div className="mt-3 space-y-1 text-sm">
              {pet.breed && <p><span className="font-medium">Breed:</span> {pet.breed}</p>}
              {pet.age && <p><span className="font-medium">Age:</span> {pet.age} years</p>}
              {pet.weight && <p><span className="font-medium">Weight:</span> {pet.weight} lbs</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CountryInfo() {
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Country Research</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Research popular relocation destinations for your escape plan.
      </p>
      <div className="space-y-3">
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h3 className="font-bold">Portugal</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Low cost of living, warm climate, English-friendly. Digital nomad visa available.
          </p>
        </div>
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h3 className="font-bold">Spain</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Vibrant culture, Mediterranean lifestyle, good healthcare. Non-lucrative visa option.
          </p>
        </div>
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h3 className="font-bold">Mexico</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Very affordable, close to US, beautiful beaches. Temporary residency visa available.
          </p>
        </div>
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h3 className="font-bold">Thailand</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Extremely low cost, tropical paradise, friendly expat community. Tourist visa or retirement visa.
          </p>
        </div>
      </div>
    </div>
  );
}

function PlanForm({ countries, onSave }) {
  const [formData, setFormData] = useState({
    target_country_id: '',
    target_date: '',
    savings_target: '',
    current_savings: '0',
    monthly_contribution: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('/api/escape-plan/relocation-plans', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSave();
    } catch (error) {
      alert('Failed to create plan');
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Create Relocation Plan</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Target Country</label>
          <input
            type="text"
            className="input"
            placeholder="Portugal, Spain, Mexico..."
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Target Move Date</label>
            <input
              type="date"
              className="input"
              value={formData.target_date}
              onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Savings Target ($)</label>
            <input
              type="number"
              className="input"
              value={formData.savings_target}
              onChange={(e) => setFormData({ ...formData, savings_target: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Current Savings ($)</label>
            <input
              type="number"
              className="input"
              value={formData.current_savings}
              onChange={(e) => setFormData({ ...formData, current_savings: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Monthly Contribution ($)</label>
            <input
              type="number"
              className="input"
              value={formData.monthly_contribution}
              onChange={(e) => setFormData({ ...formData, monthly_contribution: e.target.value })}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary">Create Plan</button>
          <button type="button" onClick={onSave} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}

function RelocationPlanView({ plan, onRefresh }) {
  if (!plan) {
    return (
      <div className="card text-center">
        <p className="text-gray-500 mb-4">No relocation plan created yet.</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Create a plan to track your progress toward moving abroad.
        </p>
      </div>
    );
  }

  const progress = (parseFloat(plan.current_savings) / parseFloat(plan.savings_target)) * 100;
  const remaining = parseFloat(plan.savings_target) - parseFloat(plan.current_savings);
  const monthlyContribution = parseFloat(plan.monthly_contribution) || 0;
  const monthsRemaining = monthlyContribution > 0 ? Math.ceil(remaining / monthlyContribution) : 0;

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Your Relocation Plan</h2>
        {plan.target_date && (
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Target Date: {new Date(plan.target_date).toLocaleDateString()}
          </p>
        )}

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-medium">Savings Progress</span>
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                ${parseFloat(plan.current_savings).toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6">
              <div
                className="bg-primary-600 h-6 rounded-full transition-all flex items-center justify-end pr-2"
                style={{ width: `${Math.min(progress, 100)}%` }}
              >
                <span className="text-white text-xs font-bold">
                  {progress.toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
              <span>Goal: ${parseFloat(plan.savings_target).toLocaleString()}</span>
              <span>${remaining.toLocaleString()} remaining</span>
            </div>
          </div>

          {monthlyContribution > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Contribution</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ${monthlyContribution.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Months to Goal</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {monthsRemaining}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h3 className="font-bold text-lg mb-3">Relocation Checklist</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            <span className="text-sm">Research visa requirements</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            <span className="text-sm">Get pet health certificates</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            <span className="text-sm">Book flights</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            <span className="text-sm">Arrange housing</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            <span className="text-sm">Notify current employer</span>
          </label>
        </div>
      </div>
    </div>
  );
}