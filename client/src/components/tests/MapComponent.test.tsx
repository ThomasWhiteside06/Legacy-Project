import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MapComponent from "../MapComponent.js";
import type { Pet } from "../../models/Pets.js";

// mock react leaflet - offers simple html rather than rendering a proper interactive map
vi.mock("react-leaflet", () => ({
  //map
  MapContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="map">{children}</div>
  ),
  //marker
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="marker">{children}</div>
  ),
  //pet info
  Popup: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));



describe("MapComponent", () => {

  //mock pet data
  const pets: Pet[] = [
    {
      _id: "123",
      name: "Bella",
      type: 'dog',
      gender: 'female',
      shelterName: 'Test Shelter Name',
      phone: '01234 567890',
      email: 'testemail@test.com',
      age: 10,
      city: 'Test City',
      location: {lat: 1, lng: 1},
      image: "/bella.jpg", 
    },
    {
      _id: "456",
      name: "Ginger",
      type: "Cat",
      gender: "Male",
      shelterName: "Test Shelter Name 2",
      phone: "01234 567891",
      email: "cats@test.com",
      age: 2,
      image: "/ginger.jpg",
      location: {
        lat: 51.6,
        lng: -0.08,
      },
    },
  ];

  //checks that the map renders
  test("renders the map", () => {
    render(
      <MemoryRouter>
        <MapComponent pets={pets} />
      </MemoryRouter>
    );
    expect(screen.getByTestId("map")).toBeInTheDocument();
  });

  //checks that all the markers are rendered
  test("renders a marker for each pet", () => {
    render(
      <MemoryRouter>
        <MapComponent pets={pets} />
      </MemoryRouter>
    );
    expect(screen.getAllByTestId("marker")).toHaveLength(2);
  });

  //checks that all the information that should be displayed, is displayed
  test("displays each pet's information", () => {
    render(
      <MemoryRouter>
        <MapComponent pets={pets} />
      </MemoryRouter>
    );
    expect(screen.getByText("Bella")).toBeInTheDocument();
    expect(screen.getByText("Ginger")).toBeInTheDocument();
    expect(screen.getByText("Age: 10")).toBeInTheDocument();
    expect(screen.getByText("Age: 2")).toBeInTheDocument();
    expect(screen.getByText("Shelter: Test Shelter Name")).toBeInTheDocument();
    expect(screen.getByText("Shelter: Test Shelter Name 2")).toBeInTheDocument();
  });

  //checks that the markers have links to the details page for the correct pet
  test("creates links to the pet details pages", () => {
    render(
      <MemoryRouter>
        <MapComponent pets={pets} />
      </MemoryRouter>
    );
    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/pets/123");
    expect(links[1]).toHaveAttribute("href", "/pets/456");
  });

  //tests that the page handles it correctly when there is no shelter name
  test("shows fallback shelter text when shelter name is missing", () => {
    const petWithoutShelter: Pet[] = [{...pets[0]!, shelterName: ""}];
    render(
      <MemoryRouter>
        <MapComponent pets={petWithoutShelter} />
      </MemoryRouter>
    );
    expect(screen.getByText(/No Shelter Name/i)).toBeInTheDocument();
  });
});