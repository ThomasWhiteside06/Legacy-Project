import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminDashboard from "../AdminDashboard.js";

//mock of AdminPetList to make sure the data is correct and the following tests are independant
vi.mock("../AdminPetList.js", () => ({
  default: () => <div>Mock Pet Listings</div>,
}));
//mock of AdminMessages to make sure the data is correct and the following tests are independant
vi.mock("../AdminMessages.js", () => ({
  default: () => <div>Mock Messages</div>,
}));



describe("AdminDashboard", () => {

  //checks that the dashboard heading is rendered
  test("renders the dashboard heading", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AdminDashboard />
      </MemoryRouter>
    );
    expect(screen.getByText(/Welcome to Your Dashboard/i)).toBeInTheDocument();
  });

  //checks that the navigation buttons render
  test("renders the navigation buttons", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AdminDashboard />
      </MemoryRouter>
    );
    expect(screen.getByRole("button", { name: /Pet Listings/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Messages/i })).toBeInTheDocument();
  });

  //checks that the navigation to the Pet Listings page works
  test("renders the Pet Listings page", () => {
    render(
      <MemoryRouter initialEntries={["/list"]}>
        <AdminDashboard />
      </MemoryRouter>
    );
    expect(screen.getByText("Mock Pet Listings")).toBeInTheDocument();
  });

  //checks that the navigation to the Messages page works
  test("renders the Messages page", () => {
    render(
      <MemoryRouter initialEntries={["/messages"]}>
        <AdminDashboard />
      </MemoryRouter>
    );
    expect(screen.getByText("Mock Messages")).toBeInTheDocument();
  });

  //checks that the navigation links are what they should be
  test("navigation links have the correct destinations", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AdminDashboard />
      </MemoryRouter>
    );
    const petListingsLink = screen.getByRole("button", { name: /Pet Listings/i }).closest("a");
    const messagesLink = screen.getByRole("button", { name: /Messages/i }).closest("a");
    expect(petListingsLink).toHaveAttribute("href", "/dashboard/list");
    expect(messagesLink).toHaveAttribute("href", "/dashboard/messages");
  });
});