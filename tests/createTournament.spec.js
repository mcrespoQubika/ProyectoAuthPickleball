import { test, expect } from '../fixtures.js';
import { loginAndGoToHome } from '../src/helper/loginHelper.js';
import { HomePage } from '../src/pages/HomePage.js';
import { CreteEvent } from '../src/pages/CreateEventPage.js';
import { TournamentManagerViewPage } from '../src/pages/TournamentManagerViewPage.js';
import { TournamentPoolReportPage } from '../src/pages/TournamentPoolReportPage.js';
import { BracketEditCardPage } from '../src/pages/BracketEditCardPage.js';
import { BRACKET_CONFIGS } from '../src/data/bracketConfigs.js';

test.describe.serial('Create tournament', () => {
  let homePage;
  let creteEvent;
  let tournamentCreation;
  let bracket;
  let addBracket;

  test.beforeAll(async ({ sharedPage }) => {
    await loginAndGoToHome(sharedPage, process.env.USERNAME, process.env.PASSWORD);
    await expect(sharedPage).toHaveTitle('Den Home');

    homePage = new HomePage(sharedPage);
    creteEvent = new CreteEvent(sharedPage);
    tournamentCreation = new TournamentManagerViewPage(sharedPage);
    bracket = new TournamentPoolReportPage(sharedPage);
    addBracket = new BracketEditCardPage(sharedPage);
  });

  test('Create the tournament', async ({ sharedPage }) => {
    await homePage.clickOnMoreOption();
    await expect(homePage.menuBarListBox).toBeVisible();

    await homePage.clickOnCreateEvent();
    await expect(sharedPage).toHaveTitle('Create Event');

    await creteEvent.accessToCreteTournamentScreen();
    await expect(sharedPage).toHaveTitle('Tournament View');

    await tournamentCreation.createTournament();
    await expect(tournamentCreation.tournamentSavedNotification).toBeVisible();
  });

  test('Go to the tournament bracket screen', async ({ sharedPage }) => {
    await tournamentCreation.goToEditBracketPage();
    await expect(sharedPage).toHaveTitle('Pool Report');
  });

  for (const [index, bracketConfig] of BRACKET_CONFIGS.entries()) {
    test(`Add bracket ${index + 1} (${bracketConfig.teamType} - ${bracketConfig.bracketFormat})`, async () => {
      await bracket.clickAddBracket();
      await addBracket.creteNewBracket(
        tournamentCreation.eventStartDate,
        tournamentCreation.eventEndDate,
        bracketConfig,
      );
      await addBracket.saveBracket();
      await addBracket.goBackToPoolReport();
      await bracket.addBracketButton.waitFor({ state: 'visible' });
    });
  }

  test('Tournament appears on the Home screen', async ({ sharedPage }) => {
    await homePage.goToHome();
    await expect(sharedPage).toHaveTitle('Den Home');

    const tournamentNameOnHome = sharedPage.locator('.margin-bottom-unset', {
      hasText: tournamentCreation.tournamentName,
    });
    await expect(tournamentNameOnHome).toBeVisible();
  });
});

test.afterEach(async ({ sharedPage }, testInfo) => {
  console.log(`Finished test ${testInfo.title} with status ${testInfo.status}`);
  if (testInfo.status !== testInfo.expectedStatus) {
    await sharedPage.screenshot({
      path: testInfo.outputPath('screenshot.png'),
      fullPage: true,
    });
  }
});
