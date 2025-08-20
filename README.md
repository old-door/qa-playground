# QA Automation Playground

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Made for QA Learning](https://img.shields.io/badge/Made%20for-QA%20Learning-blue)](#)
[![Playwright](https://img.shields.io/badge/Tested%20with-Playwright-45ba4b)](https://playwright.dev/)

A **minimal React + TypeScript + Playwright** playground for demonstrating different QA automation approaches, test cases, and concepts.  
Built for the QA community — open source, easy to run locally, and intentionally **simple** (no styles, no complex logic) so you can focus on **testing techniques**.

---

## ✨ Purpose

- 📚 **Educational resource** for QA engineers & test automation learners.
- 🧪 **Sandbox** for practicing automation with Playwright.
- 🛠️ Demonstrates **different QA cases and approaches**.
- 🔍 Great for **experiments, workshops, and demos**.

---

## 🚀 Getting Started

```bash
npm install
# Also download new browser binaries and their dependencies:
npx playwright install --with-deps
# Start playground app
npm run dev
# Use new terminal to run all Playwright tests via UI mode:
npm run test
```

## 🧩 Available playground pages
/ – Introductory text about the playground.

/table – A sortable table with multiple column types.

/items – An item catalog with various filters.

/chart – A page with a chart (canvas) showing item values and labels.

## 🧪 Available test examples
* [Sorting](tests/specs/sortable-table.spec.ts)
* [Filtering](tests/specs/filterable-items.spec.ts)
* [Visual comparison](tests/specs/chart.spec.ts)
* [Canvas functional testing](tests/specs/chart.spec.ts)

## 🤝 Contributing
Pull requests with new QA case examples are welcome!
For major changes, please open an issue first to discuss what you’d like to add.

## 📄 License
This project is licensed under the MIT License — free to use, modify, and share for educational or commercial purposes.