import React, { useState } from 'react';
import StatCard from '../../../components/StatCard';

const StateReports = () => {
    const [reportType, setReportType] = useState('Financial');

    return (
        <div className="dashboard-panel">
            <div className="section-header">
                <h2 className="section-title">Reports</h2>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <select
                        className="form-select"
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                    >
                        <option value="Financial">Financial Reports</option>
                        <option value="Progress">Progress Reports</option>
                        <option value="UCs">UC Status Reports</option>
                    </select>
                    <button className="btn btn-primary btn-sm">📥 Export Report</button>
                </div>
            </div>

            <div className="dashboard-section">
                <div className="kpi-row">
                    <StatCard
                        icon="📊"
                        value="8"
                        label="Reports Available"
                        color="var(--color-primary)"
                    />
                    <StatCard
                        icon="📥"
                        value="24"
                        label="Downloads this month"
                        color="var(--color-secondary)"
                    />
                </div>
            </div>

            <div className="dashboard-section">
                <h3 className="section-title">{reportType} Report Overview</h3>
                <div className="card" style={{ padding: 'var(--space-4)', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--border-light)' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Detailed charts and data tables for <strong>{reportType}</strong> will be displayed here.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StateReports;
