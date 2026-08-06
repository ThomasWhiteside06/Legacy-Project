import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import FavoritePetsPage from "../FavsPetPage.js";

//mocks axios so it doesn't send actual API requests
vi.mock("axios");
//creates a typed version of the mocked axios object
const mockedAxios = vi.mocked(axios);
//mocks the Pet Card component so the following tests don't rely on it working
vi.mock("../../components/PetCard.js", () => ({default: ({ pet }: any) => (<div data-testid="pet-card">{pet.name}</div>)}));



describe("FavoritePetsPage", () => {

  //clears all mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("token", "fake-token");
  });

  //checks the title renders
  test("renders the page title", () => {
    render(
      <MemoryRouter>
        <FavoritePetsPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Favorite Pets")).toBeInTheDocument();
  });

  //checks that the favourite pets are fetched and displyed correctly
  test("fetches and displays favourite pets", async () => {
    mockedAxios.get.mockResolvedValue({
      data: [
        {
          _id: "123",
          name: "Bella",
          type: "Dog",
          age: "5",
        },
        {
          _id: "456",
          name: "Max",
          type: "Cat",
          age: "3",
        },
      ],
    });
    render(
      <MemoryRouter>
        <FavoritePetsPage />
      </MemoryRouter>
    );
    await waitFor(() => {expect(mockedAxios.get).toHaveBeenCalledWith("http://localhost:3000/favorite", {headers: {Authorization: "Bearer fake-token"}});});
    expect(screen.getByText("Bella")).toBeInTheDocument();
    expect(screen.getByText("Max")).toBeInTheDocument();
    expect(screen.getAllByTestId("pet-card")).toHaveLength(2);
  });

  //checks that the pets link to their own details page
  test("creates links to pet detail pages", async () => {
    mockedAxios.get.mockResolvedValue({
      data: [
        {
          _id: "123",
          name: "Bella",
          type: "Dog",
          age: "5",
        },
      ],
    });
    render(
      <MemoryRouter>
        <FavoritePetsPage />
      </MemoryRouter>
    );
    await waitFor(() => {expect(screen.getByText("Bella")).toBeInTheDocument();});
    const link = screen.getByText("Bella").closest("div")?.parentElement?.querySelector("a");
    expect(link).toHaveAttribute("href", "/pets/123");
  });

  //checks that failed fetches are handled appropriately
  test("handles failed favourite fetch", async () => {
    mockedAxios.get.mockRejectedValue(new Error("Failed request"));
    render(
      <MemoryRouter>
        <FavoritePetsPage />
      </MemoryRouter>
    );
    await waitFor(() => {expect(mockedAxios.get).toHaveBeenCalled()});
    expect(screen.getByText("Favorite Pets")).toBeInTheDocument();
    expect(screen.queryByTestId("pet-card")).not.toBeInTheDocument();
  });
});