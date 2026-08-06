import { describe, expect, test, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminEditPage from "../AdminEditPage.js";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";

//mocked function used to track navigation - checks that navigations go to the right destination without actually navigating to it
const mockedNavigate = vi.fn();
//mocks axios so it doesn't send actual API requests
vi.mock("axios");
//creates a typed version of the mocked axios object
const mockedAxios = vi.mocked(axios);
//mocks react router functions that are used in this file
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
    //mocks useParams to provide an id as it is normally from the url
    useParams: () => ({id: "123"}),
  };
});



describe("AdminEditPage", () => {

  //before each test it clears all the mocks so the tests don't affect each other
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("token", "fake-token");
    localStorage.setItem("role", "shelter");
    mockedAxios.get.mockResolvedValue({data: {name: "Bella", age: "5", image: "/bella.jpg"}});
    mockedAxios.put.mockResolvedValue({data: {}});
  });

  //checks that the edit form renders
  test("renders the edit form", async () => {
    render(
      <MemoryRouter>
        <AdminEditPage />
      </MemoryRouter>
    );
    expect(await screen.findByDisplayValue("Bella")).toBeInTheDocument();
    expect(screen.getByDisplayValue("5")).toBeInTheDocument();
  });

  //checks that the user can modify the form's fields
  test("updates the input fields", async () => {
    render(
      <MemoryRouter>
        <AdminEditPage />
      </MemoryRouter>
    );
    const name = await screen.findByDisplayValue("Bella");
    await userEvent.clear(name);
    await userEvent.type(name, "Charlie");
    expect(name).toHaveValue("Charlie");
  });

  //checks that submitting the form updates the pet
  test("submits the edited pet", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <AdminEditPage />
      </MemoryRouter>
    );
    const submit = await screen.findByRole("button", {name: /submit/i,});
    await user.click(submit);
    await waitFor(() => {expect(mockedAxios.put).toHaveBeenCalled();});
    expect(mockedNavigate).toHaveBeenCalledWith("/pets/123");
  });

  //checks that users that are adopters cannot access the edit form
  test("does not render the form for adopters", () => {
    localStorage.setItem("role", "adopter");
    render(
      <MemoryRouter>
        <AdminEditPage />
      </MemoryRouter>
    );
    expect(screen.queryByRole("button", {name: /submit/i})).not.toBeInTheDocument();
  });
});