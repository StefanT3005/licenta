import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verifică dacă există token la încărcarea aplicației
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Configurează axios să includă token-ul în toate request-urile
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Opțional: Verifică token-ul cu backend-ul (dacă ai endpoint pentru asta)
          // const res = await axios.get('http://localhost:8000/api/auth/me');
          // setUser(res.data.user);
          
          // Sau decodează token-ul local (simplu, fără verificare)
          const userData = decodeToken(token);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Token invalid sau expirat:', error);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Funcție simplă pentru decodare JWT (fără verificare - doar pentru display)
  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:8000/api/auth/login', {
        email,
        password,
      });

      const { token, user: userData } = res.data;

      // Salvează token-ul
      localStorage.setItem('token', token);
      
      // Configurează axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Actualizează state-ul
      setUser(userData);
      setIsAuthenticated(true);

      toast.success(`Bun venit, ${userData.name}!`);
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Eroare la autentificare';
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Signup
  const signup = async (name, email, password) => {
    try {
      const res = await axios.post('http://localhost:8000/api/auth/signup', {
        name,
        email,
        password,
      });

      const { token, user: userData } = res.data;

      // Salvează token-ul
      localStorage.setItem('token', token);
      
      // Configurează axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Actualizează state-ul
      setUser(userData);
      setIsAuthenticated(true);

      toast.success(`Cont creat cu succes! Bun venit, ${userData.name}!`);
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Eroare la înregistrare';
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Logout
  const logout = () => {
    // Șterge token-ul
    localStorage.removeItem('token');
    
    // Șterge header-ul Authorization
    delete axios.defaults.headers.common['Authorization'];

    // Reset state
    setUser(null);
    setIsAuthenticated(false);

    toast.success('Ai fost deconectat cu succes');
  };

  // Update user profile (opțional - pentru viitor)
  const updateUser = (updatedData) => {
    setUser({ ...user, ...updatedData });
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook pentru a folosi AuthContext mai ușor
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};