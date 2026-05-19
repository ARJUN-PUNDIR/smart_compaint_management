import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Bot, MapPin, Tag } from 'lucide-react';

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const token = localStorage.getItem('token');
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${API_URL}/api/complaints/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setComplaint(res.data);
        setStatus(res.data.status);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [id]);

  const handleUpdateStatus = async () => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.put(`${API_URL}/api/complaints/${id}`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComplaint(res.data);
      alert('Status updated successfully!');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}><div className="loader" style={{ display: 'inline-block' }}/></div>;
  if (!complaint) return <div style={{ textAlign: 'center', marginTop: '50px' }}><h3>Complaint not found</h3></div>;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={() => navigate('/dashboard')} className="btn btn-secondary" style={{ marginBottom: '24px', padding: '8px 16px' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <h1>{complaint.title}</h1>
          <span className={`badge badge-${status.toLowerCase().replace(' ', '-')}`} style={{ fontSize: '1rem', padding: '8px 16px' }}>
            {complaint.status}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '24px', color: 'var(--text-muted)', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} /> {complaint.location}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Tag size={16} /> {complaint.category}</span>
          <span>By: {complaint.name} ({complaint.email})</span>
          <span>Created: {new Date(complaint.createdAt).toLocaleDateString()}</span>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ color: 'var(--text-muted)' }}>Description</h3>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>{complaint.description}</p>
        </div>

        {/* AI Information Section */}
        {complaint.aiPriority ? (
          <div style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid var(--primary)', borderRadius: '12px', padding: '24px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Bot color="var(--primary)" />
              <h3 style={{ margin: 0, color: 'var(--primary)' }}>AI Analysis</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>Department</p>
                <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{complaint.aiDepartment}</p>
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>Priority</p>
                <span className={`badge badge-${complaint.aiPriority.toLowerCase() === 'high' ? 'high' : 'pending'}`}>
                  {complaint.aiPriority}
                </span>
              </div>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>AI Summary</p>
              <p>{complaint.aiSummary}</p>
            </div>
            
            <div>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>Suggested Auto-Response</p>
              <p style={{ fontStyle: 'italic', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>"{complaint.aiResponse}"</p>
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: '32px' }}>
             <Link to={`/complaint/${id}/analysis`} className="btn btn-primary" style={{ display: 'inline-flex' }}>
               <Bot size={18} /> Run AI Analysis
             </Link>
          </div>
        )}

        {/* Admin Controls */}
        {isAdmin && (
          <div style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid var(--warning)', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', color: 'var(--warning)' }}>Admin Controls</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px' }}>
              <div className="form-group" style={{ margin: 0, flex: 1 }}>
                <label>Update Status</label>
                <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <button className="btn btn-secondary" onClick={handleUpdateStatus} disabled={updating} style={{ background: 'var(--warning)', color: '#000' }}>
                {updating ? <span className="loader" style={{ borderColor: '#000', borderTopColor: 'transparent' }} /> : 'Update Status'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintDetail;
