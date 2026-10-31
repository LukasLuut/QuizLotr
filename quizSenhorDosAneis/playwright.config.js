import { defineConfig, devices } from "@playwright/test";

// Smoke E2E: sobe a API (../retorno-do-dev) e o Vite, e joga uma partida curta.
// Precisa de um MySQL com o banco do .env da API (no CI, o serviço mysql do workflow).
export default defineConfig({
  testDir: "./e2e",
  timeout: 90_000,
  expect: { timeout: 15_000 },
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: "http://localhost:5173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: [
    {
      command: "npm run dev",
      cwd: "../retorno-do-dev",
      url: "http://localhost:3000/health",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: "npm run dev -- --port 5173 --strictPort",
      url: "http://localhost:5173",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
