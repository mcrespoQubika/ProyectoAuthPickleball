'use-strict';
import { expect } from '@playwright/test';

export class CreateEventPage {
  constructor(page) {
    this.page = page;
    this.createTournamentButton = page.locator('vaadin-button', {
      hasText: 'Create Tournament',
    });
    this.confirmationDialog = page.locator('vaadin-dialog-overlay');
    this.yesButton = this.confirmationDialog.locator('vaadin-button', { hasText: 'Yes' });
  }

  async accessToCreateTournamentScreen() {
    await this.createTournamentButton.click();
    await expect(this.confirmationDialog).toBeVisible();
    await this.yesButton.click();
  }
}
