import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "../HomePage.js";



describe("HomePage", () => {

  //checks that the heading and description are rendered
  test("renders the homepage heading and description", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(screen.getByText("Welcome to PetAdopt")).toBeInTheDocument();
    expect(screen.getByText("Your place to find pets waiting for a forever home.")).toBeInTheDocument();
  });

  //checks that the image renders
  test("renders the dashboard image", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    const image = screen.getByAltText("dashboard");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/images/dashboard 3.jpg");
  });

  //checks that all of the main feature sections are rendered
  test("renders all feature sections", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(screen.getByText("Browse Pets")).toBeInTheDocument();
    expect(screen.getByText("Sign Up as Shelter")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Contact Us" })).toBeInTheDocument();
  });

  //checks that the descriptions of the features are rendered
  test("renders feature descriptions", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(screen.getByText("Explore a list of pets available for adoption.")).toBeInTheDocument();
    expect(screen.getByText("Are you a shelter? Register to list pets for adoption.")).toBeInTheDocument();
    expect(screen.getByText("Have questions? Reach out to us anytime.")).toBeInTheDocument();
  });

  //checks that the navigation buttons link to the correct pages
  test("navigation buttons link to the correct pages", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(screen.getByRole("button", {name: "View Pets"}).closest("a")).toHaveAttribute("href", "/pets");
    expect(screen.getByRole("button", {name: "Register as Shelter",}).closest("a")).toHaveAttribute("href", "/register");
    expect(screen.getByRole("button", {name: "Contact Us",}).closest("a")).toHaveAttribute("href", "/contact");
  });
});