'use-strict';

import { formatDateMMDDYYYY, getRandomDateBetween } from '../helper/dateHelper.js';
import {
  VAADIN_SELECT_OPTIONS,
  VAADIN_TIME_PICKER_OPTIONS,
  selectExactOption,
  selectOptionByPrefix,
  selectRandomOption,
  setDate,
} from '../helper/vaadinOverlayHelper.js';

export class BracketEditCardPage {
  constructor(page) {
    this.page = page;

    this.backArrowButton = page.locator('den-back-arrow img');

    this.teamTypeSelect = page.locator('vaadin-select', { hasText: 'Team Type' });
    this.bracketFormatSelect = page.locator('vaadin-select', { hasText: 'Bracket Format' });

    this.playOffTypeSelect = page.locator('vaadin-select', { hasText: 'PlayOff Type' });

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

    this.alternateDescriptionInput = page
      .locator('vaadin-text-field', { hasText: 'Alternate Description' })
      .locator('input[slot="input"]');
    this.commentsInput = page
      .locator('vaadin-text-field', { hasText: 'Comments' })
      .locator('input[slot="input"]');

    this.allowAnyScoreCheckbox = page.locator('vaadin-checkbox', { hasText: 'Allow Any Score' });

    this.saveButton = page.getByRole('button', { name: 'Save', exact: true });

    this.bracketSavedNotification = page.locator(
      'vaadin-notification-card span:has-text("Bracket Saved")',
    );
  }

  async createNewBracket(tournamentStartDate, tournamentEndDate, bracketConfig, comment) {
    await this.setTeamType(bracketConfig.teamType);
    await this.setBracketFormat(bracketConfig.bracketFormat, bracketConfig.bracketFormatDetail);
    await this.setPlayOffType(bracketConfig.bracketFormat, bracketConfig.playOffType);
    await this.setRandomScheduledStartDate(tournamentStartDate, tournamentEndDate);
    await this.setRandomScheduledStartTime();

    await this.setLowSkillLevel(bracketConfig.lowSkillLevel);
    await this.setHighSkillLevel(bracketConfig.highSkillLevel);
    await this.setLowAge(bracketConfig.lowAge);
    await this.setHighAge(bracketConfig.highAge);
    await this.setAlternateDescription(bracketConfig.alternateDescription);
    await this.setComments(comment);
    await this.setMaximumFullTeams(bracketConfig.maximumFullTeams);
    await this.setAllowAnyScore(bracketConfig.allowAnyScore);
  }

  async saveBracket() {
    await this.saveButton.click();
  }

  async goBackToPoolReport() {
    await this.backArrowButton.click();
  }

  async setRandomScheduledStartDate(tournamentStartDate, tournamentEndDate) {
    const randomDate = getRandomDateBetween(tournamentStartDate, tournamentEndDate);
    await setDate(this.scheduledStartDateInput, formatDateMMDDYYYY(randomDate));
  }

  async setRandomScheduledStartTime() {
    await selectRandomOption(this.page, this.scheduledStartTimeInput, VAADIN_TIME_PICKER_OPTIONS);
  }

  async setTeamType(teamType) {
    await selectExactOption(this.page, this.teamTypeSelect, VAADIN_SELECT_OPTIONS, teamType);
  }

  async setBracketFormat(bracketFormat, bracketFormatDetail) {
    await selectOptionByPrefix(
      this.page,
      this.bracketFormatSelect,
      VAADIN_SELECT_OPTIONS,
      bracketFormat,
      bracketFormatDetail,
    );
  }

  async setPlayOffType(bracketFormat, playOffType) {
    const requiresPlayOffType =
      bracketFormat === 'Round Robin' || bracketFormat === 'Double Round Robin';
    if (!requiresPlayOffType || playOffType == null) return;

    await selectOptionByPrefix(this.page, this.playOffTypeSelect, VAADIN_SELECT_OPTIONS, playOffType);
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

  async setComments(comments) {
    if (comments == null) return;
    await this.commentsInput.fill(comments);
  }

  async setMaximumFullTeams(maximumFullTeams) {
    if (maximumFullTeams == null) return;
    await this.maximumFullTeamsInput.fill(String(maximumFullTeams));
  }

  async setAllowAnyScore(allowAnyScore) {
    if (allowAnyScore == null) return;
    const isChecked = await this.allowAnyScoreCheckbox.locator('input[slot="input"]').isChecked();
    if (isChecked !== allowAnyScore) {
      await this.allowAnyScoreCheckbox.click();
    }
  }
}
