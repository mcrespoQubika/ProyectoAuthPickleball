'use strict';

export class HorizontalMenuBarPage {
  constructor(page) {
    const navBar = page.locator('.nav-bar-hl');

    this.homeTab = navBar.locator('vaadin-tab.nav-bar-tab', { hasText: 'Home' });
    this.friendsTab = navBar.locator('vaadin-tab.nav-bar-tab', { hasText: 'Friends' });
    this.timelineTab = navBar.locator('vaadin-tab.nav-bar-tab', { hasText: 'Timeline' });
    this.searchTab = navBar.locator('vaadin-tab.nav-bar-tab', { hasText: 'Search' });
    this.accountTab = navBar.locator('vaadin-tab.nav-bar-tab', { hasText: 'Account' });
  }

  async goToAccount() {
    await this.accountTab.click();
    await this.searchTab.waitFor({ timeout: 5000 });
  }
}
