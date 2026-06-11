import { test, expect } from '@playwright/test';
import { FakeLoginPage } from '../src/pages/FakeLoginPage.js';
import { LoginPage } from '../src/pages/LoginPage.js';
import { chooseEnvironment } from '../src/helper/loginHelper.js';
import { ERROR_MESSAGES } from '../src/data/errorMessages.js';

test.beforeEach('Go to login', async ({ page }) => {
  const environment = chooseEnvironment();
  await page.goto(environment);

  const fakeLogin = new FakeLoginPage(page);
  await fakeLogin.clickOnLoginMe(process.env.ENVIRONMENT);
});

test.describe('Login: error scenarios', () => {
  test('Validate error message when: login without username and password', async ({ page }) => {
    const login = new LoginPage(page);
    const errorMessage = await login.submitEmptyLogin();
    expect(errorMessage).toBe(ERROR_MESSAGES.INVALID_EMAIL);
  });

  test('Validate error message when: login with invalid format email', async ({ page }) => {
    const login = new LoginPage(page);
    const errorMessage = await login.submitLogin(
      process.env.INVALID_USERNAME,
      process.env.PASSWORD,
      ERROR_MESSAGES.EMAIL,
    );
    expect(errorMessage).toBe(ERROR_MESSAGES.INVALID_EMAIL);
  });

  test('Validate error message when: login with wrong email', async ({ page }) => {
    const login = new LoginPage(page);
    const errorMessage = await login.submitLogin(
      process.env.WRONG_USERNAME,
      process.env.PASSWORD,
      ERROR_MESSAGES.CREDENTIALS,
    );
    expect(errorMessage).toBe(ERROR_MESSAGES.INVALID_CREDENTIALS);
  });

  test('Validate error message when: login with wrong password', async ({ page }) => {
    const login = new LoginPage(page);
    const errorMessage = await login.submitLogin(
      process.env.USERNAME,
      process.env.WRONG_PASSWORD,
      ERROR_MESSAGES.CREDENTIALS,
    );
    expect(errorMessage).toBe(ERROR_MESSAGES.INVALID_CREDENTIALS);
  });

  test('Validate error message when: login with username and without password', async ({
    page,
  }) => {
    const login = new LoginPage(page);
    const errorMessage = await login.submitLoginWithoutPassword(process.env.USERNAME);
    expect(errorMessage).toBe(ERROR_MESSAGES.INVALID_CREDENTIALS);
  });

  test('Validate error message when: login with password and without username', async ({
    page,
  }) => {
    const login = new LoginPage(page);
    const errorMessage = await login.submitLoginWithoutUsername(process.env.PASSWORD);
    expect(errorMessage).toBe(ERROR_MESSAGES.INVALID_EMAIL);
  });
});

test.describe('Login: successful authentication', () => {
  test('Validate successful login with valid username and password', async ({ page }) => {
    const login = new LoginPage(page);
    await login.login(process.env.USERNAME, process.env.PASSWORD);

    await expect(page).toHaveTitle('Den Home');
  });
});

test.afterEach(async ({ page }, testInfo) => {
  console.log(`Finished test ${testInfo.title} with status ${testInfo.status}`);
  if (testInfo.status !== testInfo.expectedStatus) {
    await page.screenshot({
      path: testInfo.outputPath('screenshot.png'),
      fullPage: true,
    });
  }
});
