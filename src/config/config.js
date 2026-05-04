import dotenv from 'dotenv';

dotenv.config();
export const CONFIG = {
  qaGeneralURL: process.env.WEB_LOGIN_URL_QA || '',
  stageGeneralURL: process.env.WEB_LOGIN_URL_STAGE || '',
};
