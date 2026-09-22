'use-strict';

import { formatDateMMDDYYYY, getRandomDateBetween } from '../helper/dateHelper.js';
import {
  VAADIN_SELECT_OPTIONS,
  VAADIN_TIME_PICKER_OPTIONS,
  selectExactOption,
  selectOptionByPrefix,
  selectRandomOption,
} from '../helper/vaadinOverlayHelper.js';

export class BracketEditCardPage {
  constructor(page) {
    this.page = page;

    this.bracketTitleHeading = page.locator('den-back-arrow h2');
    this.backArrowButton = page.locator('den-back-arrow img');

    this.teamTypeSelect = page.locator('vaadin-select', { hasText: 'Team Type' });
    this.bracketFormatSelect = page.locator('vaadin-select', { hasText: 'Bracket Format' });
    this.matchTypeSelect = page.locator('vaadin-select', { hasText: 'Match Type' });

    this.playOffTypeSelect = page.locator('vaadin-select', { hasText: 'PlayOff Type' });

    this.eliminationMatchTypeSelects = page.locator('vaadin-select', {
      hasText: 'Elimination Match Type',
    });
    this.eliminationMatchTypeSelect = this.eliminationMatchTypeSelects.nth(0);
    this.secondEliminationMatchTypeSelect = this.eliminationMatchTypeSelects.nth(1);

    this.scoringTypeRadioGroup = page.locator('vaadin-radio-group', { hasText: 'Scoring Type' });
    this.scoringTypeSideOutRadio = this.scoringTypeRadioGroup.locator('vaadin-radio-button', {
      hasText: 'Side-out',
    });
    this.scoringTypeRallyRadio = this.scoringTypeRadioGroup.locator('vaadin-radio-button', {
      hasText: 'Rally',
    });

    this.bracketFeePerPlayerInput = page
      .locator('vaadin-integer-field', { hasText: 'Bracket fee per player' })
      .locator('input[slot="input"]');
    this.maximumFullTeamsInput = page
      .locator('vaadin-integer-field', { hasText: 'Maximum Full Teams' })
      .locator('input[slot="input"]');

    this.scheduledStartDateInput = page
      .locator('vaadin-date-picker', { hasText: 'Scheduled Start Date' })
      .locator('input[slot="input"]');
    this.scheduledStartTimeInput = page
      .locator('vaadin-time-picker', { hasText: 'Scheduled Start Time' })
      .locator('input[slot="input"]');

    this.lowSkillLevelSelect = page.locator('vaadin-select', { hasText: 'Low Skill Level' });
    this.highSkillLevelSelect = page.locator('vaadin-select', { hasText: 'High Skill Level' });

    this.lowAgeInput = page
      .locator('vaadin-integer-field')
      .filter({ has: page.locator('label[slot="label"]', { hasText: 'Low Age' }) })
      .locator('input[slot="input"]');
    this.highAgeInput = page
      .locator('vaadin-integer-field')
      .filter({ has: page.locator('label[slot="label"]', { hasText: 'High Age' }) })
      .locator('input[slot="input"]');

    this.poolNumberInput = page
      .locator('vaadin-integer-field', { hasText: 'Pool #' })
      .locator('input[slot="input"]');

    this.alternateDescriptionInput = page
      .locator('vaadin-text-field', { hasText: 'Alternate Description' })
      .locator('input[slot="input"]');
    this.commentsInput = page
      .locator('vaadin-text-field', { hasText: 'Comments' })
      .locator('input[slot="input"]');

    this.enableRegistrationCheckbox = page.locator('vaadin-checkbox', {
      hasText: 'Enable Registration',
    });

    this.allowAnyScoreCheckbox = page.locator('den-checkbox-helper').locator('input#checkbox');

    this.saveInfoText = page.locator('span.pd-border-card');
    this.saveButton = page.locator('vaadin-button', { hasText: 'Save' });
    this.createNextBracketButton = page.locator('vaadin-button', {
      hasText: 'Create Next Bracket',
    });
  }

  async creteNewBracket(tournamentStartDate, tournamentEndDate, bracketConfig) {
    await this.setTeamType(bracketConfig.teamType);
    await this.setBracketFormat(bracketConfig.bracketFormat);
    await this.setRandomScheduledStartDate(tournamentStartDate, tournamentEndDate);
    await this.setRandomScheduledStartTime();

    await this.setLowSkillLevel(bracketConfig.lowSkillLevel);
    await this.setHighSkillLevel(bracketConfig.highSkillLevel);
    await this.setLowAge(bracketConfig.lowAge);
    await this.setHighAge(bracketConfig.highAge);
    await this.setAlternateDescription(bracketConfig.alternateDescription);
    await this.setMaximumFullTeams(bracketConfig.maximumFullTeams);
    await this.setAllowAnyScore(bracketConfig.allowAnyScore);
  }

  async saveBracket() {
    await this.saveButton.click();
  }

  async goBackToPoolReport() {
    await this.backArrowButton.click();
  }

  async setDate(selectLocator, optionText) {
    await selectLocator.click();
    await selectLocator.fill(optionText);
    await selectLocator.press('Enter');
  }

  async setRandomScheduledStartDate(tournamentStartDate, tournamentEndDate) {
    const randomDate = getRandomDateBetween(tournamentStartDate, tournamentEndDate);
    await this.setDate(this.scheduledStartDateInput, formatDateMMDDYYYY(randomDate));
  }

  async setRandomScheduledStartTime() {
    await selectRandomOption(this.page, this.scheduledStartTimeInput, VAADIN_TIME_PICKER_OPTIONS);
  }

  async setTeamType(teamType) {
    await selectExactOption(this.page, this.teamTypeSelect, VAADIN_SELECT_OPTIONS, teamType);
  }

  async setBracketFormat(bracketFormat) {
    await selectOptionByPrefix(
      this.page,
      this.bracketFormatSelect,
      VAADIN_SELECT_OPTIONS,
      bracketFormat,
    );

    if (bracketFormat === 'Round Robin' || bracketFormat === 'Double Round Robin') {
      await selectRandomOption(this.page, this.playOffTypeSelect, VAADIN_SELECT_OPTIONS);
    }
  }

  async setLowSkillLevel(lowSkillLevel) {
    if (lowSkillLevel == null) return;
    await selectExactOption(
      this.page,
      this.lowSkillLevelSelect,
      VAADIN_SELECT_OPTIONS,
      lowSkillLevel,
    );
  }

  async setHighSkillLevel(highSkillLevel) {
    if (highSkillLevel == null) return;
    await selectExactOption(
      this.page,
      this.highSkillLevelSelect,
      VAADIN_SELECT_OPTIONS,
      highSkillLevel,
    );
  }

  async setLowAge(lowAge) {
    if (lowAge == null) return;
    await this.lowAgeInput.fill(String(lowAge));
  }

  async setHighAge(highAge) {
    if (highAge == null) return;
    await this.highAgeInput.fill(String(highAge));
  }

  async setAlternateDescription(alternateDescription) {
    if (alternateDescription == null) return;
    await this.alternateDescriptionInput.fill(alternateDescription);
  }

  async setMaximumFullTeams(maximumFullTeams) {
    if (maximumFullTeams == null) return;
    await this.maximumFullTeamsInput.fill(String(maximumFullTeams));
  }

  async setAllowAnyScore(allowAnyScore) {
    if (!allowAnyScore) return;
    await this.allowAnyScoreCheckbox.click();
  }
}
