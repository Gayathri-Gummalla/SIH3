import React from 'react';

const PublicSidebar = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'dashboard', icon: '📊', label: 'Dashboard' },
        { id: 'projects', icon: '🏗️', label: 'Projects' },
        { id: 'complaint', icon: '📝', label: 'Complaint' }
    ];

    return (
        <aside className="dashboard-sidebar" style={{ backgroundColor: 'var(--color-accent)' }}>
            <div style={{ padding: '20px', color: 'white', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <h2 style={{ fontSize: '1.2rem', margin: 0, color: 'white' }}>PM-AJAY</h2>
                <p style={{ fontSize: '0.8rem', opacity: 0.8, margin: 0 }}>Public Portal</p>
            </div>
            <nav style={{ marginTop: '20px' }}>
                <ul className="dashboard-sidebar-nav">
                    {menuItems.map((item) => (
                        <li key={item.id} className="dashboard-sidebar-item">
                            <button
                                onClick={() => setActiveTab(item.id)}
                                className={`dashboard-sidebar-link ${activeTab === item.id ? 'active' : ''}`}
                                style={{
                                    width: '100%',
                                    background: activeTab === item.id ? 'rgba(255, 255, 255, 0.1)' : 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    color: 'white',
                                    borderLeft: activeTab === item.id ? '4px solid white' : '4px solid transparent'
                                }}
                            >
                                <span className="dashboard-sidebar-icon">{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default PublicSidebar;
