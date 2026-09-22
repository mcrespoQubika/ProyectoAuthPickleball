'use-strict';

export class TournamentPoolReportPage {
  constructor(page) {
    this.page = page;

    this.addBracketButton = page.locator('.pd-flexwrap', { hasText: 'Add Bracket' });
  }

  async clickAddBracket() {
    await this.addBracketButton.click();
  }
}
