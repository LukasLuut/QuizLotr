import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { AuthTestProvider } from "../../context/AuthContext";

const renderAt = (status) =>
  render(
    <AuthTestProvider value={{ status, user: status === "authenticated" ? { name: "Frodo" } : null }}>
      <MemoryRouter initialEntries={["/playquiz"]}>
        <Routes>
          <Route path="/login" element={<p>tela de login</p>} />
          <Route
            path="/playquiz"
            element={
              <ProtectedRoute>
                <p>jogo</p>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthTestProvider>
  );

describe("ProtectedRoute", () => {
  it("sem sessão redireciona para o login (sem tela branca)", () => {
    renderAt("anonymous");
    expect(screen.getByText("tela de login")).toBeInTheDocument();
  });

  it("enquanto reidrata a sessão mostra carregamento", () => {
    renderAt("loading");
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("com sessão mostra a página", () => {
    renderAt("authenticated");
    expect(screen.getByText("jogo")).toBeInTheDocument();
  });
});
