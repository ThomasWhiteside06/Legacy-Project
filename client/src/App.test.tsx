import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import App from "./App.js";

// mock react leaflet - offers simple html rather than rendering a proper interactive map
vi.mock("react-leaflet", () => ({
  MapContainer: () => <div data-testid="map">Map</div>,
  TileLayer: () => <div />,
  Marker: () => <div />,
  Popup: () => <div />,
}));
// Helper function that changes the browser's current URL before rendering App, allowing each test to simulate navigating to a different route without manually navigating around the app
const renderWithRoute = (route: string) => {
  window.history.pushState({}, "", route);
  return render(<App />);
};



describe("App routing", () => {

  //resets the app to the home page and clears local storage before each test so they are independant from each other
  beforeEach(() => {
    window.history.pushState({}, "", "/");
    localStorage.clear();
  });

  //checks that the navbar and footer render
  it("renders the navbar and footer", () => {
    renderWithRoute("/");
    expect(screen.getByText("PetAdopt")).toBeInTheDocument();
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
  });

  //checks that the home page route renders
  it("renders the home page route", () => {
    renderWithRoute("/");
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });

  //checks that the contact page route renders
  it("renders the contact page route", () => {
    renderWithRoute("/contact");
    expect(screen.getByText(/contact/i)).toBeInTheDocument();
  });

  //checks that the register page route renders
  it("renders the register page route", () => {
    renderWithRoute("/register");
    expect(screen.getByRole("heading", { name: "Register" })).toBeInTheDocument();
  });

  //checks that the login page route renders
  it("renders the login page route", () => {
    renderWithRoute("/login");
    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
  });

  //checks that the pet list page route renders
  it("renders the pet list page route", () => {
    renderWithRoute("/pets");
    expect(screen.getByText("Available Pets for Adoption")
    ).toBeInTheDocument();
  });

  //checks that the favorite pets page route renders
  it("renders the favourite pets page route", () => {
    renderWithRoute("/favorite");
    expect(screen.getByText(/favorite/i)).toBeInTheDocument();
  });

  //checks that the pet details page route renders
  it("renders the pet detail page route", () => {
    renderWithRoute("/pets/123");
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  //checks that the dashboard route renders
  it("renders the dashboard route", () => {
    renderWithRoute("/dashboard");
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });

  //checks that the admin edit route renders
  it("renders the admin edit route", () => {
    renderWithRoute("/pets/123/edit");
    expect(document.querySelector(".edit-page-container")).toBeInTheDocument();
  });
});