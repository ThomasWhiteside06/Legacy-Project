import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import PetDetailPage from "../PetDetailPage.js";

//mocks axios so it doesn't send actual API requests
vi.mock("axios");
//creates a typed version of the mocked axios object
const mockedAxios = vi.mocked(axios);
//mock pet data
const mockPet = {
  _id: "123",
  name: "Charlie",
  age: "3",
  gender: "Male",
  shelterName: "Happy Pets",
  phone: "123456789",
  email: "happy@test.com",
  image: "/charlie.jpg",
  location: {
    lat: 51.5074,
    lng: -0.1278,
  },
};
//helper function that renders the page with different roles
const renderPage = (role?: string) => {
  if (role) {
    localStorage.setItem("token", "test-token");
    localStorage.setItem("role", role);
  } else {
    localStorage.clear();
  }
  return render(
    <MemoryRouter initialEntries={["/pets/123"]}>
      <Routes>
        <Route
          path="/pets/:id"
          element={<PetDetailPage />}
        />
        <Route
          path="/dashboard/list"
          element={<p>Dashboard List</p>}
        />
        <Route
          path="/pets/:id/edit"
          element={<p>Edit Page</p>}
        />
      </Routes>
    </MemoryRouter>
  );
};



describe("PetDetailPage", () => {

  //clears all mocks before each test so they are independant from each other
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  //checks that the loading message is being displayed
  test("shows loading initially", () => {
    renderPage();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  //checks that the pet details are fetched and displayed correctly
  test("fetches and displays pet details", async () => {
    mockedAxios.get.mockResolvedValueOnce({data: mockPet,}).mockResolvedValueOnce({data: {address: {city: "London"}}}).mockResolvedValueOnce({data: []});
    renderPage();
    expect(await screen.findByText("Charlie")).toBeInTheDocument();
    expect(screen.getByText("Age: 3")).toBeInTheDocument();
    expect(screen.getByText("Gender: Male")).toBeInTheDocument();
    expect(screen.getByText("London")).toBeInTheDocument();
    expect(screen.getByText("Happy Pets")).toBeInTheDocument();
    expect(screen.getByAltText("Charlie")).toHaveAttribute("src", "/charlie.jpg");
  });

  //checks that the favourite button is shown for adopters
  test("shows favorite button for adopters", async () => {
    mockedAxios.get.mockResolvedValueOnce({data: mockPet}).mockResolvedValueOnce({data: {address: {city: "London"}}}).mockResolvedValueOnce({data: []});
    renderPage("adopter");
    expect(await screen.findByText("Heart This Pet")).toBeInTheDocument();
  });

  //checks that if a pet is already favourited, it will show the unheart button
  test("shows unheart button when pet is already favorite", async () => {
    mockedAxios.get.mockResolvedValueOnce({data: mockPet,}).mockResolvedValueOnce({data: {address: {city: "London"}}}).mockResolvedValueOnce({data: [{_id: "123"}]});
    renderPage("adopter");
    expect(await screen.findByText("Unheart This Pet")).toBeInTheDocument();
  });

  //checks that pressing the favourite button toggles the favourite status
  test("toggles favorite status", async () => {
    const user = userEvent.setup();
    mockedAxios.get.mockResolvedValueOnce({data: mockPet}).mockResolvedValueOnce({data: {address: {city: "London"}}}).mockResolvedValueOnce({data: []});
    mockedAxios.post.mockResolvedValue({data: {pet: {favorite: true}}});
    renderPage("adopter");
    const button = await screen.findByText("Heart This Pet");
    await user.click(button);
    expect(mockedAxios.post).toHaveBeenCalledWith("http://localhost:3000/favorite/123/toggle", {}, expect.objectContaining({headers: {Authorization: "Bearer test-token"}}));
    expect(await screen.findByText( "Unheart This Pet")).toBeInTheDocument();
  });

  //checks that the edit and delete buttons are shown for shelters
  test("shows edit and delete buttons for shelters", async () => {
    mockedAxios.get.mockResolvedValueOnce({data: mockPet}).mockResolvedValueOnce({data: {address: {city: "London"}}}).mockResolvedValueOnce({data: []});
    renderPage("shelter");
    await screen.findByText("Charlie");
    expect(screen.getByRole("button", { name: "Edit Pet" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete Pet" })).toBeInTheDocument();
  });

  //checks that the edit button navigated the user to the edit page
  test("navigates to edit page when edit clicked", async () => {
    const user = userEvent.setup();
    mockedAxios.get.mockResolvedValueOnce({data: mockPet,}).mockResolvedValueOnce({data: {address: {city: "London"}}}).mockResolvedValueOnce({data: []});
    renderPage("shelter");
    await screen.findByText("Charlie");
    const buttons = screen.getAllByRole("button");
    await user.click(buttons[0]);
    expect(await screen.findByText("Edit Page")).toBeInTheDocument();
  });

  //checks that pressing the delete button deletes the pet and navigates the user to the dashboard
  test("deletes pet and navigates to dashboard", async () => {
    const user = userEvent.setup();
    mockedAxios.get.mockResolvedValueOnce({data: mockPet}).mockResolvedValueOnce({data: {address: {city: "London"}}}).mockResolvedValueOnce({data: []});
    mockedAxios.delete.mockResolvedValue({});
    renderPage("shelter");
    await screen.findByText("Charlie");
    const buttons =screen.getAllByRole("button");
    await user.click(buttons[1]);
    await waitFor(() => {expect(mockedAxios.delete).toHaveBeenCalledWith("http://localhost:3000/dashboard/pets/123", expect.any(Object))});
    expect(await screen.findByText("Dashboard List")).toBeInTheDocument();
  });

  //checks that failed requests are handled appropriately
  test("handles failed API request", async () => {
    mockedAxios.get.mockRejectedValue(new Error("Failed request"));
    renderPage();
    await waitFor(() => {expect(screen.getByText("Loading...")).toBeInTheDocument()});
  });
});