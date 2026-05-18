import { test, expect } from '@playwright/test';
import { FakeLoginPage } from '../src/pages/FakeLoginPage.js';
import { LoginPage } from '../src/pages/LoginPage.js';
import { chooseEnvironment } from '../src/helper/loginHelper.js';

test.beforeEach('Go to login', async ({ page }) => {
  const environment = chooseEnvironment();
  await page.goto(environment);

  const fakeLogin = new FakeLoginPage(page);
  await fakeLogin.clickOnLoginMe(process.env.ENVIRONMENT);
});

test('Validate login', async ({ page }) => {
  const login = new LoginPage(page);
  await login.makeLogin(process.env.USERNAME, process.env.PASSWORD);

  await expect(page).toHaveTitle('Den Home');
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
