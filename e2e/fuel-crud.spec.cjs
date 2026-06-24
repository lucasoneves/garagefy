const { test, expect } = require('@playwright/test');

const API_BASE = 'http://localhost:8080/api';

const mockToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.test';
const mockUser = JSON.stringify({
  id: 'v1',
  name: 'Test User',
  email: 'test@garagefy.com',
});

const mockFuels = [
  {
    id: 'fuel-1',
    vehicle_id: 'v1',
    gas_station: 'Shell',
    fuel_type: 'gasoline_premium',
    price_per_liter: 6.49,
    total_cost: 194.70,
    liters: 30,
    odometer: 15000,
    date: '2026-06-01T00:00:00Z',
  },
  {
    id: 'fuel-2',
    vehicle_id: 'v1',
    gas_station: 'Petrobras',
    fuel_type: 'ethanol',
    price_per_liter: 4.29,
    total_cost: 85.80,
    liters: 20,
    odometer: 15300,
    date: '2026-06-15T00:00:00Z',
  },
];

const mockVehicle = { id: 'v1', brand: 'Fiat', model: 'Uno', plate: 'ABC1234' };

function setupApiMock(page, fuels = mockFuels) {
  return page.route(`${API_BASE}/**`, async (route) => {
    const url = route.request().url();
    const method = route.request().method();

    if (url.includes('/vehicles')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([mockVehicle]),
      });
    } else if (url.includes('/fuels') && method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(fuels),
      });
    } else {
      await route.continue();
    }
  });
}

