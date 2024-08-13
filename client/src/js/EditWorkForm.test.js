import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import EditWorkForm from "./EditWorkForm";
import { API_URL } from "../apiConfig";

global.fetch = jest.fn();

const mockWorkData = {
  id: 1,
  title: "Sample Work",
  description: "This is a sample description.",
  workLink: "http://example.com/sample",
  status: "visible",
  images: ["http://example.com/image1.jpg"],
};

beforeEach(() => {
  fetch.mockClear();
  fetch.mockResolvedValue({
    ok: true,
    json: async () => mockWorkData,
  });
});

describe("EditWorkForm Component", () => {
  let originalError;
  let originalAlert;

  beforeAll(() => {
    originalError = console.error;
    console.error = jest.fn();
    originalAlert = window.alert;
    window.alert = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
    window.alert = originalAlert;
  });

  test("renders the form with initial data", async () => {
    render(
      <MemoryRouter initialEntries={["/edit/1"]}>
        <Routes>
          <Route path="/edit/:id" element={<EditWorkForm />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByDisplayValue("Sample Work")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("This is a sample description.")
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("http://example.com/sample")
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("http://example.com/image1.jpg")
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Visible" }).selected).toBe(true);
  });

  test("handles input changes", async () => {
    render(
      <MemoryRouter initialEntries={["/edit/1"]}>
        <Routes>
          <Route path="/edit/:id" element={<EditWorkForm />} />
        </Routes>
      </MemoryRouter>
    );

    const titleInput = await screen.findByDisplayValue("Sample Work");
    fireEvent.change(titleInput, { target: { value: "Updated Work" } });

    expect(titleInput.value).toBe("Updated Work");
  });

  test("submits the form and calls the API", async () => {
    render(
      <MemoryRouter initialEntries={["/edit/1"]}>
        <Routes>
          <Route path="/edit/:id" element={<EditWorkForm />} />
          <Route path="/" element={<div>Home</div>} />
        </Routes>
      </MemoryRouter>
    );

    const submitButton = await screen.findByText("Update Work");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/works/1`,
        expect.any(Object)
      );
      expect(window.alert).toHaveBeenCalledWith("Work updated successfully!");
    });
  });

  test("handles file uploads", async () => {
    render(
      <MemoryRouter initialEntries={["/edit/1"]}>
        <Routes>
          <Route path="/edit/:id" element={<EditWorkForm />} />
        </Routes>
      </MemoryRouter>
    );

    const fileRadio = screen.getByLabelText("Upload Images");
    fireEvent.click(fileRadio);

    const fileInput = screen.getByLabelText("Upload Images");
    const file = new File(["dummy content"], "example.png", {
      type: "image/png",
    });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(fileInput.files[0]).toBe(file);
    expect(fileInput.files).toHaveLength(1);
  });

  test("handles fetch errors gracefully", async () => {
    fetch.mockRejectedValueOnce(new Error("Network error"));

    render(
      <MemoryRouter initialEntries={["/edit/1"]}>
        <Routes>
          <Route path="/edit/:id" element={<EditWorkForm />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching work:",
        expect.any(Error)
      );
    });

    expect(screen.getByText("Edit Work")).toBeInTheDocument();
  });

  test("handles update errors gracefully", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockWorkData,
    });

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ message: "Internal Server Error" }),
    });

    render(
      <MemoryRouter initialEntries={["/edit/1"]}>
        <Routes>
          <Route path="/edit/:id" element={<EditWorkForm />} />
        </Routes>
      </MemoryRouter>
    );

    const submitButton = await screen.findByText("Update Work");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error updating work:",
        expect.any(Error)
      );
      expect(window.alert).toHaveBeenCalledWith(
        "Could not update the work. Please try again later."
      );
    });
  });
});
