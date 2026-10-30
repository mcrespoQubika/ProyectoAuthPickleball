export class TournamentPoolReportPage {
  constructor(page) {
    this.page = page;

    this.addBracketButton = page.locator('.pd-flexwrap', { hasText: 'Add Bracket' });

    this.bracketRows = page.locator('#otherBracketsGrid span.body');
  }

  async clickAddBracket() {
    await this.addBracketButton.click();
  }

  bracketRowsWithLabel(bracketLabel, { exact = false } = {}) {
    const escapedLabel = bracketLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = exact ? `^${escapedLabel}$` : `^${escapedLabel}`;
    return this.bracketRows.filter({ hasText: new RegExp(pattern) });
  }
}
