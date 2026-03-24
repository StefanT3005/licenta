import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, CheckCircle, XCircle, Loader } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Token lipsă din link. Link-ul este invalid.');
        return;
      }

      try {
        const response = await axios.post('http://localhost:8000/api/auth/verify-email', {
          token
        });

        setStatus('success');
        setMessage(response.data.message || 'Email verificat cu succes!');
        toast.success('Email verificat cu succes!');

        // Update user in context
        if (response.data.user) {
          updateUser(response.data.user);
        }

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } catch (error) {
        console.error('Email verification error:', error);
        setStatus('error');
        setMessage(error.response?.data?.message || 'Eroare la verificarea email-ului. Link-ul poate fi expirat.');
        toast.error('Eroare la verificarea email-ului');
      }
    };

    verifyEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const handleResendEmail = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Nu ești autentificat. Te rugăm să te loghezi.');
        navigate('/login');
        return;
      }

      await axios.post(
        'http://localhost:8000/api/auth/resend-verification',
        {},
        { headers: { Authorization: `Bearer ${token}` }}
      );

      toast.success('Email retrimis! Verifică inbox-ul.');
    } catch (error) {
      console.error('Resend email error:', error);
      toast.error(error.response?.data?.message || 'Eroare la retrimierea email-ului');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          {status === 'loading' && (
            <div className="p-4 bg-blue-100 rounded-full">
              <Loader className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
          )}
          {status === 'success' && (
            <div className="p-4 bg-green-100 rounded-full">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          )}
          {status === 'error' && (
            <div className="p-4 bg-red-100 rounded-full">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          <Mail className="w-6 h-6 inline-block mr-2" />
          Verificare Email
        </h1>

        {/* Message */}
        <div className="text-center mb-6">
          {status === 'loading' && (
            <p className="text-gray-600">
              Verificăm email-ul tău...
            </p>
          )}
          {status === 'success' && (
            <div>
              <p className="text-green-600 font-semibold mb-2">{message}</p>
              <p className="text-sm text-gray-500">
                Vei fi redirecționat către dashboard în 3 secunde...
              </p>
            </div>
          )}
          {status === 'error' && (
            <div>
              <p className="text-red-600 font-semibold mb-2">{message}</p>
              <p className="text-sm text-gray-500 mb-4">
                Link-ul poate fi expirat (valabil 24h) sau invalid.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {status === 'success' && (
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition"
          >
            Mergi la Dashboard
          </button>
        )}

        {status === 'error' && (
          <div className="space-y-3">
            <button
              onClick={handleResendEmail}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
            >
              Retrimite Email de Verificare
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition"
            >
              Înapoi la Profil
            </button>
            <p className="text-xs text-center text-gray-500">
              Poți retrimi email-ul de verificare din pagina de profil.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;