import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import PetCard from "../components/PetCard.js";
import "../styles/AdminPetList.css";
import type { Pet } from '../models/Pets.js'

interface NewPet {
  name: string;
  type: string;
  gender: string;
  shelterName: string;
  phone: string;
  email: string;
  age: string;
  location: string;
  image: string;
}

interface GeocodeResult {
  lat: number;
  lng: number;
}

interface NominatimResult {
  lat: string;
  lon: string;
}

const AdminPetList = (): JSX.Element => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newPet, setNewPet] = useState<NewPet>({
    name: "",
    type: "",
    gender: "",
    shelterName: "",
    phone: "",
    email: "",
    age: "",
    location: "",
    image: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get<Pet[]>(
          "http://localhost:3000/dashboard/pets",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPets(response.data);
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };

    fetchPets();
  }, [token]);

  const handleAddPetClick = () => {
    setShowAddForm(true);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setNewPet((prevPet) => ({
      ...prevPet,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
  };

  const geocodeCity = async (
    cityName: string
  ): Promise<GeocodeResult> => {
    try {
      const response = await axios.get<NominatimResult[]>(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: cityName,
            format: "json",
            limit: 1,
          },
        }
      );
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0]!;
        return {lat: parseFloat(lat), lng: parseFloat(lon),};
      }

      throw new Error("No results found");
    } catch (error) {
      console.error("Error geocoding location:", error);

      return {
        lat: 0,
        lng: 0,
      };
    }
  };

  const handleAddPetSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!imageFile) return;

    try {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "petAdopt");

      const cloudinaryRes = await axios.post(
        process.env.CLOUDINARY_URL!,
        formData
      );

      const imageUrl = cloudinaryRes.data.secure_url;

      const { lat, lng } = await geocodeCity(newPet.location);

      const newPetData = {
        ...newPet,
        location: { lat, lng },
        image: imageUrl,
      };

      const response = await axios.post<Pet>(
        "http://localhost:3000/pets",
        newPetData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPets((prevPets) => [...prevPets, response.data]);

      setShowAddForm(false);

      setNewPet({
        name: "",
        type: "",
        gender: "",
        shelterName: "",
        phone: "",
        email: "",
        age: "",
        location: "",
        image: "",
      });

      setImageFile(null);
    } catch (error) {
      console.error("Error uploading pet:", error);
    }
  };

  return (
    <div className="Adminpet-list-page">
      {userRole === "shelter" && (
        <button onClick={handleAddPetClick}>
          New Pet
        </button>
      )}

      {showAddForm && (
        <form
          onSubmit={handleAddPetSubmit}
          className="add-pet-form"
        >
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newPet.name}
            onChange={handleInputChange}
            required
          />

          <input
            type="text"
            name="type"
            placeholder="Type (e.g., Dog, Cat)"
            value={newPet.type}
            onChange={handleInputChange}
            required
          />

          <input
            type="text"
            name="gender"
            placeholder="Gender"
            value={newPet.gender}
            onChange={handleInputChange}
            required
          />

          <input
            type="text"
            name="shelterName"
            placeholder="Shelter"
            value={newPet.shelterName}
            onChange={handleInputChange}
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Contact Number"
            value={newPet.phone}
            onChange={handleInputChange}
            required
          />

          <input
            type="text"
            name="email"
            placeholder="Email"
            value={newPet.email}
            onChange={handleInputChange}
            required
          />

          <input
            type="number"
            name="age"
            placeholder="Age"
            value={newPet.age}
            onChange={handleInputChange}
            required
          />

          <input
            type="text"
            name="location"
            placeholder="City Name"
            value={newPet.location}
            onChange={handleInputChange}
            required
          />

          <input
            type="file"
            name="image"
            onChange={handleFileChange}
          />

          <button type="submit">
            Submit
          </button>
        </form>
      )}

      <div className="pet-list">
        {pets.map((pet) => (
          <div key={pet._id}>
            <PetCard pet={pet} />
            <Link to={`/pets/${pet._id}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPetList;