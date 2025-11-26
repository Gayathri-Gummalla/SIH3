import React, { useState } from 'react';
import PublicNavbar from './public/PublicNavbar';
import PublicHome from './public/PublicHome';
import PublicAllProjects from './public/PublicAllProjects';
import PublicComplaint from './public/PublicComplaint';

const PublicDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <PublicHome />;
            case 'projects':
                return <PublicAllProjects />;
            case 'complaint':
                return <PublicComplaint />;
            default:
                return <PublicHome />;
        }
    };

    return (
        <div className="page-wrapper">
            <PublicNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="page-content">
                <div className="container" style={{ marginTop: 'var(--space-6)' }}>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default PublicDashboard;
