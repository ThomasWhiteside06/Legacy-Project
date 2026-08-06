import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminPetList from "../AdminPetList.js";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";

//mocks axios so it doesn't send actual API requests
vi.mock("axios");
//creates a typed version of the mocked axios object
const mockedAxios = vi.mocked(axios);
//mocks the Pet Card component so that the following tests are not dependant on that working
vi.mock("../../components/PetCard.js", () => ({default: ({ pet }: any) => (<div data-testid="pet-card">{pet.name}</div>)}));



describe("AdminPetList", () => {

  //clears all the mocks before each test so they are independant
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("token", "fake-token");
    localStorage.setItem("role", "shelter");
    mockedAxios.get.mockResolvedValue({
      data: [
        {
          _id: "123",
          name: "Bella",
          type: "Dog",
          age: "5",
        }
      ]
    });
  });

  //checks that pets are fetched and dispalyed correctly
  test("fetches and displays pets", async () => {
    render(
      <MemoryRouter>
        <AdminPetList />
      </MemoryRouter>
    );
    expect(await screen.findByText("Bella")).toBeInTheDocument();
    expect(mockedAxios.get).toHaveBeenCalledWith("http://localhost:3000/dashboard/pets", {headers: {Authorization: "Bearer fake-token"}});
  });

  //check that the button to add a New Pet is displayed for shelters
  test("shows New Pet button for shelters", () => {
    render(
      <MemoryRouter>
        <AdminPetList />
      </MemoryRouter>
    );
    expect(screen.getByRole("button", {name: "New Pet"})).toBeInTheDocument();
  });

  //checks that the button to add a New Pet is not displayed for adopters
  test("does not show New Pet button for adopters", () => {
    localStorage.setItem("role", "adopter");
    render(
      <MemoryRouter>
        <AdminPetList />
      </MemoryRouter>
    );
    expect(screen.queryByRole("button", {name: "New Pet"})).not.toBeInTheDocument();
  });

  //checks that clicking the New Pet button opens the form
  test("opens add pet form", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <AdminPetList />
      </MemoryRouter>
    );
    await user.click(screen.getByRole("button", {name: "New Pet"}));
    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("City Name")).toBeInTheDocument();
  });

  //checks that the user can add info into the form's fields
  test("updates form fields", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <AdminPetList />
      </MemoryRouter>
    );
    await user.click(screen.getByRole("button", {name: "New Pet"}));
    const nameInput = screen.getByPlaceholderText("Name");
    await user.type(nameInput, "Charlie");
    expect(nameInput).toHaveValue("Charlie");
  });

  //checks that the entire process of creating a new pet works
  test("submits a new pet", async () => {
    const user = userEvent.setup();
    mockedAxios.post.mockResolvedValueOnce({data: {secure_url: "https://image.com/pet.jpg"}})
      .mockResolvedValueOnce({
        data: {
          _id: "456",
          name: "Charlie",
          type: "Dog",
        },
      });
    mockedAxios.get.mockResolvedValueOnce({data: [],})
      .mockResolvedValueOnce({
        data: [
          {
            lat: "50.1",
            lon: "-1.2",
          },
        ],
      });
    render(
      <MemoryRouter>
        <AdminPetList />
      </MemoryRouter>
    );
    await user.click(screen.getByRole("button", {name: "New Pet"}));
    await user.type(screen.getByPlaceholderText("Name"), "Charlie");
    await user.type(screen.getByPlaceholderText("Type (e.g., Dog, Cat)"), "Dog");
    await user.type(screen.getByPlaceholderText("Gender"), "Male");
    await user.type(screen.getByPlaceholderText("Shelter"), "Happy Pets");
    await user.type(screen.getByPlaceholderText("Contact Number"), "123456789");
    await user.type(screen.getByPlaceholderText("Email"), "test@test.com");
    await user.type(screen.getByPlaceholderText("Age"), "3");
    await user.type(screen.getByPlaceholderText("City Name"), "London");
    const file = new File(["image"], "pet.jpg", {type: "image/jpeg"});
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(fileInput, file);
    await user.click(screen.getByRole("button", {name: "Submit"}));
    await waitFor(() => {expect(mockedAxios.post).toHaveBeenCalledTimes(2)});
    expect(screen.getByText("Charlie")).toBeInTheDocument();
  });

  //checks that failed fectehes are handled appropriately
  test("handles failed pet fetch", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockedAxios.get.mockRejectedValue(new Error("Failed"));
    render(
      <MemoryRouter>
        <AdminPetList />
      </MemoryRouter>
    );
    await waitFor(() => {expect(consoleSpy).toHaveBeenCalled()});
    consoleSpy.mockRestore();
  });
});