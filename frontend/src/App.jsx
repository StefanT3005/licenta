import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";
import LandingPage from "./Pages/LandingPage/LandingPage";
import SignUp from "./Pages/Auth/SignUp";
import Login from "./Pages/Auth/Login";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Plans from "./Pages/Plans/Plans";
import Profile from "./Pages/Profile/Profile";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Preferences from './Pages/Preferences/Preferences';
import News from './Pages/News/News';
import Admin from './Pages/Admin/Admin';
import VerifyEmail from './Pages/VerifyEmail/VerifyEmail';

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} /> 

          <Route 
            path="/preferences" 
            element={
              <ProtectedRoute>
                <Preferences />
              </ProtectedRoute>
            } 
          />

          <Route path="/" element={<ProtectedRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="plans" element={<Plans />} />
            <Route path="profile" element={<Profile />} />
            <Route path="news" element={<News />} />
            <Route path="admin" element={<Admin />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </div>
  );
};

export default App;