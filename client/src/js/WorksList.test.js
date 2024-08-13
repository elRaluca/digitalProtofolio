import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import WorksList from "./WorksList";
import { API_URL } from "../apiConfig";

global.fetch = jest.fn();
global.alert = jest.fn();

const mockWorks = [
  { id: 1, title: "Work 1", status: "visible", images: ["image1.jpg"] },
  { id: 2, title: "Work 2", status: "hidden", images: [] },
];

beforeEach(() => {
  fetch.mockClear();
  alert.mockClear();
});

describe("WorksList Component", () => {
  test("renders visible works", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockWorks,
    });

    render(
      <MemoryRouter>
        <WorksList showHidden={false} />
      </MemoryRouter>
    );

    const workTitle = await screen.findByText("Work 1");
    expect(workTitle).toBeInTheDocument();
  });

  test("renders hidden works", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockWorks,
    });

    render(
      <MemoryRouter>
        <WorksList showHidden={true} />
      </MemoryRouter>
    );

    const workTitle = await screen.findByText("Work 2");
    expect(workTitle).toBeInTheDocument();
  });

  test("deletes a work", async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockWorks,
      })
      .mockResolvedValueOnce({
        ok: true,
      });

    render(
      <MemoryRouter>
        <WorksList showHidden={false} />
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
  });

  test("toggles work visibility", async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockWorks,
      })
      .mockResolvedValueOnce({
        ok: true,
      });

    render(
      <MemoryRouter>
        <WorksList showHidden={false} />
      </MemoryRouter>
    );

    const toggleButton = await screen.findByText("Hide");
    fireEvent.click(toggleButton);

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/works/1`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "hidden" }),
    });

    await waitFor(() => {
      expect(alert).toHaveBeenCalledWith("Work hidden successfully!");
    });
  });
});
