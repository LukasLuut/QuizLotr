import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

// jsdom não implementa mídia
window.HTMLMediaElement.prototype.play = () => Promise.resolve();
window.HTMLMediaElement.prototype.pause = () => {};
window.HTMLMediaElement.prototype.load = () => {};
