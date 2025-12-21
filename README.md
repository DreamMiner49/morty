# Mortgage Payment Calculator

A modern, responsive web application for calculating mortgage payments with an intuitive slider-based interface.

## Features

### Core Calculator Inputs
- **Loan Amount**: Adjustable from $50,000 to $2,000,000 (default: $300,000)
- **Down Payment**: Toggle between percentage (0-50%) or dollar amount
- **Interest Rate**: 0% to 15% with 0.125% increments (default: 6.5%)
- **Loan Term**: Quick select buttons for 10, 15, 20, 25, or 30 years

### Static Monthly Charges
- Expandable/collapsible section for recurring monthly costs
- Default fields for Property Tax and Homeowner's Insurance
- Add custom charges (HOA fees, PMI, etc.)
- Edit and delete custom charges
- All charges included in total monthly payment calculation

### Output Display
- **Principal & Interest (P&I)** payment
- **Total Monthly Payment** (P&I + all static charges)
- **Itemized Breakdown** showing each component
- **Total Cost** over loan life
- **Total Interest Paid** over loan life
- **Amortization Schedule** (collapsible yearly breakdown)

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:5173
```

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Technology Stack

- **React 18** - UI framework
- **Vite 4** - Build tool and dev server
- **Tailwind CSS 3** - Styling framework
- **JavaScript (ES6+)** - Programming language

## Features & Usage

### Interactive Sliders
- All inputs have both slider controls and manual input fields
- Click on displayed values to type precise numbers
- Real-time calculation updates as you adjust values

### Down Payment Toggle
- Switch between percentage and dollar amount views
- Values automatically convert when toggling

### Static Charges Management
- Click "Static Monthly Charges" header to expand/collapse
- Use "Add Custom Charge" button to add new line items
- Each charge has a name field and amount field
- Delete button (trash icon) removes custom charges

### Responsive Design
- Mobile-optimized layout
- Two-column desktop layout (inputs left, results right)
- Stacked single-column layout on smaller screens

## Mortgage Calculation Formula

```
M = P * [r(1+r)^n] / [(1+r)^n - 1]

Where:
M = Monthly payment
P = Principal (loan amount - down payment)
r = Monthly interest rate (annual rate / 12)
n = Total number of payments (years * 12)
```

## Project Structure

```
morty/
├── src/
│   ├── utils/
│   │   └── mortgageCalculations.js  # Calculation logic
│   ├── App.jsx                      # Main application component
│   ├── main.jsx                     # React entry point
│   └── index.css                    # Global styles & Tailwind
├── index.html                       # HTML template
├── vite.config.js                   # Vite configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── postcss.config.js                # PostCSS configuration
└── package.json                     # Project dependencies
```

## License

This project is open source and available under the MIT License.
