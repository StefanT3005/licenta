import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, User, TrendingUp, FileText, LogOut } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Planuri', path: '/plans', icon: FileText },
    { name: 'Profil', path: '/profile', icon: User },
    { name: 'Știri', path: '/news', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar - STICKY cu Z-INDEX mare */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
                <img src="/src/assets/logo.png" alt="Logo" className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-gray-900">TS FinVest</span>
            </Link>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Bun venit, <strong className="text-gray-900">{user?.name}</strong>
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Ieșire
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content with Sidebar */}
      <div className="flex">
        {/* Sidebar - STICKY cu Z-INDEX */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)] sticky top-16 z-40 shadow-sm">
          <div className="p-4">
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-900 font-semibold shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content - Z-INDEX mai mic */}
        <main className="flex-1 relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;