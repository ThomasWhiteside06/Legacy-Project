import "../styles/Navbar.css";
import { Link, useNavigate } from "react-router-dom";

const Navbar = (): JSX.Element => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token on logout

    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h3>PetAdopt</h3>
      <div className="nav-links">
        {isLoggedIn ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
