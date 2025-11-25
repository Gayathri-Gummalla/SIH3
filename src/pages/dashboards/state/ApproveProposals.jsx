import React, { useState } from 'react';
import Modal from '../../../components/Modal';

const ApproveProposals = () => {
    const [proposals, setProposals] = useState([
        { id: 1, district: 'Pune', title: 'Community Development Projects', date: '2025-11-18', status: 'Pending', budget: '15.5 Cr' },
        { id: 2, district: 'Nashik', title: 'Infrastructure Upgrades', date: '2025-11-19', status: 'Pending', budget: '22.0 Cr' },
        { id: 3, district: 'Mumbai', title: 'Skill Development Center', date: '2025-11-10', status: 'Approved', budget: '10.0 Cr' },
    ]);

    const [selectedProposal, setSelectedProposal] = useState(null);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    const handleApproveClick = (proposal) => {
        setSelectedProposal(proposal);
        setIsApproveModalOpen(true);
    };

    const handleRejectClick = (proposal) => {
        setSelectedProposal(proposal);
        setRejectReason('');
        setIsRejectModalOpen(true);
    };

    const confirmApprove = () => {
        setProposals(proposals.map(p => p.id === selectedProposal.id ? { ...p, status: 'Approved' } : p));
        setIsApproveModalOpen(false);
    };

    const confirmReject = () => {
        setProposals(proposals.map(p => p.id === selectedProposal.id ? { ...p, status: 'Rejected' } : p));
        setIsRejectModalOpen(false);
    };

    return (
        <div className="dashboard-panel">
            <div className="section-header">
                <h2 className="section-title">Approve District Proposals</h2>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <select className="form-select" style={{ width: '150px' }}>
                        <option value="">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>

            <div className="table-wrapper">
                <table className="table">
                    <thead>
                        <tr>
                            <th>District</th>
                            <th>Proposal Title</th>
                            <th>Submission Date</th>
                            <th>Budget</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {proposals.map(proposal => (
                            <tr key={proposal.id}>
                                <td>{proposal.district}</td>
                                <td>{proposal.title}</td>
                                <td>{proposal.date}</td>
                                <td>{proposal.budget}</td>
                                <td>
                                    <span className={`badge badge-${proposal.status === 'Approved' ? 'success' : proposal.status === 'Rejected' ? 'error' : 'warning'}`}>
                                        {proposal.status}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn btn-secondary btn-sm" style={{ marginRight: '5px' }}>View</button>
                                    {proposal.status === 'Pending' && (
                                        <>
                                            <button className="btn btn-primary btn-sm" onClick={() => handleApproveClick(proposal)} style={{ marginRight: '5px' }}>Approve</button>
                                            <button className="btn btn-error btn-sm" onClick={() => handleRejectClick(proposal)}>Reject</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isApproveModalOpen}
                onClose={() => setIsApproveModalOpen(false)}
                title="Confirm Approval"
                footer={
                    <>
                        <button className="btn btn-outline" onClick={() => setIsApproveModalOpen(false)}>Cancel</button>
                        <button className="btn btn-primary" onClick={confirmApprove}>Confirm Approve</button>
                    </>
                }
            >
                <p>Are you sure you want to approve the proposal <strong>{selectedProposal?.title}</strong>?</p>
            </Modal>

            <Modal
                isOpen={isRejectModalOpen}
                onClose={() => setIsRejectModalOpen(false)}
                title="Reject Proposal"
                footer={
                    <>
                        <button className="btn btn-outline" onClick={() => setIsRejectModalOpen(false)}>Cancel</button>
                        <button className="btn btn-error" onClick={confirmReject}>Reject Proposal</button>
                    </>
                }
            >
                <div className="form-group">
                    <label className="form-label">Reason for Rejection</label>
                    <textarea
                        className="form-input"
                        rows="4"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Please provide a reason for rejection..."
                    ></textarea>
                </div>
            </Modal>
        </div>
    );
};

export default ApproveProposals;
