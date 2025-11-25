import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import NotificationBell from '../../components/NotificationBell';
import DashboardSidebar from '../../components/DashboardSidebar';
import { useAuth } from '../../contexts/AuthContext';

const ContractorDashboard = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const sidebarMenu = [
        { icon: '📊', label: 'Dashboard', path: '/dashboard' },
        { icon: '📋', label: 'Assigned Works', path: '#' },
        { icon: '📈', label: 'Progress Updates', path: '#' },
        { icon: '📷', label: 'Photo Uploads', path: '#' },
        { icon: '🛠️', label: 'Material Requests', path: '#' },
        { icon: '💰', label: 'Invoice Submission', path: '#' },
        { icon: '💸', label: 'Payment Status', path: '#' },
        { icon: '🔔', label: 'Notifications', path: '#' },
        { icon: '🚪', label: 'Logout', action: () => { logout(); navigate('/login'); } }
    ];

    return (
        <div className="dashboard-layout">
            <DashboardSidebar menuItems={sidebarMenu} />

            <main className="dashboard-main">
                <div className="dashboard-header">
                    <div className="dashboard-title-section">
                        <h1>Contractor Dashboard</h1>
                        <p>ABC Construction Pvt Ltd</p>
                    </div>
                    <div className="dashboard-actions">
                        <NotificationBell />
                    </div>
                </div>

                {/* KPIs */}
                <div className="kpi-row">
                    <StatCard icon="🏗️" value="8" label="Works Assigned" color="var(--color-primary)" />
                    <StatCard icon="📈" value="65%" label="Avg Progress" color="var(--color-warning)" />
                    <StatCard icon="🛠️" value="3" label="Pending Material Requests" color="var(--color-info)" />
                    <StatCard icon="💰" value="₹25 L" label="Payments Due" color="var(--color-success)" />
                </div>

                {/* Assigned Works */}
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2 className="section-title">Assigned Works</h2>
                    </div>

                    <div className="work-order-card">
                        <div className="work-order-header">
                            <div>
                                <h4 className="work-order-title">Community Hall Construction</h4>
                                <div className="work-order-meta">
                                    <span>📍 Shirur, Pune</span>
                                    <span>💰 Contract Value: ₹50 Lakhs</span>
                                    <span>📅 Deadline: June 30, 2025</span>
                                </div>
                            </div>
                            <span className="badge badge-warning">ONGOING</span>
                        </div>
                        <div className="progress-bar" style={{ marginBottom: 'var(--space-3)' }}>
                            <div className="progress-fill" style={{ width: '65%' }}></div>
                        </div>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
                            Current Progress: 65% • Last Updated: Nov 20, 2025
                        </p>
                        <div className="work-order-actions">
                            <button className="btn btn-primary btn-sm">📈 Update Progress</button>
                            <button className="btn btn-secondary btn-sm">📷 Upload Photos</button>
                        </div>
                    </div>

                    <div className="work-order-card">
                        <div className="work-order-header">
                            <div>
                                <h4 className="work-order-title">Water Supply System</h4>
                                <div className="work-order-meta">
                                    <span>📍 Khed, Pune</span>
                                    <span>💰 Contract Value: ₹85 Lakhs</span>
                                    <span>📅 Deadline: March 31, 2025</span>
                                </div>
                            </div>
                            <span className="badge badge-warning">ONGOING</span>
                        </div>
                        <div className="progress-bar" style={{ marginBottom: 'var(--space-3)' }}>
                            <div className="progress-fill" style={{ width: '73%' }}></div>
                        </div>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
                            Current Progress: 73% • Last Updated: Nov 22, 2025
                        </p>
                        <div className="work-order-actions">
                            <button className="btn btn-primary btn-sm">📈 Update Progress</button>
                            <button className="btn btn-secondary btn-sm">📷 Upload Photos</button>
                        </div>
                    </div>
                </div>

                {/* Progress Update Form */}
                <div className="form-section">
                    <div className="form-section-header">
                        <h3 className="form-section-title">Update Work Progress</h3>
                    </div>

                    <div className="form-group">
                        <label className="form-label required">Select Project</label>
                        <select className="form-control form-select">
                            <option>Community Hall Construction - Shirur</option>
                            <option>Water Supply System - Khed</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label required">Progress Percentage</label>
                        <input type="number" className="form-control" placeholder="Enter % complete" min="0" max="100" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Daily Activity Log</label>
                        <textarea className="form-control" rows="4" placeholder="Describe work completed today..."></textarea>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Upload Progress Photos</label>
                        <div className="upload-area">
                            <div className="upload-area-icon">📷</div>
                            <div className="upload-area-text">Upload geo-tagged photos</div>
                            <div className="upload-area-hint">JPG, PNG with GPS location</div>
                        </div>
                    </div>

                    <button className="btn btn-primary">Submit Update</button>
                </div>

                {/* Material Requests */}
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2 className="section-title">Material Requests</h2>
                        <button className="btn btn-primary btn-sm">➕ New Request</button>
                    </div>

                    <div className="table-wrapper">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Request ID</th>
                                    <th>Material</th>
                                    <th>Quantity</th>
                                    <th>Project</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>MR-001</td>
                                    <td>Cement (50kg bags)</td>
                                    <td>200</td>
                                    <td>Community Hall</td>
                                    <td><span className="badge badge-success">APPROVED</span></td>
                                    <td><button className="btn btn-primary btn-sm">View</button></td>
                                </tr>
                                <tr>
                                    <td>MR-002</td>
                                    <td>Steel Rods (12mm)</td>
                                    <td>500 kg</td>
                                    <td>Water Supply</td>
                                    <td><span className="badge badge-warning">PENDING</span></td>
                                    <td><button className="btn btn-primary btn-sm">View</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Payment Status */}
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2 className="section-title">Payment Status</h2>
                    </div>

                    <div className="invoice-card">
                        <div className="invoice-header">
                            <div>
                                <div className="invoice-number">INV-2024-001</div>
                                <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                                    Community Hall - Progress Payment
                                </p>
                            </div>
                            <div className="invoice-amount">₹12,50,000</div>
                        </div>
                        <div className="invoice-details">
                            <div>
                                <div className="invoice-detail-label">Submitted</div>
                                <div className="invoice-detail-value">Nov 20, 2025</div>
                            </div>
                            <div>
                                <div className="invoice-detail-label">Work Completed</div>
                                <div className="invoice-detail-value">65%</div>
                            </div>
                            <div>
                                <div className="invoice-detail-label">Status</div>
                                <div className="invoice-detail-value">
                                    <span className="badge badge-warning">UNDER REVIEW</span>
                                </div>
                            </div>
                            <div>
                                <div className="invoice-detail-label">Expected Release</div>
                                <div className="invoice-detail-value">Nov 30, 2025</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ContractorDashboard;
