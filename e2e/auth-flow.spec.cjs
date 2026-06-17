const { test, expect } = require('@playwright/test');

const API_BASE = 'http://localhost:8080/api';

const mockUser = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Test User',
  email: 'test@garagefy.com',
};

const mockToken =
  'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjNlNDU2Ny1lODliLTEyZDMtYTQ1Ni00MjY2MTQxNzQwMDAifQ.test';

function setupApiMock(page) {
  return page.route(`${API_BASE}/auth/*`, async (route) => {
    const url = route.request().url();

    if (url.includes('/auth/register')) {
      const postData = route.request().postDataJSON();
      expect(postData).toMatchObject({
        name: expect.any(String),
        email: expect.any(String),
        password: expect.any(String),
      });

      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          token: mockToken,
          user: {
            id: mockUser.id,
            name: postData.name,
            email: postData.email,
          },
        }),
      });
    } else if (url.includes('/auth/login')) {
      const postData = route.request().postDataJSON();
      expect(postData).toMatchObject({
        email: expect.any(String),
        password: expect.any(String),
      });

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: mockToken,
          user: {
            id: mockUser.id,
            name: 'Test User',
            email: postData.email,
          },
        }),
      });
    } else {
      await route.continue();
    }
  });
}

test.describe('Auth Flow - Registro e Login', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMock(page);
  });

  test('Registro: cria conta, recebe JWT e salva cookie', async ({ page, context }) => {
    await page.goto('/register');

    await expect(page.getByRole('heading', { name: /criar conta/i })).toBeVisible();

    await page.getByPlaceholder('Seu nome').fill(mockUser.name);
    await page.getByPlaceholder('seu@email.com').fill(mockUser.email);
    await page.getByPlaceholder('••••••••').fill('Test@123');

    await page.getByRole('button', { name: /cadastrar/i }).click();

    await page.waitForURL('http://localhost:3333/', { timeout: 15000 });

    const cookies = await context.cookies();
    const tokenCookie = cookies.find((c) => c.name === 'garagefy_token');
    const userCookie = cookies.find((c) => c.name === 'garagefy_user');

    expect(tokenCookie).toBeDefined();
    expect(decodeURIComponent(tokenCookie.value)).toBe(mockToken);
    expect(tokenCookie.httpOnly).toBe(false);

    expect(userCookie).toBeDefined();
    const parsedUser = JSON.parse(decodeURIComponent(userCookie.value));
    expect(parsedUser).toMatchObject({
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
    });
  });

  test('Login: autentica, recebe JWT e salva cookie', async ({ page, context }) => {
    await page.goto('/login');

    await expect(page.getByRole('heading', { name: /entrar/i })).toBeVisible();

    await page.getByPlaceholder('seu@email.com').fill(mockUser.email);
    await page.getByPlaceholder('••••••••').fill('Test@123');

    await page.getByRole('button', { name: /entrar/i }).click();

    await page.waitForURL('http://localhost:3333/', { timeout: 15000 });

    const cookies = await context.cookies();
    const tokenCookie = cookies.find((c) => c.name === 'garagefy_token');

    expect(tokenCookie).toBeDefined();
    expect(decodeURIComponent(tokenCookie.value)).toBe(mockToken);
  });

  test('Registro: exibe erro quando API falha', async ({ page }) => {
    await page.route(`${API_BASE}/auth/register`, async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Email já cadastrado' }),
      });
    });

    await page.goto('/register');
    await page.getByPlaceholder('Seu nome').fill(mockUser.name);
    await page.getByPlaceholder('seu@email.com').fill(mockUser.email);
    await page.getByPlaceholder('••••••••').fill('Test@123');
    await page.getByRole('button', { name: /cadastrar/i }).click();

    await expect(page.getByText(/erro ao criar conta/i)).toBeVisible();
    await expect(page).toHaveURL(/\/register/);
  });

  test('Login: exibe erro quando credenciais são inválidas', async ({ page }) => {
    await page.route(`${API_BASE}/auth/login`, async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Credenciais inválidas' }),
      });
    });

    await page.goto('/login');
    await page.getByPlaceholder('seu@email.com').fill('wrong@email.com');
    await page.getByPlaceholder('••••••••').fill('wrongpass');
    await page.getByRole('button', { name: /entrar/i }).click();

    await expect(page.getByText(/email ou senha inválidos/i)).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test('Login com API real: verifica Go backend e cookie', async ({ page, context })  => {
    test.skip(!process.env.E2E_REAL_API, 'Define E2E_REAL_API para testar contra backend real');

    await page.goto('/login');
    await page.getByPlaceholder('seu@email.com').fill(process.env.E2E_EMAIL || 'test@garagefy.com');
    await page.getByPlaceholder('••••••••').fill(process.env.E2E_PASSWORD || 'password123');
    await page.getByRole('button', { name: /entrar/i }).click();

    await page.waitForURL('http://localhost:3333/', { timeout: 15000 });

    const cookies = await context.cookies();
    const tokenCookie = cookies.find((c) => c.name === 'garagefy_token');
    expect(tokenCookie).toBeDefined();
    expect(tokenCookie.value).toBeTruthy();

    const userCookie = cookies.find((c) => c.name === 'garagefy_user');
    expect(userCookie).toBeDefined();
    const user = JSON.parse(decodeURIComponent(userCookie.value));
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');
  });
});
