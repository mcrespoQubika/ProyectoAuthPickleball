'use strict';

import { FakeLoginPage } from '../pages/FakeLoginPage.js';
import { LoginPage } from '../pages/LoginPage.js';

export function chooseEnvironment() {
  if (!process.env.ENVIRONMENT) throw new Error('ENVIRONMENT variable is not defined');
  const env = process.env.ENVIRONMENT.toUpperCase();
  if (env === 'QA') return process.env.WEB_LOGIN_URL_QA;
  else if (env === 'TRAINING') return process.env.WEB_LOGIN_URL_TRAINING;
  else return process.env.WEB_LOGIN_URL_STAGE;
}

export async function loginAndGoToHome(page, username, password) {
  const environment = chooseEnvironment();
  await page.goto(environment);

  const fakeLogin = new FakeLoginPage(page);
  await fakeLogin.clickOnLoginMe(process.env.ENVIRONMENT);

  const login = new LoginPage(page);
  await login.login(username, password);
}
