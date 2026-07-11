import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import TeamMembers from './pages/TeamMembers';
import WorkRequests from './pages/WorkRequests';
import Resources from './pages/Resources';
import Statistics from './pages/Statistics';
import Profile from './pages/Profile';
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route 
      path="/members" element={
      <ProtectedRoute>
        <TeamMembers />
        </ProtectedRoute>
      } />

      <Route path="/requests" element={<ProtectedRoute><WorkRequests /></ProtectedRoute>} />

      <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
      

    <Route path='/statistics' element={<ProtectedRoute><Statistics /></ProtectedRoute>} />  
    <Route path="/profile" element={
  <ProtectedRoute>
    <Profile />
  </ProtectedRoute>
} />
    
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;