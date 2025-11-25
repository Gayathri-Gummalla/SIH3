import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import NotificationBell from '../../components/NotificationBell';
import DashboardSidebar from '../../components/DashboardSidebar';
import { useAuth } from '../../contexts/AuthContext';

const GPDashboard = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [uploadedPhotos, setUploadedPhotos] = useState([]);

    const sidebarMenu = [
        { icon: '📊', label: 'Dashboard', path: '/dashboard' },
        { icon: '➕', label: 'Propose New Works', path: '#' },
        { icon: '📤', label: 'Upload Survey Data', path: '#' },
        { icon: '📈', label: 'Monitor Progress', path: '#' },
        { icon: '✅', label: 'Confirm Completion', path: '#' },
        { icon: '💬', label: 'Communication', path: '#' },
        { icon: '🔔', label: 'Notifications', path: '#' },
        { icon: '🚪', label: 'Logout', action: () => { logout(); navigate('/login'); } }
    ];

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        const newPhotos = files.map(file => ({
            name: file.name,
            date: new Date().toLocaleDateString(),
            location: 'Shirur GP'
        }));
        setUploadedPhotos([...uploadedPhotos, ...newPhotos]);
    };

    return (
        <div className="dashboard-layout">
            <DashboardSidebar menuItems={sidebarMenu} />

            <main className="dashboard-main">
                <div className="dashboard-header">
                    <div className="dashboard-title-section">
                        <h1>Gram Panchayat Dashboard</h1>
                        <p>Shirur Gram Panchayat - Pune District, Maharashtra</p>
                    </div>
                    <div className="dashboard-actions">
                        <NotificationBell />
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="kpi-row">
                    <StatCard icon="📝" value="12" label="Works Proposed" color="var(--color-primary)" />
                    <StatCard icon="🚧" value="8" label="Works in Progress" color="var(--color-warning)" />
                    <StatCard icon="✅" value="15" label="Works Completed" color="var(--color-success)" />
                    <StatCard icon="💰" value="₹45 L" label="Funds Received" color="var(--color-info)" />
                </div>

                {/* Project Proposal Form */}
                <div className="form-section">
                    <div className="form-section-header">
                        <h3 className="form-section-title">Propose New Work</h3>
                    </div>

                    <form>
                        <div className="form-group">
                            <label className="form-label required">Project Title</label>
                            <input type="text" className="form-control" placeholder="e.g., Community Hall Construction" />
                        </div>

                        <div className="form-group">
                            <label className="form-label required">Component</label>
                            <select className="form-control form-select">
                                <option>Select Component</option>
                                <option>Adarsh Gram</option>
                                <option>GIA (Grant-in-Aid)</option>
                                <option>Hostel</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label required">Description</label>
                            <textarea className="form-control" rows="4" placeholder="Describe the proposed work in detail"></textarea>
                        </div>

                        <div className="form-group">
                            <label className="form-label required">Estimated Cost (₹)</label>
                            <input type="number" className="form-control" placeholder="Enter estimated cost" />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Upload Documents/Photos</label>
                            <div className="upload-area" onClick={() => document.getElementById('fileInput').click()}>
                                <div className="upload-area-icon">📁</div>
                                <div className="upload-area-text">Click to upload or drag and drop</div>
                                <div className="upload-area-hint">PDF, JPG, PNG (Max 10MB)</div>
                                <input id="fileInput" type="file" multiple accept="image/*,.pdf" style={{ display: 'none' }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                            <button type="submit" className="btn btn-primary">Submit Proposal</button>
                            <button type="button" className="btn btn-outline">Save as Draft</button>
                        </div>
                    </form>
                </div>

                {/* Work Progress Tracker */}
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2 className="section-title">Ongoing Projects</h2>
                    </div>

                    <div className="work-order-card">
                        <div className="work-order-header">
                            <div>
                                <h4 className="work-order-title">Community Hall Construction</h4>
                                <div className="work-order-meta">
                                    <span>📍 Shirur Village</span>
                                    <span>🏗️ PWD</span>
                                    <span>💰 ₹50 Lakhs</span>
                                </div>
                            </div>
                            <span className="badge badge-warning">ONGOING</span>
                        </div>
                        <div className="progress-bar" style={{ marginBottom: 'var(--space-3)' }}>
                            <div className="progress-fill" style={{ width: '65%' }}></div>
                        </div>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
                            Progress: 65% • Expected Completion: June 2025
                        </p>
                        <div className="work-order-actions">
                            <button className="btn btn-primary btn-sm">View Details</button>
                            <button className="btn btn-secondary btn-sm">Upload Photos</button>
                        </div>
                    </div>

                    <div className="work-order-card">
                        <div className="work-order-header">
                            <div>
                                <h4 className="work-order-title">Water Supply System</h4>
                                <div className="work-order-meta">
                                    <span>📍 Khed Village</span>
                                    <span>🏗️ PHED</span>
                                    <span>💰 ₹85 Lakhs</span>
                                </div>
                            </div>
                            <span className="badge badge-warning">ONGOING</span>
                        </div>
                        <div className="progress-bar" style={{ marginBottom: 'var(--space-3)' }}>
                            <div className="progress-fill" style={{ width: '73%' }}></div>
                        </div>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
                            Progress: 73% • Expected Completion: March 2025
                        </p>
                        <div className="work-order-actions">
                            <button className="btn btn-primary btn-sm">View Details</button>
                            <button className="btn btn-secondary btn-sm">Upload Photos</button>
                        </div>
                    </div>
                </div>

                {/* Photo & Geo-tag Upload */}
                <div className="form-section">
                    <div className="form-section-header">
                        <h3 className="form-section-title">Upload Progress Photos</h3>
                    </div>

                    <div className="upload-area" onClick={() => document.getElementById('photoInput').click()}>
                        <div className="upload-area-icon">📷</div>
                        <div className="upload-area-text">Upload geo-tagged photos</div>
                        <div className="upload-area-hint">JPG, PNG with location data</div>
                        <input
                            id="photoInput"
                            type="file"
                            multiple
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleFileUpload}
                        />
                    </div>

                    {uploadedPhotos.length > 0 && (
                        <div className="photo-grid">
                            {uploadedPhotos.map((photo, index) => (
                                <div key={index} className="photo-item">
                                    <div className="photo-item-overlay">
                                        <div>{photo.name}</div>
                                        <div>{photo.date} • {photo.location}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Communication Panel */}
                <div className="communication-panel">
                    <h3 style={{ marginBottom: 'var(--space-4)' }}>Communication with District Admin</h3>

                    <div className="message-list">
                        <div className="message-item">
                            <div className="message-avatar">DA</div>
                            <div className="message-content">
                                <div className="message-header">
                                    <span className="message-sender">District Admin</span>
                                    <span className="message-time">2 hours ago</span>
                                </div>
                                <p className="message-text">
                                    Your proposal for Community Hall has been approved. Please proceed with the survey.
                                </p>
                            </div>
                        </div>

                        <div className="message-item">
                            <div className="message-avatar">GP</div>
                            <div className="message-content">
                                <div className="message-header">
                                    <span className="message-sender">You</span>
                                    <span className="message-time">1 day ago</span>
                                </div>
                                <p className="message-text">
                                    Submitted proposal for Community Hall construction. Estimated cost: ₹50 Lakhs.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <textarea className="form-control" rows="3" placeholder="Type your message..."></textarea>
                    </div>
                    <button className="btn btn-primary">Send Message</button>
                </div>
            </main>
        </div>
    );
};

export default GPDashboard;
