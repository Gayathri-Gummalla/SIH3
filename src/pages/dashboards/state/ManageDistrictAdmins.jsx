import React, { useState } from 'react';
import Modal from '../../../components/Modal';

const ManageDistrictAdmins = () => {
    const [admins, setAdmins] = useState([
        { id: 1, district: 'Pune', name: 'Rahul Deshmukh', email: 'rahul.d@pune.gov.in', phone: '9876543210', status: 'Active' },
        { id: 2, district: 'Mumbai', name: 'Priya Sharma', email: 'priya.s@mumbai.gov.in', phone: '9876543211', status: 'Active' },
        { id: 3, district: 'Nagpur', name: 'Vikram Singh', email: 'vikram.s@nagpur.gov.in', phone: '9876543212', status: 'Inactive' },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentAdmin, setCurrentAdmin] = useState(null);
    const [formData, setFormData] = useState({ district: '', name: '', email: '', phone: '', status: true });

    const handleAdd = () => {
        setCurrentAdmin(null);
        setFormData({ district: '', name: '', email: '', phone: '', status: true });
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
        setAdmins(admins.map(a => a.id === currentAdmin.id ? { ...a, status: 'Inactive' } : a));
        setIsDeleteModalOpen(false);
    };

    return (
        <div className="dashboard-panel">
            <div className="section-header">
                <h2 className="section-title">Manage District Admins</h2>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <input type="text" placeholder="Search..." className="form-input" style={{ width: '200px' }} />
                    <button className="btn btn-primary btn-sm" onClick={handleAdd}>+ Add New Admin</button>
                </div>
            </div>

            <div className="table-wrapper">
                <table className="table">
                    <thead>
                        <tr>
                            <th>District</th>
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
                                <td>{admin.district}</td>
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
                title={currentAdmin ? "Edit District Admin" : "Add New District Admin"}
                footer={
                    <>
                        <button className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleSave}>Save</button>
                    </>
                }
            >
                <div className="form-group">
                    <label className="form-label">District</label>
                    <select
                        className="form-select"
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    >
                        <option value="">Select District</option>
                        <option value="Pune">Pune</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Nagpur">Nagpur</option>
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
                <p>Are you sure you want to deactivate this admin?</p>
            </Modal>
        </div>
    );
};

export default ManageDistrictAdmins;
