import React from 'react';


const Dashboard = () => {
    return (
        <div className="dashboard-container">
            <h1>Dashboard</h1>
            <div className="dashboard-content">
                <div className="dashboard-card">
                    <h2>Welcome</h2>
                    <p>Welcome to your dashboard. Here you can manage your account and view your statistics.</p>
                </div>
                <div className="dashboard-stats">
                    <div className="stat-card">
                        
                        <h3>Total Orders</h3>
                        <p>0</p>
                    </div>
                    <div className="stat-card">
                        <h3>Active Orders</h3>
                        <p>0</p>
                    </div>
                    <div className="stat-card">
                        <h3>Completed Orders</h3>
                        <p>0</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;