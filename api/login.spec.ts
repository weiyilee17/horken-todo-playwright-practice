import { test, expect, Page, Locator } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/login');
});

test.describe('Login form', () => {
  test('Should block empty input', async ({ page }) => {
    const loginButton = page.getByRole('button', { name: 'Login' });

    await loginButton.click();
    expect(await loginButton.isDisabled());

    expect(page.getByText('Invalid email'));
    expect(page.getByText('String must contain at least'));
  });

  test('Should block invalid email', async ({ page }) => {
    const emailField = page.getByLabel('Email');

    const invalidEmails = ['asdf', 'asdf@asdf', 'asdf.gmail.com'];

    for (const invalidEmail of invalidEmails) {
      await emailField.fill(invalidEmail);
      expect(await page.getByText('Invalid email').isVisible());
      await emailField.clear();
    }

    const loginButton = page.getByRole('button', { name: 'Login' });

    await loginButton.click();
    expect(await loginButton.isDisabled());
  });

  test('Should block invalid password', async ({ page }) => {
    const passwordField = page.getByLabel('Password');

    const passwordsNotLongEnough = ['a', 'as', 'asd', 'asdf', 'asdfj', 'asdfjk', 'asdfjkl'];

    for (const invalidPssword of passwordsNotLongEnough) {
      await passwordField.fill(invalidPssword);
      expect(await page.getByText('String must contain at least 8 characters').isVisible());
      await passwordField.clear();
    }

    const loginButton = page.getByRole('button', { name: 'Login' });

    await loginButton.click();
    expect(await loginButton.isDisabled());

    const invalidInput = [
      {
        invalidText: 'Asdfjkl!',
        expectedErrorMessage: 'At least 1 number is required',
      },
      {
        invalidText: '1SDFJKL!',
        expectedErrorMessage: 'At least 1 lower case is required',
      },
      {
        invalidText: '1sdfjkl!',
        expectedErrorMessage: 'At least 1 upper case is required',
      },
      {
        invalidText: 'A2dfjklo',
        expectedErrorMessage: 'At least 1 special character is required',
      },
    ];

    await validateField(page, passwordField, invalidInput);
  });

  test('Should only allow test account', async ({ page }) => {
    const emailField = page.getByLabel('Email');
    const passwordField = page.getByLabel('Password');

    await emailField.fill('test@test.com');
    await passwordField.fill('password');

    const loginButton = page.getByRole('button', { name: 'Login' });

    await loginButton.click();

    await expect(page.locator('li')).toHaveText(/Login Successful/);
    await page.screenshot({ path: `./api/screenshots/login-success-${new Date().toISOString()}.png`, fullPage: true });

    await emailField.fill('test@gmail.com');
    await passwordField.fill('password666');

    await loginButton.click();

    await expect(page.locator('li')).toHaveText(/Login Failed/);
    await page.screenshot({ path: `./api/screenshots/login-fail-${new Date().toISOString()}.png`, fullPage: true });
  });
});

async function validateField(
  page: Page,
  targetElement: Locator,
  invalidInput: { invalidText: string; expectedErrorMessage: string }[]
) {
  for (const { invalidText, expectedErrorMessage } of invalidInput) {
    await targetElement.fill(invalidText);
    await expect(page.getByText(expectedErrorMessage)).toBeVisible();

    await targetElement.clear();
  }
}
