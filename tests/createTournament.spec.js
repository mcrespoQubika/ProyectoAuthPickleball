import { test, expect } from '@playwright/test';
import { loginAndGoToHome } from '../src/helper/loginHelper.js';
import { HomePage } from '../src/pages/HomePage.js';
import { CreateEventPage } from '../src/pages/CreateEventPage.js';
import { TournamentManagerViewPage } from '../src/pages/TournamentManagerViewPage.js';
import { TournamentPoolReportPage } from '../src/pages/TournamentPoolReportPage.js';
import { BracketEditCardPage } from '../src/pages/BracketEditCardPage.js';
import { BRACKET_CONFIGS } from '../src/data/bracketConfigs.js';

test('Create tournament and its brackets', async ({ page }) => {
  test.setTimeout(180_000);

  await test.step('Log in', async () => {
    await loginAndGoToHome(page, process.env.USERNAME, process.env.PASSWORD);
    await expect(page).toHaveTitle('Den Home');
  });

  const homePage = new HomePage(page);
  const createEvent = new CreateEventPage(page);
  const tournamentCreation = new TournamentManagerViewPage(page);
  const bracket = new TournamentPoolReportPage(page);
  const addBracket = new BracketEditCardPage(page);

  await test.step('Create the tournament', async () => {
    await homePage.clickOnMoreOption();
    await expect(homePage.menuBarListBox).toBeVisible();

    await homePage.clickOnCreateEvent();
    await expect(page).toHaveTitle('Create Event');

    await createEvent.accessToCreateTournamentScreen();
    await expect(page).toHaveTitle('Tournament View');

    await tournamentCreation.createTournament();
    await expect(tournamentCreation.tournamentSavedNotification).toBeVisible();
  });

  await test.step('Go to the tournament bracket screen', async () => {
    await tournamentCreation.goToEditBracketPage();
    await expect(page).toHaveTitle('Pool Report');
  });

  for (const [index, bracketConfig] of BRACKET_CONFIGS.entries()) {
    await test.step(`Add bracket ${index + 1} (${bracketConfig.teamType} - ${bracketConfig.bracketFormat})`, async () => {
      const bracketComment = `bracket${index + 1}`;
      const bracketLabel = bracketConfig.alternateDescription ?? bracketConfig.teamType;
      const bracketLabelIsExact = bracketConfig.alternateDescription != null;
      const matchingRowsBefore = await bracket
        .bracketRowsWithLabel(bracketLabel, { exact: bracketLabelIsExact })
        .count();

      await bracket.clickAddBracket();
      const { scheduledStartDate, scheduledStartTime } = await addBracket.createNewBracket(
        tournamentCreation.eventStartDate,
        tournamentCreation.eventEndDate,
        bracketConfig,
        bracketComment,
      );
      test.info().annotations.push({
        type: `Bracket ${index + 1} scheduled start`,
        description: `${scheduledStartDate} ${scheduledStartTime}`,
      });
      await addBracket.saveBracket();
      await expect(addBracket.bracketSavedNotification).toBeVisible();
      await expect(addBracket.bracketSavedNotification).toBeHidden({ timeout: 10_000 });
      await addBracket.goBackToPoolReport();
      await bracket.addBracketButton.waitFor({ state: 'visible' });

      await expect(
        bracket.bracketRowsWithLabel(bracketLabel, { exact: bracketLabelIsExact }),
      ).toHaveCount(matchingRowsBefore + 1);
    });
  }

  await test.step('Tournament appears on the Home screen', async () => {
    await homePage.goToHome();
    await expect(page).toHaveTitle('Den Home');
    await expect(homePage.tournamentCard(tournamentCreation.tournamentName)).toBeVisible();
  });
});
