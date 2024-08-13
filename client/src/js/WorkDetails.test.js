import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import WorkDetails from "./WorkDetails";
import { API_URL } from "../apiConfig";

global.fetch = jest.fn();

const mockWork = {
  id: 1,
  title: "Work 1",
  description: "This is a description of Work 1.",
  images: ["image1.jpg", "image2.jpg"],
  workLink: "http://example.com/work1",
};

beforeEach(() => {
  fetch.mockClear();
});

describe("WorkDetails Component", () => {
  let originalError;

  beforeAll(() => {
    originalError = console.error;
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  test("renders work details", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockWork,
    });

    render(
      <MemoryRouter initialEntries={["/works/1"]}>
        <Routes>
          <Route path="/works/:id" element={<WorkDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText("Work 1")).toBeInTheDocument();
    expect(
      screen.getByText("This is a description of Work 1.")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Link To The Work/i })
    ).toHaveAttribute("href", "http://example.com/work1");
    expect(screen.getAllByRole("img")).toHaveLength(3);
  });

  test("swaps images on thumbnail click", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockWork,
    });

    render(
      <MemoryRouter initialEntries={["/works/1"]}>
        <Routes>
          <Route path="/works/:id" element={<WorkDetails />} />
        </Routes>
      </MemoryRouter>
    );

    const mainImage = await screen.findByAltText("Work 1");
    const thumbnails = screen.getAllByRole("img");

    expect(mainImage).toHaveAttribute("src", `${API_URL}/uploads/image1.jpg`);

    fireEvent.click(thumbnails[2]);
    expect(mainImage).toHaveAttribute("src", `${API_URL}/uploads/image2.jpg`);
  });

  test("handles work deletion", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockWork,
    });

    fetch.mockResolvedValueOnce({
      ok: true,
    });

    global.alert = jest.fn();
    global.confirm = jest.fn(() => true);

    render(
      <MemoryRouter initialEntries={["/works/1"]}>
        <Routes>
          <Route path="/works/:id" element={<WorkDetails />} />
          <Route path="/" element={<div>Home</div>} />
        </Routes>
      </MemoryRouter>
    );

    const deleteButton = await screen.findByText("Delete");
    fireEvent.click(deleteButton);

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/works/1`, {
      method: "DELETE",
    });

    await waitFor(() => {
      expect(alert).toHaveBeenCalledWith("Work deleted successfully!");
    });

    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  test("handles fetch error", async () => {
    fetch.mockRejectedValueOnce(new Error("Network error"));

    render(
      <MemoryRouter initialEntries={["/works/1"]}>
        <Routes>
          <Route path="/works/:id" element={<WorkDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching work details:",
        expect.any(Error)
      );
    });

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
