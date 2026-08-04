import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import PetCard from "../components/PetCard.js";
import "../styles/FavsPetPage.css";
import type { Pet } from '../models/Pets.js'

const FavoritePetsPage = (): JSX.Element => {
  const [favorites, setFavorites] = useState<Pet[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get<Pet[]>(
          "http://localhost:3000/favorite",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFavorites(response.data);
      } catch (error) {
        console.error("Error fetching favorite pets:", error);
      }
    };
    fetchFavorites();
  }, [token]);

  return (
    <div className="favorite-list">
      <h2 id="title">
        Favorite Pets
      </h2>
      <div className="pet-list">
        {favorites.map((pet) => (
          <div key={pet._id}>
            <PetCard pet={pet} />
            <Link to={`/pets/${pet._id}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritePetsPage;