'use strict';

export class AccountPage {
  constructor(page) {
    const mainView = page.locator('.main-view');

    this.page = page;
    this.moreOptionsButton = mainView.locator('vaadin-menu-bar-button', {
      hasText: 'More options',
    });
    this.changePasswordMenuItem = page.locator('vaadin-menu-bar-item', {
      hasText: 'Change Password',
    });
    this.logOutOption = page.locator('vaadin-menu-bar-item', {
      hasText: 'Logout',
    });
    this.currentPasswordInput = page
      .locator('vaadin-password-field', { hasText: 'Current Password' })
      .locator('input[slot="input"]');
    this.newPasswordInput = page
      .locator('vaadin-password-field', { hasText: 'New Password' })
      .locator('input[slot="input"]');
    this.repeatPasswordInput = page
      .locator('vaadin-password-field', { hasText: 'Repeat Password' })
      .locator('input[slot="input"]');
    this.resetButton = page.locator('.pd-flexwrap vaadin-button', { hasText: 'Reset' });
    this.cancelButton = page.locator('.pd-flexwrap vaadin-button', { hasText: 'Cancel' });
    this.currentPasswordError = page.locator(
      'vaadin-password-field:has-text("Current Password") [slot="error-message"]',
    );
    this.newPasswordError = page.locator(
      'vaadin-password-field:has-text("New Password") [slot="error-message"]',
    );
    this.repeatPasswordError = page.locator(
      'vaadin-password-field:has-text("Repeat Password") [slot="error-message"]',
    );
    this.passwordChangedNotification = page.locator(
      'vaadin-notification-card span:has-text("Password Changed!")',
    );
  }

  async goToChangePassword() {
    await this.moreOptionsButton.click();
    await this.changePasswordMenuItem.waitFor({ state: 'visible' });
    await this.changePasswordMenuItem.click();
  }

  async submitWithWrongPassword(password) {
    await this.currentPasswordInput.fill(password);
    await this.resetButton.click();
    await this.currentPasswordError.waitFor({ state: 'visible' });
    return await this.currentPasswordError.textContent();
  }

  async submitWithEmptyNewPassword(currentPassword) {
    await this.currentPasswordInput.fill(currentPassword);
    await this.resetButton.click();
    await this.newPasswordError.waitFor({ state: 'visible' });
    return await this.newPasswordError.textContent();
  }

  async submitDifferentPasswords(currentPassword, newPassword, repeatPassword) {
    await this.currentPasswordInput.fill(currentPassword);
    await this.newPasswordInput.fill(newPassword);
    await this.repeatPasswordInput.fill(repeatPassword);
    await this.resetButton.click();
    await this.newPasswordError.waitFor({ state: 'visible' });
    await this.repeatPasswordError.waitFor({ state: 'visible' });
    return [
      await this.newPasswordError.textContent(),
      await this.repeatPasswordError.textContent(),
    ];
  }

  async changePassword(currentPassword, newPassword) {
    await this.currentPasswordInput.fill(currentPassword);
    await this.newPasswordInput.fill(newPassword);
    await this.repeatPasswordInput.fill(newPassword);
    await this.resetButton.click();
    return this.passwordChangedNotification;
  }

  async logOutViaAccount() {
    await this.moreOptionsButton.waitFor({ state: 'visible' });
    await this.moreOptionsButton.click();
    await this.logOutOption.waitFor({ state: 'visible' });
    await this.logOutOption.click();
    await this.page.waitForLoadState('load');
  }
}
