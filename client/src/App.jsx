import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Health from './pages/Health';
import Sports from './pages/Sports';
import Budget from './pages/Budget';
import EscapePlan from './pages/EscapePlan';
import { CurrencyProvider } from './contexts/CurrencyContext';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <CurrencyProvider>
      <Router>
        <Layout user={user} onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<Dashboard user={user} />} />
            <Route path="/health" element={<Health user={user} />} />
            <Route path="/sports" element={<Sports user={user} />} />
            <Route path="/budget" element={<Budget user={user} />} />
            <Route path="/escape-plan" element={<EscapePlan user={user} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </Router>
    </CurrencyProvider>
  );
}

export default App;