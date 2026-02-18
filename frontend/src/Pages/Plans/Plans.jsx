import { useState, useEffect } from 'react';
import { Plus, Target, TrendingUp, Calendar, Edit2, Trash2, X, CheckCircle, DollarSign } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [progressAmount, setProgressAmount] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    goal_amount: '',
    target_date: '',
    risk_level: 'medium',
    category: 'other',
    monthly_contribution: '',
    notes: ''
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8000/api/plans', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const raw = res?.data;
      const nextPlans = Array.isArray(raw?.plans) ? raw.plans : Array.isArray(raw) ? raw : [];
      setPlans(nextPlans);
    } catch (error) {
      toast.error('Eroare la încărcarea planurilor');
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedDate = new Date(formData.target_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      toast.error('Data țintă trebuie să fie în viitor! ⚠️');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      if (editingPlan) {
        await axios.put(
          `http://localhost:8000/api/plans/${editingPlan._id}`, 
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Plan actualizat cu succes! 🎉');
      } else {
        await axios.post(
          'http://localhost:8000/api/plans', 
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Plan creat cu succes! 🎉');
      }

      fetchPlans();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Eroare');
    }
  };

  // ✨ NOU - Update Progress (ADAUGĂ suma)
  const handleUpdateProgress = async (e) => {
    e.preventDefault();

    if (!progressAmount || parseFloat(progressAmount) <= 0) {
      toast.error('Introduceți o sumă validă');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      // CALCULEAZĂ noul total (cumulat)
      const newTotal = selectedPlan.current_amount + parseFloat(progressAmount);
      
      await axios.put(
        `http://localhost:8000/api/plans/${selectedPlan._id}`,
        { current_amount: newTotal },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Ai adăugat $${parseFloat(progressAmount).toLocaleString()}! 💰`);
      fetchPlans();
      closeProgressModal();
    } catch (error) {
      toast.error('Eroare la actualizarea progresului');
    }
  };

  const openProgressModal = (plan) => {
    setSelectedPlan(plan);
    setProgressAmount(''); // Start gol pentru a introduce suma DE ADĂUGAT
    setShowProgressModal(true);
  };

  const closeProgressModal = () => {
    setShowProgressModal(false);
    setSelectedPlan(null);
    setProgressAmount('');
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description || '',
      goal_amount: plan.goal_amount,
      target_date: (plan.target_date || '').split('T')[0],
      risk_level: plan.risk_level,
      category: plan.category,
      monthly_contribution: plan.monthly_contribution || '',
      notes: plan.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Ești sigur că vrei să ștergi acest plan?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/plans/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Plan șters cu succes');
      fetchPlans();
    } catch (error) {
      toast.error('Eroare la ștergerea planului');
    }
  };

  const openModal = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      description: '',
      goal_amount: '',
      target_date: '',
      risk_level: 'medium',
      category: 'other',
      monthly_contribution: '',
      notes: ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPlan(null);
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'retirement': return '🏖️';
      case 'education': return '🎓';
      case 'home': return '🏠';
      case 'emergency': return '🚨';
      case 'wealth': return '💰';
      default: return '🎯';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  const safePlans = Array.isArray(plans) ? plans : [];

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Target className="w-8 h-8 text-blue-600" />
              Planurile Mele
            </h1>
            <p className="text-gray-600 mt-1">Gestionează și monitorizează obiectivele tale financiare</p>
          </div>
          <button
            onClick={openModal}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30 hover:scale-105 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Plan Nou
          </button>
        </div>

        {safePlans.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Niciun plan creat încă</h3>
            <p className="text-gray-600 mb-6">Începe să-ți planifici viitorul financiar creând primul plan</p>
            <button
              onClick={openModal}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Creează Primul Plan
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safePlans.map((plan) => (
              <div key={plan._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getCategoryIcon(plan.category)}</span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getRiskColor(plan.risk_level)}`}>
                        {plan.risk_level === 'low' && 'Risc Scăzut'}
                        {plan.risk_level === 'medium' && 'Risc Mediu'}
                        {plan.risk_level === 'high' && 'Risc Ridicat'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(plan)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editează"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(plan._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Șterge"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {plan.description && (
                  <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                )}

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progres</span>
                    <span className="text-sm font-bold text-blue-600">{Math.round(plan.progress || 0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(100, plan.progress || 0)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Suma curentă:</span>
                    <span className="text-sm font-semibold text-gray-900">
                      ${(plan.current_amount ?? 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Obiectiv:</span>
                    <span className="text-sm font-semibold text-gray-900">
                      ${(plan.goal_amount ?? 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rămas:</span>
                    <span className="text-sm font-semibold text-orange-600">
                      ${(plan.remaining_amount ?? 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* ✨ NOU - Buton Adaugă Contribuție */}
                <button
                  onClick={() => openProgressModal(plan)}
                  className="w-full mb-3 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 border border-green-200"
                >
                  <DollarSign className="w-4 h-4" />
                  Adaugă Contribuție
                </button>

                <div className="flex items-center gap-2 text-sm text-gray-600 pt-3 border-t border-gray-100">
                  <Calendar className="w-4 h-4" />
                  <span>Termen: {plan.target_date ? new Date(plan.target_date).toLocaleDateString('ro-RO') : '-'}</span>
                </div>

                <div className="mt-3">
                  {plan.status === 'completed' && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      Completat
                    </span>
                  )}
                  {plan.status === 'active' && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      <TrendingUp className="w-3 h-3" />
                      Activ
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Create/Edit Plan */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingPlan ? 'Editează Planul' : 'Plan Nou'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nume Plan *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="ex: Pensionare anticipată"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Categorie
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="retirement">🏖️ Pensionare</option>
                    <option value="education">🎓 Educație</option>
                    <option value="home">🏠 Casă</option>
                    <option value="emergency">🚨 Urgențe</option>
                    <option value="wealth">💰 Avere</option>
                    <option value="other">🎯 Altele</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nivel Risc
                  </label>
                  <select
                    name="risk_level"
                    value={formData.risk_level}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">Scăzut</option>
                    <option value="medium">Mediu</option>
                    <option value="high">Ridicat</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Suma Țintă ($) *
                  </label>
                  <input
                    type="number"
                    name="goal_amount"
                    value={formData.goal_amount}
                    onChange={handleChange}
                    required
                    min="1"
                    placeholder="50000"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Data Țintă *
                  </label>
                  <input
                    type="date"
                    name="target_date"
                    value={formData.target_date}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contribuție Lunară ($)
                </label>
                <input
                  type="number"
                  name="monthly_contribution"
                  value={formData.monthly_contribution}
                  onChange={handleChange}
                  min="0"
                  placeholder="500"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descriere
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Detalii despre plan..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notițe
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Notițe personale..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
                >
                  Anulează
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30"
                >
                  {editingPlan ? 'Actualizează' : 'Creează Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✨ NOU - Modal Adaugă Contribuție */}
      {showProgressModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                💰 Adaugă Contribuție
              </h2>
              <button onClick={closeProgressModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Plan: <span className="font-bold">{selectedPlan.name}</span></p>
              <p className="text-sm text-gray-600">Obiectiv: <span className="font-bold">${selectedPlan.goal_amount.toLocaleString()}</span></p>
              <p className="text-sm text-gray-600">Suma curentă: <span className="font-bold text-green-600">${selectedPlan.current_amount.toLocaleString()}</span></p>
            </div>

            <form onSubmit={handleUpdateProgress} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cât vrei să adaugi? ($)
                </label>
                <input
                  type="number"
                  value={progressAmount}
                  onChange={(e) => setProgressAmount(e.target.value)}
                  required
                  min="0.01"
                  step="0.01"
                  placeholder="500"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-lg font-semibold"
                />
                <p className="text-xs text-gray-500 mt-2">
                  💡 Suma se va adăuga la suma curentă (${selectedPlan.current_amount.toLocaleString()})
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeProgressModal}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
                >
                  Anulează
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-green-500/30"
                >
                  Adaugă Suma
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Plans;