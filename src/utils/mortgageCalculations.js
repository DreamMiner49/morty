/**
 * Calculate monthly mortgage payment using the standard mortgage formula
 * M = P * [r(1+r)^n] / [(1+r)^n - 1]
 */
export const calculateMonthlyPayment = (principal, annualRate, years) => {
  if (principal <= 0 || years <= 0) return 0;
  if (annualRate === 0) return principal / (years * 12);

  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = years * 12;

  const monthlyPayment =
    principal *
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  return monthlyPayment;
};

/**
 * Calculate total payment over the life of the loan
 */
export const calculateTotalPayment = (monthlyPayment, years) => {
  return monthlyPayment * years * 12;
};

/**
 * Calculate total interest paid over the life of the loan
 */
export const calculateTotalInterest = (totalPayment, principal) => {
  return totalPayment - principal;
};

/**
 * Format number as currency
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format number with commas
 */
export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Parse currency string to number
 */
export const parseCurrency = (value) => {
  return parseFloat(value.replace(/[^0-9.-]/g, '')) || 0;
};

/**
 * Generate amortization schedule
 */
export const generateAmortizationSchedule = (principal, annualRate, years) => {
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, years);
  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = years * 12;

  let balance = principal;
  const schedule = [];

  for (let month = 1; month <= numberOfPayments; month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance -= principalPayment;

    // Only add every 12th month (yearly) to keep the table manageable
    if (month % 12 === 0 || month === 1) {
      schedule.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance),
      });
    }
  }

  return schedule;
};
