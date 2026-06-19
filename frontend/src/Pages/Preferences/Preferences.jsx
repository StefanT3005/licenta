import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, TrendingUp, Target, Calendar, ArrowRight, Loader, Shield, Scale, Zap, Home, GraduationCap, AlertCircle, TrendingUpIcon, Info } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const Preferences = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [checkingExisting, setCheckingExisting] = useState(true);
  const [formData, setFormData] = useState({
    budget_monthly: '',
    risk_level: 'medium',
    main_goal: 'wealth',
    horizon_months: '12',
    notes: ''
  });

  useEffect(() => {
    checkExistingPreferences();
  }, []);

  const checkExistingPreferences = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('http://localhost:8000/api/preferences', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data) {
        setFormData({
          budget_monthly: response.data.budget_monthly.toString(),
          risk_level: response.data.risk_level,
          main_goal: response.data.main_goal,
          horizon_months: response.data.horizon_months.toString(),
          notes: response.data.notes || ''
        });
      }
    } catch (error) {
      console.log('No existing preferences');
    } finally {
      setCheckingExisting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.budget_monthly || parseFloat(formData.budget_monthly) <= 0) {
      toast.error('Introduceți un buget lunar valid');
      return;
    }

    if (!formData.horizon_months || parseInt(formData.horizon_months) < 1) {
      toast.error('Orizontul de timp trebuie să fie minim 1 lună');
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      await api.post(
        'http://localhost:8000/api/preferences',
        {
          budget_monthly: parseFloat(formData.budget_monthly),
          risk_level: formData.risk_level,
          main_goal: formData.main_goal,
          horizon_months: parseInt(formData.horizon_months),
          notes: formData.notes
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success('Preferințe salvate cu succes');
      navigate('/dashboard');
    } catch (error) {
      console.error('Save preferences error:', error);
      toast.error(error.response?.data?.message || 'Eroare la salvarea preferințelor');
    } finally {
      setIsLoading(false);
    }
  };

  const riskLevels = [
    { 
      value: 'low', 
      label: 'Conservator', 
      icon: Shield,
      description: 'Risc scăzut, randament stabil (până la 9% anual)',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500'
    },
    { 
      value: 'medium', 
      label: 'Echilibrat', 
      icon: Scale,
      description: 'Echilibru între risc și randament (8-11% anual)',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-500'
    },
    { 
      value: 'high', 
      label: 'Agresiv', 
      icon: Zap,
      description: 'Risc ridicat, potențial mare (peste 10% anual)',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-500'
    }
  ];

  const goals = [
    { value: 'retirement', label: 'Pensionare', icon: Home },
    { value: 'education', label: 'Educație', icon: GraduationCap },
    { value: 'home', label: 'Casă', icon: Home },
    { value: 'emergency', label: 'Fond Urgență', icon: AlertCircle },
    { value: 'wealth', label: 'Creștere Avere', icon: TrendingUpIcon },
    { value: 'other', label: 'Altele', icon: Target }
  ];

  if (checkingExisting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Setează-ți Profilul Investițional
          </h1>
          <p className="text-lg text-gray-600">
            Răspunde la câteva întrebări pentru a primi sugestii personalizate
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="flex items-center text-lg font-semibold text-gray-800 mb-3">
                <DollarSign className="w-6 h-6 mr-2 text-indigo-600" />
                Cât poți investi lunar?
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
                  $
                </span>
                <input
                  type="number"
                  name="budget_monthly"
                  value={formData.budget_monthly}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="500"
                  required
                  className="w-full pl-10 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Suma pe care o poți aloca lunar pentru investiții
              </p>
            </div>

            <div>
              <label className="flex items-center text-lg font-semibold text-gray-800 mb-3">
                <TrendingUp className="w-6 h-6 mr-2 text-indigo-600" />
                Ce nivel de risc accepți?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {riskLevels.map((risk) => {
                  const IconComponent = risk.icon;
                  return (
                    <button
                      key={risk.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, risk_level: risk.value }))}
                      className={`p-5 rounded-xl border-2 transition-all ${
                        formData.risk_level === risk.value
                          ? `${risk.borderColor} ${risk.bgColor} shadow-md`
                          : 'border-gray-200 hover:border-indigo-300 bg-white'
                      }`}
                    >
                      <div className={`flex justify-center mb-3 ${formData.risk_level === risk.value ? risk.color : 'text-gray-400'}`}>
                        <IconComponent className="w-10 h-10" />
                      </div>
                      <div className="font-bold text-gray-900 mb-2 text-base">{risk.label}</div>
                      <div className="text-xs text-gray-600 leading-relaxed">{risk.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="flex items-center text-lg font-semibold text-gray-800 mb-3">
                <Target className="w-6 h-6 mr-2 text-indigo-600" />
                Care e obiectivul tău principal?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {goals.map((goal) => {
                  const IconComponent = goal.icon;
                  return (
                    <button
                      key={goal.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, main_goal: goal.value }))}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.main_goal === goal.value
                          ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                          : 'border-gray-200 hover:border-indigo-300 bg-white'
                      }`}
                    >
                      <div className={`flex justify-center mb-2 ${
                        formData.main_goal === goal.value ? 'text-indigo-600' : 'text-gray-400'
                      }`}>
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">{goal.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="flex items-center text-lg font-semibold text-gray-800 mb-3">
                <Calendar className="w-6 h-6 mr-2 text-indigo-600" />
                Cât timp ești dispus să investești?
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  name="horizon_months"
                  value={formData.horizon_months}
                  onChange={handleChange}
                  min="1"
                  max="120"
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="text-right min-w-[100px]">
                  <div className="text-2xl font-bold text-indigo-600">
                    {formData.horizon_months}
                  </div>
                  <div className="text-sm text-gray-600">luni</div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>1 lună</span>
                <span>10 ani</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Notițe opționale
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="De ex: Vreau să învăț mai multe despre investiții..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                maxLength="500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Se salvează...
                </>
              ) : (
                <>
                  Salvează și Continuă
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-600">
          <Info className="w-4 h-4" />
          <span>Poți schimba aceste preferințe oricând din Dashboard</span>
        </div>
      </div>
    </div>
  );
};

export default Preferences;