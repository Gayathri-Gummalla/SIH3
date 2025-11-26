import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, ROLE_NAMES } from '../contexts/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('admin@mosje.gov.in');
    const [password, setPassword] = useState('Admin@123');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    // Predefined demo accounts for quick access
    const demoAccounts = [
        { email: 'admin@mosje.gov.in', password: 'Admin@123', label: 'Central Admin', icon: '🏛️' },
        { email: 'finance@mosje.gov.in', password: 'Finance@123', label: 'Central Finance', icon: '💰' },
        { email: 'nodal.maharashtra@gov.in', password: 'Nodal@123', label: 'State Nodal (MH)', icon: '🏢' },
        { email: 'finance.maharashtra@gov.in', password: 'Finance@123', label: 'State Finance (MH)', icon: '💵' },
        { email: 'do.pune@gov.in', password: 'District@123', label: 'District Officer', icon: '🏘️' },
        { email: 'ia.pune@gov.in', password: 'Agency@123', label: 'Implementing Agency', icon: '🏗️' },
        { email: 'ea.abc@construction.com', password: 'Agency@123', label: 'Executing Agency', icon: '👷' },
        { email: 'auditor@mosje.gov.in', password: 'Auditor@123', label: 'Auditor', icon: '📊' }
    ];

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await login(email, password);
            
            if (result.success) {
                // Login successful, navigate to dashboard
                setTimeout(() => {
                    navigate('/dashboard', { replace: true });
                }, 100);
            } else {
                setError(result.message || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An error occurred. Please check if the backend server is running on port 5000.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDemoLogin = (demoEmail, demoPassword) => {
        setEmail(demoEmail);
        setPassword(demoPassword);
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <img src="/logos/pmajay.png" alt="PM-AJAY" className="login-logo" />
                    <h1 className="login-title">PM-AJAY Portal</h1>
                    <p className="login-subtitle">Ministry of Social Justice & Empowerment</p>
                </div>

                {error && (
                    <div style={{
                        padding: 'var(--space-3)',
                        marginBottom: 'var(--space-4)',
                        backgroundColor: 'var(--color-danger-light)',
                        color: 'var(--color-danger)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-danger)'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label className="form-label required">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label required">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-primary" 
                        style={{ width: '100%', marginTop: 'var(--space-4)' }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login to Dashboard'}
                    </button>
                </form>

                <div style={{ marginTop: 'var(--space-6)' }}>
                    <p style={{ textAlign: 'center', marginBottom: 'var(--space-3)', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>
                        Quick Demo Login
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-2)' }}>
                        {demoAccounts.map((account, index) => (
                            <button
                                key={index}
                                type="button"
                                className="btn btn-secondary"
                                style={{ 
                                    fontSize: 'var(--text-xs)', 
                                    padding: 'var(--space-2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-1)'
                                }}
                                onClick={() => handleDemoLogin(account.email, account.password)}
                                disabled={isLoading}
                            >
                                <span>{account.icon}</span>
                                <span>{account.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ marginTop: 'var(--space-6)', textAlign: 'center' }}>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                        <a href="#" style={{ color: 'var(--color-primary)' }}>Forgot Password?</a>
                    </p>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>
                        Don't have an account? <a href="#" style={{ color: 'var(--color-primary)' }}>Contact Admin</a>
                    </p>
                </div>

                <div className="alert alert-info" style={{ marginTop: 'var(--space-6)' }}>
                    <strong>🔒 Security Notice:</strong> This portal uses government-grade encryption and authentication.
                    All activities are logged for audit purposes.
                </div>
            </div>
        </div>
    );
};

export default Login;
