import React, { useState } from 'react';
import StatCard from '../../../components/StatCard';

const ReportsAnalytics = () => {
    const [reportType, setReportType] = useState('Fund Utilization');

    return (
        <div className="dashboard-panel">
            <div className="section-header">
                <h2 className="section-title">Reports & Analytics</h2>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <select
                        className="form-select"
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                    >
                        <option value="Fund Utilization">Fund Utilization</option>
                        <option value="Project Progress">Project Progress</option>
                        <option value="Annual Plan Summary">Annual Plan Summary</option>
                        <option value="UCs submitted">UCs submitted</option>
                        <option value="State-wise Comparison">State-wise Comparison</option>
                    </select>
                    <button className="btn btn-primary btn-sm">📥 Export Report</button>
                </div>
            </div>

            <div className="dashboard-section">
                <div className="kpi-row">
                    <StatCard
                        icon="📊"
                        value="12"
                        label="Reports Generated"
                        color="var(--color-primary)"
                    />
                    <StatCard
                        icon="📥"
                        value="45"
                        label="Downloads"
                        color="var(--color-secondary)"
                    />
                </div>
            </div>

            <div className="dashboard-section">
                <h3 className="section-title">{reportType} Report</h3>
                <div className="card" style={{ padding: 'var(--space-4)', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--border-light)' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Graphical representation and detailed data for <strong>{reportType}</strong> will be displayed here.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ReportsAnalytics;
