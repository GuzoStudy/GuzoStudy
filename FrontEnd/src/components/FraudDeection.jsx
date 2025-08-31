import React, { useState } from 'react';
import { AlertTriangle, Shield, Eye, X, Check, Search } from 'lucide-react';

const FraudDetection = () => {
  const [selectedAlert, setSelectedAlert] = useState(null);

  const fraudAlerts = [
    {
      id: 1,
      type: 'fake_course',
      title: 'Suspicious Course Content Detected',
      description: 'Course "Quick Money Making Secrets" contains plagiarized content',
      severity: 'high',
      instructor: 'John Doe',
      courseId: 'CRS-2024-089',
      detectedAt: '2024-01-26 09:15',
      status: 'pending',
      aiConfidence: 94,
      details: {
        reason: 'Content matches existing copyrighted material',
        sources: ['Course ID: CRS-2023-045', 'External URL: example.com'],
        flaggedSections: ['Module 1: Introduction', 'Module 3: Advanced Techniques']
      }
    },
    {
      id: 2,
      type: 'plagiarism',
      title: 'Plagiarism in Assignment Submission',
      description: 'Student Alex Johnson submitted copied assignment',
      severity: 'medium',
      student: 'Alex Johnson',
      courseId: 'CRS-2024-012',
      detectedAt: '2024-01-26 11:30',
      status: 'pending',
      aiConfidence: 89,
      details: {
        reason: 'Text similarity score: 92%',
        sources: ['Previous submission by Emma Davis', 'Online source: stackoverflow.com'],
        flaggedContent: 'Entire code solution matches existing work'
      }
    },
    {
      id: 3,
      type: 'scam_account',
      title: 'Suspicious Account Activity',
      description: 'Multiple accounts created from same IP with fake credentials',
      severity: 'high',
      instructor: 'Maria Garcia',
      detectedAt: '2024-01-25 16:45',
      status: 'investigated',
      aiConfidence: 96,
      details: {
        reason: 'Pattern matching suspicious behavior',
        evidence: ['5 accounts from IP 192.168.1.1', 'Similar email patterns', 'Fake profile images'],
        relatedAccounts: ['fake.teacher1@email.com', 'fake.teacher2@email.com']
      }
    },
    {
      id: 4,
      type: 'fake_course',
      title: 'Low Quality Course Upload',
      description: 'Course content appears to be auto-generated or extremely low quality',
      severity: 'medium',
      instructor: 'Robert Smith',
      courseId: 'CRS-2024-156',
      detectedAt: '2024-01-25 14:20',
      status: 'resolved',
      aiConfidence: 78,
      details: {
        reason: 'AI-generated content detected, poor grammar, no original insights',
        issues: ['Repetitive content', 'No practical examples', 'Generic information'],
        recommendation: 'Course removed from platform'
      }
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#64748b';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'fake_course': return '📚';
      case 'plagiarism': return '📄';
      case 'scam_account': return '👤';
      default: return '⚠️';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'investigated': return '#2563eb';
      case 'resolved': return '#10b981';
      default: return '#64748b';
    }
  };

  const handleResolve = (id) => {
    console.log('Resolving alert:', id);
  };

  const handleDismiss = (id) => {
    console.log('Dismissing alert:', id);
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
          AI Fraud Detection
        </h1>
        <p style={{ color: '#64748b', fontSize: '16px' }}>
          Monitor and manage fraud alerts using AI-powered detection systems
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid-4" style={{ marginBottom: '32px' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '12px', backgroundColor: '#fee2e2', borderRadius: '12px' }}>
              <AlertTriangle size={24} color="#ef4444" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', color: '#64748b', marginBottom: '4px' }}>Active Alerts</h3>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#ef4444' }}>12</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '12px', backgroundColor: '#dcfce7', borderRadius: '12px' }}>
              <Shield size={24} color="#10b981" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', color: '#64748b', marginBottom: '4px' }}>Blocked Accounts</h3>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>47</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '12px', backgroundColor: '#fef3c7', borderRadius: '12px' }}>
              <Eye size={24} color="#f59e0b" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', color: '#64748b', marginBottom: '4px' }}>Under Review</h3>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b' }}>8</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '12px', backgroundColor: '#dbeafe', borderRadius: '12px' }}>
              <Shield size={24} color="#2563eb" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', color: '#64748b', marginBottom: '4px' }}>AI Accuracy</h3>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#2563eb' }}>94.2%</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Detection Overview */}
      <div className="card" style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
          Detection Categories
        </h3>
        <div className="grid-3">
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📚</div>
            <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Fake Courses</h4>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '12px' }}>
              AI detects low-quality, plagiarized, or fraudulent course content
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '20px', fontWeight: '700', color: '#ef4444' }}>5</span>
                <p style={{ fontSize: '12px', color: '#64748b' }}>Detected</p>
              </div>
              <div>
                <span style={{ fontSize: '20px', fontWeight: '700', color: '#10b981' }}>3</span>
                <p style={{ fontSize: '12px', color: '#64748b' }}>Resolved</p>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📄</div>
            <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Plagiarism</h4>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '12px' }}>
              Advanced algorithms identify copied assignments and content
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '20px', fontWeight: '700', color: '#ef4444' }}>4</span>
                <p style={{ fontSize: '12px', color: '#64748b' }}>Detected</p>
              </div>
              <div>
                <span style={{ fontSize: '20px', fontWeight: '700', color: '#10b981' }}>7</span>
                <p style={{ fontSize: '12px', color: '#64748b' }}>Resolved</p>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>👤</div>
            <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Scam Accounts</h4>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '12px' }}>
              Pattern recognition identifies fake accounts and suspicious behavior
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '20px', fontWeight: '700', color: '#ef4444' }}>3</span>
                <p style={{ fontSize: '12px', color: '#64748b' }}>Detected</p>
              </div>
              <div>
                <span style={{ fontSize: '20px', fontWeight: '700', color: '#10b981' }}>12</span>
                <p style={{ fontSize: '12px', color: '#64748b' }}>Blocked</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fraud Alerts Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600' }}>
            Recent Fraud Alerts
          </h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-secondary">Configure AI</button>
            <button className="btn-primary">Generate Report</button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Alert Details</th>
                <th>Severity</th>
                <th>AI Confidence</th>
                <th>Status</th>
                <th>Detected</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fraudAlerts.map(alert => (
                <tr key={alert.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '20px' }}>{getTypeIcon(alert.type)}</span>
                      <span style={{ 
                        backgroundColor: '#f1f5f9', 
                        color: '#475569',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {alert.type.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <p style={{ fontWeight: '600', marginBottom: '4px' }}>{alert.title}</p>
                      <p style={{ fontSize: '14px', color: '#64748b' }}>{alert.description}</p>
                      {alert.instructor && (
                        <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                          Instructor: {alert.instructor}
                        </p>
                      )}
                      {alert.student && (
                        <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                          Student: {alert.student}
                        </p>
                      )}
                    </div>
                  </td>
                  <td>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: `${getSeverityColor(alert.severity)}20`,
                      color: getSeverityColor(alert.severity)
                    }}>
                      {alert.severity}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '60px',
                        height: '8px',
                        backgroundColor: '#e2e8f0',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${alert.aiConfidence}%`,
                          height: '100%',
                          backgroundColor: alert.aiConfidence > 80 ? '#10b981' : '#f59e0b'
                        }} />
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: '600' }}>
                        {alert.aiConfidence}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: `${getStatusColor(alert.status)}20`,
                      color: getStatusColor(alert.status)
                    }}>
                      {alert.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '14px', color: '#64748b' }}>
                    {new Date(alert.detectedAt).toLocaleString()}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                        onClick={() => setSelectedAlert(alert)}
                      >
                        <Eye size={14} />
                        Details
                      </button>
                      {alert.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleResolve(alert.id)}
                            style={{
                              backgroundColor: '#10b981',
                              color: 'white',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Check size={12} />
                            Resolve
                          </button>
                          <button
                            onClick={() => handleDismiss(alert.id)}
                            className="btn-danger"
                            style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <X size={12} />
                            Dismiss
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '700px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Fraud Alert Details</h2>
              <button
                onClick={() => setSelectedAlert(null)}
                style={{ 
                  border: 'none', 
                  backgroundColor: 'transparent', 
                  fontSize: '24px', 
                  cursor: 'pointer' 
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span style={{ fontSize: '32px' }}>{getTypeIcon(selectedAlert.type)}</span>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600' }}>{selectedAlert.title}</h3>
                  <p style={{ color: '#64748b' }}>{selectedAlert.description}</p>
                </div>
              </div>

              <div className="grid-3" style={{ marginBottom: '24px' }}>
                <div>
                  <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Severity</p>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    backgroundColor: `${getSeverityColor(selectedAlert.severity)}20`,
                    color: getSeverityColor(selectedAlert.severity)
                  }}>
                    {selectedAlert.severity}
                  </span>
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>AI Confidence</p>
                  <span style={{ fontSize: '18px', fontWeight: '700', color: '#10b981' }}>
                    {selectedAlert.aiConfidence}%
                  </span>
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Status</p>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    backgroundColor: `${getStatusColor(selectedAlert.status)}20`,
                    color: getStatusColor(selectedAlert.status)
                  }}>
                    {selectedAlert.status}
                  </span>
                </div>
              </div>

              <div style={{ 
                padding: '20px', 
                backgroundColor: '#f8fafc', 
                borderRadius: '12px',
                marginBottom: '24px'
              }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
                  Detection Details
                </h4>
                <p style={{ marginBottom: '12px' }}>
                  <strong>Reason:</strong> {selectedAlert.details.reason}
                </p>
                
                {selectedAlert.details.sources && (
                  <div style={{ marginBottom: '12px' }}>
                    <strong>Sources:</strong>
                    <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                      {selectedAlert.details.sources.map((source, index) => (
                        <li key={index} style={{ marginBottom: '4px' }}>{source}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedAlert.details.flaggedSections && (
                  <div style={{ marginBottom: '12px' }}>
                    <strong>Flagged Sections:</strong>
                    <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                      {selectedAlert.details.flaggedSections.map((section, index) => (
                        <li key={index} style={{ marginBottom: '4px' }}>{section}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedAlert.details.evidence && (
                  <div style={{ marginBottom: '12px' }}>
                    <strong>Evidence:</strong>
                    <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                      {selectedAlert.details.evidence.map((item, index) => (
                        <li key={index} style={{ marginBottom: '4px' }}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                className="btn-secondary"
                onClick={() => setSelectedAlert(null)}
              >
                Close
              </button>
              {selectedAlert.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      handleDismiss(selectedAlert.id);
                      setSelectedAlert(null);
                    }}
                    className="btn-danger"
                  >
                    Dismiss Alert
                  </button>
                  <button
                    onClick={() => {
                      handleResolve(selectedAlert.id);
                      setSelectedAlert(null);
                    }}
                    className="btn-primary"
                  >
                    Take Action
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FraudDetection;