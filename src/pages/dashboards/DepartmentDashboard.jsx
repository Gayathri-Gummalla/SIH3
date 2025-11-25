import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import NotificationBell from '../../components/NotificationBell';
import DashboardSidebar from '../../components/DashboardSidebar';
import { useAuth } from '../../contexts/AuthContext';

const DepartmentDashboard = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const sidebarMenu = [
        { icon: '📊', label: 'Dashboard', path: '/dashboard' },
        { icon: '📋', label: 'Work Orders', path: '#' },
        { icon: '📄', label: 'DPR Uploads', path: '#' },
        { icon: '⏱️', label: 'Timelines & Milestones', path: '#' },
        { icon: '✅', label: 'Quality Checks', path: '#' },
        { icon: '💰', label: 'Invoice Approvals', path: '#' },
        { icon: '📊', label: 'Reports', path: '#' },
        { icon: '🔔', label: 'Notifications', path: '#' },
        { icon: '🚪', label: 'Logout', action: () => { logout(); navigate('/login'); } }
    ];

    return (
        <div className="dashboard-layout">
            <DashboardSidebar menuItems={sidebarMenu} />

            <main className="dashboard-main">
                <div className="dashboard-header">
                    <div className="dashboard-title-section">
                        <h1>Department Dashboard</h1>
                        <p>Public Works Department - Pune District</p>
                    </div>
                    <div className="dashboard-actions">
                        <NotificationBell />
                    </div>
                </div>

                {/* KPIs */}
                <div className="kpi-row">
                    <StatCard icon="📋" value="25" label="Projects Assigned" color="var(--color-primary)" />
                    <StatCard icon="📄" value="18" label="DPRs Submitted" color="var(--color-secondary)" />
                    <StatCard icon="✅" value="5" label="Pending Quality Checks" color="var(--color-warning)" />
                    <StatCard icon="💰" value="12" label="Invoices Approved" color="var(--color-success)" />
                </div>

                {/* Work Orders List */}
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2 className="section-title">Assigned Work Orders</h2>
                        <button className="btn btn-primary btn-sm">📥 Download All</button>
                    </div>

                    <div className="work-order-card">
                        <div className="work-order-header">
                            <div>
                                <h4 className="work-order-title">Community Hall Construction - Shirur</h4>
                                <div className="work-order-meta">
                                    <span>📅 Assigned: Jan 15, 2024</span>
                                    <span>💰 Budget: ₹50 Lakhs</span>
                                    <span>📍 Shirur GP</span>
                                </div>
                            </div>
                            <span className="badge badge-warning">DPR PENDING</span>
                        </div>
                        <div className="work-order-actions">
                            <button className="btn btn-primary btn-sm">📄 Upload DPR</button>
                            <button className="btn btn-secondary btn-sm">View Details</button>
                        </div>
                    </div>

                    <div className="work-order-card">
                        <div className="work-order-header">
                            <div>
                                <h4 className="work-order-title">Road Construction - Junnar</h4>
                                <div className="work-order-meta">
                                    <span>📅 Assigned: Feb 1, 2024</span>
                                    <span>💰 Budget: ₹60 Lakhs</span>
                                    <span>📍 Junnar GP</span>
                                </div>
                            </div>
                            <span className="badge badge-success">DPR APPROVED</span>
                        </div>
                        <div className="work-order-actions">
                            <button className="btn btn-primary btn-sm">👷 Assign Contractor</button>
                            <button className="btn btn-secondary btn-sm">View Details</button>
                        </div>
                    </div>
                </div>

                {/* DPR Upload Section */}
                <div className="form-section">
                    <div className="form-section-header">
                        <h3 className="form-section-title">Upload Detailed Project Report (DPR)</h3>
                    </div>

                    <div className="form-group">
                        <label className="form-label required">Select Project</label>
                        <select className="form-control form-select">
                            <option>Community Hall Construction - Shirur</option>
                            <option>Road Construction - Junnar</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Upload DPR Document</label>
                        <div className="upload-area">
                            <div className="upload-area-icon">📄</div>
                            <div className="upload-area-text">Upload DPR (PDF)</div>
                            <div className="upload-area-hint">Technical drawings, cost estimates, timelines</div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label required">Expected Completion Date</label>
                        <input type="date" className="form-control" />
                    </div>

                    <button className="btn btn-primary">Submit DPR</button>
                </div>

                {/* Invoice Approvals */}
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2 className="section-title">Contractor Invoice Approvals</h2>
                        <span className="badge badge-warning" style={{ fontSize: 'var(--text-base)', padding: 'var(--space-2) var(--space-4)' }}>
                            3 Pending
                        </span>
                    </div>

                    <div className="invoice-card">
                        <div className="invoice-header">
                            <div>
                                <div className="invoice-number">INV-2024-001</div>
                                <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                                    ABC Construction Pvt Ltd
                                </p>
                            </div>
                            <div className="invoice-amount">₹12,50,000</div>
                        </div>
                        <div className="invoice-details">
                            <div>
                                <div className="invoice-detail-label">Project</div>
                                <div className="invoice-detail-value">Community Hall - Shirur</div>
                            </div>
                            <div>
                                <div className="invoice-detail-label">Work Completed</div>
                                <div className="invoice-detail-value">65%</div>
                            </div>
                            <div>
                                <div className="invoice-detail-label">Submitted</div>
                                <div className="invoice-detail-value">Nov 20, 2025</div>
                            </div>
                            <div>
                                <div className="invoice-detail-label">Status</div>
                                <div className="invoice-detail-value">
                                    <span className="badge badge-warning">PENDING APPROVAL</span>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                            <button className="btn btn-primary btn-sm">✅ Approve</button>
                            <button className="btn btn-outline btn-sm">❌ Reject</button>
                            <button className="btn btn-secondary btn-sm">📄 View Invoice</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DepartmentDashboard;
