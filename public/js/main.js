:root {
    --primary-color: #4e73df;
    --success-color: #1cc88a;
    --info-color: #36b9cc;
    --warning-color: #f6c23e;
    --danger-color: #e74a3b;
    --dark-color: #5a5c69;
    --light-color: #f8f9fc;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background-color: var(--light-color);
    min-height: 100vh;
}

/* Auth Pages */
.auth-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--primary-color) 0%, #224abe 100%);
}

.auth-card {
    background: white;
    border-radius: 1rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    width: 100%;
    max-width: 400px;
    padding: 2rem;
}

.auth-header {
    text-align: center;
    margin-bottom: 2rem;
}

.auth-header h2 {
    color: var(--primary-color);
    font-weight: 700;
}

.auth-header p {
    color: #858796;
}

/* Dashboard Layout */
.dashboard-wrapper {
    display: flex;
    min-height: 100vh;
}

.sidebar {
    width: 250px;
    background: linear-gradient(180deg, var(--primary-color) 0%, #224abe 100%);
    color: white;
    transition: all 0.3s;
}

.sidebar-header {
    padding: 1.5rem;
    text-align: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header h3 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
}

.sidebar-nav {
    padding: 1rem 0;
}

.sidebar-nav a {
    display: flex;
    align-items: center;
    padding: 0.75rem 1.5rem;
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    transition: all 0.3s;
}

.sidebar-nav a:hover,
.sidebar-nav a.active {
    background: rgba(255, 255, 255, 0.1);
    color: white;
}

.sidebar-nav a i {
    margin-right: 0.75rem;
    width: 20px;
    text-align: center;
}

.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.top-navbar {
    background: white;
    padding: 1rem 2rem;
    box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.user-info span {
    font-weight: 600;
    color: var(--dark-color);
}

.btn-logout {
    background: none;
    border: 1px solid var(--danger-color);
    color: var(--danger-color);
    padding: 0.375rem 1rem;
    border-radius: 0.35rem;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-logout:hover {
    background: var(--danger-color);
    color: white;
}

.content-wrapper {
    padding: 2rem;
    flex: 1;
}

/* Cards */
.card {
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.1);
    margin-bottom: 1.5rem;
}

.card-header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e3e6f0;
    font-weight: 700;
    color: var(--primary-color);
}

.card-body {
    padding: 1.5rem;
}

/* Stats Cards */
.stats-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.stat-card {
    background: white;
    border-radius: 0.5rem;
    padding: 1.5rem;
    box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.1);
    border-left: 4px solid;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.stat-card.primary { border-left-color: var(--primary-color); }
.stat-card.success { border-left-color: var(--success-color); }
.stat-card.info { border-left-color: var(--info-color); }
.stat-card.warning { border-left-color: var(--warning-color); }

.stat-info h4 {
    font-size: 0.875rem;
    color: #858796;
    margin-bottom: 0.5rem;
}

.stat-info .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--dark-color);
}

.stat-icon {
    font-size: 2rem;
    color: #dddfeb;
}

/* Forms */
.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--dark-color);
}

.form-control {
    width: 100%;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border: 1px solid #d1d3e2;
    border-radius: 0.35rem;
    transition: border-color 0.3s;
}

.form-control:focus {
    outline: none;
    border-color: var(--primary-color);
}

/* Buttons */
.btn {
    display: inline-block;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    border-radius: 0.35rem;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-primary {
    background: var(--primary-color);
    color: white;
}

.btn-primary:hover {
    background: #2e59d9;
}

.btn-success {
    background: var(--success-color);
    color: white;
}

.btn-success:hover {
    background: #17a673;
}

.btn-block {
    display: block;
    width: 100%;
}

/* Tables */
.table-responsive {
    overflow-x: auto;
}

.table {
    width: 100%;
    border-collapse: collapse;
}

.table th,
.table td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #e3e6f0;
}

.table th {
    font-weight: 700;
    color: var(--dark-color);
    background: #f8f9fc;
}

.table tbody tr:hover {
    background: #f8f9fc;
}

/* Alerts */
.alert {
    padding: 1rem;
    border-radius: 0.35rem;
    margin-bottom: 1rem;
}

.alert-success {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.alert-danger {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}

/* Utility Classes */
.text-center { text-align: center; }
.mt-3 { margin-top: 1rem; }
.mb-3 { margin-bottom: 1rem; }
.mb-4 { margin-bottom: 1.5rem; }

/* Profit/Loss Display */
.profit-loss-summary {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.summary-card {
    background: white;
    padding: 1.5rem;
    border-radius: 0.5rem;
    text-align: center;
    box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.1);
}

.summary-card h4 {
    color: #858796;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
}

.summary-card .amount {
    font-size: 2rem;
    font-weight: 700;
}

.summary-card.profit .amount { color: var(--success-color); }
.summary-card.loss .amount { color: var(--danger-color); }

.status-badge {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    font-weight: 600;
}

.status-badge.profit {
    background: #d4edda;
    color: #155724;
}

.status-badge.loss {
    background: #f8d7da;
    color: #721c24;
}

/* Responsive */
@media (max-width: 768px) {
    .dashboard-wrapper {
        flex-direction: column;
    }
    
    .sidebar {
        width: 100%;
    }
    
    .stats-row {
        grid-template-columns: 1fr;
    }
    
    .profit-loss-summary {
        grid-template-columns: 1fr;
    }
}