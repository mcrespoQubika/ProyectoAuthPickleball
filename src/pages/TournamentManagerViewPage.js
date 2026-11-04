import {
  addDays,
  addMonths,
  addWeeks,
  formatDateDayMonthName,
  formatDateMMDDYYYY,
} from '../helper/dateHelper.js';
import {
  VAADIN_SELECT_OPTIONS,
  selectExactOption,
  setDate,
} from '../helper/vaadinOverlayHelper.js';
import { TOURNAMENT_CONFIG } from '../data/tournamentConfig.js';

export class TournamentManagerViewPage {
  constructor(page) {
    this.page = page;

    this.selectPlayLocationButton = page.locator('vaadin-button', {
      hasText: 'Select Play Location',
    });
    this.tournamentNameInput = page
      .locator('vaadin-text-field', { hasText: 'Tournament Name' })
      .locator('input[slot="input"]');
    this.tournamentFeeInput = page
      .locator('vaadin-integer-field')
      .filter({ has: page.locator('label[slot="label"]', { hasText: 'Tournament Fee' }) })
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

    this.saveButton = page.getByRole('button', { name: 'Save', exact: true });

    this.playLocationDialog = page.locator('vaadin-dialog-overlay');
    this.playLocationCityInput = this.playLocationDialog.locator(
      'vaadin-combo-box[placeholder="Type the name of the City"] input[slot="input"]',
    );
    this.playLocationSearchButton = this.playLocationDialog.locator('vaadin-button', {
      hasText: 'Search',
    });
    this.playLocationResultsGrid = page.locator('vaadin-grid');

    this.editBracketsButton = page.getByRole('button', { name: 'Edit Brackets', exact: true });

    this.tournamentSavedNotification = page.locator(
      'vaadin-notification-card span:has-text("Tournament Saved")',
    );
  }

  async createTournament() {
    const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
    this.tournamentName = `${formatDateDayMonthName(new Date())} ${process.env.TOURNAMENT_NAME} ${uniqueSuffix}`;

    const { citySearchTerm, cityOptionText } = TOURNAMENT_CONFIG.playLocation;
    await this.selectPlayLocation(citySearchTerm, cityOptionText);
    await this.tournamentNameInput.fill(this.tournamentName);
    await this.tournamentFeeInput.fill(String(TOURNAMENT_CONFIG.fee));
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

    await setDate(this.eventStartDateInput, formatDateMMDDYYYY(this.eventStartDate));
    await setDate(this.eventEndDateInput, formatDateMMDDYYYY(this.eventEndDate));
    await setDate(this.registrationOpensInput, formatDateMMDDYYYY(registrationOpens));
    await setDate(this.registrationClosesInput, formatDateMMDDYYYY(registrationCloses));
  }

  async setTournamentConfiguration() {
    await selectExactOption(
      this.page,
      this.ballColorSelect,
      VAADIN_SELECT_OPTIONS,
      TOURNAMENT_CONFIG.ballColor,
    );
    await selectExactOption(
      this.page,
      this.surfaceTypeSelect,
      VAADIN_SELECT_OPTIONS,
      TOURNAMENT_CONFIG.surfaceType,
    );
    await selectExactOption(
      this.page,
      this.netTypeSelect,
      VAADIN_SELECT_OPTIONS,
      TOURNAMENT_CONFIG.netType,
    );
    await selectExactOption(
      this.page,
      this.venueTypeSelect,
      VAADIN_SELECT_OPTIONS,
      TOURNAMENT_CONFIG.venueType,
    );
  }

  async goToEditBracketPage() {
    await this.editBracketsButton.click();
  }
}
