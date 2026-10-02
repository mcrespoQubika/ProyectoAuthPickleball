export class HomePage {
  constructor(page) {
    const mainView = page.locator('.main-view');

    this.page = page;
    this.moreOptionsButton = mainView.locator('vaadin-menu-bar-button', {
      hasText: 'More options',
    });
    this.menuBarListBox = page.locator('vaadin-menu-bar-list-box');
    this.createEventMenuItem = this.menuBarListBox.locator('vaadin-menu-bar-item', {
      hasText: 'Create Event',
    });
    this.homeTab = page.locator('vaadin-tab', { hasText: 'Home' });
  }

  async clickOnMoreOption() {
    await this.moreOptionsButton.click();
  }

  async clickOnCreateEvent() {
    await this.createEventMenuItem.click();
  }

  async goToHome() {
    await this.homeTab.click();
  }
}
