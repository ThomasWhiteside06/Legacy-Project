import { useEffect, useState, type ChangeEvent } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import PetCard from "../components/PetCard.js";
import MapComponent from "../components/MapComponent.js";
import "../styles/PetListPage.css";
import type { Pet } from '../models/Pets.js'

interface Filters {
  type: string;
  city: string;
  age: string;
}

const PetListPage = (): JSX.Element => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [filters, setFilters] = useState<Filters>({
    type: "",
    city: "",
    age: "",
  });
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get<Pet[]>(
          "http://localhost:3000/pets"
        );
        setPets(response.data);
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };
    fetchPets();
  }, []);

  const handleFilterChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const filteredPets = pets.filter((pet) => {
    return (
      (filters.type ? pet.type?.toLowerCase() === filters.type.toLowerCase() : true) &&
      (filters.city ? pet.city ?.toLowerCase().includes(filters.city.toLowerCase()) : true) &&
      (filters.age ? pet.age === parseInt(filters.age) : true)
    );
  });

  return (
    <div className="pet-list-page">
      <MapComponent pets={filteredPets} />
      <h2>Available Pets for Adoption</h2>
      <div className="filter-form">
        <input
          type="text"
          name="type"
          placeholder="Type (e.g., Cat)"
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          onChange={handleFilterChange}
        />
      </div>
      <div className="pet-list">
        {filteredPets.map((pet) => (
          <div key={pet._id}>
            <PetCard pet={pet} />
            <Link to={`/pets/${pet._id}`} />
          </div>
        ))}
      </div>
      <Link
        to="/favorite"
        className="floating-favorites-button"
      >
        \❤️/
      </Link>
    </div>
  );
};

export default PetListPage;