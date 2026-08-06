import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../Navbar";



describe("Navbar", () => {

  //clears the localstorage before each test
  beforeEach(() => {
    localStorage.clear();
  });

  //checks that the title renders
  it("renders the PetAdopt title", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText("PetAdopt")).toBeInTheDocument();
  });

  //checks that the login link is displayed when there is no token
  it("shows login link when user is not logged in", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByRole("link", {name: "Login"})).toBeInTheDocument();
    expect(screen.queryByRole("button", {name: "Logout"})).not.toBeInTheDocument();
  });

  //checks that the logout button is rendered when there is a token 
  it("shows logout button when user is logged in", () => {
    localStorage.setItem("token", "fake-token");
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByRole("button", {name: "Logout"})).toBeInTheDocument();
    expect(screen.queryByRole("link", {name: "Login"})).not.toBeInTheDocument();
  });

  //checks that the token is deleted when the user logs out
  it("removes token when logout is clicked", () => {
    localStorage.setItem("token", "fake-token");
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole("button", {name: "Logout"}));
    expect(localStorage.getItem("token")).toBeNull();
  });

  //checks that when the user logs out, it takes them back to the login page
  it("navigates to login after logout", () => {
    localStorage.setItem("token", "fake-token");
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole("button", {name: "Logout"}));
    expect(localStorage.getItem("token")).toBeNull();
  });
});