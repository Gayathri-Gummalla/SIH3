import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sanctionService, formatCurrency, formatDate, getStatusColor } from '../../services/api';
import './SanctionList.css';

const SanctionList = () => {
    const [sanctions, setSanctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        fetchSanctions();
    }, [filter]);

    const fetchSanctions = async () => {
        try {
            setLoading(true);
            const filters = filter !== 'all' ? { status: filter } : {};
            const response = await sanctionService.getSanctions(filters);
            
            if (response.success) {
                setSanctions(response.sanctions);
            }
        } catch (error) {
            console.error('Error fetching sanctions:', error);
            alert('Failed to load sanctions');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const colors = {
            pending: '#f59e0b',
            approved: '#10b981',
            rejected: '#ef4444'
        };
        return (
            <span style={{
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600',
                backgroundColor: colors[status] + '20',
                color: colors[status]
            }}>
                {status.toUpperCase()}
            </span>
        );
    };

    if (loading) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <p>Loading sanctions...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: 'var(--space-6)' }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 'var(--space-6)'
            }}>
                <div>
                    <h1 style={{ marginBottom: 'var(--space-2)' }}>Sanction Management</h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                        Manage sanction orders and fund allocations
                    </p>
                </div>
                <button 
                    className="btn btn-primary"
                    onClick={() => navigate('/sanctions/create')}
                >
                    ➕ Create New Sanction
                </button>
            </div>

            {/* Filters */}
            <div style={{ 
                display: 'flex', 
                gap: 'var(--space-3)', 
                marginBottom: 'var(--space-4)',
                borderBottom: '2px solid var(--color-border)',
                paddingBottom: 'var(--space-2)'
            }}>
                {['all', 'pending', 'approved', 'rejected'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        style={{
                            padding: 'var(--space-2) var(--space-4)',
                            border: 'none',
                            background: filter === status ? 'var(--color-primary)' : 'transparent',
                            color: filter === status ? 'white' : 'var(--color-text-secondary)',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            fontWeight: filter === status ? 'bold' : 'normal',
                            transition: 'all 0.2s'
                        }}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>

            {/* Sanctions Table */}
            {sanctions.length === 0 ? (
                <div style={{ 
                    textAlign: 'center', 
                    padding: 'var(--space-8)',
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderRadius: 'var(--radius-lg)'
                }}>
                    <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-secondary)' }}>
                        No sanctions found
                    </p>
                </div>
            ) : (
                <div style={{ 
                    backgroundColor: 'white',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
                                <th style={{ padding: 'var(--space-3)', textAlign: 'left' }}>Sanction ID</th>
                                <th style={{ padding: 'var(--space-3)', textAlign: 'left' }}>State</th>
                                <th style={{ padding: 'var(--space-3)', textAlign: 'left' }}>Financial Year</th>
                                <th style={{ padding: 'var(--space-3)', textAlign: 'right' }}>Amount</th>
                                <th style={{ padding: 'var(--space-3)', textAlign: 'center' }}>Status</th>
                                <th style={{ padding: 'var(--space-3)', textAlign: 'left' }}>Created Date</th>
                                <th style={{ padding: 'var(--space-3)', textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sanctions.map((sanction) => (
                                <tr 
                                    key={sanction.id}
                                    style={{ 
                                        borderBottom: '1px solid var(--color-border)',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => navigate(`/sanctions/${sanction.id}`)}
                                >
                                    <td style={{ padding: 'var(--space-3)' }}>
                                        <strong>{sanction.sanction_id}</strong>
                                    </td>
                                    <td style={{ padding: 'var(--space-3)' }}>{sanction.state_code}</td>
                                    <td style={{ padding: 'var(--space-3)' }}>{sanction.financial_year}</td>
                                    <td style={{ padding: 'var(--space-3)', textAlign: 'right' }}>
                                        <strong>{formatCurrency(sanction.total_amount)}</strong>
                                    </td>
                                    <td style={{ padding: 'var(--space-3)', textAlign: 'center' }}>
                                        {getStatusBadge(sanction.status)}
                                    </td>
                                    <td style={{ padding: 'var(--space-3)' }}>{formatDate(sanction.created_at)}</td>
                                    <td style={{ padding: 'var(--space-3)', textAlign: 'center' }}>
                                        <button 
                                            className="btn btn-secondary"
                                            style={{ fontSize: '12px', padding: '6px 12px' }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/sanctions/${sanction.id}`);
                                            }}
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default SanctionList;
