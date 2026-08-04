import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/AdminEditPage.css";

interface Pet {
  name: string;
  age: string;
  image: string;
}

const AdminEditPage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>(); // Ensure `id` is obtained correctly
  const [pet, setPet] = useState<Pet>({
    name: "",
    age: "",
    image: "",
  });
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState<File|null>(null);  
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    if (!id) return; // Prevent API call if `id` is undefined

    const fetchPet = async () => {
      try {
        const response = await axios.get<Pet>(`http://localhost:3000/pets/${id}`);
        setPet(response.data);
      } catch (error) {
        console.error("Error fetching pet details:", error);
      }
    };

    fetchPet();
  }, [id]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPet({ ...pet, [name]: value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]!);
    }
  };

  const handleEditSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const updatedPet: Pet = { ...pet };

      if (imageFile) {
        // Upload image file here and get the URL
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "petAdopt");

        const uploadResponse = await axios.post(
          process.env.CLOUDINARY_URL!,
          formData
        );

        updatedPet.image = uploadResponse.data.secure_url; // Update with new image URL
      }

      await axios.put(
        `http://localhost:3000/dashboard/pets/${id}`,
        updatedPet,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigate(`/pets/${id}`);
    } catch (error) {
      console.error("Error updating pet:", error);
    }
  };

  return (
    <div className="edit-page-container">
      {userRole === "shelter" && (
        <form onSubmit={handleEditSubmit} className="edit-form">
          <input
            type="text"
            name="name"
            value={pet.name}
            onChange={handleInputChange}
            placeholder="Name"
            required
          />

          <input
            type="number"
            name="age"
            placeholder="Age"
            value={pet.age}
            onChange={handleInputChange}
            required
          />

          <input type="file" name="image" onChange={handleFileChange} />

          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default AdminEditPage;
