import { useState } from 'react';
import {
  calculateMonthlyPayment,
  calculateTotalPayment,
  calculateTotalInterest,
  formatCurrency,
  formatNumber,
  parseCurrency,
  generateAmortizationSchedule,
} from './utils/mortgageCalculations';

function App() {
  // Tab state
  const [activeTab, setActiveTab] = useState('tab1'); // 'tab1', 'tab2', or 'tab3'

  // Main calculator inputs
  const [loanAmount, setLoanAmount] = useState(300000);
  const [existingMortgage, setExistingMortgage] = useState(0);
  const [housePrice, setHousePrice] = useState(400000); // For tab 2

  // Tab 1 down payment state
  const [downPaymentType1, setDownPaymentType1] = useState('percentage');
  const [downPaymentPercent1, setDownPaymentPercent1] = useState(20);
  const [downPaymentDollar1, setDownPaymentDollar1] = useState(60000);

  // Tab 2 down payment state
  const [downPaymentType2, setDownPaymentType2] = useState('percentage');
  const [downPaymentPercent2, setDownPaymentPercent2] = useState(20);
  const [downPaymentDollar2, setDownPaymentDollar2] = useState(80000);

  // Tab 1 additional state
  const [interestRate1, setInterestRate1] = useState(6.5);
  const [loanTerm1, setLoanTerm1] = useState(30);
  const [propertyTax1, setPropertyTax1] = useState(300);
  const [homeownersInsurance1, setHomeownersInsurance1] = useState(150);
  const [customCharges1, setCustomCharges1] = useState([]);
  const [chargesPanelOpen1, setChargesPanelOpen1] = useState(true);

  // Tab 2 additional state
  const [interestRate2, setInterestRate2] = useState(6.5);
  const [loanTerm2, setLoanTerm2] = useState(30);
  const [propertyTax2, setPropertyTax2] = useState(300);
  const [homeownersInsurance2, setHomeownersInsurance2] = useState(150);
  const [customCharges2, setCustomCharges2] = useState([]);
  const [chargesPanelOpen2, setChargesPanelOpen2] = useState(true);

  // Tab 3 rental state
  const [monthlyRent, setMonthlyRent] = useState(2000);
  const [rentersInsurance, setRentersInsurance] = useState(25);
  const [rentalYears, setRentalYears] = useState(30);
  const [yearlyRentalIncrease, setYearlyRentalIncrease] = useState(2.5);

  // Amortization schedule
  const [showAmortization, setShowAmortization] = useState(false);

  // Helper function to format number inputs with commas
  const formatNumberInput = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const parseNumberInput = (value) => {
    return Number(value.toString().replace(/,/g, ''));
  };

  // Calculate Tab 1 values
  const totalLoanAmount1 = loanAmount + existingMortgage;
  const downPaymentAmount1 =
    downPaymentType1 === 'percentage'
      ? (totalLoanAmount1 * downPaymentPercent1) / 100
      : downPaymentDollar1;
  const principal1 = totalLoanAmount1 - downPaymentAmount1;
  const monthlyPI1 = calculateMonthlyPayment(principal1, interestRate1, loanTerm1);
  const totalStaticCharges1 =
    propertyTax1 +
    homeownersInsurance1 +
    customCharges1.reduce((sum, charge) => sum + charge.amount, 0);
  const totalMonthlyPayment1 = monthlyPI1 + totalStaticCharges1;

  // Calculate Tab 2 values
  const downPaymentAmount2 =
    downPaymentType2 === 'percentage'
      ? (housePrice * downPaymentPercent2) / 100
      : downPaymentDollar2;
  const totalLoanAmount2 = housePrice - downPaymentAmount2;
  const principal2 = totalLoanAmount2;
  const monthlyPI2 = calculateMonthlyPayment(principal2, interestRate2, loanTerm2);
  const totalStaticCharges2 =
    propertyTax2 +
    homeownersInsurance2 +
    customCharges2.reduce((sum, charge) => sum + charge.amount, 0);
  const totalMonthlyPayment2 = monthlyPI2 + totalStaticCharges2;

  // Tab 3 rental calculations with yearly increases
  const totalMonthlyPayment3 = monthlyRent + rentersInsurance; // First year's monthly payment
  let totalRentalCost = 0;
  for (let year = 0; year < rentalYears; year++) {
    const yearlyRent = monthlyRent * Math.pow(1 + yearlyRentalIncrease / 100, year);
    const yearlyTotal = (yearlyRent + rentersInsurance) * 12;
    totalRentalCost += yearlyTotal;
  }

  // Use active tab values for detailed calculations
  const totalLoanAmount = activeTab === 'tab1' ? totalLoanAmount1 : activeTab === 'tab2' ? totalLoanAmount2 : 0;
  const downPaymentAmount = activeTab === 'tab1' ? downPaymentAmount1 : activeTab === 'tab2' ? downPaymentAmount2 : 0;
  const principal = activeTab === 'tab1' ? principal1 : activeTab === 'tab2' ? principal2 : 0;
  const monthlyPI = activeTab === 'tab1' ? monthlyPI1 : activeTab === 'tab2' ? monthlyPI2 : 0;
  const totalMonthlyPayment = activeTab === 'tab1' ? totalMonthlyPayment1 : activeTab === 'tab2' ? totalMonthlyPayment2 : totalMonthlyPayment3;
  const interestRate = activeTab === 'tab1' ? interestRate1 : interestRate2;
  const loanTerm = activeTab === 'tab1' ? loanTerm1 : loanTerm2;
  const totalStaticCharges = activeTab === 'tab1' ? totalStaticCharges1 : totalStaticCharges2;
  const propertyTax = activeTab === 'tab1' ? propertyTax1 : propertyTax2;
  const homeownersInsurance = activeTab === 'tab1' ? homeownersInsurance1 : homeownersInsurance2;
  const customCharges = activeTab === 'tab1' ? customCharges1 : customCharges2;
  const chargesPanelOpen = activeTab === 'tab1' ? chargesPanelOpen1 : chargesPanelOpen2;
  const totalPayment = activeTab !== 'tab3' ? calculateTotalPayment(monthlyPI, loanTerm) : totalRentalCost;
  const totalInterest = activeTab !== 'tab3' ? calculateTotalInterest(totalPayment, principal) : 0;
  const totalCostWithCharges = activeTab !== 'tab3' ? totalPayment + totalStaticCharges * loanTerm * 12 : totalRentalCost;

  // Amortization schedule
  const amortizationSchedule = showAmortization
    ? generateAmortizationSchedule(principal, interestRate, loanTerm)
    : [];

  const handleDownPaymentTypeToggle = () => {
    if (activeTab === 'tab1') {
      const baseAmount = totalLoanAmount1;
      if (downPaymentType1 === 'percentage') {
        setDownPaymentDollar1((baseAmount * downPaymentPercent1) / 100);
        setDownPaymentType1('dollar');
      } else {
        setDownPaymentPercent1((downPaymentDollar1 / baseAmount) * 100);
        setDownPaymentType1('percentage');
      }
    } else {
      const baseAmount = housePrice;
      if (downPaymentType2 === 'percentage') {
        setDownPaymentDollar2((baseAmount * downPaymentPercent2) / 100);
        setDownPaymentType2('dollar');
      } else {
        setDownPaymentPercent2((downPaymentDollar2 / baseAmount) * 100);
        setDownPaymentType2('percentage');
      }
    }
  };

  const addCustomCharge = () => {
    if (activeTab === 'tab1') {
      setCustomCharges1([
        ...customCharges1,
        { id: Date.now(), name: 'Custom Charge', amount: 0 },
      ]);
    } else {
      setCustomCharges2([
        ...customCharges2,
        { id: Date.now(), name: 'Custom Charge', amount: 0 },
      ]);
    }
  };

  const updateCustomCharge = (id, field, value) => {
    if (activeTab === 'tab1') {
      setCustomCharges1(
        customCharges1.map((charge) =>
          charge.id === id ? { ...charge, [field]: value } : charge
        )
      );
    } else {
      setCustomCharges2(
        customCharges2.map((charge) =>
          charge.id === id ? { ...charge, [field]: value } : charge
        )
      );
    }
  };

  const deleteCustomCharge = (id) => {
    if (activeTab === 'tab1') {
      setCustomCharges1(customCharges1.filter((charge) => charge.id !== id));
    } else {
      setCustomCharges2(customCharges2.filter((charge) => charge.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Mortgage Payment Calculator
        </h1>

        {/* Summary Bar */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Tab 1 Summary */}
            <div className={`p-4 rounded-lg border-2 transition-all ${
              activeTab === 'tab1'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Loan + Existing
                </h3>
                {activeTab === 'tab1' && (
                  <span className="px-2 py-1 text-xs font-bold text-blue-600 bg-blue-100 rounded">
                    ACTIVE
                  </span>
                )}
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {formatCurrency(totalMonthlyPayment1)}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Monthly Payment
              </div>
            </div>

            {/* Tab 2 Summary */}
            <div className={`p-4 rounded-lg border-2 transition-all ${
              activeTab === 'tab2'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  House Price
                </h3>
                {activeTab === 'tab2' && (
                  <span className="px-2 py-1 text-xs font-bold text-blue-600 bg-blue-100 rounded">
                    ACTIVE
                  </span>
                )}
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {formatCurrency(totalMonthlyPayment2)}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Monthly Payment
              </div>
            </div>

            {/* Tab 3 Summary */}
            <div className={`p-4 rounded-lg border-2 transition-all ${
              activeTab === 'tab3'
                ? 'border-green-600 bg-green-50'
                : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Rental
                </h3>
                {activeTab === 'tab3' && (
                  <span className="px-2 py-1 text-xs font-bold text-green-600 bg-green-100 rounded">
                    ACTIVE
                  </span>
                )}
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {formatCurrency(totalMonthlyPayment3)}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Monthly Payment
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg bg-white shadow-md p-1">
            <button
              onClick={() => setActiveTab('tab1')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'tab1'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Loan + Existing Mortgage
            </button>
            <button
              onClick={() => setActiveTab('tab2')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'tab2'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              House Price
            </button>
            <button
              onClick={() => setActiveTab('tab3')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'tab3'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Rental
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Inputs */}
          <div className="space-y-6">
            {/* Loan Amount Card - Tab 1 */}
            {activeTab === 'tab1' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Loan Amount
                </label>
                <div className="relative mb-4">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">$</span>
                  <input
                    type="text"
                    value={formatNumberInput(loanAmount)}
                    onChange={(e) => setLoanAmount(parseNumberInput(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 text-2xl font-bold text-blue-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <input
                  type="range"
                  min="50000"
                  max="2000000"
                  step="10000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full mb-1"
                />
                <div className="flex justify-between text-xs text-gray-500 mb-6">
                  <span>$50,000</span>
                  <span>$2,000,000</span>
                </div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Existing Mortgage
                </label>
                <div className="relative mb-4">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">$</span>
                  <input
                    type="text"
                    value={formatNumberInput(existingMortgage)}
                    onChange={(e) => setExistingMortgage(parseNumberInput(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 text-2xl font-bold text-blue-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="2000000"
                  step="10000"
                  value={existingMortgage}
                  onChange={(e) => setExistingMortgage(Number(e.target.value))}
                  className="w-full mb-1"
                />
                <div className="flex justify-between text-xs text-gray-500 mb-6">
                  <span>$0</span>
                  <span>$2,000,000</span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700">Total Loan Amount</span>
                    <span className="text-3xl font-bold text-blue-600">
                      ${formatNumberInput(totalLoanAmount)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* House Price Card - Tab 2 */}
            {activeTab === 'tab2' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  House Price
                </label>
                <div className="relative mb-4">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">$</span>
                  <input
                    type="text"
                    value={formatNumberInput(housePrice)}
                    onChange={(e) => setHousePrice(parseNumberInput(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 text-2xl font-bold text-blue-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <input
                  type="range"
                  min="50000"
                  max="3000000"
                  step="10000"
                  value={housePrice}
                  onChange={(e) => setHousePrice(Number(e.target.value))}
                  className="w-full mb-1"
                />
                <div className="flex justify-between text-xs text-gray-500 mb-6">
                  <span>$50,000</span>
                  <span>$3,000,000</span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-600">House Price</span>
                    <span className="text-lg font-semibold text-gray-800">
                      ${formatNumberInput(housePrice)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-600">Down Payment</span>
                    <span className="text-lg font-semibold text-gray-800">
                      ${formatNumberInput(downPaymentAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="text-sm font-semibold text-gray-700">Loan Amount</span>
                    <span className="text-3xl font-bold text-blue-600">
                      ${formatNumberInput(totalLoanAmount)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Rental Card - Tab 3 */}
            {activeTab === 'tab3' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Monthly Rent
                </label>
                <div className="relative mb-4">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">$</span>
                  <input
                    type="text"
                    value={formatNumberInput(monthlyRent)}
                    onChange={(e) => setMonthlyRent(parseNumberInput(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 text-2xl font-bold text-green-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="50"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(Number(e.target.value))}
                  className="w-full mb-1"
                />
                <div className="flex justify-between text-xs text-gray-500 mb-6">
                  <span>$500</span>
                  <span>$10,000</span>
                </div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Renters Insurance (Monthly)
                </label>
                <div className="relative mb-4">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-400">$</span>
                  <input
                    type="number"
                    value={rentersInsurance}
                    onChange={(e) => setRentersInsurance(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 text-xl font-bold text-green-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="0"
                  />
                </div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rental Period (Years)
                </label>
                <div className="flex items-baseline gap-2 mb-4">
                  <input
                    type="number"
                    value={rentalYears}
                    onChange={(e) => setRentalYears(Number(e.target.value))}
                    className="flex-1 px-4 py-2 text-2xl font-bold text-green-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="1"
                    max="30"
                  />
                  <span className="text-2xl font-bold text-gray-600">years</span>
                </div>
                <div className="grid grid-cols-5 gap-2 mb-6">
                  {[10, 15, 20, 25, 30].map((years) => (
                    <button
                      key={years}
                      onClick={() => setRentalYears(years)}
                      className={`py-2 px-3 rounded-lg font-medium transition-colors ${
                        rentalYears === years
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {years}
                    </button>
                  ))}
                </div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Yearly Rental Increase
                </label>
                <div className="flex items-baseline gap-2 mb-4">
                  <input
                    type="number"
                    value={yearlyRentalIncrease}
                    onChange={(e) => setYearlyRentalIncrease(Number(e.target.value))}
                    className="flex-1 px-4 py-2 text-2xl font-bold text-green-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="0"
                    max="20"
                    step="0.1"
                  />
                  <span className="text-2xl font-bold text-gray-600">%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="0.1"
                  value={yearlyRentalIncrease}
                  onChange={(e) => setYearlyRentalIncrease(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mb-6">
                  <span>0%</span>
                  <span>20%</span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-600">Monthly Rent</span>
                    <span className="text-lg font-semibold text-gray-800">
                      {formatCurrency(monthlyRent)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-600">Renters Insurance</span>
                    <span className="text-lg font-semibold text-gray-800">
                      {formatCurrency(rentersInsurance)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="text-sm font-semibold text-gray-700">Total Monthly Cost</span>
                    <span className="text-3xl font-bold text-green-600">
                      {formatCurrency(totalMonthlyPayment3)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-3 border-t">
                    <span className="text-sm font-semibold text-gray-700">
                      Total Cost Over {rentalYears} Years
                    </span>
                    <span className="text-xl font-bold text-gray-800">
                      {formatCurrency(totalRentalCost)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Down Payment */}
            {activeTab !== 'tab3' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Down Payment
                </label>
                <button
                  onClick={handleDownPaymentTypeToggle}
                  className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
                >
                  Switch to {(activeTab === 'tab1' ? downPaymentType1 : downPaymentType2) === 'percentage' ? '$' : '%'}
                </button>
              </div>

              {activeTab === 'tab1' ? (
                // Tab 1 Down Payment
                downPaymentType1 === 'percentage' ? (
                  <>
                    <div className="flex items-baseline gap-2 mb-4">
                      <input
                        type="number"
                        value={downPaymentPercent1}
                        onChange={(e) => setDownPaymentPercent1(Number(e.target.value))}
                        className="flex-1 px-4 py-2 text-2xl font-bold text-blue-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        max="50"
                        step="0.1"
                      />
                      <span className="text-2xl font-bold text-gray-600">%</span>
                      <span className="text-lg text-gray-500">
                        ({formatCurrency(downPaymentAmount1)})
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="0.5"
                      value={downPaymentPercent1}
                      onChange={(e) => setDownPaymentPercent1(Number(e.target.value))}
                      className="w-full"
                    />
                  </>
                ) : (
                  <>
                    <div className="relative mb-4">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">$</span>
                      <input
                        type="text"
                        value={formatNumberInput(downPaymentDollar1)}
                        onChange={(e) => setDownPaymentDollar1(parseNumberInput(e.target.value))}
                        className="w-full pl-10 pr-4 py-2 text-2xl font-bold text-blue-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={totalLoanAmount1 * 0.5}
                      step="1000"
                      value={downPaymentDollar1}
                      onChange={(e) => setDownPaymentDollar1(Number(e.target.value))}
                      className="w-full"
                    />
                  </>
                )
              ) : (
                // Tab 2 Down Payment
                downPaymentType2 === 'percentage' ? (
                  <>
                    <div className="flex items-baseline gap-2 mb-4">
                      <input
                        type="number"
                        value={downPaymentPercent2}
                        onChange={(e) => setDownPaymentPercent2(Number(e.target.value))}
                        className="flex-1 px-4 py-2 text-2xl font-bold text-blue-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        max="50"
                        step="0.1"
                      />
                      <span className="text-2xl font-bold text-gray-600">%</span>
                      <span className="text-lg text-gray-500">
                        ({formatCurrency(downPaymentAmount2)})
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="0.5"
                      value={downPaymentPercent2}
                      onChange={(e) => setDownPaymentPercent2(Number(e.target.value))}
                      className="w-full"
                    />
                  </>
                ) : (
                  <>
                    <div className="relative mb-4">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">$</span>
                      <input
                        type="text"
                        value={formatNumberInput(downPaymentDollar2)}
                        onChange={(e) => setDownPaymentDollar2(parseNumberInput(e.target.value))}
                        className="w-full pl-10 pr-4 py-2 text-2xl font-bold text-blue-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={1000000}
                      step="1000"
                      value={downPaymentDollar2}
                      onChange={(e) => setDownPaymentDollar2(Number(e.target.value))}
                      className="w-full"
                    />
                  </>
                )
              )}
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                {(activeTab === 'tab1' ? downPaymentType1 : downPaymentType2) === 'percentage' ? (
                  <>
                    <span>0%</span>
                    <span>50%</span>
                  </>
                ) : (
                  <>
                    <span>$0</span>
                    <span>{activeTab === 'tab1' ? '50% of loan' : '$1,000,000'}</span>
                  </>
                )}
              </div>
              </div>
            )}

            {/* Interest Rate - Only for mortgage tabs */}
            {activeTab !== 'tab3' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Interest Rate
                </label>
                <div className="flex items-baseline gap-2 mb-4">
                  <input
                    type="number"
                    value={interestRate}
                    onChange={(e) => {
                      if (activeTab === 'tab1') setInterestRate1(Number(e.target.value));
                      else setInterestRate2(Number(e.target.value));
                    }}
                    className="flex-1 px-4 py-2 text-2xl font-bold text-blue-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max="15"
                    step="0.125"
                  />
                  <span className="text-2xl font-bold text-gray-600">%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.125"
                  value={interestRate}
                  onChange={(e) => {
                    if (activeTab === 'tab1') setInterestRate1(Number(e.target.value));
                    else setInterestRate2(Number(e.target.value));
                  }}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>15%</span>
                </div>
              </div>
            )}

            {/* Loan Term - Only for mortgage tabs */}
            {activeTab !== 'tab3' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Loan Term
                </label>
                <div className="flex items-baseline gap-2 mb-4">
                  <input
                    type="number"
                    value={loanTerm}
                    onChange={(e) => {
                      if (activeTab === 'tab1') setLoanTerm1(Number(e.target.value));
                      else setLoanTerm2(Number(e.target.value));
                    }}
                    className="flex-1 px-4 py-2 text-2xl font-bold text-blue-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    max="30"
                  />
                  <span className="text-2xl font-bold text-gray-600">years</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[10, 15, 20, 25, 30].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        if (activeTab === 'tab1') setLoanTerm1(term);
                        else setLoanTerm2(term);
                      }}
                      className={`py-2 px-3 rounded-lg font-medium transition-colors ${
                        loanTerm === term
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Static Monthly Charges - Only for mortgage tabs */}
            {activeTab !== 'tab3' && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <button
                  onClick={() => {
                    if (activeTab === 'tab1') setChargesPanelOpen1(!chargesPanelOpen1);
                    else setChargesPanelOpen2(!chargesPanelOpen2);
                  }}
                  className="w-full px-6 py-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    Static Monthly Charges
                  </h3>
                  <svg
                    className={`w-5 h-5 text-gray-600 transition-transform ${
                      chargesPanelOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {chargesPanelOpen && (
                  <div className="p-6 space-y-4">
                    {/* Property Tax */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Property Tax (Monthly)
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">$</span>
                        <input
                          type="number"
                          value={propertyTax}
                          onChange={(e) => {
                            if (activeTab === 'tab1') setPropertyTax1(Number(e.target.value));
                            else setPropertyTax2(Number(e.target.value));
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="0"
                        />
                      </div>
                    </div>

                    {/* Homeowners Insurance */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Homeowner's Insurance (Monthly)
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">$</span>
                        <input
                          type="number"
                          value={homeownersInsurance}
                          onChange={(e) => {
                            if (activeTab === 'tab1') setHomeownersInsurance1(Number(e.target.value));
                            else setHomeownersInsurance2(Number(e.target.value));
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="0"
                        />
                      </div>
                    </div>

                  {/* Custom Charges */}
                  {customCharges.map((charge) => (
                    <div key={charge.id} className="flex gap-2">
                      <input
                        type="text"
                        value={charge.name}
                        onChange={(e) =>
                          updateCustomCharge(charge.id, 'name', e.target.value)
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Charge name"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">$</span>
                        <input
                          type="number"
                          value={charge.amount}
                          onChange={(e) =>
                            updateCustomCharge(
                              charge.id,
                              'amount',
                              Number(e.target.value)
                            )
                          }
                          className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="0"
                        />
                      </div>
                      <button
                        onClick={() => deleteCustomCharge(charge.id)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={addCustomCharge}
                    className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors font-medium"
                  >
                    + Add Custom Charge
                  </button>
                </div>
              )}
              </div>
            )}
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {/* Monthly Payment Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {activeTab === 'tab3' ? 'Monthly Rental Cost' : 'Monthly Payment'}
              </h2>
              <div className={`text-5xl font-bold mb-6 ${activeTab === 'tab3' ? 'text-green-600' : 'text-blue-600'}`}>
                {formatCurrency(totalMonthlyPayment)}
              </div>

              <div className="space-y-3 border-t pt-4">
                {activeTab === 'tab3' ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Monthly Rent</span>
                      <span className="font-semibold text-gray-800">
                        {formatCurrency(monthlyRent)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Renters Insurance</span>
                      <span className="font-semibold text-gray-800">
                        {formatCurrency(rentersInsurance)}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Principal & Interest</span>
                      <span className="font-semibold text-gray-800">
                        {formatCurrency(monthlyPI)}
                      </span>
                    </div>
                    {propertyTax > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Property Tax</span>
                        <span className="font-semibold text-gray-800">
                          {formatCurrency(propertyTax)}
                        </span>
                      </div>
                    )}
                    {homeownersInsurance > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Homeowner's Insurance</span>
                        <span className="font-semibold text-gray-800">
                          {formatCurrency(homeownersInsurance)}
                        </span>
                      </div>
                    )}
                    {customCharges.map((charge) => (
                      <div key={charge.id} className="flex justify-between items-center">
                        <span className="text-gray-600">{charge.name}</span>
                        <span className="font-semibold text-gray-800">
                          {formatCurrency(charge.amount)}
                        </span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Loan/Rental Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {activeTab === 'tab3' ? 'Rental Summary' : 'Loan Summary'}
              </h2>
              <div className="space-y-4">
                {activeTab === 'tab1' ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">New Loan</div>
                      <div className="text-lg font-bold text-gray-800">
                        {formatCurrency(loanAmount)}
                      </div>
                    </div>
                    {existingMortgage > 0 && (
                      <div>
                        <div className="text-sm text-gray-600">Existing Mortgage</div>
                        <div className="text-lg font-bold text-gray-800">
                          {formatCurrency(existingMortgage)}
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="text-sm text-gray-600">Total Loan Amount</div>
                      <div className="text-lg font-bold text-blue-600">
                        {formatCurrency(totalLoanAmount)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Down Payment</div>
                      <div className="text-lg font-bold text-gray-800">
                        {formatCurrency(downPaymentAmount)}
                      </div>
                    </div>
                  </div>
                ) : activeTab === 'tab2' ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">House Price</div>
                      <div className="text-lg font-bold text-gray-800">
                        {formatCurrency(housePrice)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Down Payment</div>
                      <div className="text-lg font-bold text-gray-800">
                        {formatCurrency(downPaymentAmount)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Loan Amount</div>
                      <div className="text-lg font-bold text-blue-600">
                        {formatCurrency(totalLoanAmount)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Monthly Rent</div>
                      <div className="text-lg font-bold text-gray-800">
                        {formatCurrency(monthlyRent)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Renters Insurance</div>
                      <div className="text-lg font-bold text-gray-800">
                        {formatCurrency(rentersInsurance)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Total Monthly</div>
                      <div className="text-lg font-bold text-green-600">
                        {formatCurrency(totalMonthlyPayment3)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Rental Period</div>
                      <div className="text-lg font-bold text-gray-800">
                        {rentalYears} years
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'tab3' ? (
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm font-semibold text-gray-700">
                        Total Cost Over {rentalYears} Years
                      </span>
                      <span className="text-xl font-bold text-green-600">
                        {formatCurrency(totalRentalCost)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Principal</span>
                      <span className="text-lg font-semibold text-gray-800">
                        {formatCurrency(principal)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">
                        Total Interest Paid
                      </span>
                      <span className="text-lg font-semibold text-red-600">
                        {formatCurrency(totalInterest)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">
                        Total P&I Over {loanTerm} Years
                      </span>
                      <span className="text-lg font-semibold text-gray-800">
                        {formatCurrency(totalPayment)}
                      </span>
                    </div>
                    {totalStaticCharges > 0 && (
                      <>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">
                            Total Static Charges Over {loanTerm} Years
                          </span>
                          <span className="text-lg font-semibold text-gray-800">
                            {formatCurrency(totalStaticCharges * loanTerm * 12)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t">
                          <span className="text-sm font-semibold text-gray-700">
                            Total Cost Over {loanTerm} Years
                          </span>
                          <span className="text-xl font-bold text-gray-900">
                            {formatCurrency(totalCostWithCharges)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Amortization Schedule - Only for mortgage tabs */}
            {activeTab !== 'tab3' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => setShowAmortization(!showAmortization)}
                className="w-full px-6 py-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  Amortization Schedule
                </h3>
                <svg
                  className={`w-5 h-5 text-gray-600 transition-transform ${
                    showAmortization ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showAmortization && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Month
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Principal
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Interest
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {amortizationSchedule.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {row.month}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">
                            {formatCurrency(row.payment)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">
                            {formatCurrency(row.principal)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">
                            {formatCurrency(row.interest)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">
                            {formatCurrency(row.balance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            )}

            {/* Year-by-Year Rental Cost Breakdown - Only for rental tab */}
            {activeTab === 'tab3' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => setShowAmortization(!showAmortization)}
                className="w-full px-6 py-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  Year-by-Year Cost Breakdown
                </h3>
                <svg
                  className={`w-5 h-5 text-gray-600 transition-transform ${
                    showAmortization ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showAmortization && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Year
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Monthly Rent
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Monthly Insurance
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Monthly
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Yearly Cost
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Array.from({ length: rentalYears }, (_, year) => {
                        const yearlyRent = monthlyRent * Math.pow(1 + yearlyRentalIncrease / 100, year);
                        const totalMonthly = yearlyRent + rentersInsurance;
                        const yearlyCost = totalMonthly * 12;
                        return (
                          <tr key={year} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {year + 1}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right">
                              {formatCurrency(yearlyRent)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right">
                              {formatCurrency(rentersInsurance)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right">
                              {formatCurrency(totalMonthly)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-semibold">
                              {formatCurrency(yearlyCost)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
