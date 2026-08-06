import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import AdminMessages from "../AdminMessages.js";

//mocks axios so it doesn't send actual API requests
vi.mock("axios");
//creates a typed version of the mocked axios object
const mockedAxios = vi.mocked(axios);



describe("AdminMessages", () => {

  //clears all the mocks before running each test so they dont interfere with each other
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("token", "fake-token");
  });

  //checks that the heading renders
  test("renders the messages heading", () => {
    render(<AdminMessages />);
    expect(screen.getByText("Messages")).toBeInTheDocument();
  });

  //checks that messages are fetched and displayed correctly
  test("fetches and displays messages", async () => {
    mockedAxios.get.mockResolvedValue({
      data: [
        {
          _id: "1",
          name: "John Smith",
          email: "john@test.com",
          message: "I would like to adopt Bella",
        },
        {
          _id: "2",
          name: "Sarah Jones",
          email: "sarah@test.com",
          message: "Is Max still available?",
        },
      ],
    });
    render(<AdminMessages />);
    expect(await screen.findByText("John Smith")).toBeInTheDocument();
    expect(screen.getByText("john@test.com")).toBeInTheDocument();
    expect(screen.getByText("I would like to adopt Bella")).toBeInTheDocument();
    expect(screen.getByText("Sarah Jones")).toBeInTheDocument();
    expect(screen.getByText("Is Max still available?")).toBeInTheDocument();
  });

  //checks that the auth token is sent to the backend when requesting a message
  test("calls the API with the authentication token", async () => {
    mockedAxios.get.mockResolvedValue({data: [],});
    render(<AdminMessages />);
    await waitFor(() => {expect(mockedAxios.get).toHaveBeenCalledWith("http://localhost:3000/dashboard/messages", {headers: {Authorization: "Bearer fake-token"}});});
  });

  //checks that no messages are rendered if the backend returns none
  test("renders no messages when API returns an empty array", async () => {
    mockedAxios.get.mockResolvedValue({data: [],});
    render(<AdminMessages />);
    await waitFor(() => {expect(mockedAxios.get).toHaveBeenCalled();});
    expect(screen.queryByText("From:")).not.toBeInTheDocument();
  });

  //checks that errors are handled without crashing the app
  test("handles API errors without crashing", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockedAxios.get.mockRejectedValue(new Error("Failed to fetch messages"));
    render(<AdminMessages />);
    await waitFor(() => {expect(consoleSpy).toHaveBeenCalledWith("Error fetching messages:", expect.any(Error))});
    expect(screen.getByText("Messages")).toBeInTheDocument();
    consoleSpy.mockRestore();
  });
});