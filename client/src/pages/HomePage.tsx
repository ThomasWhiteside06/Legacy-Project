import { Link } from "react-router-dom";
import "../styles/HomePage.css";
import { TbMessageFilled } from "react-icons/tb";
import { IoPersonAddSharp } from "react-icons/io5";
import { MdOutlinePets } from "react-icons/md";

const HomePage = (): JSX.Element => {
  return (
    <div className="homepage">
      <header>
        <h1>Welcome to PetAdopt</h1>
        <p>Your place to find pets waiting for a forever home.</p>
        <img
          src="/images/dashboard 3.jpg"
          alt="dashboard"
          className="dashboard-image"
        />
      </header>
      <section className="features">
        <div className="feature">
          <MdOutlinePets
            style={{
              color: "black",
              marginTop: "8px",
              fontSize: "30px",
            }}
          />
          <h2>Browse Pets</h2>
          <p>Explore a list of pets available for adoption.</p>
          <Link to="/pets">
            <button>
              View Pets
            </button>
          </Link>
        </div>
        <div className="feature">
          <IoPersonAddSharp
            style={{
              color: "black",
              marginTop: "8px",
              fontSize: "30px",
            }}
          />
          <h2>Sign Up as Shelter</h2>
          <p>Are you a shelter? Register to list pets for adoption.</p>
          <Link to="/register">
            <button>
              Register as Shelter
            </button>
          </Link>
        </div>
        <div className="feature">
          <TbMessageFilled
            style={{
              color: "black",
              marginTop: "8px",
              fontSize: "30px",
            }}
          />
          <h2>Contact Us</h2>
          <p>Have questions? Reach out to us anytime.</p>
          <Link to="/contact">
            <button>
              Contact Us
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;