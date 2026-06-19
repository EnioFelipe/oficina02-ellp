import { test, expect } from '@playwright/test';
import { finalizeWorkshop, readSeedData } from './helpers/db.mjs';

const seed = readSeedData();
const apiUrl = process.env.E2E_API_URL || 'http://localhost:4000';

test.describe('fluxo inscricao, finalizacao e certificado', () => {
  test('aluno se inscreve, oficina e finalizada e certificado e baixado', async ({ page, request }) => {
    await expect.poll(async () => {
      const response = await request.get(`${apiUrl}/workshops`);
      const workshops = await response.json();
      return workshops.some((item) => item.name === seed.workshopName);
    }, { timeout: 15000 }).toBe(true);

    await page.goto('/workshops');
    await expect(page.getByRole('heading', { name: 'Oficinas' })).toBeVisible();

    const row = page.locator('tr', { hasText: seed.workshopName });
    await row.getByRole('button', { name: 'Inscrever-se' }).click();

    await page.getByLabel('Nome').fill(seed.studentName);
    await page.getByLabel('Idade').fill('22');
    await page.getByLabel('CPF').fill(seed.cpf);
    await page.getByRole('button', { name: 'Confirmar inscrição' }).click();

    await expect(page.getByText('Inscrição realizada com sucesso')).toBeVisible({ timeout: 10000 });

    const consultBefore = await request.get(`${apiUrl}/enrollments/cpf/${encodeURIComponent(seed.cpf)}`);
    expect(consultBefore.ok()).toBeTruthy();
    const bodyBefore = await consultBefore.json();
    expect(bodyBefore[0]?.certificateAvailable).toBe(false);

    await finalizeWorkshop(seed.workshopId);

    await page.goto('/consultar');
    await page.getByLabel('CPF').fill(seed.cpf);
    await page.getByRole('button', { name: 'Buscar' }).click();

    const downloadButton = page.getByRole('button', { name: /Baixar certificado/i });
    await expect(downloadButton).toBeVisible();

    const downloadPromise = page.waitForEvent('download');
    await downloadButton.click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/certificado/i);
  });
});
