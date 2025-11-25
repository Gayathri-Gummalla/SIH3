import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import NotificationBell from '../../components/NotificationBell';
import DashboardSidebar from '../../components/DashboardSidebar';
import { stateStats } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';

const StateDashboard = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const stats = stateStats.Maharashtra;

    const sidebarMenu = [
        { icon: '📊', label: 'Dashboard', path: '/dashboard' },
        { icon: '👥', label: 'Manage District Admins', path: '#' },
        { icon: '💰', label: 'Fund Release to Districts', path: '#' },
        { icon: '✅', label: 'Approve District Proposals', path: '#' },
        { icon: '📄', label: 'Upload Utilisation Certificates', path: '#' },
        { icon: '📊', label: 'Reports', path: '#' },
        { icon: '🔔', label: 'Notifications', path: '#' },
        { icon: '❓', label: 'Help', path: '#' },
        { icon: '🚪', label: 'Logout', action: () => { logout(); navigate('/login'); } }
    ];

    const formatCurrency = (amount) => {
        return `₹${(amount / 10000000).toFixed(2)} Cr`;
    };

    return (
        <div className="dashboard-layout">
            <DashboardSidebar menuItems={sidebarMenu} />

            <main className="dashboard-main">
                <div className="dashboard-header">
                    <div className="dashboard-title-section">
                        <h1>State Dashboard - Maharashtra</h1>
                        <p>State Social Welfare Department (SSWD)</p>
                    </div>
                    <div className="dashboard-actions">
                        <NotificationBell />
                    </div>
                </div>

                {/* State KPIs */}
                <div className="kpi-row">
                    <StatCard
                        icon="🏘️"
                        value={stats.districts}
                        label="Districts"
                        color="var(--color-primary)"
                    />
                    <StatCard
                        icon="📊"
                        value={stats.projects}
                        label="Total Projects"
                        color="var(--color-secondary)"
                    />
                    <StatCard
                        icon="💰"
                        value={formatCurrency(stats.fundAllocated)}
                        label="Fund Allocated"
                        color="var(--color-success)"
                    />
                    <StatCard
                        icon="✅"
                        value={stats.projectsCompleted}
                        label="Completed"
                        trend="positive"
                        trendValue="+8% this month"
                        color="var(--color-success)"
                    />
                </div>

                {/* District-wise Status */}
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2 className="section-title">District-wise Fund Status</h2>
                        <button className="btn btn-primary btn-sm">💰 Release Funds</button>
                    </div>

                    <div className="table-wrapper">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>District</th>
                                    <th>Fund Released</th>
                                    <th>Fund Utilized</th>
                                    <th>Project Status</th>
                                    <th>UC Uploaded</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Pune</strong></td>
                                    <td>₹68 Cr</td>
                                    <td>₹52 Cr (76%)</td>
                                    <td>
                                        <div style={{ fontSize: 'var(--text-xs)' }}>
                                            <span className="badge badge-success">18 Completed</span>
                                            <span className="badge badge-warning" style={{ marginLeft: 'var(--space-2)' }}>20 Ongoing</span>
                                        </div>
                                    </td>
                                    <td><span className="badge badge-success">YES</span></td>
                                    <td><button className="btn btn-primary btn-sm">View</button></td>
                                </tr>
                                <tr>
                                    <td><strong>Mumbai</strong></td>
                                    <td>₹92 Cr</td>
                                    <td>₹71 Cr (77%)</td>
                                    <td>
                                        <div style={{ fontSize: 'var(--text-xs)' }}>
                                            <span className="badge badge-success">22 Completed</span>
                                            <span className="badge badge-warning" style={{ marginLeft: 'var(--space-2)' }}>16 Ongoing</span>
                                        </div>
                                    </td>
                                    <td><span className="badge badge-success">YES</span></td>
                                    <td><button className="btn btn-primary btn-sm">View</button></td>
                                </tr>
                                <tr>
                                    <td><strong>Nagpur</strong></td>
                                    <td>₹54 Cr</td>
                                    <td>₹38 Cr (70%)</td>
                                    <td>
                                        <div style={{ fontSize: 'var(--text-xs)' }}>
                                            <span className="badge badge-success">15 Completed</span>
                                            <span className="badge badge-warning" style={{ marginLeft: 'var(--space-2)' }}>17 Ongoing</span>
                                        </div>
                                    </td>
                                    <td><span className="badge badge-warning">PENDING</span></td>
                                    <td><button className="btn btn-primary btn-sm">View</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pending District Proposals */}
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2 className="section-title">Pending District Proposals</h2>
                        <span className="badge badge-warning" style={{ fontSize: 'var(--text-base)', padding: 'var(--space-2) var(--space-4)' }}>
                            {stats.projectsProposed} Pending
                        </span>
                    </div>

                    <div className="card">
                        {['Pune - Community Development Projects', 'Nashik - Infrastructure Upgrades'].map((proposal, index) => (
                            <div key={index} style={{
                                padding: 'var(--space-4)',
                                border: '1px solid var(--border-light)',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: 'var(--space-3)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <h4 style={{ margin: 0, marginBottom: 'var(--space-2)' }}>{proposal}</h4>
                                    <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                                        Submitted: Nov {18 + index}, 2025 • Estimated Budget: ₹{(Math.random() * 20 + 10).toFixed(2)} Cr
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                    <button className="btn btn-secondary btn-sm">📄 Review</button>
                                    <button className="btn btn-primary btn-sm">✅ Approve</button>
                                    <button className="btn btn-outline btn-sm">❌ Reject</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upload UC */}
                <div className="form-section">
                    <div className="form-section-header">
                        <h3 className="form-section-title">Upload Utilization Certificate (UC)</h3>
                    </div>

                    <div className="form-group">
                        <label className="form-label required">Select District</label>
                        <select className="form-control form-select">
                            <option>Pune</option>
                            <option>Mumbai</option>
                            <option>Nagpur</option>
                            <option>Nashik</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label required">Financial Year</label>
                        <select className="form-control form-select">
                            <option>2024-25</option>
                            <option>2023-24</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Upload UC Document</label>
                        <div className="upload-area">
                            <div className="upload-area-icon">📄</div>
                            <div className="upload-area-text">Upload Utilization Certificate</div>
                            <div className="upload-area-hint">PDF format, digitally signed</div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Progress Tracking</label>
                        <div className="timeline">
                            <div className="timeline-item completed">
                                <div className="timeline-content">
                                    <div className="timeline-title">Fund Released</div>
                                    <div className="timeline-date">Jan 15, 2024</div>
                                </div>
                            </div>
                            <div className="timeline-item completed">
                                <div className="timeline-content">
                                    <div className="timeline-title">Projects Initiated</div>
                                    <div className="timeline-date">Feb 1, 2024</div>
                                </div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-content">
                                    <div className="timeline-title">UC Submission</div>
                                    <div className="timeline-date">Pending</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button className="btn btn-primary">Submit UC to Ministry</button>
                </div>
            </main>
        </div>
    );
};

export default StateDashboard;
