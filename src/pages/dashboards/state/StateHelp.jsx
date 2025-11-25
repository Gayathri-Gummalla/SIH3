import React, { useState } from 'react';

const StateHelp = () => {
    const [formData, setFormData] = useState({ subject: '', message: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Support request submitted!');
        setFormData({ subject: '', message: '' });
    };

    return (
        <div className="dashboard-panel">
            <div className="section-header">
                <h2 className="section-title">Help & Support</h2>
            </div>

            <div className="dashboard-section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div>
                    <h3 className="section-title">Frequently Asked Questions</h3>
                    <div className="card" style={{ padding: 'var(--space-4)' }}>
                        <details style={{ marginBottom: 'var(--space-2)' }}>
                            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>How to release funds to a district?</summary>
                            <p style={{ marginTop: 'var(--space-2)', color: 'var(--text-secondary)' }}>Go to Fund Release panel, click "Release Funds", select district and component, and enter amount.</p>
                        </details>
                        <details style={{ marginBottom: 'var(--space-2)' }}>
                            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>How to approve district proposals?</summary>
                            <p style={{ marginTop: 'var(--space-2)', color: 'var(--text-secondary)' }}>Navigate to Approve District Proposals, review pending proposals, and click Approve or Reject.</p>
                        </details>
                        <details>
                            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>How to upload Utilization Certificates?</summary>
                            <p style={{ marginTop: 'var(--space-2)', color: 'var(--text-secondary)' }}>Go to Upload Utilisation Certificates, select district and year, and upload the signed PDF.</p>
                        </details>
                    </div>
                </div>

                <div>
                    <h3 className="section-title">Contact Support</h3>
                    <div className="card" style={{ padding: 'var(--space-4)' }}>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Subject</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Message</label>
                                <textarea
                                    className="form-input"
                                    rows="5"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary">Submit Request</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StateHelp;