test.describe('Fuel CRUD', () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      { name: 'garagefy_token', value: mockToken, domain: 'localhost', path: '/' },
      { name: 'garagefy_user', value: mockUser, domain: 'localhost', path: '/' },
    ]);
  });

  test.describe('Listagem', () => {
    test('exibe dados dos abastecimentos', async ({ page }) => {
      await setupApiMock(page);
      await page.goto('/fuel');

      await expect(page.getByText('Fuel History')).toBeVisible();
      await expect(page.getByText('R$ 280,50')).toBeVisible();
      await expect(page.getByText(/50.*L total/)).toBeVisible();

      await expect(page.getByText('Shell')).toBeVisible();
      await expect(page.getByText('Gasolina (Premium)')).toBeVisible();
      await expect(page.getByText('30 L')).toBeVisible();
      await expect(page.getByText('R$ 194,70')).toBeVisible();

      await expect(page.getByText('Petrobras')).toBeVisible();
      await expect(page.getByText('20 L')).toBeVisible();
      await expect(page.getByText('R$ 85,80')).toBeVisible();

      const editLink = page.locator('a[href*="/fuel/edit/fuel-1"]');
      await expect(editLink).toBeVisible();
    });

    test('exibe estado vazio quando nao ha registros', async ({ page }) => {
      await setupApiMock(page, []);
      await page.goto('/fuel');

      await expect(page.getByText('Nenhum abastecimento registrado')).toBeVisible();
    });
  });

  test.describe('Criacao', () => {
    test('cria abastecimento e redireciona', async ({ page }) => {
      let postedPayload = null;

      await page.route(`${API_BASE}/**`, async (route) => {
        const url = route.request().url();
        const method = route.request().method();

        if (url.includes('/vehicles')) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([mockVehicle]),
          });
        } else if (url.includes('/fuels') && method === 'GET') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([]),
          });
        } else if (url.includes('/fuels') && method === 'POST') {
          postedPayload = route.request().postDataJSON();
          await route.fulfill({
            status: 201,
            contentType: 'application/json',
            body: JSON.stringify({ ...postedPayload, id: 'fuel-new' }),
          });
        } else {
          await route.continue();
        }
      });

      await page.goto('/add-fuel');
      await expect(page.getByText('Add Fuel')).toBeVisible();

      await page.getByPlaceholder('Shell, Exxon, BP...').fill('Ipiranga');
      await page.getByRole('combobox').selectOption('ethanol');
      await page.getByPlaceholder('0.00').first().fill('5,49');
      await page.getByPlaceholder('0.00').nth(1).fill('109,80');
      await page.getByPlaceholder('0.00').nth(2).fill('20');
      await page.getByPlaceholder('0', { exact: true }).fill('16000');
      await page.getByPlaceholder('DD/MM/YYYY').fill('20062026');

      await page.getByRole('button', { name: /save fuel entry/i }).click();

      expect(postedPayload).toMatchObject({
        vehicle_id: 'v1',
        gas_station: 'Ipiranga',
        fuel_type: 'ethanol',
        price_per_liter: 5.49,
        total_cost: 109.80,
        liters: 20,
        odometer: 16000,
      });

      await page.waitForURL('http://localhost:3333/fuel', { timeout: 15000 });
    });

    test('exibe erro quando API falha', async ({ page }) => {
      const dialogPromise = new Promise((resolve) => {
        page.on('dialog', async (dialog) => {
          resolve(dialog.message());
          await dialog.accept();
        });
      });

      await page.route(`${API_BASE}/**`, async (route) => {
        const url = route.request().url();
        const method = route.request().method();

        if (url.includes('/vehicles')) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([mockVehicle]),
          });
        } else if (url.includes('/fuels') && method === 'POST') {
          await route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Dados invalidos' }),
          });
        } else {
          await route.continue();
        }
      });

      await page.goto('/add-fuel');
      await page.getByPlaceholder('Shell, Exxon, BP...').fill('Ipiranga');
      await page.getByPlaceholder('0.00').nth(1).fill('100');
      await page.getByPlaceholder('DD/MM/YYYY').fill('20062026');
      await page.getByRole('button', { name: /save fuel entry/i }).click();

      await expect(await dialogPromise).toContain('Não foi possível');
    });
  });

  test.describe('Edicao', () => {
    test('carrega dados e atualiza abastecimento', async ({ page }) => {
      let putPayload = null;

      await page.route(`${API_BASE}/**`, async (route) => {
        const url = route.request().url();
        const method = route.request().method();

        if (url.includes('/vehicles')) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([mockVehicle]),
          });
        } else if (url.includes('/fuels/fuel-1') && method === 'GET') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockFuels[0]),
          });
        } else if (url.includes('/fuels/fuel-1') && method === 'PUT') {
          putPayload = route.request().postDataJSON();
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(putPayload),
          });
        } else {
          await route.continue();
        }
      });

      await page.goto('/fuel/edit/fuel-1');
      await expect(page.getByText('Edit Fuel')).toBeVisible();

      await expect(page.getByPlaceholder('Shell, Exxon, BP...')).toHaveValue('Shell');
      await expect(page.getByPlaceholder('0', { exact: true })).toHaveValue('15000');

      await page.getByPlaceholder('Shell, Exxon, BP...').fill('Ipiranga');
      await page.getByRole('button', { name: /update fuel entry/i }).click();

      expect(putPayload).toMatchObject({
        gas_station: 'Ipiranga',
        fuel_type: 'gasoline_premium',
        total_cost: 194.70,
        odometer: 15000,
      });

      await page.waitForURL('http://localhost:3333/fuel', { timeout: 15000 });
    });

    test('exibe erro quando atualizacao falha', async ({ page }) => {
      const dialogPromise = new Promise((resolve) => {
        page.on('dialog', async (dialog) => {
          resolve(dialog.message());
          await dialog.accept();
        });
      });

      await page.route(`${API_BASE}/**`, async (route) => {
        const url = route.request().url();
        const method = route.request().method();

        if (url.includes('/vehicles')) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([mockVehicle]),
          });
        } else if (url.includes('/fuels/fuel-1') && method === 'GET') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockFuels[0]),
          });
        } else if (url.includes('/fuels/fuel-1') && method === 'PUT') {
          await route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Erro ao atualizar' }),
          });
        } else {
          await route.continue();
        }
      });

      await page.goto('/fuel/edit/fuel-1');
      await page.getByRole('button', { name: /update fuel entry/i }).click();

      await expect(await dialogPromise).toContain('Não foi possível');
    });
  });

  test.describe('Exclusao', () => {
    test('deleta abastecimento apos confirmacao', async ({ page }) => {
      const deletePromise = page.waitForResponse(
        (resp) => resp.url().includes('/fuels/') && resp.request().method() === 'DELETE'
      );

      await page.addInitScript(() => {
        localStorage.setItem('@garagefy:active_vehicle_id', 'v1');
        window.confirm = () => true;
      });

      await page.route(`${API_BASE}/**`, async (route) => {
        const url = route.request().url();
        const method = route.request().method();

        if (url.includes('/vehicles')) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([mockVehicle]),
          });
        } else if (url.includes('/fuels') && method === 'GET') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockFuels),
          });
        } else if (method === 'DELETE') {
          await route.fulfill({ status: 204 });
        } else {
          await route.continue();
        }
      });

      await page.goto('/fuel');
      await expect(page.getByText('Shell')).toBeVisible();

      const deleteButtons = page.locator('main button').filter({ has: page.locator('svg') });
      await expect(deleteButtons).toHaveCount(2);

      await deleteButtons.last().click();

      await expect(deletePromise).resolves.toBeTruthy();
    });
  });
});
