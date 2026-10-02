'use-strict';

import {
  addDays,
  addMonths,
  addWeeks,
  formatDateDayMonthName,
  formatDateMMDDYYYY,
} from '../helper/dateHelper.js';
import { VAADIN_SELECT_OPTIONS, selectRandomOption } from '../helper/vaadinOverlayHelper.js';

export class TournamentManagerViewPage {
  constructor(page) {
    this.page = page;

    this.countrySelect = page.locator('vaadin-select', { hasText: 'Select Country' });
    this.selectPlayLocationButton = page.locator('vaadin-button', {
      hasText: 'Select Play Location',
    });
    this.tournamentNameInput = page
      .locator('vaadin-text-field', { hasText: 'Tournament Name' })
      .locator('input[slot="input"]');
    this.feeAndPrizeCurrencySelect = page.locator('vaadin-select', {
      hasText: 'Fee and Prize Currency',
    });
    this.tournamentFeeInput = page
      .locator('vaadin-integer-field')
      .filter({ has: page.locator('label[slot="label"]', { hasText: 'Tournament Fee' }) })
      .locator('input[slot="input"]');
    this.maximumPlayersInput = page
      .locator('vaadin-integer-field', { hasText: 'Maximum Players' })
      .locator('input[slot="input"]');

    this.eventStartDateInput = page
      .locator('vaadin-date-picker', { hasText: 'Event Start Date' })
      .locator('input[slot="input"]');
    this.eventEndDateInput = page
      .locator('vaadin-date-picker', { hasText: 'Event End Date' })
      .locator('input[slot="input"]');
    this.registrationOpensInput = page
      .locator('vaadin-date-picker', { hasText: 'Registration Opens' })
      .locator('input[slot="input"]');
    this.registrationClosesInput = page
      .locator('vaadin-date-picker', { hasText: 'Registration Closes' })
      .locator('input[slot="input"]');
    this.ballColorSelect = page.locator('vaadin-select', { hasText: 'Ball/Color' });
    this.surfaceTypeSelect = page.locator('vaadin-select', { hasText: 'Surface Type' });
    this.netTypeSelect = page.locator('vaadin-select', { hasText: 'Net Type' });
    this.venueTypeSelect = page.locator('vaadin-select', { hasText: 'Venue Type' });
    this.restTimeSelect = page.locator('vaadin-select', { hasText: 'Rest Time' });

    this.requireDuprIdToggle = page
      .locator('den-toggle', { hasText: 'ID to Register' })
      .locator('input#checkbox');
    this.requireUsapMembershipToggle = page
      .locator('den-toggle', { hasText: 'Membership to Register' })
      .locator('input#checkbox');
    this.restrictByDuprRatingToggle = page
      .locator('den-toggle', { hasText: 'Restrict Registration by DUPR Rating' })
      .locator('input#checkbox');
    this.hidePlayersNeedingPartnersToggle = page
      .locator('den-toggle', { hasText: 'Hide Players Needing Partners' })
      .locator('input#checkbox');
    this.hideRegistrationCountToggle = page
      .locator('den-toggle', { hasText: 'Hide registration count from players and staff' })
      .locator('input#checkbox');
    this.hideBracketsToggle = page
      .locator('den-toggle', { hasText: 'Hide Brackets from Players and Spectators' })
      .locator('input#checkbox');

    this.duprClubIdInput = page
      .locator('vaadin-big-decimal-field', { hasText: 'DUPR Club ID' })
      .locator('input[slot="input"]');

    this.privateEventCheckbox = page.locator('vaadin-checkbox', { hasText: 'Private Event' });
    this.playersEnterScoresCheckbox = page.locator('vaadin-checkbox', {
      hasText: 'Players Enter Scores',
    });

    this.saveButton = page.locator('vaadin-button', { hasText: 'Save' });
    this.editBracketsButton = page.locator('vaadin-button', { hasText: 'Edit Brackets' });

    this.playLocationDialog = page.locator('vaadin-dialog-overlay');
    this.playLocationCityInput = this.playLocationDialog.locator(
      'vaadin-combo-box[placeholder="Type the name of the City"] input[slot="input"]',
    );
    this.playLocationSearchButton = this.playLocationDialog.locator('vaadin-button', {
      hasText: 'Search',
    });
    this.playLocationResultsGrid = page.locator('vaadin-grid');

    this.countrySelectError = page.locator(
      'vaadin-select:has-text("Select Country") [slot="error-message"]',
    );
    this.tournamentNameError = page.locator(
      'vaadin-text-field:has-text("Tournament Name") [slot="error-message"]',
    );

    this.eventStartDateError = page.locator(
      'vaadin-date-picker:has-text("Event Start Date") [slot="error-message"]',
    );
    this.eventEndDateError = page.locator(
      'vaadin-date-picker:has-text("Event End Date") [slot="error-message"]',
    );
    this.registrationOpensError = page.locator(
      'vaadin-date-picker:has-text("Registration Opens") [slot="error-message"]',
    );
    this.registrationClosesError = page.locator(
      'vaadin-date-picker:has-text("Registration Closes") [slot="error-message"]',
    );

    this.editBracketButton = page.locator('vaadin-button', {
      hasText: 'Edit Bracket',
    });

    this.tournamentSavedNotification = page.locator(
      'vaadin-notification-card span:has-text("Tournament Saved")',
    );
  }

