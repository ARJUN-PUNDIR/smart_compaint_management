import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NewComplaint = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', title: '', description: '', category: 'General', location: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/complaints', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Navigate to analysis page automatically
      navigate(`/complaint/${res.data._id}/analysis`);
    } catch (err) {
      console.error(err);
      alert('Failed to register complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1>Register New Complaint</h1>
      <div className="glass-card" style={{ marginTop: '24px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" className="form-control" required 
                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" className="form-control" required 
                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
          </div>
          
          <div className="form-group">
            <label>Complaint Title</label>
            <input type="text" className="form-control" required 
              value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          </div>
          
          <div className="form-group">
            <label>Description (Be detailed for better AI Analysis)</label>
            <textarea className="form-control" rows="4" required 
              value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label>Category</label>
              <select className="form-control" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                <option value="General">General</option>
                <option value="Water">Water</option>
                <option value="Electricity">Electricity</option>
                <option value="Sanitation">Sanitation</option>
                <option value="Roads">Roads</option>
              </select>
            </div>
            <div className="form-group">
              <label>Location</label>
              <input type="text" className="form-control" required 
                value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="loader" /> : 'Submit & Analyze'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewComplaint;
