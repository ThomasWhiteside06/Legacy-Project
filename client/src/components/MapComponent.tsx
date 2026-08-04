import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import type { Pet } from '../models/Pets.js'

interface MapComponentProps {
  pets: Pet[];
}

const MapComponent = ({ pets }: MapComponentProps): JSX.Element => {
  // Generate random offsets to avoid marker overlap for pets with the same location
  const getRandomOffset = (): number =>
    (Math.random() - 0.5) * 0.001;

  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      style={{
        height: "300px",
        width: "100%",
        marginTop: "20px",
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {pets.map((pet) => (
        <Marker
          key={pet._id}
          position={[
            pet.location.lat + getRandomOffset(),
            pet.location.lng + getRandomOffset(),
          ]}
        >
          <Popup>
            <h3>{pet.name}</h3>
            <p>Age: {pet.age}</p>
            <p>Shelter: {pet.shelterName || "No Shelter Name"}</p>
            <Link to={`/pets/${pet._id}`}>
              View Details
            </Link>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;