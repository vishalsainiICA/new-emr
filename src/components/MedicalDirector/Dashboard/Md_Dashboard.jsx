import { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import "./Md_dashboard.css"; // <-- tumhara existing CSS

const Md_Dashboard = () => {

    const [activeView, setActiveView] = useState("dashboard");
    const [collapsed, setCollapsed] = useState(false);
    const [toast, setToast] = useState("");

    /* ================= TOAST ================= */
    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(""), 3000);
    };

    /* ================= CHART ================= */
    useEffect(() => {
        if (activeView !== "dashboard") return;

        const canvas = document.getElementById("mainChart");
        if (!canvas) return;

        const chart = new Chart(canvas, {
            type: "line",
            data: {
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                datasets: [
                    {
                        label: "Revenue (Lakhs)",
                        data: [2.5, 3.2, 2.8, 4.1, 3.9, 4.5, 4.2],
                        borderColor: "#2563eb",
                        backgroundColor: "rgba(37,99,235,0.05)",
                        fill: true,
                        tension: 0.4,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                maintainAspectRatio: false,
            },
        });

        return () => chart.destroy();
    }, [activeView]);

    return (
        <>
            {/* ================= SIDEBAR ================= */}
            <nav className={`sidebar ${collapsed ? "collapsed" : ""}`}>
                <div className="brand-area">
                    <i className="fa-solid fa-user-md brand-icon"></i>
                    <span className="brand-text">Dr. Percha</span>
                    <button
                        className="sidebar-toggle"
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        <i className="fa-solid fa-bars"></i>
                    </button>
                </div>

                <div className="nav-menu">
                    <div className="nav-label">Main</div>

                    <div
                        className={`nav-item ${activeView === "dashboard" ? "active" : ""}`}
                        onClick={() => setActiveView("dashboard")}
                    >
                        <i className="fa-solid fa-chart-pie"></i>
                        <span>Dashboard</span>
                    </div>

                    <div
                        className={`nav-item ${activeView === "patients" ? "active" : ""}`}
                        onClick={() => setActiveView("patients")}
                    >
                        <i className="fa-solid fa-user-injured"></i>
                        <span>Patients</span>
                    </div>

                    <div
                        className={`nav-item ${activeView === "doctors" ? "active" : ""}`}
                        onClick={() => setActiveView("doctors")}
                    >
                        <i className="fa-solid fa-user-doctor"></i>
                        <span>Doctors</span>
                    </div>
                </div>
            </nav>

            {/* ================= MAIN ================= */}
            <div className="main-wrapper">
                <header className="top-header">
                    <div className="page-title">
                        {activeView === "dashboard" && "Dashboard Overview"}
                        {activeView === "patients" && "Patient Management"}
                        {activeView === "doctors" && "Medical Staff"}
                    </div>
                </header>

                <div className="content">

                    {/* ============ DASHBOARD ============ */}
                    {activeView === "dashboard" && (
                        <div className="view-section active">
                            <div className="grid-kpi">
                                <div className="kpi-card">
                                    <div className="kpi-title">Total Revenue</div>
                                    <div className="kpi-value">₹ 12.5M</div>
                                </div>
                                <div className="kpi-card">
                                    <div className="kpi-title">Live Queue</div>
                                    <div className="kpi-value">18</div>
                                </div>
                            </div>

                            <div className="panel">
                                <div className="panel-header">
                                    <span>Revenue Performance</span>
                                    <button
                                        className="btn btn-ghost"
                                        onClick={() => showToast("Exporting Report")}
                                    >
                                        <i className="fa-solid fa-download"></i>
                                    </button>
                                </div>
                                <div style={{ height: 300 }}>
                                    <canvas id="mainChart"></canvas>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ============ PATIENTS ============ */}
                    {activeView === "patients" && (
                        <div className="view-section active">
                            <div className="panel">
                                <div className="panel-header">
                                    <span>Patient Directory</span>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => showToast("Create Patient")}
                                    >
                                        + New Patient
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ============ DOCTORS ============ */}
                    {activeView === "doctors" && (
                        <div className="view-section active">
                            <div className="panel">
                                <div className="panel-header">
                                    <span>Physician Directory</span>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* ================= TOAST ================= */}
            {toast && <div id="toast" className="show">{toast}</div>}
        </>
    );
};

export default Md_Dashboard;
