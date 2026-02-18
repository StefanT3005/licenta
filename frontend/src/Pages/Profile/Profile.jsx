import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { User, Mail, Lock, Save, X, CheckCircle2, Shield, Bell, Trash2, TrendingUp, Wallet, Target } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    setLoading(true);

    // Validare
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error('Parolele nu coincid');
      setLoading(false);
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 8) {
      toast.error('Parola trebuie să conțină cel puțin 8 caractere');
      setLoading(false);
      return;
    }

    try {
      // Request la backend pentru update
      const res = await axios.put('http://localhost:8000/api/auth/profile', {
        name: formData.name,
        email: formData.email,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      // Update context cu datele noi
      updateUser(res.data.user);

      toast.success('Profil actualizat cu succes! 🎉');
      setIsEditing(false);
      
      // Reset password fields
      setFormData({
        name: res.data.user.name,
        email: res.data.user.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Eroare la actualizarea profilului';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    toast.error('Funcție în dezvoltare');
    setShowDeleteModal(false);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profilul Meu</h1>
          <p className="text-gray-600 mt-1">Gestionează informațiile contului tău</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Stats & Quick Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Investment Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Statistici Investiții
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Portofoliu Total</p>
                      <p className="text-2xl font-bold text-gray-900">$24,593</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-green-600 font-semibold text-sm">+12.5%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Active</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Planuri</p>
                    <p className="text-2xl font-bold text-gray-900">3</p>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <div className="flex items-center gap-3">
                    <Target className="w-10 h-10 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Profit Total</p>
                      <p className="text-xl font-bold text-green-600">+$2,847</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Acțiuni Rapide</h3>
              <div className="space-y-2">
                <button className="w-full p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">Notificări</span>
                </button>
                <button className="w-full p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">Securitate</span>
                </button>
                <button className="w-full p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">Setări Investiții</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content - Profile Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Informații Personale</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30 hover:scale-105"
                  >
                    Editează Profil
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      disabled={loading}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                      Anulează
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-blue-500/30"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Salvare...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Salvează
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nume Complet
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-50 disabled:text-gray-600 font-medium"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Adresă Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-50 disabled:text-gray-600 font-medium"
                    />
                  </div>
                </div>
              </div>

              {!isEditing && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Sfat:</strong> Pentru a modifica informațiile, apasă pe "Editează Profil".
                  </p>
                </div>
              )}
            </div>

            {/* Change Password - Only when editing */}
            {isEditing && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-600" />
                  Schimbă Parola
                </h3>
                
                <div className="space-y-5">
                  {/* Current Password */}
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                      Parola Curentă
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        placeholder="Lasă gol dacă nu schimbi parola"
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                      Parola Nouă
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="Minim 8 caractere"
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirmă Parola Nouă
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirmă noua parolă"
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                      {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
                        <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Securitate & Preferințe</h3>
              
              <div className="space-y-4">
                {/* Notifications */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Notificări Email</p>
                      <p className="text-sm text-gray-600">Primește actualizări despre portofoliul tău</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* 2FA */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Autentificare în Doi Pași</p>
                      <p className="text-sm text-gray-600">Protecție suplimentară pentru contul tău</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200">
                    Activează
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-bold text-red-600 mb-3 flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Zona de Pericol
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Odată ce ștergi contul, nu mai există cale de întoarcere. Te rog fii sigur.
                </p>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 border border-red-300 rounded-lg transition-colors"
                >
                  Șterge Contul Permanent
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Ștergere Cont</h3>
            <p className="text-gray-600 text-center mb-6">
              Ești sigur că vrei să ștergi contul? Această acțiune este permanentă și nu poate fi anulată.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
              >
                Anulează
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors"
              >
                Șterge Contul
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Profile;