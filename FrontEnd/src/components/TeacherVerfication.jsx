import React, { useState } from 'react';
import { CheckCircle, Clock, XCircle, Eye, ExternalLink } from 'lucide-react';

const TeacherVerification = () => {
  const [selectedApplication, setSelectedApplication] = useState(null);

  const applications = [
    {
      id: 1,
      name: 'Dr. Ahmed Hassan',
      email: 'ahmed.hassan@example.com',
      subject: 'Computer Science',
      experience: '8 years',
      status: 'pending',
      submissionDate: '2024-01-15',
      documents: ['CV.pdf', 'Degree.pdf', 'Certificate.pdf'],
      faydaId: 'FYD-2024-001',
      faydaStatus: 'verified'
    },
    {
      id: 2,
      name: 'Prof. Maya Al-Rashid',
      email: 'maya.rashid@example.com',
      subject: 'Mathematics',
      experience: '12 years',
      status: 'pending',
      submissionDate: '2024-01-18',
      documents: ['Resume.pdf', 'PhD.pdf', 'References.pdf'],
      faydaId: 'FYD-2024-002',
      faydaStatus: 'pending'
    },
    {
      id: 3,
      name: 'Dr. Omar Khalil',
      email: 'omar.khalil@example.com',
      subject: 'Physics',
      experience: '6 years',
      status: 'approved',
      submissionDate: '2024-01-20',
      documents: ['CV.pdf', 'Masters.pdf', 'Teaching_Cert.pdf'],
      faydaId: 'FYD-2024-003',
      faydaStatus: 'verified'
    },
    {
      id: 4,
      name: 'Dr. Layla Mansour',
      email: 'layla.mansour@example.com',
      subject: 'Biology',
      experience: '10 years',
      status: 'rejected',
      submissionDate: '2024-01-12',
      documents: ['Profile.pdf', 'Credentials.pdf'],
      faydaId: 'FYD-2024-004',
      faydaStatus: 'failed'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'pending': return '#f59e0b';
      default: return '#64748b';
    }
  };

  const getFaydaStatusColor = (status) => {
    switch (status) {
      case 'verified': return '#10b981';
      case 'failed': return '#ef4444';
      case 'pending': return '#f59e0b';
      default: return '#64748b';
    }
  };

  const handleApprove = (id) => {
    console.log('Approving application:', id);
  };

  const handleReject = (id) => {
    console.log('Rejecting application:', id);
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
          Teacher Verification
        </h1>
        <p style={{ color: '#64748b', fontSize: '16px' }}>
          Review and verify teacher applications with Fayda integration
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid-4" style={{ marginBottom: '32px' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '12px', backgroundColor: '#fef3c7', borderRadius: '12px' }}>
              <Clock size={24} color="#f59e0b" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', color: '#64748b', marginBottom: '4px' }}>Pending Reviews</h3>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b' }}>23</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '12px', backgroundColor: '#dcfce7', borderRadius: '12px' }}>
              <CheckCircle size={24} color="#10b981" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', color: '#64748b', marginBottom: '4px' }}>Approved</h3>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>156</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '12px', backgroundColor: '#fee2e2', borderRadius: '12px' }}>
              <XCircle size={24} color="#ef4444" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', color: '#64748b', marginBottom: '4px' }}>Rejected</h3>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#ef4444' }}>18</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '12px', backgroundColor: '#e0f2fe', borderRadius: '12px' }}>
              <ExternalLink size={24} color="#2563eb" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', color: '#64748b', marginBottom: '4px' }}>Fayda Verified</h3>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#2563eb' }}>142</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-1">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600' }}>
              Teacher Applications
            </h3>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-secondary">Export Data</button>
              <button className="btn-primary">Bulk Actions</button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Teacher Info</th>
                  <th>Subject</th>
                  <th>Experience</th>
                  <th>Fayda Status</th>
                  <th>Application Status</th>
                  <th>Submission Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.id}>
                    <td>
                      <div>
                        <p style={{ fontWeight: '600' }}>{app.name}</p>
                        <p style={{ fontSize: '14px', color: '#64748b' }}>{app.email}</p>
                        <p style={{ fontSize: '12px', color: '#94a3b8' }}>ID: {app.faydaId}</p>
                      </div>
                    </td>
                    <td>
                      <span style={{ 
                        backgroundColor: '#e0f2fe', 
                        color: '#0369a1',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {app.subject}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: '600' }}>{app.experience}</span>
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: `${getFaydaStatusColor(app.faydaStatus)}20`,
                        color: getFaydaStatusColor(app.faydaStatus)
                      }}>
                        {app.faydaStatus === 'verified' && <CheckCircle size={12} />}
                        {app.faydaStatus === 'pending' && <Clock size={12} />}
                        {app.faydaStatus === 'failed' && <XCircle size={12} />}
                        {app.faydaStatus}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: `${getStatusColor(app.status)}20`,
                        color: getStatusColor(app.status)
                      }}>
                        {app.status === 'approved' && <CheckCircle size={12} />}
                        {app.status === 'pending' && <Clock size={12} />}
                        {app.status === 'rejected' && <XCircle size={12} />}
                        {app.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '14px', color: '#64748b' }}>
                      {app.submissionDate}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                          onClick={() => setSelectedApplication(app)}
                        >
                          <Eye size={14} />
                          Review
                        </button>
                        {app.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(app.id)}
                              style={{
                                backgroundColor: '#10b981',
                                color: 'white',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                cursor: 'pointer'
                              }}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(app.id)}
                              className="btn-danger"
                              style={{ padding: '6px 12px', fontSize: '12px' }}
                            >
                              Reject
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
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
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
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Application Review</h2>
              <button
                onClick={() => setSelectedApplication(null)}
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
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                Teacher Information
              </h3>
              <div className="grid-2">
                <div>
                  <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Name</p>
                  <p style={{ fontWeight: '600' }}>{selectedApplication.name}</p>
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Email</p>
                  <p style={{ fontWeight: '600' }}>{selectedApplication.email}</p>
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Subject</p>
                  <p style={{ fontWeight: '600' }}>{selectedApplication.subject}</p>
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Experience</p>
                  <p style={{ fontWeight: '600' }}>{selectedApplication.experience}</p>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                Fayda Verification
              </h3>
              <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontWeight: '600' }}>Fayda ID:</span>
                  <span>{selectedApplication.faydaId}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: '600' }}>Status:</span>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    backgroundColor: `${getFaydaStatusColor(selectedApplication.faydaStatus)}20`,
                    color: getFaydaStatusColor(selectedApplication.faydaStatus)
                  }}>
                    {selectedApplication.faydaStatus}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                Documents
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedApplication.documents.map((doc, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px'
                  }}>
                    <span>{doc}</span>
                    <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                className="btn-secondary"
                onClick={() => setSelectedApplication(null)}
              >
                Close
              </button>
              {selectedApplication.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      handleReject(selectedApplication.id);
                      setSelectedApplication(null);
                    }}
                    className="btn-danger"
                  >
                    Reject Application
                  </button>
                  <button
                    onClick={() => {
                      handleApprove(selectedApplication.id);
                      setSelectedApplication(null);
                    }}
                    className="btn-primary"
                  >
                    Approve Application
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

export default TeacherVerification;