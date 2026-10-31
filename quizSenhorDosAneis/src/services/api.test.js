import { describe, expect, it, vi, beforeEach } from "vitest";
import { api, errorMessage, onUnauthorized, request, tokenStore } from "./api";

const respond = (status, body) =>
  vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(body === undefined ? "" : JSON.stringify(body), { status }));

describe("errorMessage", () => {
  it("usa a mensagem do backend", () => {
    expect(errorMessage({ message: "E-mail já cadastrado" }, 409)).toBe("E-mail já cadastrado");
  });

  it("entende o formato antigo de erros do DTO (lista de constraints)", () => {
    expect(errorMessage([{ constraints: { a: "Nome inválido" } }, { b: "Senha curta" }], 400)).toBe("Nome inválido. Senha curta");
  });

  it("tem mensagem padrão por status", () => {
    expect(errorMessage(null, 500)).toMatch(/servidor/);
  });
});

describe("request", () => {
  beforeEach(() => tokenStore.clear());

  it("envia o token salvo no header Authorization", async () => {
    tokenStore.set("abc");
    const spy = respond(200, { ok: true });
    await request("/users/me");
    expect(spy.mock.calls[0][1].headers.Authorization).toBe("Bearer abc");
  });

  it("nunca considera 'undefined' como token", () => {
    localStorage.setItem("token", "undefined");
    expect(tokenStore.get()).toBeNull();
  });

  it("401 com token chama o handler de sessão expirada", async () => {
    tokenStore.set("expirado");
    const handler = vi.fn();
    const off = onUnauthorized(handler);
    respond(401, { message: "Sessão expirada" });
    await expect(request("/users/me")).rejects.toMatchObject({ status: 401 });
    expect(handler).toHaveBeenCalled();
    off();
  });

  it("login errado não dispara o handler (rota sem auth)", async () => {
    const handler = vi.fn();
    const off = onUnauthorized(handler);
    respond(401, { message: "E-mail ou senha inválidos" });
    await expect(api.login("a@b.c", "x")).rejects.toThrow("E-mail ou senha inválidos");
    expect(handler).not.toHaveBeenCalled();
    off();
  });

  it("falha de rede vira mensagem legível", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("Failed to fetch"));
    await expect(request("/x")).rejects.toThrow(/servidor/);
  });
});
