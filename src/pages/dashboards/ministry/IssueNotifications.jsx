import React, { useState } from 'react';
import Modal from '../../../components/Modal';

const IssueNotifications = () => {
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Annual Plan Submission Deadline Extended', date: '2025-11-20', audience: 'All States', status: 'Sent' },
        { id: 2, title: 'New Guidelines for Fund Utilization', date: '2025-11-15', audience: 'All States', status: 'Sent' },
        { id: 3, title: 'Meeting with Maharashtra State Admin', date: '2025-11-28', audience: 'Maharashtra', status: 'Scheduled' },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ title: '', message: '', audience: 'All States', scheduleDate: '' });

    const handleCreate = () => {
        setNotifications([...notifications, {
            id: Date.now(),
            title: formData.title,
            date: formData.scheduleDate || new Date().toISOString().split('T')[0],
            audience: formData.audience,
            status: formData.scheduleDate ? 'Scheduled' : 'Sent'
        }]);
        setIsModalOpen(false);
        setFormData({ title: '', message: '', audience: 'All States', scheduleDate: '' });
    };

    return (
        <div className="dashboard-panel">
            <div className="section-header">
                <h2 className="section-title">Notifications & Circulars</h2>
                <button className="btn btn-primary btn-sm" onClick={() => setIsModalOpen(true)}>+ Create New Notification</button>
            </div>

            <div className="table-wrapper">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Date</th>
                            <th>Target Audience</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notifications.map(notif => (
                            <tr key={notif.id}>
                                <td>{notif.title}</td>
                                <td>{notif.date}</td>
                                <td>{notif.audience}</td>
                                <td>
                                    <span className={`badge badge-${notif.status === 'Sent' ? 'success' : 'warning'}`}>
                                        {notif.status}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn btn-secondary btn-sm" style={{ marginRight: '5px' }}>View</button>
                                    <button className="btn btn-outline btn-sm">Deactivate</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Notification"
                footer={
                    <>
                        <button className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleCreate}>Send / Schedule</button>
                    </>
                }
            >
                <div className="form-group">
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-input"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Message Body</label>
                    <textarea
                        className="form-input"
                        rows="5"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    ></textarea>
                </div>
                <div className="form-group">
                    <label className="form-label">Select Audience</label>
                    <select
                        className="form-select"
                        value={formData.audience}
                        onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                    >
                        <option value="All States">All States</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Karnataka">Karnataka</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Schedule Date (Optional)</label>
                    <input
                        type="date"
                        className="form-input"
                        value={formData.scheduleDate}
                        onChange={(e) => setFormData({ ...formData, scheduleDate: e.target.value })}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default IssueNotifications;
