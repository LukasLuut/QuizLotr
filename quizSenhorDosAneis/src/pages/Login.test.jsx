import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";
import { AuthTestProvider } from "../context/AuthContext";

const renderLogin = (auth) =>
  render(
    <AuthTestProvider value={{ status: "anonymous", notice: null, clearNotice: vi.fn(), login: vi.fn(), register: vi.fn(), ...auth }}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </AuthTestProvider>
  );

describe("Login", () => {
  it("mostra a mensagem real do backend quando o login falha", async () => {
    const login = vi.fn().mockRejectedValue(new Error("E-mail ou senha inválidos"));
    renderLogin({ login });
    await userEvent.type(screen.getByLabelText("E-mail"), "frodo@condado.me");
    await userEvent.type(screen.getByLabelText("Senha"), "errada{Enter}");
    expect(login).toHaveBeenCalledWith("frodo@condado.me", "errada");
    expect(await screen.findByRole("alert")).toHaveTextContent("E-mail ou senha inválidos");
  });

  it("cadastro mostra os erros de validação do servidor", async () => {
    const register = vi.fn().mockRejectedValue(new Error("Senha deve conter pelo menos um número"));
    renderLogin({ register });
    await userEvent.click(screen.getByRole("button", { name: "Criar nova conta" }));
    await userEvent.type(screen.getByLabelText("Nome de usuário"), "Sam");
    await userEvent.type(screen.getByLabelText("E-mail"), "sam@condado.me");
    await userEvent.type(screen.getByLabelText("Senha"), "Abc@def");
    await userEvent.click(screen.getByRole("button", { name: "Registrar" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("pelo menos um número");
  });
});
