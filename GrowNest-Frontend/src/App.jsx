import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';

// Layouts
import DashboardLayout from './layouts/DashboardLayout.jsx';

// Public pages
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import AddChild from './pages/AddChild.jsx';
// Dashboard pages
import Dashboard from './pages/Dashboard.jsx';
import ChildProfile from './pages/ChildProfile.jsx';
import Nutrition from './pages/Nutrition.jsx';
import Vaccination from './pages/Vaccination.jsx';
import AIAssistant from './pages/AIAssistant.jsx';
import Activities from './pages/Activities.jsx';
import Community from './pages/Community.jsx';
import MedicalRecords from './pages/MedicalRecords.jsx';
import Settings from './pages/Settings.jsx';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/onboarding" element={<AddChild />} />

          {/* Dashboard routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/child-profile" element={<ChildProfile />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/vaccination" element={<Vaccination />} />
            <Route path="/assistant" element={<AIAssistant />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/community" element={<Community />} />
            <Route path="/medical-records" element={<MedicalRecords />} />
            <Route path="/settings" element={<Settings />} />

          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