  async createTournament() {
    const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
    this.tournamentName = `${formatDateDayMonthName(new Date())} ${process.env.TOURNAMENT_NAME} ${uniqueSuffix}`;

    await this.selectPlayLocation('Miami', 'Miami, Florida');
    await this.tournamentNameInput.fill(this.tournamentName);
    await this.tournamentFeeInput.fill('5');
    await this.enterTournamentDateTimes();
    await this.setTournamentConfiguration();
    await this.saveButton.click();
  }

  async selectPlayLocation(citySearchTerm, cityOptionText) {
    await this.selectPlayLocationButton.click();
    await this.playLocationDialog.waitFor({ state: 'visible' });

    await this.playLocationCityInput.fill(citySearchTerm);
    const cityOption = this.page.locator('vaadin-combo-box-item', { hasText: cityOptionText });
    await cityOption.waitFor({ state: 'visible' });
    await cityOption.click();

    await this.playLocationSearchButton.click();
    await this.playLocationResultsGrid.waitFor({ state: 'visible' });

    const firstLocationOption = this.playLocationResultsGrid
      .locator('vaadin-grid-cell-content')
      .filter({ hasNot: this.page.locator('vaadin-grid-sorter') })
      .filter({ hasText: /.+/ })
      .first();
    await firstLocationOption.click();
  }

  async enterTournamentDateTimes() {
    const today = new Date();

    this.eventStartDate = addMonths(today, 1);
    this.eventEndDate = addWeeks(this.eventStartDate, 2);
    const registrationOpens = addWeeks(today, 1);
    const registrationCloses = addDays(this.eventStartDate, -1);

    await this.setDate(this.eventStartDateInput, formatDateMMDDYYYY(this.eventStartDate));
    await this.setDate(this.eventEndDateInput, formatDateMMDDYYYY(this.eventEndDate));
    await this.setDate(this.registrationOpensInput, formatDateMMDDYYYY(registrationOpens));
    await this.setDate(this.registrationClosesInput, formatDateMMDDYYYY(registrationCloses));
  }

  async setDate(selectLocator, optionText) {
    await selectLocator.click();
    await selectLocator.fill(optionText);
    await selectLocator.press('Enter');
  }

  async setTournamentConfiguration() {
    await selectRandomOption(this.page, this.ballColorSelect, VAADIN_SELECT_OPTIONS);
    await selectRandomOption(this.page, this.surfaceTypeSelect, VAADIN_SELECT_OPTIONS);
    await selectRandomOption(this.page, this.netTypeSelect, VAADIN_SELECT_OPTIONS);
    await selectRandomOption(this.page, this.venueTypeSelect, VAADIN_SELECT_OPTIONS);
  }

  async goToEditBracketPage() {
    await this.editBracketButton.click();
  }
}
