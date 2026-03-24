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
      const storedUser = localStorage.getItem('user'); // ← ADĂUGAT
      
      if (token) {
        try {
          // Configurează axios să includă token-ul în toate request-urile
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Dacă avem user în localStorage, folosește-l direct
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              setUser(parsedUser);
              setIsAuthenticated(true);
            } catch (parseError) {
              console.error('Error parsing stored user:', parseError);
            }
          }
          
          // Fetch user data from backend pentru refresh (opțional)
          const res = await axios.get('http://localhost:8000/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data)); // ← SALVEAZĂ
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Token invalid sau expirat:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user'); // ← ADĂUGAT
          delete axios.defaults.headers.common['Authorization'];
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

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
      
      // IMPORTANT - Salvează user object
      localStorage.setItem('user', JSON.stringify(userData)); // ← ADĂUGAT
      
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
      
      // IMPORTANT - Salvează user object
      localStorage.setItem('user', JSON.stringify(userData)); // ← ADĂUGAT
      
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
    
    // Șterge user object
    localStorage.removeItem('user'); // ← ADĂUGAT
    
    // Șterge header-ul Authorization
    delete axios.defaults.headers.common['Authorization'];

    // Reset state
    setUser(null);
    setIsAuthenticated(false);

    toast.success('Ai fost deconectat cu succes');
  };

  // Update user profile (called from Profile.jsx after successful update)
  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser)); // ← ADĂUGAT
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