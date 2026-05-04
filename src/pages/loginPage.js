'use strict';
import { expect } from '@playwright/test';

let token;

export class loginPage {
  constructor(page) {
    this.page = page;
    this.usernameLabel = page.locator('vaadin-text-field#email input');
    this.passwordLabel = page.locator('vaadin-password-field#password input');
    this.loginButton = page.locator('#login-button');
  }
  async makeLogin(username, password, page) {
    await this.usernameLabel.fill(username);
    await this.passwordLabel.fill(password);
    await this.loginButton.click();

    await expect(page).toHaveTitle('Den Home');

    const cookies = await this.page.context().cookies();
    const authCookie = cookies.find((c) => c.name === 'api-pickle-ball-den-auth-token');
    token = authCookie?.value;
  }
}
