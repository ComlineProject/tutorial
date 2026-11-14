import { expect, test } from '@playwright/test';

// The sidebar is a tree of parts and their sections. It marks the page the
// reader is on, and its links move between pages.
test('navigation: the tree marks the current page and links to the others', async ({ page }) => {
	await page.goto('/part-1_introduction/sect-1_what-is-comline/');

	const nav = page.getByRole('navigation', { name: 'Tutorial contents' });
	await expect(nav.locator('[aria-current="page"]')).toHaveText('1.1 What is Comline?');
	await expect(nav.getByRole('link', { name: '1.3 Try it' })).toBeVisible();

	await nav.getByRole('link', { name: '1.3 Try it' }).click();
	await expect(page.getByRole('heading', { name: 'Try it' })).toBeVisible();
	await expect(nav.locator('[aria-current="page"]')).toHaveText('1.3 Try it');
});

// Only the part holding the current page starts open; the others fold away
// and open from their arrow. Next carries on from one part into the next.
test('navigation: parts fold, and Next crosses into the next part', async ({ page }) => {
	await page.goto('/part-2_basics/sect-2_structs-and-enums/');

	const nav = page.getByRole('navigation', { name: 'Tutorial contents' });
	const part = (n: number) => nav.locator('details').nth(n);
	await expect(part(0)).not.toHaveAttribute('open');
	await expect(part(1)).toHaveAttribute('open');
	await expect(part(2)).not.toHaveAttribute('open');
	await expect(nav.getByRole('link', { name: '3.1 Running the generator' })).toBeHidden();

	await part(2).locator('summary').click({ position: { x: 4, y: 8 } });
	await expect(nav.getByRole('link', { name: '3.1 Running the generator' })).toBeVisible();

	await page.getByRole('link', { name: 'Next' }).click();
	await expect(nav.locator('[aria-current="page"]')).toHaveText('2.3 Protocols');
	await page.getByRole('link', { name: 'Next' }).click();
	await expect(nav.locator('[aria-current="page"]')).toHaveText('3. Generating code');
	await expect(part(1)).not.toHaveAttribute('open');
});
