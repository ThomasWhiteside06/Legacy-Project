import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Footer from "../Footer";



describe("Footer", () => {

  //checks that the footer element is rendered
  it("renders the footer", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  //checks that the headings in the footer are displayed
  it("renders footer section headings", () => {
    render(<Footer />);
    expect(screen.getByText("Resources")).toBeInTheDocument();
    expect(screen.getByText("All about pets")).toBeInTheDocument();
  });

  //checfks that all the links are displayed
  it("renders all footer links", () => {
    render(<Footer />);
    expect(screen.getByText("FAQ")).toBeInTheDocument();
    expect(screen.getByText("Newsletter")).toBeInTheDocument();
    expect(screen.getByText("Nutrition")).toBeInTheDocument();
    expect(screen.getByText("Training")).toBeInTheDocument();
  });

  //checks that all the links have the correct URLs - since the app just has all of them link to google, only 1 test is needed
  it("renders links with the correct URL", () => {
    render(<Footer />);
    const links = screen.getAllByRole("link");
    links.forEach((link) => {expect(link).toHaveAttribute("href", "https://www.google.com");});
  });

  //checks that the footer logo image is rendered
  it("renders the footer logo", () => {
    render(<Footer />);
    const logo = screen.getByAltText("logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveClass("footerImg");
  });

  //checks that the copyright message displays the current year
  it("renders the current year copyright message", () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} PetAdopt. All rights reserved.`)).toBeInTheDocument();
  });
});