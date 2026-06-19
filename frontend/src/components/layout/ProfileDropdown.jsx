import { ChevronDown, User, LogOut, Mail, LayoutDashboard, Newspaper, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from "../../context/AuthContext";

const ProfileDropdown = ({
  isOpen,
  onToggle,
  name,
  avatar,
  email,
  onLogout,
  showDashboard = true,
}) => {

  const navigate = useNavigate();
  const getInitials = (n) => {
    return n ? n.charAt(0).toUpperCase() : "U";
  };

  const { user } = useContext(AuthContext);
  
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`
          flex items-center gap-3 p-1.5 pr-3 rounded-full 
          transition-all duration-200 border border-transparent
          ${isOpen ? "bg-blue-50 border-blue-100" : "hover:bg-gray-50 hover:border-gray-200"}
        `}
      >
        {avatar ? (
          <img
            src={avatar}
            alt="Avatar"
            className="h-10 w-10 object-cover rounded-full ring-2 ring-white shadow-sm"
          />
        ) : (
          <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center ring-2 ring-white shadow-sm">
            <span className="text-white font-bold text-sm">
              {getInitials(name)}
            </span>
          </div>
        )}

        <div className="hidden sm:flex flex-col items-start text-left">
          <p className="text-sm font-semibold text-gray-800 leading-tight">
            {name}
          </p>
          <p className="text-xs text-gray-500 font-medium">Contul meu</p>
        </div>

        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-blue-600" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl ring-1 ring-black/5 z-50 overflow-hidden origin-top-right animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-5 py-4 bg-gray-50/50 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900">{name}</p>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
              <Mail className="w-3 h-3" />
              {email}
            </div>
          </div>

          <div className="p-2 space-y-1">
            {showDashboard && (
              <button
                onClick={() => {
                  navigate("/dashboard");
                  onToggle();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-colors group"
              >
                <div className="p-1.5 bg-gray-100 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors text-gray-500">
                  <LayoutDashboard size={16} />
                </div>
                Dashboard
              </button>
            )}

            <button
              onClick={() => {
                navigate("/profile");
                onToggle(); 
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-colors group"
            >
              <div className="p-1.5 bg-gray-100 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors text-gray-500">
                <User size={16} />
              </div>
              Vezi Profilul
            </button>

            <button
              onClick={() => {
                navigate("/news");
                onToggle(); 
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-colors group"
            >
              <div className="p-1.5 bg-gray-100 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors text-gray-500">
                <Newspaper size={16} />
              </div>
              Știri
            </button>
            
            {user?.is_admin && (
            <button
              onClick={() => {
                navigate("/admin");
                onToggle(); 
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-colors group"
            >
              <div className="p-1.5 bg-gray-100 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors text-gray-500">
                <Shield size={16} />
              </div>
              Admin Panel
            </button>
            )}
          
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors group"
            >
              <div className="p-1.5 bg-red-50 rounded-lg group-hover:bg-red-100 text-red-500 transition-colors">
                <LogOut size={16} />
              </div>
              Deconectare
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;