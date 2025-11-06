import React from "react";
import { render, screen, within, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserPage from "../components/UserPage";

describe("UserPage", () => {
  const user = { username: "leon" };

  //Test 1: Check page title and subtitle
  test("renders page title and subtitle", () => {
    render(<UserPage user={user} />);
    expect(screen.getByRole("heading", { name: /leon's Page/i })).toBeInTheDocument();
    expect(screen.getByText(/Your account info and bet history/i)).toBeInTheDocument();
  });

  //Test 2: Check username and balance display
  test("shows username and balance", () => {
    render(<UserPage user={user} />);
    expect(screen.getAllByText(/Username:/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/leon/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/\$152\.37/)).toBeInTheDocument();
  });

  //Test 3: Check table headers
  test("renders table headers", () => {
    render(<UserPage user={user} />);
    const table = screen.getByRole("table");
    const header = within(table).getAllByRole("row")[0];
    const headers = within(header).getAllByRole("columnheader").map((th) => th.textContent);
    expect(headers).toEqual(["Contest", "City", "Type", "Amount", "Outcome", "Date"]);
  });

  //Test 4: Check table rows populated by mock data
  test("populates bet rows from mock effect", async () => {
    render(<UserPage user={user} />);
    const table = screen.getByRole("table");

    // Wait for useEffect to load mock data
    await waitFor(() => {
      const rows = within(table).getAllByRole("row");
      expect(rows.length).toBe(4); // 1 header + 3 data rows
    });

    // Verify content of mock data
    expect(screen.getAllByText(/Will be done in split 3/i).length).toBe(3);
    expect(screen.getAllByText(/Madison/i).length).toBe(3);
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();
    expect(screen.getAllByText("$1.00").length).toBe(3);
    expect(screen.getAllByText(/Pending/i).length).toBe(3);
  });
});
