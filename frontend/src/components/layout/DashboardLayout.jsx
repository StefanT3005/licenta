import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, User, TrendingUp, FileText, LogOut, Shield, Menu, X } from 'lucide-react';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';

const DashboardLayout = ({ children }) => {
    const location = useLocation();
    const { user, logout } = useContext(AuthContext);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Planuri', path: '/plans', icon: FileText },
        { name: 'Profil', path: '/profile', icon: User },
        { name: 'Stiri', path: '/news', icon: TrendingUp },
        ...(user?.is_admin ? [{ name: 'Admin Panel', path: '/admin', icon: Shield }] : [])
    ];

    return (
        <div className="min-h-screen bg-gray-50">

            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="px-6">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition"
                            >
                                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>

                            <Link to="/" className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
                                    <img src="/src/assets/logo.png" alt="Logo" className="w-7 h-7" />
                                </div>
                                <span className="text-xl font-bold text-gray-900">TS FinVest</span>
                            </Link>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">
                                Bun venit, <strong className="text-gray-900">{user?.name}</strong>
                            </span>
                            <button
                                onClick={logout}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Iesire
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex">
                <aside
                    className={`bg-white border-r border-gray-200 sticky top-16 z-40 shadow-sm transition-all duration-300 overflow-hidden ${
                        sidebarOpen ? 'w-64' : 'w-0'
                    }`}
                    style={{ minHeight: 'calc(100vh - 64px)' }}
                >
                    <div className="p-4 w-64">
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
                
                <main className="flex-1 relative z-10">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;