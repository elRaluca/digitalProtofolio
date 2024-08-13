// AddWorkForm.test.js

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import AddWorkForm from "./AddWorkForm";
import { API_URL } from "../apiConfig";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

global.alert = jest.fn();

describe("AddWorkForm", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );
    global.alert.mockClear();
  });

  test("renders the form fields", () => {
    render(
      <Router>
        <AddWorkForm />
      </Router>
    );

    expect(screen.getByLabelText(/Add Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Add Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Add Images/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Use Url/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Work Link/i)).toBeInTheDocument();
    expect(screen.getByText(/Choose Visibility/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Save/i })).toBeInTheDocument();
  });

  test("handles title change", () => {
    render(
      <Router>
        <AddWorkForm />
      </Router>
    );

    const titleInput = screen.getByLabelText(/Add Title/i);
    fireEvent.change(titleInput, { target: { value: "New Work Title" } });

    expect(titleInput.value).toBe("New Work Title");
  });

  test("handles description change", () => {
    render(
      <Router>
        <AddWorkForm />
      </Router>
    );

    const descriptionInput = screen.getByLabelText(/Add Description/i);
    fireEvent.change(descriptionInput, {
      target: { value: "New Work Description" },
    });

    expect(descriptionInput.value).toBe("New Work Description");
  });

  test("handles work link change", () => {
    render(
      <Router>
        <AddWorkForm />
      </Router>
    );

    const workLinkInput = screen.getByLabelText(/Work Link/i);
    fireEvent.change(workLinkInput, {
      target: { value: "http://example.com" },
    });

    expect(workLinkInput.value).toBe("http://example.com");
  });

  test("toggles between file and URL input for images", () => {
    render(
      <Router>
        <AddWorkForm />
      </Router>
    );

    const fileRadio = screen.getByLabelText(/Add Images/i);
    const urlRadio = screen.getByLabelText(/Use Url/i);

    expect(fileRadio).toBeChecked();
    expect(urlRadio).not.toBeChecked();

    fireEvent.click(urlRadio);

    expect(urlRadio).toBeChecked();
    expect(fileRadio).not.toBeChecked();
  });

  test("adds a new URL input field", () => {
    render(
      <Router>
        <AddWorkForm />
      </Router>
    );

    fireEvent.click(screen.getByLabelText(/Use Url/i));

    const addUrlButton = screen.getByRole("button", {
      name: /Add Another URL/i,
    });
    fireEvent.click(addUrlButton);

    const urlInputs = screen
      .getAllByRole("textbox")
      .filter((input) => input.name.startsWith("imageUrl"));

    expect(urlInputs.length).toBe(2);
  });

  test("submits the form with file", async () => {
    render(
      <Router>
        <AddWorkForm />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Add Title/i), {
      target: { value: "Test Title" },
    });
    fireEvent.change(screen.getByLabelText(/Add Description/i), {
      target: { value: "Test Description" },
    });
    fireEvent.change(screen.getByLabelText(/Work Link/i), {
      target: { value: "http://example.com" },
    });

    const fileInput =
      screen.getByLabelText(/Add Images/i).parentElement.nextSibling;
    const file = new File(["file content"], "image.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(screen.getByRole("button", { name: /Save/i }));

    await screen.findByRole("button", { name: /Save/i });

    expect(global.fetch).toHaveBeenCalledWith(
      `${API_URL}/works`,
      expect.objectContaining({
        method: "POST",
      })
    );
    expect(global.alert).toHaveBeenCalledWith("Work added successfully!");
  });

  test("submits the form with URLs", async () => {
    render(
      <Router>
        <AddWorkForm />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Add Title/i), {
      target: { value: "Test Title" },
    });
    fireEvent.change(screen.getByLabelText(/Add Description/i), {
      target: { value: "Test Description" },
    });
    fireEvent.change(screen.getByLabelText(/Work Link/i), {
      target: { value: "http://example.com" },
    });

    fireEvent.click(screen.getByLabelText(/Use Url/i));

    const imageUrlInput = screen.getAllByRole("textbox")[2];

    fireEvent.change(imageUrlInput, {
      target: { value: "http://example.com/image1.png" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Save/i }));

    await screen.findByRole("button", { name: /Save/i });

    expect(global.fetch).toHaveBeenCalledWith(
      `${API_URL}/works`,
      expect.objectContaining({
        method: "POST",
      })
    );
    expect(global.alert).toHaveBeenCalledWith("Work added successfully!");
  });
});
