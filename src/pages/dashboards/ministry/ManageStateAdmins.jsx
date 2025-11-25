import React, { useState } from 'react';
import Modal from '../../../components/Modal';

const ManageStateAdmins = () => {
    const [admins, setAdmins] = useState([
        { id: 1, state: 'Maharashtra', name: 'Rajesh Kumar', email: 'rajesh.k@mah.gov.in', phone: '9876543210', status: 'Active' },
        { id: 2, state: 'Karnataka', name: 'Suresh Patil', email: 'suresh.p@kar.gov.in', phone: '9876543211', status: 'Active' },
        { id: 3, state: 'Gujarat', name: 'Amit Shah', email: 'amit.s@guj.gov.in', phone: '9876543212', status: 'Inactive' },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentAdmin, setCurrentAdmin] = useState(null);
    const [formData, setFormData] = useState({ state: '', name: '', email: '', phone: '', status: true });

    const handleAdd = () => {
        setCurrentAdmin(null);
        setFormData({ state: '', name: '', email: '', phone: '', status: true });
        setIsModalOpen(true);
    };

    const handleEdit = (admin) => {
        setCurrentAdmin(admin);
        setFormData({ ...admin, status: admin.status === 'Active' });
        setIsModalOpen(true);
    };

    const handleDeleteClick = (admin) => {
        setCurrentAdmin(admin);
        setIsDeleteModalOpen(true);
    };

    const handleSave = () => {
        if (currentAdmin) {
            setAdmins(admins.map(a => a.id === currentAdmin.id ? { ...formData, id: a.id, status: formData.status ? 'Active' : 'Inactive' } : a));
        } else {
            setAdmins([...admins, { ...formData, id: Date.now(), status: formData.status ? 'Active' : 'Inactive' }]);
        }
        setIsModalOpen(false);
    };

    const handleDeleteConfirm = () => {
        setAdmins(admins.map(a => a.id === currentAdmin.id ? { ...a, status: 'Inactive' } : a)); // Soft delete/Deactivate
        setIsDeleteModalOpen(false);
    };

    return (
        <div className="dashboard-panel">
            <div className="section-header">
                <h2 className="section-title">Manage State Admins</h2>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <input type="text" placeholder="Search..." className="form-input" style={{ width: '200px' }} />
                    <button className="btn btn-primary btn-sm" onClick={handleAdd}>+ Add New Admin</button>
                    <button className="btn btn-outline btn-sm">📥 Export</button>
                </div>
            </div>

            <div className="table-wrapper">
                <table className="table">
                    <thead>
                        <tr>
                            <th>State Name</th>
                            <th>Admin Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.map(admin => (
                            <tr key={admin.id}>
                                <td>{admin.state}</td>
                                <td>{admin.name}</td>
                                <td>{admin.email}</td>
                                <td>{admin.phone}</td>
                                <td>
                                    <span className={`badge badge-${admin.status === 'Active' ? 'success' : 'error'}`}>
                                        {admin.status}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(admin)} style={{ marginRight: '5px' }}>Edit</button>
                                    <button className="btn btn-outline btn-sm" onClick={() => handleDeleteClick(admin)}>Deactivate</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentAdmin ? "Edit State Admin" : "Add New State Admin"}
                footer={
                    <>
                        <button className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleSave}>Save</button>
                    </>
                }
            >
                <div className="form-group">
                    <label className="form-label">State</label>
                    <select
                        className="form-select"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    >
                        <option value="">Select State</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Gujarat">Gujarat</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-input"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-input"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input
                        type="tel"
                        className="form-input"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">
                        <input
                            type="checkbox"
                            checked={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                        /> Active
                    </label>
                </div>
            </Modal>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Confirm Deactivation"
                footer={
                    <>
                        <button className="btn btn-outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                        <button className="btn btn-error" onClick={handleDeleteConfirm}>Deactivate</button>
                    </>
                }
            >
                <p>Are you sure you want to deactivate this admin? They will no longer be able to access the system.</p>
            </Modal>
        </div>
    );
};

export default ManageStateAdmins;
