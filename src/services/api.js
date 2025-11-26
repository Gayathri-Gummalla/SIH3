import axios from 'axios';

// Base API URL - update this if backend is on different port/host
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds
});

// Request interceptor - Add auth token to all requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('pm_ajay_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle 401 - Unauthorized
        if (error.response?.status === 401) {
            localStorage.removeItem('pm_ajay_token');
            localStorage.removeItem('pm_ajay_user');
            window.location.href = '/login';
        }
        
        // Handle network errors
        if (!error.response) {
            console.error('Network error:', error.message);
            return Promise.reject({
                message: 'Network error. Please check if the backend server is running.',
                error: error.message
            });
        }
        
        return Promise.reject(error.response?.data || error);
    }
);

// ============================================
// AUTHENTICATION SERVICES
// ============================================

export const authService = {
    // Login
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.success && response.data.data) {
            const { token, user } = response.data.data;
            localStorage.setItem('pm_ajay_token', token);
            localStorage.setItem('pm_ajay_user', JSON.stringify(user));
            return { success: true, user, token };
        }
        return response.data;
    },

    // Register new user
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    // Get current user profile
    getProfile: async () => {
        const response = await api.get('/auth/profile');
        return response.data;
    },

    // Update profile
    updateProfile: async (updates) => {
        const response = await api.put('/auth/profile', updates);
        return response.data;
    },

    // Change password
    changePassword: async (currentPassword, newPassword) => {
        const response = await api.post('/auth/change-password', {
            currentPassword,
            newPassword
        });
        return response.data;
    },

    // Get all users (admin only)
    getUsers: async () => {
        const response = await api.get('/auth/users');
        return response.data;
    },

    // Logout
    logout: () => {
        localStorage.removeItem('pm_ajay_token');
        localStorage.removeItem('pm_ajay_user');
    }
};

// ============================================
// SANCTION SERVICES (Central Admin)
// ============================================

