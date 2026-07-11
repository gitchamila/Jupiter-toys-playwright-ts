# Jupiter Toys Playwright TypeScript Automation Framework

This project contains a Playwright + TypeScript automation framework for testing the Jupiter Toys application.

## Current project structure

- tests/
  - contact.spec.ts: contact form validation and submission scenarios
  - shop.spec.ts: shop page product visibility scenarios
- pages/
  - base.page.ts: shared base page methods
  - contact.page.ts: contact page actions and assertions
  - shop.page.ts: shop page actions and assertions
  - cart.page.ts: cart-related page object (available for future coverage)
- components/
  - navigation.component.ts: shared navigation actions
- fixtures/
  - base.fixture.ts: custom Playwright fixture that opens the home page and validates the app is loaded
- test-data/
  - contact.data.ts: reusable contact form data and validation messages
- playwright.config.ts: Playwright configuration with base URL, browser setup, reporters, and screenshots/video/tracing settings

## Current behavior

- The custom fixture in fixtures/base.fixture.ts loads the home page before each test.
- It verifies that the application URL contains #/ and that the page title is Jupiter Toys.
- The contact page object interacts with the contact form, validates mandatory field errors, and prepares form data.
- The shop page object navigates to the shop view and verifies product cards are visible.

## Prerequisites

- Node.js
- npm

## Installation

Run the following command in the project root:

```bash
npm install
```

## Browser setup

If Playwright browsers are not installed yet, run:

```bash
npx playwright install
```

## Running tests

Run all tests:

```bash
npx playwright test
```

Run a specific file:

```bash
npx playwright test tests/contact.spec.ts
```

```bash
npx playwright test tests/shop.spec.ts
```

## Reports

HTML reports are enabled through Playwright config and will be generated in the playwright-report folder.

## Notes

- The project uses the Page Object Model (POM) approach.
- Test data is kept in the test-data folder for easier maintenance.
- Fixtures are used to centralize common setup and reduce duplication.