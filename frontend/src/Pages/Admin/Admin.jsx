import { useState, useEffect } from 'react';
import { 
  Users, 
  Target, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  Search, 
  Trash2, 
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, [searchTerm, sortBy, sortOrder]);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch system stats
      const statsRes = await axios.get('http://localhost:8000/api/admin/stats', { headers });
      setStats(statsRes.data);

      // Fetch users
      const usersRes = await axios.get('http://localhost:8000/api/admin/users', {
        headers,
        params: { search: searchTerm, sortBy, order: sortOrder }
      });
      setUsers(usersRes.data.users);
    } catch (error) {
      console.error('Admin data fetch error:', error);
      if (error.response?.status === 403) {
        toast.error('Acces interzis. Necesită permisiuni de administrator.');
      } else {
        toast.error('Eroare la încărcarea datelor');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/admin/users/${userToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Utilizator șters cu succes');
      setShowDeleteModal(false);
      setUserToDelete(null);
      fetchAdminData();
    } catch (error) {
      console.error('Delete user error:', error);
      toast.error(error.response?.data?.message || 'Eroare la ștergere utilizator');
    }
  };

  const handleToggleAdmin = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:8000/api/admin/users/${userId}/toggle-admin`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Status admin ${!currentStatus ? 'activat' : 'dezactivat'}`);
      fetchAdminData();
    } catch (error) {
      console.error('Toggle admin error:', error);
      toast.error(error.response?.data?.message || 'Eroare la modificare status');
    }
  };

  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          Panou Administrator
        </h1>
        <p className="text-gray-600">Gestionare utilizatori și statistici sistem</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Users */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-gray-600 text-sm font-medium">Total Utilizatori</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.users.total}</p>
            <div className="mt-2 flex items-center gap-4 text-sm">
              <span className="text-green-600">{stats.users.verified} verificați</span>
              <span className="text-gray-500">{stats.users.admins} admini</span>
            </div>
          </div>

          {/* Recent Signups */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-gray-600 text-sm font-medium">Înregistrări 7 Zile</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.users.recentSignups}</p>
            <p className="text-sm text-gray-500 mt-2">
              {stats.users.withPreferences} cu preferințe
            </p>
          </div>

          {/* Total Plans */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-gray-600 text-sm font-medium">Total Planuri</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.plans.total}</p>
            <div className="mt-2 flex items-center gap-4 text-sm">
              <span className="text-green-600">{stats.plans.active} active</span>
              <span className="text-gray-500">{stats.plans.completed} finalizate</span>
            </div>
          </div>

          {/* Financial Stats */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-gray-600 text-sm font-medium">Total Investit</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ${stats.financial.totalCurrentAmount.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              din ${stats.financial.totalGoalAmount.toLocaleString()} obiectiv
            </p>
          </div>
        </div>
      )}

      {/* Users Table Section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Utilizatori Sistem</h2>
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Caută utilizatori..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="createdAt">Data înregistrare</option>
              <option value="name">Nume</option>
              <option value="email">Email</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Utilizator</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Planuri</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Înregistrat</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      {user.is_admin && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full w-fit">
                          <Shield className="w-3 h-3" />
                          Admin
                        </span>
                      )}
                      {user.emailVerified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full w-fit">
                          <CheckCircle className="w-3 h-3" />
                          Verificat
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full w-fit">
                          <XCircle className="w-3 h-3" />
                          Neverificat
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm">
                      <p className="font-semibold text-gray-900">{user.stats.totalPlans} total</p>
                      <p className="text-gray-600">{user.stats.activePlans} active</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString('ro-RO')}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleAdmin(user._id, user.is_admin)}
                        className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
                        title={user.is_admin ? 'Revocă admin' : 'Setează admin'}
                      >
                        <Shield className={`w-4 h-4 ${user.is_admin ? 'text-purple-600' : 'text-gray-400'}`} />
                      </button>
                      <button
                        onClick={() => confirmDelete(user)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Șterge utilizator"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">Nu s-au găsit utilizatori</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Confirmare Ștergere</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Ești sigur că vrei să ștergi utilizatorul <strong>{userToDelete.name}</strong> ({userToDelete.email})?
              Această acțiune va șterge toate planurile și datele asociate și nu poate fi anulată.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserToDelete(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 font-semibold"
              >
                Anulează
              </button>
              <button
                onClick={handleDeleteUser}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
              >
                Șterge Utilizator
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;