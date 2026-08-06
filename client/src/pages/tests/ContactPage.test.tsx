import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import ContactPage from "../ContactPage.js";

//mocks axios so it doesn't send actual API requests
vi.mock("axios");
//creates a typed version of the mocked axios object
const mockedAxios = vi.mocked(axios);



describe("ContactPage", () => {

  //clears all mocks before each test so they are independant from each other
  beforeEach(() => {vi.clearAllMocks();});

  //checks that the contact form renders
  test("renders the contact form", () => {
    render(<ContactPage />);
    expect(screen.getByText("Contact Us")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your Message")).toBeInTheDocument();
    expect(screen.getByRole("button", {name: /send message/i})).toBeInTheDocument();
  });

  //checks that the user can add info to the form's fields
  test("allows the user to fill in the form", async () => {
    const user = userEvent.setup();
    render(
      <ContactPage />
    );
    const nameInput = screen.getByPlaceholderText("Your Name");
    const emailInput = screen.getByPlaceholderText("Your Email");
    const messageInput = screen.getByPlaceholderText("Your Message");
    await user.type(nameInput, "Thomas");
    await user.type(emailInput, "thomas@test.com");
    await user.type(messageInput, "Hello, I need help");
    expect(nameInput).toHaveValue("Thomas");
    expect(emailInput).toHaveValue("thomas@test.com");
    expect(messageInput).toHaveValue("Hello, I need help");
  });

  //checks that the desired chain of events happen upon submitting the form
  test("submits the form successfully", async () => {
    const user = userEvent.setup();
    mockedAxios.post.mockResolvedValue({data: {},});
    render(<ContactPage />);
    await user.type(screen.getByPlaceholderText("Your Name"), "Thomas");
    await user.type(screen.getByPlaceholderText("Your Email"), "thomas@test.com");
    await user.type(screen.getByPlaceholderText("Your Message"),"Test message");
    await user.click(screen.getByRole("button", {name: /send message/i}));
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "http://localhost:3000/contact",
        {
          name: "Thomas",
          email: "thomas@test.com",
          message: "Test message",
        }
      );
    });
    expect(screen.getByText("Message sent successfully!")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your Name")).toHaveValue("");
    expect(screen.getByPlaceholderText("Your Email")).toHaveValue("");
    expect(screen.getByPlaceholderText("Your Message")).toHaveValue("");
  });

  //checks to see if the error message is displayed upon the submission failing
  test("shows an error message when submission fails", async () => {
    const user = userEvent.setup();
    mockedAxios.post.mockRejectedValue(new Error("Network error"));
    render(<ContactPage />);
    await user.type(screen.getByPlaceholderText("Your Name"),"Thomas");
    await user.type(screen.getByPlaceholderText("Your Email"),"thomas@test.com");
    await user.type(screen.getByPlaceholderText("Your Message"),"Test message");
    await user.click(screen.getByRole("button", {name: /send message/i,}));
    await waitFor(() => {expect(screen.getByText("Failed to send message. Please try again.")).toBeInTheDocument()});
  });
});