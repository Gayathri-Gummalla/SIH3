import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, ROLES } from '../../contexts/AuthContext';
import MinistryDashboard from './MinistryDashboard';
import StateDashboard from './StateDashboard';
import DistrictDashboard from './DistrictDashboard';
import DepartmentDashboard from './DepartmentDashboard';
import ContractorDashboard from './ContractorDashboard';
import PublicDashboard from './PublicDashboard';

const DashboardRouter = () => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Map backend roles to dashboard components
    switch (user.role) {
        case ROLES.CENTRAL_ADMIN:
        case ROLES.CENTRAL_FINANCE:
        case ROLES.AUDITOR:
            return <MinistryDashboard />;

        case ROLES.STATE_NODAL:
        case ROLES.STATE_FINANCE:
            return <StateDashboard />;

        case ROLES.DISTRICT_OFFICER:
            return <DistrictDashboard />;

        case ROLES.IMPLEMENTING_AGENCY:
            return <DepartmentDashboard />;

        case ROLES.EXECUTING_AGENCY:
            return <ContractorDashboard />;

        default:
            // Fallback to public dashboard
            return <PublicDashboard />;
    }
};

export default DashboardRouter;
