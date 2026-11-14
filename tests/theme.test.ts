import { expect, test } from '@playwright/test';

// Dark is the default. The header's toggle switches to the light theme, and
// the choice is kept across a reload until it's switched back.
test('theme: starts dark, switches to light, and remembers it', async ({ page }) => {
	await page.goto('/part-1_introduction/');
	const html = page.locator('html');
	const background = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);

	await expect(html).not.toHaveAttribute('data-theme');
	const dark = await background();

	await page.getByRole('button', { name: /Light/ }).click();
	await expect(html).toHaveAttribute('data-theme', 'light');
	expect(await background()).not.toBe(dark);

	await page.reload();
	await expect(html).toHaveAttribute('data-theme', 'light');

	await page.getByRole('button', { name: /Dark/ }).click();
	await expect(html).not.toHaveAttribute('data-theme');
	expect(await background()).toBe(dark);
});
