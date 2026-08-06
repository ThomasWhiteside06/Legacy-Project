import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterPage from "../RegisterPage";
import * as authService from "../../services/authService";

//creates a mock of authService so that it isn't sending requests to the backend
vi.mock("../../services/authService", () => ({register: vi.fn(),}));



describe("RegisterPage", () => {

  //clears all the mocks before each test so they are independant from each other
  beforeEach(() => {vi.clearAllMocks()});

  //checks that the form is rendered
  it("renders the registration form", () => {
    render(<RegisterPage />);
    expect(screen.getByRole("heading", { name: "Register" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Register" })).toBeInTheDocument();
  });

  //checks that the form's fields update as the user types
  it("updates input values when typing", () => {
    render(<RegisterPage />);
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    fireEvent.change(emailInput, {target: {name: "email", value: "test@test.com"}});
    fireEvent.change(passwordInput, {target: {name: "password", value: "password123"}});
    expect(emailInput).toHaveValue("test@test.com");
    expect(passwordInput).toHaveValue("password123");
  });

  //checks that the user can change the role of the account
  it("allows changing the role", () => {
    render(<RegisterPage />);
    const select = screen.getByRole("combobox");
    fireEvent.change(select, {
      target: {name: "role", value: "shelter"}
    });
    expect(select).toHaveValue("shelter");
  });

  //checks that the expected events occur when the form is submitted
  it("submits registration successfully", async () => {
    vi.mocked(authService.register).mockResolvedValue({token: "fake-token", role: "adopter"});
    render(<RegisterPage />);
    fireEvent.change(screen.getByPlaceholderText("Email"), {target: {name: "email", value: "test@test.com"}});
    fireEvent.change(screen.getByPlaceholderText("Password"),{target: {name: "password", value: "password123"}});
    fireEvent.click(screen.getByRole("button", {name: "Register"}));
    await waitFor(() => {expect(authService.register).toHaveBeenCalledWith({email: "test@test.com", password: "password123", role: "adopter"})});
    expect(screen.getByText("Registration successful! You can now log in.")).toBeInTheDocument();
  });

  //checks that an error message is displayed if a registration fails
  it("shows an error message when registration fails", async () => {vi.mocked(authService.register).mockRejectedValue(new Error("Registration failed"));
    render(<RegisterPage />);
    fireEvent.change(screen.getByPlaceholderText("Email"), {target: {name: "email", value: "test@test.com"}});
    fireEvent.change(screen.getByPlaceholderText("Password"), {target: {name: "password", value: "password123"}});
    fireEvent.click(screen.getByRole("button", {name: "Register"}));
    await waitFor(() => {expect(screen.getByText("Error registering. Please try again.")).toBeInTheDocument()});
  });

  //checks that registering with the shelter role actually gives you the shelter role
  it("submits with shelter role", async () => {
    vi.mocked(authService.register).mockResolvedValue({token: "fake-token",role: "shelter"});
    render(<RegisterPage />);
    fireEvent.change(screen.getByPlaceholderText("Email"), {target: {name: "email", value: "shelter@test.com"}});
    fireEvent.change(screen.getByPlaceholderText("Password"),{target: {name: "password", value: "password123"}});
    fireEvent.change(screen.getByRole("combobox"), {target: {name: "role", value: "shelter"}});
    fireEvent.click(screen.getByRole("button", {name: "Register"}));
    await waitFor(() => {expect(authService.register).toHaveBeenCalledWith({email: "shelter@test.com", password: "password123", role: "shelter"})});
  });
});