import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import PetListPage from "../PetListPage";

//mocks axios so it doesn't send actual API requests
vi.mock("axios");
//creates a typed version of the mocked axios object
const mockedAxios = vi.mocked(axios);
//creates a mock of Pet Card so the following tests are not reliant on it working
vi.mock("../../components/PetCard.js", () => ({default: ({ pet }: any) => (<div data-testid="pet-card">{pet.name}</div>)}));
//creates a mock of Map Component so the following tests are not reliant on it working
vi.mock("../../components/MapComponent.js", () => ({default: ({ pets }: any) => (<div data-testid="map">Map showing {pets.length} pets</div>)}));
//mock pet data
const mockPets = [
  {
    _id: "1",
    name: "Charlie",
    type: "Dog",
    city: "London",
    age: 3,
    image: "charlie.jpg",
  },
  {
    _id: "2",
    name: "Mittens",
    type: "Cat",
    city: "Manchester",
    age: 5,
    image: "mittens.jpg",
  },
];
//helper function that renders the page that avoids Memory Router setup in every test
const renderPage = () => {
  return render(
    <MemoryRouter>
      <PetListPage />
    </MemoryRouter>
  );
};



describe("PetListPage", () => {

  //clears all mocks before each test
  beforeEach(() => {vi.clearAllMocks();});

  //checks that rhe heading and filters are rendered
  it("renders page heading and filters", async () => {
    mockedAxios.get.mockResolvedValue({data: mockPets});
    renderPage();
    expect(screen.getByText("Available Pets for Adoption")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Type (e.g., Cat)")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("City")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Age")).toBeInTheDocument();
  });

  //checks that pets are fetched and displayed successfully
  it("fetches and displays pets", async () => {
    mockedAxios.get.mockResolvedValue({data: mockPets,});
    renderPage();
    await waitFor(() => {
      expect(screen.getByText("Charlie")).toBeInTheDocument();
      expect(screen.getByText("Mittens")).toBeInTheDocument();
    });
    expect(mockedAxios.get).toHaveBeenCalledWith("http://localhost:3000/pets");
  });

  //checks that pets get correctly filtered by type
  it("filters pets by type", async () => {
    mockedAxios.get.mockResolvedValue({data: mockPets,});
    renderPage();
    await waitFor(() => {expect(screen.getByText("Charlie")).toBeInTheDocument();});
    const typeInput = screen.getByPlaceholderText("Type (e.g., Cat)");
    fireEvent.change(typeInput, {target: {name: "type", value: "Cat",}});
    expect(screen.queryByText("Charlie")).not.toBeInTheDocument();
    expect(screen.getByText("Mittens")).toBeInTheDocument();
  });

  //checks that pets correctly get filtered by city
  it("filters pets by city", async () => {
    mockedAxios.get.mockResolvedValue({data: mockPets,});
    renderPage();
    await waitFor(() => {expect(screen.getByText("Charlie")).toBeInTheDocument();});
    const cityInput = screen.getByPlaceholderText("City");
    fireEvent.change(cityInput, {target: {name: "city", value: "Manchester"}});
    expect(screen.queryByText("Charlie")).not.toBeInTheDocument();
    expect(screen.getByText("Mittens")).toBeInTheDocument();
  });

  //checks that pets correctly get filtered by age
  it("filters pets by age", async () => {
    mockedAxios.get.mockResolvedValue({data: mockPets,});
    renderPage();
    await waitFor(() => {expect(screen.getByText("Charlie")).toBeInTheDocument();});
    const ageInput = screen.getByPlaceholderText("Age");
    fireEvent.change(ageInput, {target: { name: "age", value: "5"}});
    expect(screen.queryByText("Charlie")).not.toBeInTheDocument();
    expect(screen.getByText("Mittens")).toBeInTheDocument();
  });

  //checks that filtered pets are passed to the map component
  it("passes filtered pets to map component", async () => {
    mockedAxios.get.mockResolvedValue({data: mockPets,});
    renderPage();
    await waitFor(() => {expect(screen.getByTestId("map")).toHaveTextContent("Map showing 2 pets");});
    const typeInput = screen.getByPlaceholderText("Type (e.g., Cat)");
    fireEvent.change(typeInput, {target: {name: "type", value: "Dog"}});
    expect(screen.getByTestId("map")).toHaveTextContent("Map showing 1 pets");
  });

  //checks that the favourites page link is rendered
  it("renders favorites link", async () => {
    mockedAxios.get.mockResolvedValue({data: mockPets,});
    renderPage();
    const favouritesLink = screen.getByRole("link");
    expect(favouritesLink).toHaveAttribute("href", "/favorite");
  });

  //checks that a failed fetch is handled appropriately
  it("handles failed pet fetch", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockedAxios.get.mockRejectedValue(new Error("Failed request"));
    renderPage();
    await waitFor(() => {expect(consoleSpy).toHaveBeenCalledWith("Error fetching pets:", expect.any(Error));});
    consoleSpy.mockRestore();
  });
});