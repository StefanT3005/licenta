import { useState, useEffect } from 'react';
import { Plus, Target, TrendingUp, Calendar, DollarSign, Trash2, X, AlertCircle, CheckCircle, ArrowRight, ArrowLeft, Info, GraduationCap, Home, ShoppingBag, Clock, TrendingUpIcon, Briefcase, FileText } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [step, setStep] = useState(1);
  const [userPreferences, setUserPreferences] = useState(null);
  const [showContributionModal, setShowContributionModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [contribution, setContribution] = useState({ amount: '', note: '' });

  const [formData, setFormData] = useState({
    category: '',
    name: '',
    goal_amount: '',
    initial_savings: 0,
    payment_method: '',
    monthly_savings: '',
    with_investments: false,
    credit_down_payment: '',
    credit_interest_rate: 6.5,
    credit_term_years: 25
  });

  const [calculations, setCalculations] = useState({
    monthsWithout: 0,
    yearsWithout: 0,
    remainingMonthsWithout: 0,
    monthsWith: 0,
    yearsWith: 0,
    remainingMonthsWith: 0,
    totalInvested: 0,
    investmentGain: 0,
    returnRate: 0,
    creditMonthly: 0,
    creditTotal: 0,
    creditInterest: 0,
    minimumIncome: 0,
    monthsForDownPayment: 0
  });

  useEffect(() => {
    fetchPlans();
    fetchPreferences();
  }, []);

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/plans', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlans(response.data);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Eroare la încărcarea planurilor');
    } finally {
      setLoading(false);
    }
  };

  const fetchPreferences = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/preferences', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserPreferences(response.data);
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  useEffect(() => {
    if (formData.goal_amount && formData.monthly_savings) {
      calculateAll();
    }
  }, [formData.goal_amount, formData.monthly_savings, formData.initial_savings, 
      formData.payment_method, formData.credit_down_payment, formData.credit_interest_rate, 
      formData.credit_term_years, formData.with_investments]);

  const calculateAll = () => {
    const goal = parseFloat(formData.goal_amount) || 0;
    const monthly = parseFloat(formData.monthly_savings) || 0;
    const initial = parseFloat(formData.initial_savings) || 0;

    if (monthly === 0) return;

    // Calcul fără investiții - simplu
    const remaining = goal - initial;
    const monthsWithout = Math.ceil(remaining / monthly);
    const yearsWithout = Math.floor(monthsWithout / 12);
    const remainingMonthsWithout = monthsWithout % 12;

    let calc = {
      monthsWithout,
      yearsWithout,
      remainingMonthsWithout,
      monthsWith: 0,
      yearsWith: 0,
      remainingMonthsWith: 0,
      totalInvested: 0,
      investmentGain: 0,
      returnRate: 0
    };

    // Calcul CU investiții - FORMULA CORECTĂ
    if (formData.with_investments && userPreferences) {
      let annualReturn = 7;
      if (userPreferences.risk_level === 'low') annualReturn = 5;
      if (userPreferences.risk_level === 'medium') annualReturn = 7;
      if (userPreferences.risk_level === 'high') annualReturn = 12;
      const monthlyRate = annualReturn / 12 / 100;
      
      let monthsWith;
      
      if (monthlyRate === 0) {
        monthsWith = monthsWithout;
      } else if (initial === 0) {
        // Fără suma inițială - formula simplă
        monthsWith = Math.ceil(Math.log(1 + (goal * monthlyRate) / monthly) / Math.log(1 + monthlyRate));
      } else {
        // Cu suma inițială - Newton-Raphson pentru FV = PV(1+r)^n + PMT × [(1+r)^n - 1] / r
        let n = 1;
        const maxIterations = 100;
        const tolerance = 0.01;
        
        for (let i = 0; i < maxIterations; i++) {
          const onePlusR = 1 + monthlyRate;
          const onePlusRn = Math.pow(onePlusR, n);
          
          // f(n) = PV(1+r)^n + PMT × [(1+r)^n - 1] / r - FV
          const f = initial * onePlusRn + 
                    monthly * (onePlusRn - 1) / monthlyRate - 
                    goal;
          
          // f'(n) = derivata
          const ln1r = Math.log(onePlusR);
          const df = initial * ln1r * onePlusRn + 
                     monthly * ln1r * onePlusRn / monthlyRate;
          
          // Newton-Raphson: n_next = n - f(n) / f'(n)
          const nNext = n - f / df;
          
          if (Math.abs(nNext - n) < tolerance) {
            monthsWith = Math.ceil(nNext);
            break;
          }
          
          n = nNext;
          if (n < 0) n = 1;
        }
        
        if (!monthsWith) monthsWith = Math.ceil(n);
      }

      const yearsWith = Math.floor(monthsWith / 12);
      const remainingMonthsWith = monthsWith % 12;

      // Future Value CORECT - include suma inițială
      const onePlusRn = Math.pow(1 + monthlyRate, monthsWith);
      const futureValueFromInitial = initial * onePlusRn;
      const futureValueFromPayments = monthly * (onePlusRn - 1) / monthlyRate;
      const futureValue = futureValueFromInitial + futureValueFromPayments;
      
      const totalInvested = initial + (monthly * monthsWith);
      const investmentGain = Math.max(0, futureValue - goal);

      calc = {
        ...calc,
        monthsWith,
        yearsWith,
        remainingMonthsWith,
        totalInvested: Math.round(totalInvested),
        investmentGain: Math.round(investmentGain),
        returnRate: annualReturn
      };
    }

    // Calcul Credit
    if (formData.payment_method === 'savings_plus_credit' && formData.credit_down_payment) {
      const downPayment = parseFloat(formData.credit_down_payment) || 0;
      const creditAmount = goal - downPayment;
      const rate = parseFloat(formData.credit_interest_rate) || 6.5;
      const years = parseFloat(formData.credit_term_years) || 25;

      const monthlyRate = rate / 12 / 100;
      const months = years * 12;

      let creditMonthly = 0;
      if (monthlyRate === 0) {
        creditMonthly = creditAmount / months;
      } else {
        const onePlusRn = Math.pow(1 + monthlyRate, months);
        creditMonthly = creditAmount * (monthlyRate * onePlusRn) / (onePlusRn - 1);
      }

      const creditTotal = creditMonthly * months;
      const creditInterest = creditTotal - creditAmount;
      const minimumIncome = creditMonthly / 0.4;

      const monthsForDownPayment = monthly > 0 ? Math.ceil((downPayment - initial) / monthly) : 0;

      calc = {
        ...calc,
        creditMonthly: Math.round(creditMonthly),
        creditTotal: Math.round(creditTotal),
        creditInterest: Math.round(creditInterest),
        minimumIncome: Math.round(minimumIncome),
        monthsForDownPayment
      };
    }

    setCalculations(calc);
  };

  const formatTime = (years, months) => {
    const parts = [];
    if (years > 0) {
      parts.push(`${years} ${years === 1 ? 'an' : 'ani'}`);
    }
    if (months > 0) {
      parts.push(`${months} ${months === 1 ? 'lună' : 'luni'}`);
    }
    return parts.join(' ') || '0 luni';
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const nextStep = () => {
    if (step === 1 && (!formData.category || !formData.name)) {
      toast.error('Completează categoria și numele planului');
      return;
    }
    if (step === 1 && plans.some(p => p.name.toLowerCase() === formData.name.toLowerCase())) {
    toast.error('Exista deja un plan cu acest nume'); return;
    }
    if (step === 2 && !formData.goal_amount) {
      toast.error('Introdu suma necesară');
      return;
    }
    if (step === 3 && !formData.payment_method) {
      toast.error('Selectează modalitatea de plată');
      return;
    }
    if (step === 4) {
      if (formData.payment_method === 'full_savings' && !formData.monthly_savings) {
        toast.error('Introdu economiile lunare');
        return;
      }
      if (formData.payment_method === 'savings_plus_credit') {
        const downPayment = parseFloat(formData.credit_down_payment) || 0;
        const goal = parseFloat(formData.goal_amount) || 0;
        const minimum = goal * 0.25;
        
        if (downPayment < minimum) {
          toast.error(`Avansul minim este $${minimum.toLocaleString()} (25% din obiectiv)`);
          return;
        }
      }
    }
    
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleCreatePlan = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8000/api/plans', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Plan creat cu succes');
      setPlans([response.data, ...plans]);
      setShowWizard(false);
      resetForm();
    } catch (error) {
      console.error('Error creating plan:', error);
      toast.error(error.response?.data?.message || 'Eroare la crearea planului');
    }
  };

  const resetForm = () => {
    setFormData({
      category: '',
      name: '',
      goal_amount: '',
      initial_savings: 0,
      payment_method: '',
      monthly_savings: '',
      with_investments: false,
      credit_down_payment: '',
      credit_interest_rate: 6.5,
      credit_term_years: 25
    });
    setStep(1);
    setCalculations({});
  };

  const handleAddContribution = async () => {
    if (!contribution.amount || contribution.amount <= 0) {
      toast.error('Introdu o sumă validă');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:8000/api/plans/${selectedPlan._id}/contribute`,
        { amount: parseFloat(contribution.amount), note: contribution.note },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      toast.success('Contribuție adăugată');
      setPlans(plans.map(p => p._id === selectedPlan._id ? response.data : p));
      setShowContributionModal(false);
      setContribution({ amount: '', note: '' });
    } catch (error) {
      console.error('Error adding contribution:', error);
      toast.error('Eroare la adăugarea contribuției');
    }
  };

  const handleDeletePlan = async (id) => {
    if (!window.confirm('Sigur vrei să ștergi acest plan?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/plans/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Plan șters');
      setPlans(plans.filter(p => p._id !== id));
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast.error('Eroare la ștergerea planului');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  // Professional category icons instead of emojis
  const getCategoryIcon = (category) => {
    const icons = {
      'Studii': GraduationCap,
      'Locuință': Home,
      'Bunuri Diverse': ShoppingBag
    };
    return icons[category] || Target;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Studii': 'text-blue-600',
      'Locuință': 'text-green-600',
      'Bunuri Diverse': 'text-purple-600'
    };
    return colors[category] || 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Planurile Mele</h1>
          <p className="text-gray-600">Creează și urmărește-ți obiectivele financiare</p>
        </div>
        <button
          onClick={() => setShowWizard(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Plan Nou
        </button>
      </div>

      {/* Plans List */}
      {plans.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Niciun plan creat încă</h3>
          <p className="text-gray-600 mb-6">Începe să-ți planifici obiectivele financiare</p>
          <button
            onClick={() => setShowWizard(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
          >
            <Plus className="w-5 h-5" />
            Creează Primul Plan
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map(plan => {
            const CategoryIcon = getCategoryIcon(plan.category);
            const iconColor = getCategoryColor(plan.category);
            
            return (
              <div key={plan._id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 bg-gray-50 rounded-lg ${iconColor}`}>
                      <CategoryIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{plan.name}</h3>
                      <p className="text-sm text-gray-600">{plan.category}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeletePlan(plan._id)}
                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Progres</span>
                    <span className="font-semibold text-gray-900">{plan.progress_percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(plan.progress_percentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-gray-900">{formatCurrency(plan.current_amount)}</span>
                    <span className="text-gray-600">
                        din {plan.payment_method === 'savings_plus_credit'
                        ? formatCurrency((plan.credit_total_payment || 0) + (plan.credit_down_payment || 0))
                        : formatCurrency(plan.goal_amount || 0)
                        }
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2 text-sm mb-4">
                  {plan.payment_method === 'full_savings' && (
                    <>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Economii lunare</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(plan.monthly_savings)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Strategie</span>
                        <span className={`font-semibold ${plan.with_investments ? 'text-green-600' : 'text-gray-900'}`}>
                            {plan.with_investments ? 'Cu investitii' : 'Fara investitii'}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Timp estimat</span>
                        <span className="font-semibold text-gray-900">
                            {plan.with_investments
                                ? formatTime(Math.floor(plan.months_with_investments / 12), plan.months_with_investments % 12)
                                : formatTime(Math.floor(plan.months_without_investments / 12), plan.months_without_investments % 12)
                            }
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">
                            {plan.with_investments ? 'Castig estimat' : 'Ramas de economisit'}
                        </span>
                        <span className={`font-semibold ${plan.with_investments ? 'text-green-600' : 'text-gray-900'}`}>
                            {plan.with_investments
                                ? `+${formatCurrency(plan.investment_gain)}`
                                : formatCurrency(plan.goal_amount - (plan.current_amount || 0))
                            }
                        </span>
                    </div>
                    </>
                  )}
                  {plan.payment_method === 'savings_plus_credit' && (
                    <>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Avans</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(plan.credit_down_payment)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Rata lunara credit</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(plan.credit_monthly_payment)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Total platit bancii</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(plan.credit_total_payment)}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                        <span className="text-gray-700 font-bold">Cost total obiectiv</span>
                        <span className="font-bold text-red-600">
                            {formatCurrency((plan.credit_total_payment || 0) + (plan.credit_down_payment || 0))}
                        </span>
                    </div>
                    </>
                  )}
                </div>

                {/* Actions */}
                <button
                  onClick={() => {
                    setSelectedPlan(plan);
                    setShowContributionModal(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
                >
                  <Plus className="w-4 h-4" />
                  Adaugă Contribuție
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Contribution Modal */}
      {showContributionModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Adaugă Contribuție</h3>
              <button
                onClick={() => setShowContributionModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-gray-600">Plan: <span className="font-semibold text-gray-900">{selectedPlan.name}</span></p>
              <p className="text-sm text-gray-600">Progres actual: <span className="font-semibold text-gray-900">{selectedPlan.progress_percentage.toFixed(1)}%</span></p>
              <p className="text-sm text-gray-600 mt-2">
                {formatCurrency(selectedPlan.current_amount)} din {formatCurrency(selectedPlan.goal_amount)}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Sumă ($)</label>
                <input
                  type="number"
                  value={contribution.amount}
                  onChange={(e) => setContribution({ ...contribution, amount: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  placeholder="0.00"
                />
                {contribution.amount > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    Nou progres: {Math.min(((selectedPlan.current_amount + parseFloat(contribution.amount)) / selectedPlan.goal_amount * 100), 100).toFixed(1)}%
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Notă (opțional)</label>
                <input
                  type="text"
                  value={contribution.note}
                  onChange={(e) => setContribution({ ...contribution, note: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Salariu ianuarie"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowContributionModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
                >
                  Anulează
                </button>
                <button
                  onClick={handleAddContribution}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
                >
                  Adaugă
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Plan Wizard - FIXED SCROLL */}
      {showWizard && (
        <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
          <div className="min-h-screen flex items-center justify-center p-4 py-8">
            <div className="bg-white rounded-2xl p-8 max-w-4xl w-full shadow-2xl my-8">
              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  {[
                    { num: 1, label: 'Obiectiv' },
                    { num: 2, label: 'Sumă' },
                    { num: 3, label: 'Modalitate' },
                    { num: 4, label: 'Detalii' },
                    { num: 5, label: 'Review' }
                  ].map((item, idx) => (
                    <div key={item.num} className="flex items-center flex-1">
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div 
                          className={`flex items-center justify-center rounded-full font-bold text-lg transition-all duration-300 mb-3 ${
                            item.num === step 
                              ? 'bg-blue-600 text-white ring-4 ring-blue-100 scale-110' 
                              : item.num < step 
                                ? 'bg-green-600 text-white' 
                                : 'bg-gray-200 text-gray-600'
                          }`}
                          style={{ width: '48px', height: '48px' }}
                        >
                          {item.num < step ? <CheckCircle className="w-6 h-6" /> : item.num}
                        </div>
                        <span className={`text-xs font-medium text-center whitespace-nowrap ${
                          step >= item.num ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {item.label}
                        </span>
                      </div>
                      {idx < 4 && (
                        <div className={`flex-1 h-1 mx-2 transition-colors duration-300 ${
                          item.num < step ? 'bg-green-600' : 'bg-gray-200'
                        }`} style={{ marginBottom: '32px' }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 1: Obiectiv */}
              {step === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Selectează Obiectivul</h2>
                    <p className="text-gray-600">Pentru ce planifici să economisești?</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Categorie</label>
                    <div className="grid grid-cols-3 gap-4">
                      {['Studii', 'Locuință', 'Bunuri Diverse'].map(cat => {
                        const CategoryIcon = getCategoryIcon(cat);
                        const iconColor = getCategoryColor(cat);
                        
                        return (
                          <button
                            key={cat}
                            onClick={() => setFormData({ ...formData, category: cat })}
                            className={`p-6 border-2 rounded-xl font-semibold transition-all duration-300 ${
                              formData.category === cat
                                ? 'border-blue-600 bg-blue-50 text-blue-600 scale-105 shadow-lg'
                                : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                            }`}
                          >
                            <div className={`flex justify-center mb-3 ${formData.category === cat ? iconColor : 'text-gray-400'}`}>
                              <CategoryIcon className="w-12 h-12" />
                            </div>
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Nume Plan</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                      placeholder="Ex: Avans apartament, Master abroad, Mașină nouă"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Ai deja economii pentru acest obiectiv?</label>
                    <input
                      type="number"
                      name="initial_savings"
                      value={formData.initial_savings}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Sumă Necesară */}
              {step === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Sumă Necesară</h2>
                    <p className="text-gray-600">Cât costă obiectivul tău?</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Suma Țintă ($)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                      <input
                        type="number"
                        name="goal_amount"
                        value={formData.goal_amount}
                        onChange={handleInputChange}
                        className="w-full pl-14 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-3xl font-bold"
                        placeholder="50,000"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Modalitate Plată */}
              {step === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Cum vei finanta obiectivul?</h2>
                    <p className="text-gray-600">Alege modalitatea de plată</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <button
                      onClick={() => setFormData({ ...formData, payment_method: 'full_savings' })}
                      className={`p-8 border-2 rounded-2xl text-left transition-all duration-300 ${
                        formData.payment_method === 'full_savings'
                          ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 scale-105 shadow-xl'
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-lg'
                      }`}
                    >
                      <DollarSign className={`w-12 h-12 mb-4 ${
                        formData.payment_method === 'full_savings' ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <h3 className="font-bold text-xl text-gray-900 mb-2">Sursă Proprie Integrală</h3>
                      <p className="text-sm text-gray-600">Economisești complet din surse proprii, cu sau fără investiții</p>
                    </button>

                    <button
                      onClick={() => setFormData({ ...formData, payment_method: 'savings_plus_credit' })}
                      className={`p-8 border-2 rounded-2xl text-left transition-all duration-300 ${
                        formData.payment_method === 'savings_plus_credit'
                          ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 scale-105 shadow-xl'
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-lg'
                      }`}
                    >
                      <TrendingUp className={`w-12 h-12 mb-4 ${
                        formData.payment_method === 'savings_plus_credit' ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <h3 className="font-bold text-xl text-gray-900 mb-2">Sursă Proprie + Credit</h3>
                      <p className="text-sm text-gray-600">Combină economii cu credit bancar (minim 25% avans)</p>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Detalii Plată - Full Savings */}
              {step === 4 && formData.payment_method === 'full_savings' && (
                <div className="space-y-6 animate-fadeIn max-h-[60vh] overflow-y-auto pr-2">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Detalii Economisire</h2>
                    <p className="text-gray-600">Cât poți economisi lunar?</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Economii Lunare ($)</label>
                    <input
                      type="number"
                      name="monthly_savings"
                      value={formData.monthly_savings}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl font-bold"
                      placeholder="500"
                    />
                    {userPreferences && userPreferences.budget_monthly && formData.monthly_savings > 0 && (
                      <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                        <Info className="w-4 h-4" />
                        {((parseFloat(formData.monthly_savings) / userPreferences.budget_monthly) * 100).toFixed(1)}% din bugetul tău lunar
                      </p>
                    )}
                  </div>

                  {userPreferences && (
                    <div>
                      <label className="flex items-center gap-4 p-6 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all">
                        <input
                          type="checkbox"
                          name="with_investments"
                          checked={formData.with_investments}
                          onChange={handleInputChange}
                          className="w-6 h-6 text-blue-600 rounded"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <TrendingUpIcon className="w-5 h-5 text-blue-600" />
                            <p className="font-semibold text-gray-900 text-lg">Investește economiile</p>
                          </div>
                          <p className="text-sm text-gray-600">Folosește strategia din preferințe pentru randament mai mare (risc {userPreferences.risk_tolerance})</p>
                        </div>
                      </label>
                    </div>
                  )}

                  {/* Comparison */}
                  {calculations.monthsWithout > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-gray-700" />
                        <h3 className="font-bold text-lg text-gray-900">Comparație Strategii</h3>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                        {/* Without Investments */}
                        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 rounded-2xl">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                            <h4 className="font-bold text-gray-900 text-lg">Fără Investiții</h4>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600 flex items-center gap-1">
                                <Clock className="w-4 h-4" /> Timp necesar:
                              </span>
                              <span className="font-bold text-gray-900 text-lg">
                                {formatTime(calculations.yearsWithout, calculations.remainingMonthsWithout)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600 flex items-center gap-1">
                                <DollarSign className="w-4 h-4" /> Total economisit:
                              </span>
                              <span className="font-semibold text-gray-900">
                                {formatCurrency(formData.goal_amount - formData.initial_savings)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600 flex items-center gap-1">
                                <TrendingUpIcon className="w-4 h-4" /> Câștig investiții:
                              </span>
                              <span className="font-semibold text-gray-600">$0</span>
                            </div>
                          </div>
                        </div>

                        {/* With Investments */}
                        {formData.with_investments && calculations.monthsWith > 0 && (
                          <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-400 rounded-2xl shadow-lg">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                              <h4 className="font-bold text-gray-900 text-lg">Cu Investiții ({calculations.returnRate}% anual)</h4>
                            </div>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-700 flex items-center gap-1">
                                  <Clock className="w-4 h-4" /> Timp necesar:
                                </span>
                                <span className="font-bold text-green-700 text-lg">
                                  {formatTime(calculations.yearsWith, calculations.remainingMonthsWith)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-700 flex items-center gap-1">
                                  <DollarSign className="w-4 h-4" /> Total investit:
                                </span>
                                <span className="font-semibold text-gray-900">
                                  {formatCurrency(calculations.totalInvested)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-700 flex items-center gap-1">
                                  <TrendingUpIcon className="w-4 h-4" /> Câștig investiții:
                                </span>
                                <span className="font-bold text-green-600 text-lg">
                                  +{formatCurrency(calculations.investmentGain)}
                                </span>
                              </div>
                            </div>
                            <div className="mt-4 pt-4 border-t-2 border-green-300">
                              <div className="flex items-center gap-2 text-green-700">
                                <CheckCircle className="w-5 h-5" />
                                <span className="font-bold text-lg">
                                  Economisești {calculations.monthsWithout - calculations.monthsWith} luni
                                  ({formatTime(Math.floor((calculations.monthsWithout - calculations.monthsWith) / 12), (calculations.monthsWithout - calculations.monthsWith) % 12)})
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {formData.with_investments && calculations.monthsWith > 0 && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2">
                          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">
                            <strong>Recomandare:</strong> Cu investiții, atingi obiectivul cu <strong>{formatCurrency(calculations.investmentGain)}</strong> profit suplimentar 
                            și economisești <strong>{formatTime(Math.floor((calculations.monthsWithout - calculations.monthsWith) / 12), (calculations.monthsWithout - calculations.monthsWith) % 12)}</strong> 
                            ({(((calculations.monthsWithout - calculations.monthsWith) / calculations.monthsWithout) * 100).toFixed(1)}% mai rapid)
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Credit Details */}
              {step === 4 && formData.payment_method === 'savings_plus_credit' && (
                <div className="space-y-6 animate-fadeIn max-h-[60vh] overflow-y-auto pr-2">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Detalii Credit Bancar</h2>
                    <p className="text-gray-600">Configurează creditul și avansul</p>
                  </div>

                  <div className="p-5 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300 rounded-xl">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-6 h-6 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Avans Minim 25%</p>
                        <p className="text-sm text-gray-700">
                          Pentru obiectivul de {formatCurrency(formData.goal_amount)}, avansul minim este{' '}
                          <span className="font-bold text-gray-900">{formatCurrency(formData.goal_amount * 0.25)}</span> (25%)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Avans ($)</label>
                    <input
                      type="number"
                      name="credit_down_payment"
                      value={formData.credit_down_payment}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Minim ${(formData.goal_amount * 0.25).toFixed(0)}`}
                    />
                    {formData.credit_down_payment > 0 && (
                      <p className="text-sm text-gray-600 mt-2">
                        {((parseFloat(formData.credit_down_payment) / formData.goal_amount) * 100).toFixed(1)}% din obiectiv
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Economii Lunare pentru Avans ($)</label>
                    <input
                      type="number"
                      name="monthly_savings"
                      value={formData.monthly_savings}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="500"
                    />
                    {calculations.monthsForDownPayment > 0 && formData.monthly_savings > 0 && (
                      <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Timp pentru economisirea avansului: {formatTime(Math.floor(calculations.monthsForDownPayment / 12), calculations.monthsForDownPayment % 12)}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Dobândă Anuală (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        name="credit_interest_rate"
                        value={formData.credit_interest_rate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Perioadă Credit</label>
                      <select
                        name="credit_term_years"
                        value={formData.credit_term_years}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="5">5 ani</option>
                        <option value="10">10 ani</option>
                        <option value="15">15 ani</option>
                        <option value="20">20 ani</option>
                        <option value="25">25 ani</option>
                        <option value="30">30 ani</option>
                      </select>
                    </div>
                  </div>

                  {/* Credit Summary */}
                  {calculations.creditMonthly > 0 && (
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Briefcase className="w-6 h-6 text-blue-600" />
                        <h4 className="font-bold text-xl text-gray-900">Calculator Credit</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="p-4 bg-white rounded-xl">
                          <p className="text-sm text-gray-600 mb-1">Sumă credit</p>
                          <p className="font-bold text-gray-900 text-lg">
                            {formatCurrency(formData.goal_amount - formData.credit_down_payment)}
                          </p>
                        </div>
                        <div className="p-4 bg-white rounded-xl">
                          <p className="text-sm text-gray-600 mb-1">Rată lunară</p>
                          <p className="font-bold text-blue-600 text-2xl">
                            {formatCurrency(calculations.creditMonthly)}
                          </p>
                        </div>
                        <div className="p-4 bg-white rounded-xl">
                          <p className="text-sm text-gray-600 mb-1">Total de plătit bancii</p>
                          <p className="font-bold text-gray-900 text-lg">
                            {formatCurrency(calculations.creditTotal)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Credit + dobândă ({formData.credit_term_years} ani)</p>
                        </div>
                        <div className="p-4 bg-white rounded-xl">
                          <p className="text-sm text-gray-600 mb-1">Dobândă totală</p>
                          <p className="font-bold text-red-600 text-lg">
                            {formatCurrency(calculations.creditInterest)}
                          </p>
                        </div>
                      </div>
                      <div className="pt-4 border-t-2 border-blue-200">
                        <p className="text-sm text-gray-700 mb-2 flex items-center gap-1">
                          <Briefcase className="w-4 h-4" /> Venit minim necesar (rata ≤ 40% din venit):
                        </p>
                        <p className="font-bold text-gray-900 text-2xl">
                          {formatCurrency(calculations.minimumIncome)}<span className="text-lg font-normal text-gray-600">/lună</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 5: Review */}
              {step === 5 && (
                <div className="space-y-6 animate-fadeIn max-h-[60vh] overflow-y-auto pr-2">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      <h2 className="text-3xl font-bold text-gray-900">Revizuire Plan</h2>
                    </div>
                    <p className="text-gray-600">Verifică detaliile înainte de creare</p>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-gray-200 rounded-2xl p-8 space-y-6">
                    <div className="flex items-center gap-4 pb-6 border-b-2 border-gray-200">
                      {(() => {
                        const CategoryIcon = getCategoryIcon(formData.category);
                        const iconColor = getCategoryColor(formData.category);
                        return (
                          <div className={`p-4 bg-white rounded-xl ${iconColor}`}>
                            <CategoryIcon className="w-12 h-12" />
                          </div>
                        );
                      })()}
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">Obiectiv</p>
                        <p className="text-2xl font-bold text-gray-900">{formData.name}</p>
                        <p className="text-sm text-gray-600">{formData.category}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="p-4 bg-white rounded-xl">
                        <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                          <Target className="w-4 h-4" /> Sumă țintă
                        </p>
                        <p className="font-bold text-gray-900 text-xl">{formatCurrency(formData.goal_amount)}</p>
                      </div>
                      <div className="p-4 bg-white rounded-xl">
                        <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                          <DollarSign className="w-4 h-4" /> Economii existente
                        </p>
                        <p className="font-bold text-gray-900 text-xl">{formatCurrency(formData.initial_savings)}</p>
                      </div>
                    </div>

                    <div className="p-6 bg-white rounded-xl space-y-4">
                      <h4 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                        <FileText className="w-5 h-5" /> Modalitate plată
                      </h4>
                      
                      {formData.payment_method === 'full_savings' && (
                        <>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">Economii lunare</span>
                            <span className="font-semibold text-gray-900">{formatCurrency(formData.monthly_savings)}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">Strategie</span>
                            <span className="font-semibold text-gray-900">
                              {formData.with_investments ? `Cu investiții (${calculations.returnRate}% anual)` : 'Fără investiții'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-gray-600">Timp estimat</span>
                            <span className="font-bold text-blue-600 text-lg">
                              {formData.with_investments 
                                ? formatTime(calculations.yearsWith, calculations.remainingMonthsWith)
                                : formatTime(calculations.yearsWithout, calculations.remainingMonthsWithout)
                              }
                            </span>
                          </div>
                          {formData.with_investments && (
                            <div className="p-3 bg-green-50 rounded-lg flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <p className="text-sm text-green-700">
                                Câștig estimat din investiții: <strong>{formatCurrency(calculations.investmentGain)}</strong>
                              </p>
                            </div>
                          )}
                        </>
                      )}

                      {formData.payment_method === 'savings_plus_credit' && (
                        <>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">Avans</span>
                            <span className="font-semibold text-gray-900">{formatCurrency(formData.credit_down_payment)}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">Credit</span>
                            <span className="font-semibold text-gray-900">
                              {formatCurrency(formData.goal_amount - formData.credit_down_payment)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">Rată lunară credit</span>
                            <span className="font-bold text-blue-600 text-lg">{formatCurrency(calculations.creditMonthly)}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">Total de plătit bancii</span>
                            <span className="font-semibold text-gray-900">{formatCurrency(calculations.creditTotal)}</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-gray-600 font-semibold">Cost total obiectiv</span>
                            <span className="font-bold text-purple-600 text-lg">{formatCurrency(calculations.creditTotal + parseFloat(formData.credit_down_payment))}</span>
                          </div>
                          <div className="p-3 bg-red-50 rounded-lg flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <p className="text-sm text-red-700">
                              Dobândă totală: <strong>{formatCurrency(calculations.creditInterest)}</strong>
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t-2 border-gray-200">
                <button
                  onClick={() => {
                    if (step === 1) {
                      setShowWizard(false);
                      resetForm();
                    } else {
                      prevStep();
                    }
                  }}
                  className="flex items-center gap-2 px-6 py-3 text-gray-700 font-semibold hover:bg-gray-100 rounded-xl transition"
                >
                  <ArrowLeft className="w-5 h-5" />
                  {step === 1 ? 'Anulează' : 'Înapoi'}
                </button>

                {step < 5 ? (
                  <button
                    onClick={nextStep}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition shadow-lg"
                  >
                    Continuă
                    <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleCreatePlan}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition shadow-lg"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Creează Plan
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Plans;