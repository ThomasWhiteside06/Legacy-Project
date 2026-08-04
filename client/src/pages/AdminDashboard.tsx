import { Link, Route, Routes } from "react-router-dom";
import AdminPetList from "./AdminPetList.js";
import AdminMessages from "./AdminMessages.js";
import "../styles/AdminDashboard.css";

const AdminDashboard = (): JSX.Element => {
  return (
    <div className="admin-dashboard">
      <h2>Welcome to Your Dashboard</h2>
      <div className="dashboard-options">
        <Link to="/dashboard/list">
          <button>Pet Listings</button>
        </Link>
        <Link to="/dashboard/messages">
          <button>Messages</button>
        </Link>
      </div>

      <Routes>
        <Route path="/list" element={<AdminPetList />} />
        <Route path="/messages" element={<AdminMessages />} />
      </Routes>
    </div>
  );
};

export default AdminDashboard;
