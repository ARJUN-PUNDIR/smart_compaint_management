import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Home, PlusCircle } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <h2 style={{ margin: 0, color: 'var(--primary)', letterSpacing: '-1px' }}>SmartManager</h2>
      </div>
      
      {token && (
        <div className="nav-links">
          <Link to="/dashboard" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Home size={18} /> Dashboard
          </Link>
          <Link to="/new-complaint" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <PlusCircle size={18} /> New Complaint
          </Link>
          <span style={{ color: 'var(--text-muted)', marginLeft: '12px', borderLeft: '1px solid var(--border)', paddingLeft: '12px' }}>
            Hello, {user?.name}
          </span>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 16px', marginLeft: '12px' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
