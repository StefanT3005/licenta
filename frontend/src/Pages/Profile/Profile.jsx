import { useState, useEffect } from 'react';
import { User, Mail, Shield, Lock, Trash2, Edit2, Save, X, DollarSign, Target, AlertCircle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import ChangePasswordModal from './ChangePasswordModal';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  
  const [stats, setStats] = useState({
    totalPortfolio: 0,
    activePlans: 0
  });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || ''
      });
    }
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const plansRes = await axios.get('http://localhost:8000/api/plans', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const plans = plansRes.data;

      const totalPortfolio = plans.reduce((sum, plan) => {
        return sum + (plan.current_amount || plan.contributed_amount || 0);
      }, 0);

      setStats({
        totalPortfolio,
        activePlans: plans.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:8000/api/auth/update-profile',
        formData,
        { headers: { Authorization: `Bearer ${token}` }}
      );

      updateUser(response.data);
      setEditMode(false);
      toast.success('Profil actualizat cu succes!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Eroare la actualizarea profilului');
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      name: user.name,
      email: user.email
    });
    setEditMode(false);
  };

  const handleResendVerification = async () => {
    setResendingEmail(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8000/api/auth/resend-verification',
        {},
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      toast.success('Email de verificare retrimis! Verifică inbox-ul (și spam folder).');
    } catch (error) {
      console.error('Error resending verification:', error);
      toast.error(error.response?.data?.message || 'Eroare la retrimierea email-ului');
    } finally {
      setResendingEmail(false);
    }
  };

  const handleChangePassword = () => {
    setIsPasswordModalOpen(true);
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Sigur vrei să ștergi contul permanent? Această acțiune nu poate fi anulată!')) return;
    
    const confirmation = window.prompt('Scrie "ȘTERGE CONTUL" pentru a confirma:');
    if (confirmation !== 'ȘTERGE CONTUL') {
      toast.error('Confirmare eșuată');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:8000/api/auth/delete-account', {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Cont șters cu succes');
      logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Eroare la ștergerea contului');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profilul Meu</h1>
        <p className="text-gray-600">Gestionează informațiile contului tău</p>
      </div>

      {/* Email Verification Banner */}
      {!user?.emailVerified && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-yellow-800 mb-1">
                Email-ul tău nu este verificat
              </p>
              <p className="text-sm text-yellow-700 mb-3">
                Pentru siguranță, te rugăm să-ți verifici adresa de email. Am trimis un email de verificare la <strong>{user?.email}</strong>
              </p>
              <button
                onClick={handleResendVerification}
                disabled={resendingEmail}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
              >
                {resendingEmail ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Se retrimite...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Retrimite Email
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards - Only 2 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Portofoliu Total */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all">
          <div className="p-3 bg-blue-50 rounded-xl mb-4 w-fit">
            <DollarSign className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Portofoliu Total</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalPortfolio)}</p>
        </div>

        {/* Planuri Active */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all">
          <div className="p-3 bg-orange-50 rounded-xl mb-4 w-fit">
            <Target className="w-6 h-6 text-orange-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Planuri Active</p>
          <p className="text-2xl font-bold text-gray-900">{stats.activePlans}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Informații Personale */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Informații Personale</h2>
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
              >
                <Edit2 className="w-4 h-4" />
                Editează
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition"
                >
                  <X className="w-4 h-4" />
                  Anulează
                </button>
                <button
                  onClick={handleUpdateProfile}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition"
                >
                  <Save className="w-4 h-4" />
                  Salvează
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* Nume */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nume Complet
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={editMode ? formData.name : user?.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!editMode}
                  className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !editMode ? 'bg-gray-50 cursor-not-allowed' : ''
                  }`}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Adresă Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={editMode ? formData.email : user?.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!editMode}
                  className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !editMode ? 'bg-gray-50 cursor-not-allowed' : ''
                  }`}
                />
              </div>
            </div>

            {!editMode && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-sm text-gray-700">
                  <strong>Sfat:</strong> Pentru a modifica informațiile, apasă pe "Editează"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Securitate & Preferințe */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Securitate & Status</h2>

          <div className="space-y-4">
            {/* Email Verification Status */}
            <div className={`p-4 border-2 rounded-xl ${
              user?.emailVerified 
                ? 'bg-green-50 border-green-300' 
                : 'bg-yellow-50 border-yellow-300'
            }`}>
              <div className="flex items-start gap-3 mb-3">
                <div className={`p-2 rounded-lg ${
                  user?.emailVerified ? 'bg-green-100' : 'bg-yellow-100'
                }`}>
                  <Mail className={`w-5 h-5 ${
                    user?.emailVerified ? 'text-green-600' : 'text-yellow-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900">Status Email</p>
                    {user?.emailVerified ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        Verificat
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                        <XCircle className="w-3 h-3" />
                        Neverificat
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {user?.emailVerified 
                      ? 'Email-ul tău este verificat și contul este activ' 
                      : 'Te rugăm să-ți verifici email-ul pentru securitate'}
                  </p>
                </div>
              </div>
              {!user?.emailVerified && (
                <button 
                  onClick={handleResendVerification}
                  disabled={resendingEmail}
                  className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {resendingEmail ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Se retrimite...
                    </>
                  ) : (
                    'Retrimite Email de Verificare'
                  )}
                </button>
              )}
            </div>

            {/* Schimbă Parola */}
            <div className="flex items-start justify-between p-4 bg-purple-50 border border-purple-200 rounded-xl">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Lock className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 mb-1">Schimbă Parola</p>
                  <p className="text-sm text-gray-600">Actualizează parola contului</p>
                </div>
              </div>
              <button 
                onClick={handleChangePassword}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition text-sm whitespace-nowrap ml-3"
              >
                Schimbă
              </button>
            </div>

            {/* Zona de Pericol */}
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl mt-6">
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-red-900 mb-1">Zona de Pericol</p>
                  <p className="text-sm text-red-700">
                    Odată ce ștergi contul, nu mai există cale de întoarcere. Te rog fii sigur.
                  </p>
                </div>
              </div>
              <button
                onClick={handleDeleteAccount}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition"
              >
                <Trash2 className="w-4 h-4" />
                Șterge Contul Permanent
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal 
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
};

export default Profile;