'use-strict';
import { expect } from '@playwright/test';

export class CreteEvent {
  constructor(page) {
    this.page = page;
    this.createTournamentButton = page.locator('vaadin-button', {
      hasText: 'Create Tournament',
    });
    this.confirmationDialog = page.locator('vaadin-dialog-overlay');
    this.yesButton = this.confirmationDialog.locator('vaadin-button', { hasText: 'Yes' });
  }

  async accessToCreteTournamentScreen() {
    await this.createTournamentButton.click();
    await expect(this.confirmationDialog).toBeVisible();
    await this.yesButton.click();
  }
}
