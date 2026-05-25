'use strict';

let token;

export class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameLabel = page.locator('vaadin-text-field#email input');
    this.passwordLabel = page.locator('vaadin-password-field#password input');
    this.loginButton = page.locator('#login-button');
    this.navBarHorizontal = page.locator('.nav-bar-hl');
    this.enterValidEmailMessage = page.locator('#error-message-vaadin-text-field-6');
    this.invalidCredentialsMessage = page.locator('#error-message-vaadin-password-field-9');
  }

  async #fillAndSubmit(username, password) {
    await this.usernameLabel.fill(username);
    await this.passwordLabel.fill(password);
    await this.loginButton.click();
  }

  async emptyLogin() {
    await this.loginButton.click();
    return await this.enterValidEmailMessage.textContent();
  }

  async failLogin(username, password) {
    await this.#fillAndSubmit(username, password);
    const result = await Promise.race([
      this.enterValidEmailMessage.waitFor({ state: 'visible' }).then(() => 'emailError'),
      this.invalidCredentialsMessage.waitFor({ state: 'visible' }).then(() => 'credentialsError'),
    ]);

    if (result === 'emailError') {
      return await this.enterValidEmailMessage.textContent();
    } else {
      return await this.invalidCredentialsMessage.textContent();
    }
  }

  async makeLogin(username, password) {
    await this.#fillAndSubmit(username, password);

    await this.navBarHorizontal.waitFor({ state: 'visible' });

    const cookies = await this.page.context().cookies();
    const authCookie = cookies.find((c) => c.name === 'api-pickle-ball-den-auth-token');
    token = authCookie?.value;
  }
}
