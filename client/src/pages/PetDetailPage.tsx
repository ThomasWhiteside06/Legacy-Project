import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/PetDetailPage.css";
import { FaPhone, FaEdit, FaHeart } from "react-icons/fa";
import { BiSolidHomeHeart } from "react-icons/bi";
import { FaLocationDot } from "react-icons/fa6";
import { MdEmail, MdDelete } from "react-icons/md";
import type { Pet } from '../models/Pets.js'

interface Location {
  lat: number;
  lng: number;
}

interface FavoritePet {
  _id: string;
}

interface GeocodeResponse {
  address?: {
    city?: string;
    town?: string;
    village?: string;
  };
}

interface FavoriteToggleResponse {
  pet: {
    favorite: boolean;
  };
}

const PetDetailPage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();

  const [pet, setPet] = useState<Pet | null>(null);
  const [cityName, setCityName] = useState<string>("");
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    const fetchPet = async () => {
      if (!id) return;

      try {
        const response = await axios.get<Pet>(
          `http://localhost:3000/pets/${id}`
        );

        setPet(response.data);

        const { lat, lng } = response.data.location;

        if (lat && lng) {
          const geocodeResponse = await axios.get<GeocodeResponse>(
            "https://nominatim.openstreetmap.org/reverse",
            {
              params: {
                lat,
                lon: lng,
                format: "json",
              },
            }
          );

          setCityName(
            geocodeResponse.data.address?.city ||
              geocodeResponse.data.address?.town ||
              geocodeResponse.data.address?.village ||
              "Location not available"
          );
        }

        const favoritesResponse = await axios.get<FavoritePet[]>(
          "http://localhost:3000/favorite",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setIsFavorite(
          favoritesResponse.data.some(
            (favPet) => favPet._id === id
          )
        );
      } catch (error) {
        console.error("Error fetching pet details:", error);
      }
    };

    fetchPet();
  }, [id, token]);

  const handleFavoriteToggle = async () => {
    if (!id) return;

    try {
      const response = await axios.post<FavoriteToggleResponse>(
        `http://localhost:3000/favorite/${id}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsFavorite(response.data.pet.favorite);
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    console.log("Deleting pet with id:", id);

    try {
      await axios.delete(
        `http://localhost:3000/dashboard/pets/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/dashboard/list");
    } catch (error) {
      console.error("Error deleting pet:", error);
    }
  };

  const handleEdit = () => {
    if (!id) return;

    navigate(`/pets/${id}/edit`);
  };

  if (!pet) {
    return <p>Loading...</p>;
  }

  return (
    <div className="pet-details">
      <div className="pet-details-info">
        {token && userRole === "shelter" && (
          <div className="admin-actions">
            <button
              onClick={handleEdit}
              className="edit-button"
            >
              <FaEdit size={24} />
            </button>

            <button
              onClick={handleDelete}
              className="delete-button"
            >
              <MdDelete size={24} />
            </button>
          </div>
        )}
        <h2 id="name">{pet.name}</h2>
        <p>Age: {pet.age}</p>
        <p>Gender: {pet.gender}</p>
        <h4>Shelter Details</h4>
        <p>
          <FaLocationDot
            style={{
              color: "black",
              marginRight: "8px",
            }}
          />
          {cityName}
        </p>
        <p>
          <BiSolidHomeHeart
            style={{
              color: "black",
              marginRight: "8px",
            }}
          />
          {pet.shelterName}
        </p>
        <p>
          <FaPhone
            style={{
              color: "black",
              marginRight: "8px",
            }}
          />
          {pet.phone}
        </p>
        <p>
          <MdEmail
            style={{
              color: "black",
              marginRight: "8px",
            }}
          />
          {pet.email}
        </p>
      </div>
      <div className="img-and-contact">
        <img
          src={pet.image}
          alt={pet.name}
          className="pet-details-image"
        />
        {token && userRole === "adopter" && (
          <div className="text">
            <p className="bold">
              <strong>
                Interested in adopting {pet.name}? Let’s Connect!
              </strong>
            </p>
            <p className="p1">
              Feel free to reach out in the way that works best for you:
            </p>
            <p className="p2">
              Contact us <Link to="/contact">Here</Link>, drop us an email,
              or give us a call.
            </p>
            <p className="p3">
              We’re here to help make the journey easy and enjoyable.
            </p>
          </div>
        )}
        {token && userRole === "adopter" && (
          <div>
            <button
              onClick={handleFavoriteToggle}
              className="favorite-button"
            >
              {isFavorite ? (<FaHeart color="red" size={18} />) : (<FaHeart color="grey" size={18} />)}
              {isFavorite ? " Unheart This Pet" : " Heart This Pet"}
            </button>
            <Link
              to="/favorite"
              className="floating-favorites-button"
            >
              \❤️/
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetDetailPage;