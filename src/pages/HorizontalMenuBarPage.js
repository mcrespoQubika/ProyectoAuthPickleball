'use strict';

export class HorizontalMenuBarPage {
  constructor(page) {
    const navBar = page.locator('.nav-bar-hl');

    this.accountTab = navBar.locator('vaadin-tab.nav-bar-tab', { hasText: 'Account' });
  }

  async goToAccount() {
    await this.accountTab.click();
    await this.accountTab.waitFor({ timeout: 5000 });
  }
}
