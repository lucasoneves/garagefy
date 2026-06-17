const { test, expect } = require('@playwright/test');

const mockToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.test';
const mockUser = JSON.stringify({
  id: '123',
  name: 'Test User',
  email: 'test@garagefy.com',
});

test.describe('Middleware - Proteção de Rotas', () => {
  test.describe('Sem autenticação (deslogado)', () => {
    test('redireciona /fuel para /login', async ({ page }) => {
      await page.goto('/fuel');
      await page.waitForURL(/\/login/, { timeout: 10000 });
      expect(page.url()).toContain('/login');
    });

    test('redireciona /my-garage para /login', async ({ page }) => {
      await page.goto('/my-garage');
      await page.waitForURL(/\/login/, { timeout: 10000 });
      expect(page.url()).toContain('/login');
    });

    test('redireciona /expenses para /login', async ({ page }) => {
      await page.goto('/expenses');
      await page.waitForURL(/\/login/, { timeout: 10000 });
      expect(page.url()).toContain('/login');
    });

    test('redireciona /logbook para /login', async ({ page }) => {
      await page.goto('/logbook');
      await page.waitForURL(/\/login/, { timeout: 10000 });
      expect(page.url()).toContain('/login');
    });

    test('redireciona /services para /login', async ({ page }) => {
      await page.goto('/services');
      await page.waitForURL(/\/login/, { timeout: 10000 });
      expect(page.url()).toContain('/login');
    });

    test('redireciona /add-fuel para /login', async ({ page }) => {
      await page.goto('/add-fuel');
      await page.waitForURL(/\/login/, { timeout: 10000 });
      expect(page.url()).toContain('/login');
    });

    test('redireciona /settings para /login', async ({ page }) => {
      await page.goto('/settings');
      await page.waitForURL(/\/login/, { timeout: 10000 });
      expect(page.url()).toContain('/login');
    });

    test('redireciona rota raiz (/) para /login', async ({ page }) => {
      await page.goto('/');
      await page.waitForURL(/\/login/, { timeout: 10000 });
      expect(page.url()).toContain('/login');
    });

    test('NÃO redireciona /login (permanece na página)', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('/login');
    });

    test('NÃO redireciona /register (permanece na página)', async ({ page }) => {
      await page.goto('/register');
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('/register');
    });

    test('adiciona ?redirect= ao redirecionar', async ({ page }) => {
      await page.goto('/fuel');
      await page.waitForURL(/\/login/, { timeout: 10000 });
      const url = new URL(page.url());
      expect(url.searchParams.get('redirect')).toBe('/fuel');
    });
  });

  test.describe('Com autenticação (logado)', () => {
    test.beforeEach(async ({ context }) => {
      await context.addCookies([
        { name: 'garagefy_token', value: mockToken, domain: 'localhost', path: '/' },
        { name: 'garagefy_user', value: mockUser, domain: 'localhost', path: '/' },
      ]);
    });

    test('acessa /fuel sem redirecionamento', async ({ page }) => {
      const response = await page.goto('/fuel');
      expect(response.status()).not.toBe(307);
      expect(response.status()).not.toBe(302);
      expect(page.url()).not.toContain('/login');
    });

    test('acessa /my-garage sem redirecionamento', async ({ page }) => {
      const response = await page.goto('/my-garage');
      expect(response.status()).not.toBe(307);
      expect(response.status()).not.toBe(302);
      expect(page.url()).not.toContain('/login');
    });

    test('acessa / sem redirecionamento', async ({ page }) => {
      const response = await page.goto('/');
      expect(response.status()).not.toBe(307);
      expect(response.status()).not.toBe(302);
      expect(page.url()).not.toContain('/login');
    });

    test('redireciona de /login para / quando já logado', async ({ page }) => {
      await page.goto('/login');
      await page.waitForURL('http://localhost:3333/', { timeout: 10000 });
      expect(page.url()).toBe('http://localhost:3333/');
    });

    test('redireciona de /register para / quando já logado', async ({ page }) => {
      await page.goto('/register');
      await page.waitForURL('http://localhost:3333/', { timeout: 10000 });
      expect(page.url()).toBe('http://localhost:3333/');
    });
  });
});
