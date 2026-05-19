import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewComplaint from './pages/NewComplaint';
import ComplaintDetail from './pages/ComplaintDetail';
import AIAnalysisResult from './pages/AIAnalysisResult';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/new-complaint" 
            element={
              <PrivateRoute>
                <NewComplaint />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/complaint/:id" 
            element={
              <PrivateRoute>
                <ComplaintDetail />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/complaint/:id/analysis" 
            element={
              <PrivateRoute>
                <AIAnalysisResult />
              </PrivateRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
