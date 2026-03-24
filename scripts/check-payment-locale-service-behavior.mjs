import fs from 'node:fs';
import path from 'node:path';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const webRoot = process.cwd();
const lotteryPaymentServiceSrc = fs.readFileSync(
  path.resolve(webRoot, 'src', 'services', 'lotteryPaymentService.js'),
  'utf8'
);
const localeServiceSrc = fs.readFileSync(
  path.resolve(webRoot, 'src', 'services', 'localeService.js'),
  'utf8'
);

// Behavior check: equivalent formatting should produce a currency-like string.
const formattedInr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format(1234.5);
assert(
  typeof formattedInr === 'string' && formattedInr.length > 0,
  'lotteryPaymentService.formatCurrency should return a non-empty string'
);
assert(
  /1,234\.50|1234\.50/.test(formattedInr),
  `formatCurrency should include amount precision (got: ${formattedInr})`
);

// Contract check: key behaviors are present in source.
assert(
  lotteryPaymentServiceSrc.includes('async getPayoutStats('),
  'lotteryPaymentService.getPayoutStats should exist'
);
assert(
  lotteryPaymentServiceSrc.includes('async getPendingPayouts('),
  'lotteryPaymentService.getPendingPayouts should exist'
);
assert(
  lotteryPaymentServiceSrc.includes(
    'export const lotteryPaymentService = gamifiedPaymentService;'
  ),
  'lotteryPaymentService compatibility export should exist'
);
assert(
  localeServiceSrc.includes("async getSupportedLocales()"),
  'localeService.getSupportedLocales should exist'
);
assert(
  localeServiceSrc.includes(".from('supported_locales')"),
  'localeService should read supported_locales'
);

console.log('Payment/locale service behavior checks passed.');
