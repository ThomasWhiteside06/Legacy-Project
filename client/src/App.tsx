import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage.js";
import LoginPage from "./pages/LoginPage.js";
import PetListPage from "./pages/PetListPage.js";
import PetDetailPage from "./pages/PetDetailPage.js";
import HomePage from "./pages/HomePage.js";
import ContactPage from "./pages/ContactPage.js";
import AdminDashboard from "./pages/AdminDashboard.js";
import Navbar from "./components/Navbar.js";
import Footer from "./components/Footer.js";
import "./App.css";
import AdminEditPage from "./pages/AdminEditPage.js";
import FavoritePetsPage from "./pages/FavsPetPage.js";

function App() : JSX.Element {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/pets" element={<PetListPage />} />
            <Route path="/pets/:id" element={<PetDetailPage />} />
            <Route path="/favorite" element={<FavoritePetsPage />} />
            {/* the star means the following or nested paths */}
            <Route path="/dashboard/*" element={<AdminDashboard />} />
            <Route path="/pets/:id/edit" element={<AdminEditPage />} />

            {/* Add other routes here */}
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
