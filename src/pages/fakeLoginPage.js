'use strict';

export class fakeLoginPage {
  constructor(page) {
    this.logMeInButton = page.locator('#logMeInButton');
  }

  async clickOnLoginMe() {
    await this.logMeInButton.click();
  }
}
