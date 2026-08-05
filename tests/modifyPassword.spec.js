import { test, expect } from '@playwright/test';
import { HorizontalMenuBarPage } from '../src/pages/HorizontalMenuBarPage.js';
import { loginAndGoToHome, ensureLoggedIn } from '../src/helper/loginHelper.js';
import { AccountPage } from '../src/pages/AccountPage.js';
import { ERROR_MESSAGES } from '../src/data/errorMessages.js';

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
    const [newPasswordError, repeatPasswordError] = await accountOptions.submitDifferentPasswords(
      process.env.PASSWORD,
      process.env.WRONG_PASSWORD,
      process.env.PASSWORD,
    );
    expect(newPasswordError).toBe(ERROR_MESSAGES.INVALID_NEW_PASSWORD);
    expect(repeatPasswordError).toBe(ERROR_MESSAGES.INVALID_NEW_PASSWORD);
  });

  test('Validate error message when: Repeat Password, Passwords do not match', async ({ page }) => {
    const accountOptions = new AccountPage(page);
    const [newPasswordError, repeatPasswordError] = await accountOptions.submitDifferentPasswords(
      process.env.PASSWORD,
      process.env.PASSWORD,
      process.env.WRONG_PASSWORD,
    );
    expect(newPasswordError).toBe(ERROR_MESSAGES.INVALID_NEW_PASSWORD);
    expect(repeatPasswordError).toBe(ERROR_MESSAGES.INVALID_NEW_PASSWORD);
  });
});

test.describe('Successful change password', () => {
  let passwordWasChanged = false;

  test('Successful change password', async ({ page }) => {
    const accountOptions = new AccountPage(page);
    const passwordChangedNotification = await accountOptions.changePassword(
      process.env.PASSWORD,
      process.env.CHANGE_PASSWORD_OK,
    );

    await expect(passwordChangedNotification).toBeVisible();
    passwordWasChanged = true;

    await accountOptions.logOutViaAccount();
    await expect(page).toHaveTitle('Logout');
    await loginAndGoToHome(page, process.env.USERNAME, process.env.CHANGE_PASSWORD_OK);

    await expect(page).toHaveTitle('Den Home');
  });

  test.afterEach('Restore original password after a successful change', async ({ page }) => {
    if (!passwordWasChanged) return;

    try {
      await ensureLoggedIn(page, process.env.USERNAME, process.env.CHANGE_PASSWORD_OK);

      const horizontalMenu = new HorizontalMenuBarPage(page);
      await horizontalMenu.goToAccount();
      await expect(page).toHaveTitle('My Account');

      const accountOptions = new AccountPage(page);
      await accountOptions.goToChangePassword();
      const passwordRestoredNotification = await accountOptions.changePassword(
        process.env.CHANGE_PASSWORD_OK,
        process.env.PASSWORD,
      );

      await expect(passwordRestoredNotification).toBeVisible();
    } catch (error) {
      console.error(`PASSWORD RESTORE FAILED. Cause: ${error.message}`);
      throw error;
    }
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
