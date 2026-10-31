import { expect, test } from "@playwright/test";

const PASSWORD = "Anel@1234";

test("cadastro, login, uma pergunta, salvar e continuar a jornada", async ({ page }, testInfo) => {
  const email = `e2e-${testInfo.project.name}-${Date.now()}@condado.me`;
  const shot = (name) => page.screenshot({ path: testInfo.outputPath(`${name}.png`) });

  // Rota protegida sem sessão vai para o login (sem tela branca)
  await page.goto("/playquiz");
  await expect(page).toHaveURL(/\/login$/);

  // Cadastro
  await page.getByRole("button", { name: "Criar nova conta" }).click();
  await page.getByLabel("Nome do personagem").fill("Frodo Teste");
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Senha").fill(PASSWORD);
  await page.getByRole("button", { name: "Registrar" }).click();
  await expect(page.getByRole("status")).toContainText("Personagem criado");

  // Login (Enter envia o formulário)
  await page.getByLabel("Senha").fill(PASSWORD);
  await page.getByLabel("Senha").press("Enter");
  await expect(page).toHaveURL(/\/profile$/, { timeout: 20_000 });
  await expect(page.getByRole("heading", { name: "Frodo Teste" })).toBeVisible();
  await shot("perfil");

  // Novo jogo no modo Jornada
  await page.getByRole("button", { name: "Novo Jogo" }).click();
  await page.getByRole("dialog").getByRole("button", { name: /Jornada/ }).click();
  const skip = page.getByRole("button", { name: "Pular intro" });
  await Promise.race([skip.click({ timeout: 15_000 }).catch(() => {}), page.waitForURL(/\/playquiz$/, { timeout: 30_000 })]);
  await expect(page).toHaveURL(/\/playquiz$/, { timeout: 30_000 });

  // Primeira pergunta: alternativas não trazem gabarito; resposta trava os botões
  const options = page.locator(".quiz-options button");
  await expect(options).toHaveCount(4, { timeout: 30_000 });
  await shot("pergunta");
  await options.first().click();
  await expect(page.locator(".quiz-feedback p")).toBeVisible();
  await expect(options.first()).toBeDisabled();
  await shot("feedback");

  // Sem barra de rolagem horizontal
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);

  // F5 retoma a mesma partida
  await page.reload();
  await expect(page.locator(".quiz-options button")).toHaveCount(4, { timeout: 30_000 });
  await expect(page.locator("#progress-label")).toHaveText(/Progresso\s*1\/40/);

  // Esc abre o menu; "Salvar e sair" volta ao perfil com a jornada para continuar
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Menu" })).toBeVisible();
  await shot("menu");
  await page.getByRole("button", { name: "Salvar e sair" }).click();
  await expect(page).toHaveURL(/\/profile$/);
  await expect(page.getByRole("button", { name: "Continuar", exact: true })).toBeVisible();
});
