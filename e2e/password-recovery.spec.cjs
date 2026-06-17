const { test, expect } = require('@playwright/test');

const API_BASE = 'http://localhost:8080/api';

test.describe('Password Recovery Flow', () => {
  test.describe('Forgot Password', () => {
    test('exibe link "Esqueci minha senha" na página de login', async ({ page }) => {
      await page.goto('/login');
      const link = page.getByText('Esqueci minha senha');
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', '/forgot-password');
    });

    test('navega para /forgot-password ao clicar no link', async ({ page }) => {
      await page.goto('/login');
      await page.getByText('Esqueci minha senha').click();
      await page.waitForURL('/forgot-password');
      await expect(page.getByRole('heading', { name: /recuperar senha/i })).toBeVisible();
    });

    test('exibe tela de sucesso após enviar email (API mockada)', async ({ page }) => {
      await page.route(`${API_BASE}/auth/forgot-password`, async (route) => {
        const postData = route.request().postDataJSON();
        expect(postData).toMatchObject({ email: expect.any(String) });
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Email enviado' }),
        });
      });

      await page.goto('/forgot-password');
      await page.getByPlaceholder('seu@email.com').fill('user@garagefy.com');
      await page.getByRole('button', { name: /enviar link/i }).click();

      await expect(page.getByText('Email enviado')).toBeVisible();
      await expect(page.getByText('user@garagefy.com')).toBeVisible();
    });

    test('exibe erro quando API falha', async ({ page }) => {
      await page.route(`${API_BASE}/auth/forgot-password`, async (route) => {
        await route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Email não encontrado' }),
        });
      });

      await page.goto('/forgot-password');
      await page.getByPlaceholder('seu@email.com').fill('unknown@email.com');
      await page.getByRole('button', { name: /enviar link/i }).click();

      await expect(page.getByText(/erro ao solicitar/i)).toBeVisible();
    });

    test('volta ao login pelo link', async ({ page }) => {
      await page.goto('/forgot-password');
      await page.getByRole('link', { name: /voltar ao login/i }).click();
      await page.waitForURL('/login');
    });

    test('link "Lembrou a senha?" no forgot-password', async ({ page }) => {
      await page.goto('/forgot-password');
      const link = page.getByText('Lembrou a senha?');
      await expect(link).toBeVisible();
    });
  });

  test.describe('Reset Password', () => {
    test('exibe erro se token não está na URL', async ({ page }) => {
      await page.goto('/reset-password');
      await expect(page.getByText('Link inválido')).toBeVisible();
    });

    test('exibe formulário quando token está presente', async ({ page }) => {
      await page.goto('/reset-password?token=valid-token-123');
      await expect(page.getByRole('heading', { name: /redefinir senha/i })).toBeVisible();
    });

    test('valida que senhas precisam ser iguais', async ({ page }) => {
      await page.goto('/reset-password?token=valid-token-123');
      const inputs = page.locator('input[type="password"]');
      await inputs.nth(0).fill('Senha123');
      await inputs.nth(1).fill('Senha456');
      await page.getByRole('button', { name: /redefinir senha/i }).click();
      await expect(page.getByText(/senhas não conferem/i)).toBeVisible();
    });

    test('redefine senha com sucesso (API mockada)', async ({ page }) => {
      await page.route(`${API_BASE}/auth/reset-password`, async (route) => {
        const postData = route.request().postDataJSON();
        expect(postData).toMatchObject({
          token: 'valid-token-123',
          password: 'Nova@123',
        });
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Senha redefinida' }),
        });
      });

      await page.goto('/reset-password?token=valid-token-123');
      const pwInputs = page.locator('input[type="password"]');
      await pwInputs.nth(0).fill('Nova@123');
      await pwInputs.nth(1).fill('Nova@123');
      await page.getByRole('button', { name: /redefinir senha/i }).click();

      await expect(page.getByText('Senha redefinida')).toBeVisible();
    });

    test('exibe erro quando API de reset falha', async ({ page }) => {
      await page.route(`${API_BASE}/auth/reset-password`, async (route) => {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Token inválido ou expirado' }),
        });
      });

      await page.goto('/reset-password?token=expired-token');
      const pwInputs = page.locator('input[type="password"]');
      await pwInputs.nth(0).fill('Nova@123');
      await pwInputs.nth(1).fill('Nova@123');
      await page.getByRole('button', { name: /redefinir senha/i }).click();

      await expect(page.getByText(/token pode ter expirado/i)).toBeVisible();
    });
  });

  test.describe('Middleware - Rotas públicas', () => {
    test('/forgot-password é acessível sem autenticação', async ({ page }) => {
      await page.goto('/forgot-password');
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('/forgot-password');
    });

    test('/reset-password é acessível sem autenticação', async ({ page }) => {
      await page.goto('/reset-password?token=abc');
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('/reset-password');
    });

    test('redireciona /forgot-password para / quando logado', async ({ context, page }) => {
      await context.addCookies([
        { name: 'garagefy_token', value: 'mock-token', domain: 'localhost', path: '/' },
        { name: 'garagefy_user', value: '{"id":"1"}', domain: 'localhost', path: '/' },
      ]);
      await page.goto('/forgot-password');
      await page.waitForURL('http://localhost:3333/', { timeout: 10000 });
    });
  });
});
