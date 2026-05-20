'use strict';

let token;

export class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameLabel = page.locator('vaadin-text-field#email input');
    this.passwordLabel = page.locator('vaadin-password-field#password input');
    this.loginButton = page.locator('#login-button');
    this.navBarHorizontal = page.locator('.nav-bar-hl');
  }
  async makeLogin(username, password) {
    await this.usernameLabel.fill(username);
    await this.passwordLabel.fill(password);
    await this.loginButton.click();

    await this.navBarHorizontal.waitFor({ state: 'visible' });

    const cookies = await this.page.context().cookies();
    const authCookie = cookies.find((c) => c.name === 'api-pickle-ball-den-auth-token');
    token = authCookie?.value;
  }
}
