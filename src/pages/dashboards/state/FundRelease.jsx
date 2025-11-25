import React, { useState } from 'react';
import Modal from '../../../components/Modal';

const FundRelease = ({ formatCurrency }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fundData, setFundData] = useState({ district: '', component: [], amount: '', date: '' });
    const [releases, setReleases] = useState([
        { id: 1, district: 'Pune', component: 'Adarsh Gram', amount: 680000000, date: '2025-01-15' },
        { id: 2, district: 'Mumbai', component: 'GIA', amount: 920000000, date: '2025-02-01' },
    ]);

    const handleRelease = () => {
        setReleases([...releases, {
            id: Date.now(),
            district: fundData.district,
            component: fundData.component.join(', '),
            amount: parseInt(fundData.amount) * 10000000,
            date: fundData.date
        }]);
        setIsModalOpen(false);
        setFundData({ district: '', component: [], amount: '', date: '' });
    };

    const handleComponentChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setFundData({ ...fundData, component: [...fundData.component, value] });
        } else {
            setFundData({ ...fundData, component: fundData.component.filter(c => c !== value) });
        }
    };

    return (
        <div className="dashboard-panel">
            <div className="section-header">
                <h2 className="section-title">Fund Release to Districts</h2>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setIsModalOpen(true)}>💰 Release Funds</button>
                    <button className="btn btn-outline btn-sm">📊 Generate Report</button>
                </div>
            </div>

            <div className="table-wrapper">
                <table className="table">
                    <thead>
                        <tr>
                            <th>District</th>
                            <th>Scheme Component</th>
                            <th>Amount Released</th>
                            <th>Release Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {releases.map(release => (
                            <tr key={release.id}>
                                <td><strong>{release.district}</strong></td>
                                <td>{release.component}</td>
                                <td>{formatCurrency(release.amount)}</td>
                                <td>{release.date}</td>
                                <td>
                                    <button className="btn btn-primary btn-sm">View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Release Funds to District"
                footer={
                    <>
                        <button className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleRelease}>Submit</button>
                    </>
                }
            >
                <div className="form-group">
                    <label className="form-label">District</label>
                    <select
                        className="form-select"
                        value={fundData.district}
                        onChange={(e) => setFundData({ ...fundData, district: e.target.value })}
                    >
                        <option value="">Select District</option>
                        <option value="Pune">Pune</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Nagpur">Nagpur</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Scheme Component</label>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <label><input type="checkbox" value="Adarsh Gram" onChange={handleComponentChange} /> Adarsh Gram</label>
                        <label><input type="checkbox" value="GIA" onChange={handleComponentChange} /> GIA</label>
                        <label><input type="checkbox" value="Hostel" onChange={handleComponentChange} /> Hostel</label>
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label">Amount to Release (in Cr)</label>
                    <input
                        type="number"
                        className="form-input"
                        value={fundData.amount}
                        onChange={(e) => setFundData({ ...fundData, amount: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Release Date</label>
                    <input
                        type="date"
                        className="form-input"
                        value={fundData.date}
                        onChange={(e) => setFundData({ ...fundData, date: e.target.value })}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default FundRelease;
