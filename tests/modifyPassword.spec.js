import { test, expect } from '@playwright/test';
import { FakeLoginPage } from '../src/pages/FakeLoginPage.js';
import { LoginPage } from '../src/pages/LoginPage.js';
import { HorizontalMenuBarPage } from '../src/pages/HorizontalMenuBarPage.js';
import { chooseEnvironment } from '../src/helper/loginHelper.js';
import { AccountPage } from '../src/pages/AccountPage.js';
import { ERROR_MESSAGES } from '../src/data/errorMessages.js';
import { SUCCESS_MESSAGES } from '../src/data/successMessages.js';

async function loginAndGoToHome(page, username, password) {
  const environment = chooseEnvironment();
  await page.goto(environment);

  const fakeLogin = new FakeLoginPage(page);
  await fakeLogin.clickOnLoginMe(process.env.ENVIRONMENT);

  const login = new LoginPage(page);
  await login.login(username, password);
}

test.beforeEach('Go to login screen and login', async ({ page }) => {
  await loginAndGoToHome(page, process.env.USERNAME, process.env.PASSWORD);
  await expect(page).toHaveTitle('Den Home');
  const horizontalMenu = new HorizontalMenuBarPage(page);
  await horizontalMenu.goToAccount();
  await expect(page).toHaveTitle('My Account');

  const accountOptions = new AccountPage(page);
  await accountOptions.goToChangePassword();
});

test.describe('Change password: error scenarios', () => {
  test('Validate error message when: Current password is wrong', async ({ page }) => {
    const accountOptions = new AccountPage(page);
    const errorMessage = await accountOptions.submitWithWrongPassword(process.env.WRONG_PASSWORD);
    expect(errorMessage).toBe(ERROR_MESSAGES.INCORRECT_CURRENT_PASSWORD);
  });

  test('Validate error message when: New password is empty', async ({ page }) => {
    const accountOptions = new AccountPage(page);
    const errorMessage = await accountOptions.submitWithEmptyNewPassword(process.env.PASSWORD);
    expect(errorMessage).toBe(ERROR_MESSAGES.EMPTY_PASSWORD);
  });

  test('Validate error message when: New Password, Passwords do not match', async ({ page }) => {
    const accountOptions = new AccountPage(page);
    const [newPasswordError, repeatPasswordError] = await accountOptions.submitDifferentsPasswords(
      process.env.PASSWORD,
      process.env.WRONG_PASSWORD,
      process.env.PASSWORD,
    );
    expect(newPasswordError).toBe(ERROR_MESSAGES.INVALID_NEW_PASSWORD);
    expect(repeatPasswordError).toBe(ERROR_MESSAGES.INVALID_NEW_PASSWORD);
  });

  test('Validate error message when: Repeat Password, Passwords do not match', async ({ page }) => {
    const accountOptions = new AccountPage(page);
    const [newPasswordError, repeatPasswordError] = await accountOptions.submitDifferentsPasswords(
      process.env.PASSWORD,
      process.env.PASSWORD,
      process.env.WRONG_PASSWORD,
    );
    expect(newPasswordError).toBe(ERROR_MESSAGES.INVALID_NEW_PASSWORD);
    expect(repeatPasswordError).toBe(ERROR_MESSAGES.INVALID_NEW_PASSWORD);
  });
});

test.describe('Successful change password', () => {
  //let passwordChanged = false;

  test('Successful change password', async ({ page }) => {
    const accountOptions = new AccountPage(page);
    const passowrdChangedMessage = await accountOptions.changePassword(
      process.env.PASSWORD,
      process.env.CHANGE_PASSWORD_OK,
    );
    //passwordChanged = true;
    expect(passowrdChangedMessage).toBe(SUCCESS_MESSAGES.PASSWORD_CHANGED);

    await accountOptions.logOutViaAccount();
    await loginAndGoToHome(page, process.env.USERNAME, process.env.CHANGE_PASSWORD_OK);

    await expect(page).toHaveTitle('Den Home');
  });

  // test.afterEach('Revert password change', async ({ page }) => {
  //   if (!passwordChanged) return;
  //   passwordChanged = false;

  //   await loginAndGoToHome(page, process.env.USERNAME, process.env.CHANGE_PASSWORD_OK);
  //   const horizontalMenu = new HorizontalMenuBarPage(page);
  //   await horizontalMenu.goToAccount();
  //   const accountOptions = new AccountPage(page);
  //   await accountOptions.goToChangePassword();
  //   await accountOptions.changePassword(process.env.CHANGE_PASSWORD_OK, process.env.PASSWORD);
  // });
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
