'use strict';

export const ERROR_TYPE = {
  EMAIL: 'email',
  CREDENTIALS: 'credentials',
};

let token;

export class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameLabel = page.locator('vaadin-text-field#email input');
    this.passwordLabel = page.locator('vaadin-password-field#password input');
    this.loginButton = page.locator('#login-button');
    this.navBarHorizontal = page.locator('.nav-bar-hl');
    this.enterValidEmailMessage = page.locator('vaadin-text-field#email [slot="error-message"]');
    this.invalidCredentialsMessage = page.locator(
      'vaadin-password-field#password [slot="error-message"]',
    );
  }

  async #fillAndSubmit(username, password) {
    await this.usernameLabel.fill(username);
    await this.passwordLabel.fill(password);
    await this.loginButton.click();
  }

  async submitEmptyLogin() {
    await this.loginButton.click();
    await this.enterValidEmailMessage.waitFor({ state: 'visible' });
    return await this.enterValidEmailMessage.textContent();
  }

  async submitLogin(username, password, errorType) {
    await this.#fillAndSubmit(username, password);
    if (errorType === ERROR_TYPE.EMAIL) {
      await this.enterValidEmailMessage.waitFor({ state: 'visible' });
      return await this.enterValidEmailMessage.textContent();
    } else {
      await this.invalidCredentialsMessage.waitFor({ state: 'visible' });
      return await this.invalidCredentialsMessage.textContent();
    }
  }

  async submitLoginWithoutPassword(username) {
    await this.usernameLabel.fill(username);
    await this.loginButton.click();
    await this.invalidCredentialsMessage.waitFor({ state: 'visible' });
    return await this.invalidCredentialsMessage.textContent();
  }

  async submitLoginWithoutUsername(password) {
    await this.passwordLabel.fill(password);
    await this.loginButton.click();
    await this.enterValidEmailMessage.waitFor({ state: 'visible' });
    return await this.enterValidEmailMessage.textContent();
  }

  async login(username, password) {
    await this.#fillAndSubmit(username, password);

    await this.navBarHorizontal.waitFor({ state: 'visible' });

    const cookies = await this.page.context().cookies();
    const authCookie = cookies.find((c) => c.name === 'api-pickle-ball-den-auth-token');
    token = authCookie?.value;
  }
}
