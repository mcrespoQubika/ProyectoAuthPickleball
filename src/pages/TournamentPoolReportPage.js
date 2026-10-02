'use-strict';

export class TournamentPoolReportPage {
  constructor(page) {
    this.page = page;

    this.addBracketButton = page.locator('.pd-flexwrap', { hasText: 'Add Bracket' });

    // The "Bracket" column in #otherBracketsGrid renders its description in a `span.body`
    // (other columns/headers use different wrappers), so this isolates one entry per bracket row.
    this.bracketRows = page.locator('#otherBracketsGrid span.body');
  }

  async clickAddBracket() {
    await this.addBracketButton.click();
  }
}
