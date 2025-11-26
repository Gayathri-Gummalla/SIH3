import React, { useState } from 'react';
// import IndiaMap from '../../components/maps/IndiaMap'; // Temporarily disabled - React Leaflet compatibility issue
// import DistrictMap from '../../components/maps/DistrictMap'; // Temporarily disabled - React Leaflet compatibility issue
import { mockProjects } from '../../data/mockData';

const PublicDashboard = () => {
    const [selectedState, setSelectedState] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [viewMode, setViewMode] = useState('india'); // 'india', 'state', 'district'

    const handleStateSelect = (state) => {
        setSelectedState(state);
        setViewMode('state');
    };

    const handleDistrictSelect = (district) => {
        setSelectedDistrict(district);
        setViewMode('district');
    };

    return (
        <div className="page-wrapper">
            <div className="page-content">
                {/* Public Header */}
                <div style={{
                    background: 'var(--bg-gradient)',
                    color: 'var(--text-inverse)',
                    padding: 'var(--space-8) 0',
                    marginBottom: 'var(--space-6)'
                }}>
                    <div className="container">
                        <h1 style={{ color: 'white', marginBottom: 'var(--space-3)' }}>
                            PM-AJAY Transparency Dashboard
                        </h1>
                        <p style={{ fontSize: 'var(--text-lg)', color: 'white', opacity: 0.9 }}>
                            Track PM-AJAY projects in your area • View fund utilization • Submit complaints
                        </p>
                    </div>
                </div>

                <div className="container">
                    {/* Breadcrumb Navigation */}
                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <button onClick={() => setViewMode('india')} className="btn btn-outline btn-sm" style={{ marginRight: 'var(--space-2)' }}>
                            🏠 India
                        </button>
                        {selectedState && (
                            <>
                                <span style={{ margin: '0 var(--space-2)' }}>→</span>
                                <button onClick={() => setViewMode('state')} className="btn btn-outline btn-sm" style={{ marginRight: 'var(--space-2)' }}>
                                    {selectedState}
                                </button>
                            </>
                        )}
                        {selectedDistrict && (
                            <>
                                <span style={{ margin: '0 var(--space-2)' }}>→</span>
                                <span className="btn btn-primary btn-sm">{selectedDistrict}</span>
                            </>
                        )}
                    </div>

                    {/* Interactive Map */}
                    <div className="dashboard-section">
                        <div className="section-header">
                            <h2 className="section-title">
                                {viewMode === 'india' && 'Select Your State'}
                                {viewMode === 'state' && `${selectedState} - Select District`}
                                {viewMode === 'district' && `${selectedDistrict} Projects`}
                            </h2>
                        </div>

                        <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--color-bg-secondary)', borderRadius: '8px' }}>
                            <p>🗺️ Interactive map will be enabled soon</p>
                            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                                Map component temporarily disabled due to library compatibility issues
                            </p>
                        </div>
                        {/* {viewMode === 'india' && <IndiaMap onStateSelect={handleStateSelect} />}
                        {viewMode === 'state' && <DistrictMap state={selectedState} onDistrictSelect={handleDistrictSelect} />}
                        {viewMode === 'district' && <DistrictMap state={selectedState} />} */}
                    </div>

                    {/* Project List */}
                    {viewMode === 'district' && (
                        <div className="dashboard-section">
                            <div className="section-header">
                                <h2 className="section-title">Projects in {selectedDistrict}</h2>
                                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                    <select className="form-control form-select" style={{ width: 'auto' }}>
                                        <option>All Components</option>
                                        <option>Adarsh Gram</option>
                                        <option>GIA</option>
                                        <option>Hostel</option>
                                    </select>
                                    <select className="form-control form-select" style={{ width: 'auto' }}>
                                        <option>All Status</option>
                                        <option>Ongoing</option>
                                        <option>Completed</option>
                                    </select>
                                </div>
                            </div>

                            <div className="dashboard-grid">
                                {mockProjects.filter(p => p.district === selectedDistrict || selectedDistrict === 'Pune').map(project => (
                                    <div key={project.id} className="card">
                                        <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-3)' }}>
                                            {project.name}
                                        </h3>
                                        <div style={{ marginBottom: 'var(--space-3)' }}>
                                            <span className="badge badge-primary">{project.component}</span>
                                            <span className={`badge ${project.status === 'COMPLETED' ? 'badge-success' : project.status === 'ONGOING' ? 'badge-warning' : 'badge-info'}`} style={{ marginLeft: 'var(--space-2)' }}>
                                                {project.status}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
                                            <p>📍 {project.gp}</p>
                                            <p>💰 Fund Allocated: ₹{(project.fundAllocated / 100000).toFixed(2)} L</p>
                                            <p>🏗️ Department: {project.department}</p>
                                        </div>
                                        <div className="progress-bar" style={{ marginBottom: 'var(--space-2)' }}>
                                            <div className="progress-fill" style={{ width: `${project.progress}%` }}></div>
                                        </div>
                                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                                            Progress: {project.progress}%
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Fund Utilization Summary */}
                    {viewMode !== 'india' && (
                        <div className="dashboard-section">
                            <div className="section-header">
                                <h2 className="section-title">Fund Utilization Summary</h2>
                            </div>

                            <div className="kpi-row">
                                <div className="stat-card">
                                    <div className="stat-card-value">₹150 Cr</div>
                                    <div className="stat-card-label">Total Allocated</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-card-value">₹105 Cr</div>
                                    <div className="stat-card-label">Released</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-card-value">₹78 Cr</div>
                                    <div className="stat-card-label">Utilized</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-card-value">74%</div>
                                    <div className="stat-card-label">Utilization Rate</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Complaint Submission */}
                    <div className="dashboard-section">
                        <div className="section-header">
                            <h2 className="section-title">Submit a Complaint</h2>
                        </div>

                        <div className="complaint-form">
                            <div className="form-group">
                                <label className="form-label required">Your Name</label>
                                <input type="text" className="form-control" placeholder="Enter your name" />
                            </div>

                            <div className="form-group">
                                <label className="form-label required">Contact Number</label>
                                <input type="tel" className="form-control" placeholder="Enter mobile number" />
                            </div>

                            <div className="form-group">
                                <label className="form-label required">Location</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                                    <select className="form-control form-select">
                                        <option>Select State</option>
                                        <option>Maharashtra</option>
                                    </select>
                                    <select className="form-control form-select">
                                        <option>Select District</option>
                                        <option>Pune</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label required">Complaint Details</label>
                                <textarea className="form-control" rows="5" placeholder="Describe your complaint in detail..."></textarea>
                            </div>

                            <button className="btn btn-primary">Submit Complaint</button>
                        </div>
                    </div>

                    {/* Complaint Tracking */}
                    <div className="dashboard-section">
                        <div className="section-header">
                            <h2 className="section-title">Track Your Complaint</h2>
                        </div>

                        <div className="card">
                            <div className="form-group">
                                <label className="form-label">Enter Complaint Reference Number</label>
                                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                                    <input type="text" className="form-control" placeholder="e.g., COMP-2024-001" />
                                    <button className="btn btn-primary">Track</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicDashboard;
