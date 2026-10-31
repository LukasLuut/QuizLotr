import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Menu from "./Menu";

describe("Menu", () => {
  it("é um diálogo acessível que fecha com Continuar (Esc não fecha: o menu é do Espaço)", async () => {
    const onClose = vi.fn();
    render(<Menu isOpen onClose={onClose} onRestart={vi.fn()} onLeave={vi.fn()} />);
    expect(screen.getByRole("dialog", { name: "Menu" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Continuar" }));
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("pede confirmação antes de reiniciar", async () => {
    const onRestart = vi.fn();
    render(<Menu isOpen onClose={vi.fn()} onRestart={onRestart} onLeave={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: "Reiniciar" }));
    expect(onRestart).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "Sim" }));
    expect(onRestart).toHaveBeenCalledTimes(1);
  });
});
