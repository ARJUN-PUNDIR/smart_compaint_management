import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Bot, CheckCircle } from 'lucide-react';

const AIAnalysisResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAndAnalyze = async () => {
      try {
        const token = localStorage.getItem('token');
        const compRes = await axios.get(`http://localhost:5000/api/complaints/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setComplaint(compRes.data);

        // If AI already analyzed, just show it
        if (compRes.data.aiPriority) {
          setAnalysis({
            priority: compRes.data.aiPriority,
            department: compRes.data.aiDepartment,
            summary: compRes.data.aiSummary,
            autoResponse: compRes.data.aiResponse
          });
          setLoading(false);
          return;
        }

        // Trigger AI Analysis
        const aiRes = await axios.post(`http://localhost:5000/api/ai/analyze`, 
          { description: compRes.data.description },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setAnalysis(aiRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAndAnalyze();
  }, [id]);

  const handleSaveToDB = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/complaints/${id}`, {
        aiPriority: analysis.priority,
        aiDepartment: analysis.department,
        aiSummary: analysis.summary,
        aiResponse: analysis.autoResponse
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate(`/complaint/${id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to save analysis');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
        <div className="loader" style={{ width: '60px', height: '60px', marginBottom: '24px' }} />
        <h2 className="animate-fade-in" style={{ color: 'var(--primary)' }}>AI is Analyzing your complaint...</h2>
        <p style={{ color: 'var(--text-muted)' }}>Extracting context, determining priority, and routing department.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Bot size={32} color="var(--primary)" />
        <h1>AI Analysis Results</h1>
      </div>
      
      <div className="glass-card" style={{ display: 'grid', gap: '20px' }}>
        <div style={{ padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
          <h4 style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.9rem' }}>Suggested Department</h4>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{analysis?.department}</p>
        </div>
        
        <div style={{ padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
          <h4 style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.9rem' }}>Determined Priority</h4>
          <span className={`badge badge-${analysis?.priority?.toLowerCase() === 'high' ? 'high' : analysis?.priority?.toLowerCase() === 'medium' ? 'pending' : 'progress'}`} style={{ fontSize: '1rem', padding: '6px 16px' }}>
            {analysis?.priority} Priority
          </span>
        </div>

        <div style={{ padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
          <h4 style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.9rem' }}>AI Summary</h4>
          <p>{analysis?.summary}</p>
        </div>

        <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', borderRadius: '8px' }}>
          <h4 style={{ color: 'var(--success)', marginBottom: '8px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={16} /> Auto-Response Generated
          </h4>
          <p style={{ fontStyle: 'italic' }}>"{analysis?.autoResponse}"</p>
        </div>

        {!complaint?.aiPriority && (
          <button onClick={handleSaveToDB} className="btn btn-primary" style={{ marginTop: '16px' }} disabled={saving}>
            {saving ? <span className="loader" /> : 'Save AI Analysis to Complaint'}
          </button>
        )}
        {complaint?.aiPriority && (
          <button onClick={() => navigate(`/complaint/${id}`)} className="btn btn-secondary" style={{ marginTop: '16px' }}>
            View Full Complaint Details
          </button>
        )}
      </div>
    </div>
  );
};

export default AIAnalysisResult;
