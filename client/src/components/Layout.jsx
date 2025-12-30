import { Link, useLocation } from 'react-router-dom';
import { Home, Heart, Trophy, Globe, DollarSign, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Layout({ user, onLogout, children }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Health', path: '/health', icon: Heart },
    { name: 'Sports', path: '/sports', icon: Trophy },
    { name: 'Escape Plan', path: '/escape-plan', icon: Globe },
    { name: 'Budget', path: '/budget', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            PARALLAX
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Hello, {user.name}
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">
          PARALLAX
        </h1>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <nav className="px-4 py-2 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                    isActive
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
            <button
              onClick={onLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-red-600 dark:text-red-400"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
