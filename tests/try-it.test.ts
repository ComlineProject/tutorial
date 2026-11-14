import { expect, test } from '@playwright/test';

// The "Try it" lesson runs the playground's simulate view (comline-web-kit)
// on a Chat client and server: a call gets a reply, and once the server drops
// `send`, the next call times out.
test('try it: a call is answered, then times out once the server drops it', async ({ page }) => {
	await page.goto('/part-1_introduction/sect-3_try-it');

	const send = page
		.locator('.cl-sim .call-block')
		.filter({ has: page.locator('.call-fn-name', { hasText: /^send$/ }) });
	await expect(send).toBeVisible();
	await send.locator('.arg-input').first().fill('hello');
	await send.getByRole('button', { name: 'send' }).click();
	await expect(send.locator('.call-out')).toHaveClass(/ok/);
	await expect(page.locator('.cl-sim .frame-row').first()).toBeVisible();

	await page.locator('.cl-sim .sim-node.role-server').click();
	await page.locator('.cl-sim .behavior-row .behavior-kind').first().selectOption('drop');
	await page.locator('.cl-sim .sim-node.role-client').click();
	await send.getByRole('button', { name: 'send' }).click();
	await expect(send.locator('.call-out')).toHaveText('timeout');
});
