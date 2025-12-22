
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RedirectToDashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        // If no token → Login page
        if (!token) {
            navigate("/login", { replace: true });
            return;
        }

        // Navigate by role
        if (role === "superadmin") {
            navigate("/super-admin/dashboard", { replace: true });
        }
        else if (role === "medicalDirector") {
            navigate("/md/dashboard", { replace: true });
        }
        else if (role === "doctor") {
            navigate("/doctor", { replace: true });
        }
        else if (role === "perosnalAssistant") {
            navigate("/pa", { replace: true });
        }

        else {
            navigate("/login", { replace: true }); // unknown role
        }
    }, [navigate]);

    return null; // UI nahi chahiye
};

export default RedirectToDashboard;
