# Galois Canvas

Interactive Vite/React calculator for linear, quadratic, and cubic equations with Galois-flavored step-by-step explanations.

## Local app

```bash
npm install
npm run dev
```

Useful checks:

```bash
npm run lint
npm run test
npm run build
```

## Paperclip workflow

This repository is a Paperclip company package. Paperclip can import the root package files (`COMPANY.md`, `.paperclip.yaml`, `agents/`, `projects/`, `tasks/`, and `skills/`) to create a small agent team for working on the calculator app.

First start Paperclip:

```bash
npm run paperclip:onboard
npm run paperclip:run
```

Then, in another terminal, preview and import this app package:

```bash
npm run paperclip:preview
npm run paperclip:import
```

After import, open the Paperclip dashboard and assign the seeded tasks to the calculator agents.
