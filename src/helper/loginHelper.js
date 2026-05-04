'use strict';

export function chooseEnviroment() {
  const env = process.env.ENVIROMENT;
  if (env === 'QA') return process.env.WEB_LOGIN_URL_QA;
  else if (env === 'STAGE') return process.env.WEB_LOGIN_URL_STAGE;
}
