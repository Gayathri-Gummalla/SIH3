import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import NotificationBell from '../../components/NotificationBell';
import DashboardSidebar from '../../components/DashboardSidebar';
// import IndiaMap from '../../components/maps/IndiaMap'; // Temporarily disabled - React Leaflet compatibility issue
import { nationalStats, states } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';

const MinistryDashboard = () => {
    const [selectedState, setSelectedState] = useState(null);
    const navigate = useNavigate();
    const { logout } = useAuth();

    const sidebarMenu = [
        { icon: '📊', label: 'Dashboard', path: '/dashboard' },
        { icon: '👥', label: 'Manage State Admins', path: '#' },
        { icon: '💰', label: 'Fund Allocation', path: '#' },
        { icon: '✅', label: 'Annual Plans Approval', path: '#' },
        { icon: '📈', label: 'Reports & Analytics', path: '#' },
        { icon: '📢', label: 'Notifications/Circulars', path: '#' },
        { icon: '❓', label: 'Help/Support', path: '#' },
        { icon: '🚪', label: 'Logout', action: () => { logout(); navigate('/login'); } }
    ];

    const formatCurrency = (amount) => {
        return `₹${(amount / 10000000000).toFixed(2)} Cr`;
    };

    const utilizationPercentage = ((nationalStats.totalFundUtilized / nationalStats.totalFundReleased) * 100).toFixed(1);

    return (
        <div className="dashboard-layout">
            <DashboardSidebar menuItems={sidebarMenu} />

            <main className="dashboard-main">
                <div className="dashboard-header">
                    <div className="dashboard-title-section">
                        <h1>Ministry Dashboard</h1>
                        <p>National overview and state-level monitoring</p>
                    </div>
                    <div className="dashboard-actions">
                        <NotificationBell />
                    </div>
                </div>

                {/* National Statistics */}
                <div className="kpi-row">
                    <StatCard
                        icon="🏛️"
                        value={nationalStats.totalStates}
                        label="States/UTs"
                        color="var(--color-primary)"
                    />
                    <StatCard
                        icon="🏘️"
                        value={nationalStats.totalDistricts}
                        label="Districts"
                        color="var(--color-secondary)"
                    />
                    <StatCard
                        icon="📊"
                        value={nationalStats.totalProjects}
                        label="Total Projects"
                        trend="positive"
                        trendValue="+12% this year"
                        color="var(--color-accent)"
                    />
                    <StatCard
                        icon="💰"
                        value={formatCurrency(nationalStats.totalFundAllocated)}
                        label="Fund Allocated"
                        color="var(--color-success)"
                    />
                </div>

                {/* Project Status */}
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2 className="section-title">Project Status Overview</h2>
                    </div>
                    <div className="kpi-row">
                        <StatCard
                            icon="✔️"
                            value={nationalStats.projectsCompleted}
                            label="Completed"
                            trend="positive"
                            trendValue="+8% this month"
                            color="var(--color-success)"
                        />
                        <StatCard
                            icon="🚧"
                            value={nationalStats.projectsOngoing}
                            label="Ongoing"
                            color="var(--color-warning)"
                        />
                        <StatCard
                            icon="✅"
                            value={nationalStats.projectsApproved}
                            label="Approved"
                            color="var(--color-info)"
                        />
                        <StatCard
                            icon="📝"
                            value={nationalStats.projectsProposed}
                            label="Pending"
                            color="var(--color-error)"
                        />
                    </div>
                </div>

                {/* GIS Map */}
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2 className="section-title">State-wise Project Distribution</h2>
                        <button className="btn btn-primary btn-sm">📥 Export Map Data</button>
                    </div>
                    <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--color-bg-secondary)', borderRadius: '8px' }}>
                        <p>🗺️ Interactive map will be enabled soon</p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                            Map component temporarily disabled due to library compatibility issues
                        </p>
                    </div>
                    {/* <IndiaMap onStateSelect={setSelectedState} /> */}
                </div>

                {/* Fund Allocation Table */}
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2 className="section-title">State-wise Fund Allocation</h2>
                        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                            <button className="btn btn-secondary btn-sm">💰 Allocate Funds</button>
                            <button className="btn btn-outline btn-sm">📊 Generate Report</button>
                        </div>
                    </div>

                    <div className="table-wrapper">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>State/UT</th>
                                    <th>Districts</th>
                                    <th>Projects</th>
                                    <th>Fund Allocated</th>
                                    <th>Progress</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {states.map(state => {
                                    const progress = Math.floor(Math.random() * 30) + 50;
                                    return (
                                        <tr key={state.id}>
                                            <td>
                                                <strong>{state.name}</strong>
                                                <br />
                                                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                                                    {state.code}
                                                </span>
                                            </td>
                                            <td>{state.districts}</td>
                                            <td>{state.projects}</td>
                                            <td>{formatCurrency(state.fundAllocated)}</td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                    <div className="progress-bar" style={{ flex: 1, height: '6px' }}>
                                                        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                                                    </div>
                                                    <span style={{ fontSize: 'var(--text-sm)' }}>{progress}%</span>
                                                </div>
                                            </td>
                                            <td>
                                                <button className="btn btn-primary btn-sm">View</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pending Approvals */}
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2 className="section-title">Pending Annual Plan Approvals</h2>
                        <span className="badge badge-warning" style={{ fontSize: 'var(--text-base)', padding: 'var(--space-2) var(--space-4)' }}>
                            {nationalStats.projectsProposed} Pending
                        </span>
                    </div>

                    <div className="card">
                        {states.slice(0, 3).map((state, index) => (
                            <div key={state.id} style={{
                                padding: 'var(--space-4)',
                                border: '1px solid var(--border-light)',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: 'var(--space-3)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <h4 style={{ margin: 0, marginBottom: 'var(--space-2)' }}>
                                        {state.name} - Annual Action Plan 2025-26
                                    </h4>
                                    <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                                        Submitted: Nov {20 + index}, 2025 • {Math.floor(Math.random() * 50) + 30} projects
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                    <button className="btn btn-secondary btn-sm">📄 Review</button>
                                    <button className="btn btn-primary btn-sm">✅ Approve</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MinistryDashboard;
