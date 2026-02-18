import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Target, Shield, Trash2, Loader } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verifică dacă user e admin
    if (!user?.is_admin) {
      toast.error('Acces interzis');
      navigate('/dashboard');
      return;
    }

    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Fetch users (trebuie creat endpoint în backend)
      // const usersResponse = await axios.get('http://localhost:8000/api/admin/users', {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      // Pentru acum, mock data
      const mockUsers = [
        {
          _id: '1',
          name: 'Test User',
          email: 'test@example.com',
          is_admin: false,
          createdAt: new Date().toISOString()
        }
      ];
      
      const mockStats = {
        totalUsers: 150,
        activePlans: 342,
        totalInvested: 1250000,
        avgBudget: 650
      };
      
      setUsers(mockUsers);
      setStats(mockStats);
    } catch (error) {
      console.error('Fetch admin data error:', error);
      toast.error('Eroare la încărcarea datelor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Sigur vrei să ștergi acest utilizator?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      // await axios.delete(`http://localhost:8000/api/admin/users/${userId}`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      toast.success('Utilizator șters');
      fetchData();
    } catch (error) {
      console.error('Delete user error:', error);
      toast.error('Eroare la ștergerea utilizatorului');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          <p className="text-gray-600">Gestionează utilizatorii și vizualizează statistici</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-blue-500" />
                <span className="text-sm font-medium text-gray-500">Total Utilizatori</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <Target className="w-8 h-8 text-green-500" />
                <span className="text-sm font-medium text-gray-500">Planuri Active</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.activePlans}</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8 text-purple-500" />
                <span className="text-sm font-medium text-gray-500">Total Investit</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                ${(stats.totalInvested / 1000).toFixed(0)}K
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8 text-indigo-500" />
                <span className="text-sm font-medium text-gray-500">Buget Mediu</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">${stats.avgBudget}</p>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Utilizatori Înregistrați</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nume
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Înregistrării
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acțiuni
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{u.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{u.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        u.is_admin 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {u.is_admin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString('ro-RO')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {!u.is_admin && (
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="text-red-600 hover:text-red-900 inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Șterge
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notice */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            ⚠️ <strong>Notă:</strong> Acest panel necesită implementarea endpoint-urilor admin în backend 
            (<code>/api/admin/users</code>, <code>/api/admin/stats</code>). 
            Momentan afișează date mock pentru demonstrație.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Admin;