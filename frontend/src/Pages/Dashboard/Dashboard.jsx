import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Target, DollarSign, Calendar, ArrowRight, Sparkles, PieChart } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [stats, setStats] = useState({
    totalPlans: 0,
    activePlans: 0,
    totalGoalAmount: 0,
    totalCurrentAmount: 0,
    averageProgress: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch preferences
      const prefsRes = await axios.get('http://localhost:8000/api/preferences', { headers });
      setPreferences(prefsRes.data);

      // Fetch stats
      const statsRes = await axios.get('http://localhost:8000/api/plans/stats/dashboard', { headers });
      setStats(statsRes.data);

      // Fetch suggestions from backend
      if (prefsRes.data) {
        try {
          const suggestionsRes = await axios.get('http://localhost:8000/api/preferences/suggestions', { headers });
          setSuggestions(suggestionsRes.data);
        } catch (error) {
          console.error('Failed to fetch suggestions:', error);
        }
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      if (error.response?.status === 404) {
        // User doesn't have preferences yet
        setPreferences(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadge = (risk) => {
    const badges = {
      low: { color: 'bg-green-100 text-green-700 border-green-300', text: 'Conservator' },
      medium: { color: 'bg-yellow-100 text-yellow-700 border-yellow-300', text: 'Echilibrat' },
      high: { color: 'bg-red-100 text-red-700 border-red-300', text: 'Agresiv' }
    };
    return badges[risk] || badges.medium;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // User doesn't have preferences
  if (!preferences) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
            <Sparkles className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Bun venit! 👋</h2>
            <p className="text-gray-600 mb-6">Configurează-ți profilul investițional pentru a primi sugestii personalizate</p>
            <Link
              to="/preferences"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
            >
              Setează Preferințe
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const riskBadge = getRiskBadge(preferences.risk_level);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard 📊
        </h1>
        <p className="text-gray-600">Privire de ansamblu asupra investițiilor tale</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-gray-600 text-sm font-medium">Total Investit</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">${stats.totalCurrentAmount.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">din ${stats.totalGoalAmount.toLocaleString()} obiectiv</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-gray-600 text-sm font-medium">Planuri Active</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.activePlans}</p>
          <p className="text-sm text-gray-500 mt-1">din {stats.totalPlans} total</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-gray-600 text-sm font-medium">Progres Mediu</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{Math.round(stats.averageProgress)}%</p>
          <p className="text-sm text-gray-500 mt-1">către obiective</p>
        </div>
      </div>

      {/* Suggestions Section */}
      {suggestions && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Sugestii Personalizate</h2>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${riskBadge.color}`}>
              {riskBadge.text}
            </span>
          </div>

          {/* Strategy Info */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1 font-medium">Strategie Recomandată</p>
                <p className="text-lg font-bold text-gray-900">{suggestions.strategy.name}</p>
                <p className="text-sm text-gray-600 mt-1">{suggestions.strategy.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1 font-medium">Randament Estimat</p>
                <p className="text-lg font-bold text-green-600">{suggestions.strategy.expectedReturn}</p>
              </div>
            </div>
          </div>

          {/* Allocations */}
          <div className="space-y-3 mb-6">
            <p className="text-sm font-semibold text-gray-900 mb-3">Alocarea Bugetului Lunar (${preferences.budget_monthly})</p>
            {suggestions.allocations.map((allocation, index) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{allocation.emoji}</span>
                    <div>
                      <p className="text-gray-900 font-semibold">{allocation.asset}</p>
                      <p className="text-sm text-gray-600">{allocation.percentage}% din buget</p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-blue-600">${allocation.amount.toLocaleString()}/lună</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all"
                    style={{ width: `${allocation.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Financial Projection */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1 font-medium">Investiție Lunară</p>
                <p className="text-lg font-bold text-gray-900">${suggestions.financial.monthlyBudget}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1 font-medium">Orizont</p>
                <p className="text-lg font-bold text-gray-900">{suggestions.financial.horizonMonths} luni</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1 font-medium">Total Investit</p>
                <p className="text-lg font-bold text-gray-900">${suggestions.financial.totalInvested.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1 font-medium">Estimat Final</p>
                <p className="text-lg font-bold text-green-600">${suggestions.financial.estimatedFinalAmount.toLocaleString()}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-green-200">
              <p className="text-sm text-gray-600 mb-1 font-medium">Profit Estimat</p>
              <div className="flex items-center gap-3">
                <p className="text-xl font-bold text-green-600">
                  +${suggestions.financial.estimatedGain.toLocaleString()}
                </p>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                  +{suggestions.financial.estimatedGainPercentage.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm font-semibold text-gray-900 mb-2">💡 Recomandări:</p>
            <ul className="space-y-2">
              {suggestions.recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/plans"
          className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-500 hover:shadow-md transition-all group"
        >
          <Target className="w-12 h-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Planurile Mele</h3>
          <p className="text-gray-600 text-sm mb-4">Creează și gestionează-ți obiectivele financiare</p>
          <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
            Vezi planuri
            <ArrowRight className="w-5 h-5" />
          </div>
        </Link>

        <Link
          to="/preferences"
          className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-purple-500 hover:shadow-md transition-all group"
        >
          <PieChart className="w-12 h-12 text-purple-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Actualizează Preferințe</h3>
          <p className="text-gray-600 text-sm mb-4">Modifică-ți profilul investițional și sugestiile</p>
          <div className="flex items-center gap-2 text-purple-600 font-semibold group-hover:gap-3 transition-all">
            Setări
            <ArrowRight className="w-5 h-5" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;