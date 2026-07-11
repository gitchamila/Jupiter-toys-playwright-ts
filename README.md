# Jupiter Toys Playwright TypeScript Automation Framework

This repository contains a UI automation framework for the Jupiter Toys technical assessment built with Playwright and TypeScript.

## Overview

The framework is structured for maintainability and reuse. It follows common QA automation patterns such as:

- Page Object Model
- Reusable fixtures
- Separated test data
- Shared utility functions
- Browser-specific Playwright configuration
- CI/CD-ready execution
- HTML reporting
- Failure screenshots, videos, and traces

## Application Under Test

Jupiter Toys

`http://jupiter.cloud.planittesting.com`

## Automated Coverage

The current test suite covers:

1. Contact page mandatory field validation
2. Contact page successful form submission
3. Shop page product visibility
4. Cart validation for:
   - 2 Stuffed Frog
   - 5 Fluffy Bunny
   - 3 Valentine Bear
5. Cart price, subtotal, and total calculations

## Tech Stack

- Playwright
- TypeScript
- Node.js
- npm

## Project Structure

```text
tests/          Test specifications
pages/          Page object classes
components/     Shared UI components
fixtures/       Custom Playwright fixtures
test-data/      Static test data and messages
utils/          Helper functions and calculation logic
.github/        GitHub Actions workflow files
reports/        Generated Playwright HTML report
allure-results/ Allure execution output
```

## Key Files

- `tests/contact.spec.ts` - contact form validation and submission tests
- `tests/shop.spec.ts` - shop and cart tests
- `fixtures/base.fixture.ts` - shared setup fixture
- `pages/contact.page.ts` - contact page object
- `pages/shop.page.ts` - shop page object
- `pages/cart.page.ts` - cart page object
- `components/navigation.component.ts` - shared navigation actions
- `utils/price-calculator.ts` - subtotal and total calculations
- `playwright.config.ts` - Playwright configuration
- `.github/workflows/playwright.yml` - GitHub Actions pipeline

## Installation

Install dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

## Run Tests

Run the full suite:

```bash
npx playwright test
```

Run Test Case 2 five times:

```bash
npx playwright test tests/contact.spec.ts -g "Test case 2 - Contact Form Submission" --repeat-each=5
```

Run in headed mode:

```bash
npx playwright test --headed
```

Run a specific spec file:

```bash
npx playwright test tests/contact.spec.ts
```

Run only the shop suite:

```bash
npx playwright test tests/shop.spec.ts
```

## Reporting

The project generates the standard Playwright HTML report using the configured reporter in `playwright.config.ts`.

Open the report locally:

```bash
npx playwright show-report reports
```

The report output is written to:

```text
reports/
```

## Failure Evidence

On failure, Playwright is configured to retain:

- screenshots
- videos
- traces

These are stored in the Playwright output generated during execution.

## CI/CD Execution

The GitHub Actions workflow is defined in:

```text
.github/workflows/playwright.yml
```

Recommended CI steps:

```bash
npm ci
npx playwright install --with-deps
npx playwright test
```

The workflow uploads the generated Playwright HTML report as an artifact.

## Notes

- Test data is kept separate from test logic.
- Locators are managed inside page objects and components.
- Test files contain business-focused test steps.
- The suite currently targets Chromium.
- All AI-assisted changes should still be reviewed and validated by the QA engineer before use.
