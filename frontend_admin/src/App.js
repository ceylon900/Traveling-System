import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Sidebar from "./components/Sidebar"; 
import "./App.css";
import ManageMasterData from "./pages/FeaturesManagement";
import UserManagement from "./pages/UserManagement";
import BusinessManagement from "./pages/BusinessManagement";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-content">
        <Outlet /> 
      </div>
    </div>
  );
};

function App() {
  const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem("adminToken"));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAdmin(!!localStorage.getItem("adminToken"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />

        <Route element={isAdmin ? <AdminLayout /> : <Navigate to="/" />}>
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/packagesfeatures" element={<ManageMasterData />} />
          <Route path="/businessesusermanagement" element={<BusinessManagement />} />
          <Route path="/usersmanagement" element={<UserManagement />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;