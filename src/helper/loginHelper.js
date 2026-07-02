'use strict';

export function chooseEnvironment() {
  if (!process.env.ENVIRONMENT) throw new Error('ENVIRONMENT variable is not defined');
  const env = process.env.ENVIRONMENT.toUpperCase();
  if (env === 'QA') return process.env.WEB_LOGIN_URL_QA;
  else if (env === 'TRAINING') return process.env.WEB_LOGIN_URL_TRAINING;
  else return process.env.WEB_LOGIN_URL_STAGE;
}

export async function loginWithToken(page, token) {
  const url = page.url();
  await page.context().addCookies([
    { name: 'api-pickle-ball-den-auth-token', value: token, url },
    { name: 'api-pickle-ball-den-refresh-token', value: token, url },
  ]);
}