export const sanctionService = {
    // Create new sanction
    createSanction: async (sanctionData) => {
        const response = await api.post('/sanctions', sanctionData);
        return response.data;
    },

    // Upload sanction PDF
    uploadSanctionPDF: async (sanctionId, file) => {
        const formData = new FormData();
        formData.append('pdf', file);
        const response = await api.post(`/sanctions/${sanctionId}/upload-pdf`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Approve sanction
    approveSanction: async (sanctionId, approvalData) => {
        const response = await api.post(`/sanctions/${sanctionId}/approve`, approvalData);
        return response.data;
    },

    // Reject sanction
    rejectSanction: async (sanctionId, reason) => {
        const response = await api.post(`/sanctions/${sanctionId}/reject`, { reason });
        return response.data;
    },

    // Confirm fund transfer
    confirmFundTransfer: async (allocationId, transferData) => {
        const response = await api.post(`/sanctions/allocations/${allocationId}/confirm`, transferData);
        return response.data;
    },

    // Get all sanctions
    getSanctions: async (filters = {}) => {
        const response = await api.get('/sanctions', { params: filters });
        return response.data;
    },

    // Get sanction by ID
    getSanctionById: async (sanctionId) => {
        const response = await api.get(`/sanctions/${sanctionId}`);
        return response.data;
    },

    // Get national KPIs
    getNationalKPIs: async () => {
        const response = await api.get('/sanctions/kpis/national');
        return response.data;
    }
};

// ============================================
// PROJECT SERVICES (State Nodal, Agencies)
// ============================================

export const projectService = {
    // Create new project
    createProject: async (projectData) => {
        const response = await api.post('/projects', projectData);
        return response.data;
    },

    // Assign implementing agency
    assignImplementingAgency: async (projectId, agencyData) => {
        const response = await api.post(`/projects/${projectId}/assign-implementing-agency`, agencyData);
        return response.data;
    },

    // Assign executing agency
    assignExecutingAgency: async (projectId, agencyData) => {
        const response = await api.post(`/projects/${projectId}/assign-executing-agency`, agencyData);
        return response.data;
    },

    // Respond to assignment (accept/reject)
    respondToAssignment: async (assignmentId, status, reason) => {
        const response = await api.post(`/projects/assignments/${assignmentId}/respond`, {
            status,
            reason
        });
        return response.data;
    },

    // Submit assignment details
    submitAssignment: async (projectId, assignmentDetails) => {
        const response = await api.post(`/projects/${projectId}/submit-assignment`, assignmentDetails);
        return response.data;
    },

    // Submit progress update
    submitProgress: async (projectId, progressData) => {
        const response = await api.post(`/projects/${projectId}/progress`, progressData);
        return response.data;
    },

    // Submit Utilization Certificate
    submitUC: async (projectId, ucData) => {
        const response = await api.post(`/projects/${projectId}/uc`, ucData);
        return response.data;
    },

    // Review UC (approve/reject/query)
    reviewUC: async (ucId, reviewData) => {
        const response = await api.post(`/projects/uc/${ucId}/review`, reviewData);
        return response.data;
    },

    // Request tranche
    requestTranche: async (projectId, trancheData) => {
        const response = await api.post(`/projects/${projectId}/request-tranche`, trancheData);
        return response.data;
    },

    // Release tranche
    releaseTranche: async (trancheId, releaseData) => {
        const response = await api.post(`/projects/tranches/${trancheId}/release`, releaseData);
        return response.data;
    },

    // Get all projects
    getProjects: async (filters = {}) => {
        const response = await api.get('/projects', { params: filters });
        return response.data;
    },

    // Get project by ID
    getProjectById: async (projectId) => {
        const response = await api.get(`/projects/${projectId}`);
        return response.data;
    },

    // Get delayed projects
    getDelayedProjects: async () => {
        const response = await api.get('/projects/delayed');
        return response.data;
    }
};

// ============================================
// ESCALATION SERVICES
// ============================================

export const escalationService = {
    // Get all escalations
    getEscalations: async (filters = {}) => {
        const response = await api.get('/escalations', { params: filters });
        return response.data;
    },

    // Get escalation by ID
    getEscalationById: async (escalationId) => {
        const response = await api.get(`/escalations/${escalationId}`);
        return response.data;
    },

    // Resolve escalation
    resolveEscalation: async (escalationId, resolution) => {
        const response = await api.post(`/escalations/${escalationId}/resolve`, { resolution });
        return response.data;
    },

    // Create manual escalation
    createEscalation: async (escalationData) => {
        const response = await api.post('/escalations', escalationData);
        return response.data;
    },

    // Trigger escalation check (admin only)
    triggerEscalationCheck: async () => {
        const response = await api.post('/escalations/trigger-check');
        return response.data;
    },

    // Get escalation statistics
    getEscalationStats: async () => {
        const response = await api.get('/escalations/stats');
        return response.data;
    }
};

// ============================================
// NOTIFICATION SERVICES
// ============================================

export const notificationService = {
    // Get all notifications
    getNotifications: async (filters = {}) => {
        const response = await api.get('/notifications', { params: filters });
        return response.data;
    },

    // Get unread count
    getUnreadCount: async () => {
        const response = await api.get('/notifications/unread-count');
        return response.data;
    },

    // Mark as read
    markAsRead: async (notificationId) => {
        const response = await api.post(`/notifications/${notificationId}/read`);
        return response.data;
    },

    // Mark all as read
    markAllAsRead: async () => {
        const response = await api.post('/notifications/mark-all-read');
        return response.data;
    },

    // Send test notification
    sendTestNotification: async (testData) => {
        const response = await api.post('/notifications/test', testData);
        return response.data;
    }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₹0';
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
};

export const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const getStatusColor = (status) => {
    const colors = {
        pending: 'var(--color-warning)',
        approved: 'var(--color-success)',
        rejected: 'var(--color-danger)',
        ongoing: 'var(--color-info)',
        completed: 'var(--color-success)',
        delayed: 'var(--color-danger)',
        active: 'var(--color-success)',
        inactive: 'var(--color-secondary)',
        resolved: 'var(--color-success)',
        unresolved: 'var(--color-warning)'
    };
    return colors[status?.toLowerCase()] || 'var(--color-secondary)';
};

export default api;
