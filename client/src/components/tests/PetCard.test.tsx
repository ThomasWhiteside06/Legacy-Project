import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { Pet } from "../../models/Pets.js";
import PetCard from "../PetCard.js";




describe("PetCard", () => {

  //mock pet data
  const pet:Pet = {
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
  };

  //checks that the pet's name renders
  test("renders the pet name", () => {
    render(
      <MemoryRouter>
        <PetCard pet={pet} />
      </MemoryRouter>
    );
    expect(screen.getByText("Bella")).toBeInTheDocument();
  });

  //checks that the pet's image renders
  test("renders the pet image", () => {
    render(
      <MemoryRouter>
        <PetCard pet={pet} />
      </MemoryRouter>
    );
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", "/bella.jpg");
    expect(image).toHaveAttribute("alt", "Bella");
  });

  //checks that the pet card has a link to the pet's details page
  test("creates a link to the pet details page", () => {
    render(
      <MemoryRouter>
        <PetCard pet={pet} />
      </MemoryRouter>
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/pets/123");
  });

  //checks that the app handles rendering without an image
  test("does not render an image when image is empty", () => {
    render(
      <MemoryRouter>
        <PetCard pet={{...pet,image: ""}}/>
      </MemoryRouter>
    );
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});