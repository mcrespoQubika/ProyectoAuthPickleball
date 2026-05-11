'use strict';

export class fakeLoginPage {
  constructor(page) {
    this.logMeInButton = page.locator('#logMeInButton');
    this.SubmitButton = page.getByRole('button', { name: 'Submit' });
  }

  async clickOnLoginMe(environment) {
    const env = environment.toUpperCase();
    if (env === 'TRAINING') {
      //Only for training we have a special screen with submit button, after click submit, the user is redirect to FakeLoginPage
      await this.SubmitButton.click({ force: true });
    }
    await this.logMeInButton.click();
  }
}
