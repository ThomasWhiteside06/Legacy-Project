import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import LoginPage from "../LoginPage.js";

//mocks axios so it doesn't send actual API requests
vi.mock("axios");
//creates a typed version of the mocked axios object
const mockedAxios = vi.mocked(axios);



describe("LoginPage", () => {

  //clears all mocks before each test so they are independant from each other
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  //checks that the login form renders
  test("renders login form", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", {name: "Login"})).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", {name: "Log In",})).toBeInTheDocument();
  });

  //checks that the user can modify the inputs of the form
  test("updates email and password inputs", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    await user.type(emailInput, "test@test.com");
    await user.type(passwordInput, "password123");
    expect(emailInput).toHaveValue("test@test.com");
    expect(passwordInput).toHaveValue("password123");
  });

  //checks that the a user shelter can successfully log in
  test("logs in shelter and navigates to dashboard", async () => {
    const user = userEvent.setup();
    mockedAxios.post.mockResolvedValue({data: {token: "abc123", role: "shelter"}});
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <LoginPage />
      </MemoryRouter>
    );
    await user.type(screen.getByPlaceholderText("Email"), "shelter@test.com");
    await user.type(screen.getByPlaceholderText("Password"), "password");
    await user.click(screen.getByRole("button", {name: "Log In"}));
    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe("abc123")
      expect(localStorage.getItem("role")).toBe("shelter");
    });
  });

  //checks that an adopter can successfully log in
  test("logs in adopter and stores credentials", async () => {
    const user = userEvent.setup();
    mockedAxios.post.mockResolvedValue({
      data: {token: "user-token", role: "adopter"}});
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    await user.type(screen.getByPlaceholderText("Email"), "user@test.com");
    await user.type(screen.getByPlaceholderText("Password"), "password");
    await user.click(screen.getByRole("button", {name: "Log In"}));
    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe("user-token");
      expect(localStorage.getItem("role")).toBe("adopter");
    });
  });

  //checks that failed login attempts don't store any authentication info
  test("does not store data when login fails", async () => {
    const user = userEvent.setup();
    mockedAxios.post.mockRejectedValue(new Error("Login failed"));
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    await user.type(screen.getByPlaceholderText("Email"), "wrong@test.com");
    await user.type(screen.getByPlaceholderText("Password"), "wrongpassword");
    await user.click(screen.getByRole("button", { name: "Log In",}));
    await waitFor(() => {
      expect(localStorage.getItem("token")).toBeNull();
      expect(localStorage.getItem("role")).toBeNull();
    });
  });
});