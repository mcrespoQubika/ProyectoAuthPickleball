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

test.describe('Test login: validate message in login page when ', () => {
  test('Test1: inputs empty', async ({ page, request }) => {
    const login = new LoginPage(page);
    const errorMessage = await login.emptyLogin();
    expect(errorMessage).toBe(ERROR_MESSAGES.EMPTY_CREDENTIALS);
  });

  test('Test2: invalid email', async ({ page, request }) => {
    const login = new LoginPage(page);
    const errorMessage = await login.failLogin(process.env.INVALID_USERNAME, process.env.PASSWORD);
    expect(errorMessage).toBe(ERROR_MESSAGES.INVALID_EMAIL);
  });

  test('Test3: wrong email', async ({ page, request }) => {
    const login = new LoginPage(page);
    const errorMessage = await login.failLogin(process.env.WRONG_USERNAME, process.env.PASSWORD);
    expect(errorMessage).toBe(ERROR_MESSAGES.INVALID_CREDENTIALS);
  });

  test('Test4: wrong password', async ({ page, request }) => {
    const login = new LoginPage(page);
    const errorMessage = await login.failLogin(process.env.USERNAME, process.env.WRONG_PASSWORD);
    expect(errorMessage).toBe(ERROR_MESSAGES.INVALID_CREDENTIALS);
  });

  test('Test5: username without password', async ({ page }) => {
    const login = new LoginPage(page);
    const errorMessage = await login.loginWithUsernameOnly(process.env.USERNAME);
    expect(errorMessage).toBe(ERROR_MESSAGES.MISSING_PASSWORD);
  });

  test('Test6: password without username', async ({ page }) => {
    const login = new LoginPage(page);
    const errorMessage = await login.loginWithPasswordOnly(process.env.PASSWORD);
    expect(errorMessage).toBe(ERROR_MESSAGES.MISSING_USERNAME);
  });

  test('Test7: Validate login', async ({ page }) => {
    const login = new LoginPage(page);
    await login.makeLogin(process.env.USERNAME, process.env.PASSWORD);

    await expect(page).toHaveTitle('Den Home');
  });
});

test.afterEach(async ({ page }, testInfo) => {
  console.log(`Finished test ${testInfo.title} with status ${testInfo.status}`);
  if (testInfo.status !== testInfo.expectedStatus) {
    await page.screenshot({
      path: `screenshots/${testInfo.title}.png`,
      fullPage: true,
    });
  }
});
