# BudgetWise — Project 13

Front-end personal budget tracker. HTML, CSS and JavaScript modules, Chart.js 4.4.8, localStorage. No API, authentication, server database or bank integration.

## Run locally

From this folder, run `python -m http.server 8000 --directory dist`, then open http://localhost:8000. Alternatively use VS Code Live Server on `dist/index.html`. Serve through HTTP; do not open index.html directly because browser storage and JavaScript modules behave differently on file URLs.

## Use

The app starts empty. Use **Load example data** to explore a sample monthly budget; this asks before replacing records. Choose a month, add income and expenses, edit/delete through Transactions, and set category limits through Monthly budgets. Insights provides exact values alongside the chart. All entries use GBP. Needs and wants are budgeting categories, not environmental impact measures. A remaining balance is not automatically savings.

**Export backup** saves a JSON copy. **Import** validates and replaces the complete dataset only after confirmation. Keep exports private. Clear all data also requires confirmation. Storage belongs to the browser origin, not a person or account. Clearing browser data, changing the origin, or leaving private mode can remove access to records. Storage failure is reported and a failed save does not change the in-memory state. If another tab changes data, reload before editing.

## Files

- `dist/index.html`: accessible page structure and navigation.
- `dist/styles.css`: responsive desktop/mobile layouts.
- `dist/app.mjs`: rendering, events, backup actions and charts.
- `dist/core.mjs`: pure validation, calculation and state functions.
- `dist/vendor/chart.umd.js`: locally bundled Chart.js; no CDN dependency at runtime.
- `tests/core.test.mjs`: 25 automated tests, run with `node --test tests/core.test.mjs` or `npm test`. No npm installation is needed for this buildless project.

## Verification

25 automated core tests passed on 15 October 2026. JavaScript syntax checked. No browser-driven interaction, viewport inspection or participant testing has been executed in this environment. See the project pack for the remaining manual acceptance checks. Do not claim full accessibility conformance or real-user outcomes from these checks.

## Group responsibilities

Maria: Product Owner. Juan Carlos: Scrum Master. Rauf: UI/UX. Teodor: Front-End. Alin: Visualisation and QA. These are planned ownership assignments; supplied implementation and test evidence does not certify that each person wrote those files. Members should review, understand and develop their assigned areas and retain their own contribution evidence.

## Third-party code

Chart.js is distributed under the MIT licence. Its copyright and licence notice are preserved in the bundled file; see THIRD_PARTY_NOTICES.md.
