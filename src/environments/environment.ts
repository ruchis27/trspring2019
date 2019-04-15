import { Configuration } from '@apttus/core';
export const environment: Configuration = {
  production: false,
  defaultImageSrc: './assets/images/default.png',
  defaultCountry: 'US',
  defaultLanguage: 'en-US',
  enableErrorLogging: true,
  enableErrorReporting: false,
  enableMultiCurrency: true,
  enableQueryLogs: true,
  enablePerformanceLogs: true,
  defaultCurrency: 'USD',
  bufferTime: 50,
  maxBufferSize: 10,
  disableBuffer: false,
  subqueryLimit: 10,
  disableCache: false,
  encryptResponse: false,
  cartRetryLimit: 20,
  productIdentifier: 'ProductCode',
  type: 'Salesforce',
  cartDebounceTime: 2000,
  proxy: 'https://apttus-proxy.herokuapp.com',

  // Salesforce environment variables
  organizationId: '00D210000009bUwEAI',
  endpoint: 'https://apttussdk-taxandaccounting.cs26.force.com/v'
};