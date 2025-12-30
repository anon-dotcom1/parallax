import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, DollarSign, TrendingUp, Wallet, PiggyBank } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';

export default function Budget({ user }) {
  const [activeTab, setActiveTab] = useState('transactions');
  const [transactions, setTransactions] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [summary, setSummary] = useState({ income: 0, expenses: 0 });
  const { formatAmount, symbol } = useCurrency();

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    try {
      if (activeTab === 'transactions') {
        const res = await axios.get('/api/budget/transactions', config);
        setTransactions(res.data);
        calculateSummary(res.data);
      } else if (activeTab === 'goals') {
        const res = await axios.get('/api/budget/savings-goals', config);
        setSavingsGoals(res.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const calculateSummary = (txns) => {
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    
    const monthlyTxns = txns.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    });

    const income = monthlyTxns
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const expenses = monthlyTxns
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    setSummary({ income, expenses });
  };

  const tabs = [
    { id: 'transactions', label: 'Transactions', icon: DollarSign },
    { id: 'goals', label: 'Savings Goals', icon: PiggyBank },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Budget Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track expenses, manage budgets, and reach your savings goals
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add {activeTab === 'transactions' ? 'Transaction' : 'Goal'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <p className="text-sm text-gray-600 dark:text-gray-400">This Month Income</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
            {formatAmount(summary.income)}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 dark:text-gray-400">This Month Expenses</p>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">
            {formatAmount(summary.expenses)}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 dark:text-gray-400">Net</p>
          <p className={`text-3xl font-bold mt-2 ${summary.income - summary.expenses >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {formatAmount(summary.income - summary.expenses)}
          </p>
        </div>
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

      {showForm && activeTab === 'transactions' && <TransactionForm onSave={() => { setShowForm(false); loadData(); }} symbol={symbol} />}
      {showForm && activeTab === 'goals' && <SavingsGoalForm onSave={() => { setShowForm(false); loadData(); }} symbol={symbol} />}

      {!showForm && (
        <div className="space-y-4">
          {activeTab === 'transactions' && <TransactionsList data={transactions} onRefresh={loadData} formatAmount={formatAmount} />}
          {activeTab === 'goals' && <SavingsGoalsList data={savingsGoals} onRefresh={loadData} formatAmount={formatAmount} />}
        </div>
      )}
    </div>
  );
}

function TransactionForm({ onSave, symbol }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: 'groceries',
    subcategory: '',
    type: 'expense',
    is_shared: false,
    notes: ''
  });

  const categories = {
    expense: ['Groceries', 'Rent', 'Transportation', 'Entertainment', 'Healthcare', 'Shopping', 'Utilities', 'Pet Care', 'Other'],
    income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other']
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('/api/budget/transactions', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSave();
    } catch (error) {
      alert('Failed to save transaction');
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Add Transaction</h2>
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
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              className="input"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value, category: '' })}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Amount ({symbol})</label>
            <input
              type="number"
              step="0.01"
              className="input"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              className="input"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="">Select category</option>
              {categories[formData.type].map(cat => (
                <option key={cat} value={cat.toLowerCase()}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            className="input"
            rows="2"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Optional description..."
          />
        </div>
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_shared}
              onChange={(e) => setFormData({ ...formData, is_shared: e.target.checked })}
            />
            <span className="text-sm">Shared expense (split with sister)</span>
          </label>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary">Save Transaction</button>
          <button type="button" onClick={onSave} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}

function SavingsGoalForm({ onSave, symbol }) {
  const [formData, setFormData] = useState({
    name: '',
    target_amount: '',
    current_amount: '0',
    deadline: '',
    priority: '1'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('/api/budget/savings-goals', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSave();
    } catch (error) {
      alert('Failed to create savings goal');
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Create Savings Goal</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Goal Name</label>
          <input
            type="text"
            className="input"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Portugal Move Fund"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Target Amount ({symbol})</label>
            <input
              type="number"
              step="0.01"
              className="input"
              value={formData.target_amount}
              onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Current Amount ({symbol})</label>
            <input
              type="number"
              step="0.01"
              className="input"
              value={formData.current_amount}
              onChange={(e) => setFormData({ ...formData, current_amount: e.target.value })}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Deadline</label>
            <input
              type="date"
              className="input"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select
              className="input"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="1">High</option>
              <option value="2">Medium</option>
              <option value="3">Low</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary">Create Goal</button>
          <button type="button" onClick={onSave} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}

function TransactionsList({ data, onRefresh, formatAmount }) {
  const deleteTransaction = async (id) => {
    if (!confirm('Delete this transaction?')) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/budget/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onRefresh();
    } catch (error) {
      alert('Failed to delete');
    }
  };

  if (!data.length) return <div className="card text-center text-gray-500">No transactions yet. Add your first one!</div>;

  return (
    <div className="space-y-2">
      {data.map((txn) => (
        <div key={txn.id} className="card flex justify-between items-center">
          <div>
            <p className="font-medium capitalize">{txn.category}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(txn.date).toLocaleDateString()}
              {txn.is_shared && <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded">Shared</span>}
            </p>
            {txn.notes && <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{txn.notes}</p>}
          </div>
          <div className="flex items-center gap-3">
            <p className={`text-lg font-bold ${txn.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {txn.type === 'income' ? '+' : '-'}{formatAmount(txn.amount)}
            </p>
            <button
              onClick={() => deleteTransaction(txn.id)}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function SavingsGoalsList({ data, onRefresh, formatAmount }) {
  const [updating, setUpdating] = useState(null);
  const [amount, setAmount] = useState('');

  const updateGoal = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(`/api/budget/savings-goals/${id}`, {
        current_amount: amount
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUpdating(null);
      setAmount('');
      onRefresh();
    } catch (error) {
      alert('Failed to update');
    }
  };

  if (!data.length) return <div className="card text-center text-gray-500">No savings goals yet. Create your first one!</div>;

  return (
    <div className="space-y-4">
      {data.map((goal) => {
        const progress = (parseFloat(goal.current_amount) / parseFloat(goal.target_amount)) * 100;
        const remaining = parseFloat(goal.target_amount) - parseFloat(goal.current_amount);

        return (
          <div key={goal.id} className="card">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-bold text-lg">{goal.name}</p>
                {goal.deadline && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Target: {new Date(goal.deadline).toLocaleDateString()}
                  </p>
                )}
              </div>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {formatAmount(goal.current_amount)}
              </p>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
              <div
                className="bg-primary-600 h-4 rounded-full transition-all"
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm">
              <span>{progress.toFixed(1)}% complete</span>
              <span className="text-gray-600 dark:text-gray-400">{formatAmount(remaining)} to go</span>
            </div>
            
            {updating === goal.id ? (
              <div className="mt-3 flex gap-2">
                <input
                  type="number"
                  className="input flex-1"
                  placeholder="New amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  autoFocus
                />
                <button onClick={() => updateGoal(goal.id)} className="btn-primary">Save</button>
                <button onClick={() => { setUpdating(null); setAmount(''); }} className="btn-secondary">Cancel</button>
              </div>
            ) : (
              <button
                onClick={() => { setUpdating(goal.id); setAmount(goal.current_amount); }}
                className="mt-3 btn-primary w-full"
              >
                Update Amount
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}