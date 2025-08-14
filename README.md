# 🥤 Suyon Vending Machine App

A Next.js (TypeScript) simulation of a vending machine that supports **Coke**, **Water**, and **Coffee** purchases.  
The app features a realistic UI with clickable item buttons, cash/card payments, change calculation, timeouts for inactivity, and modal-based confirmation dialogs.

---

## 📦 Version

**v1.0.0**  
Tested with:

- **Node.js** 20.x
- **npm** 10.x
- **Next.js** 15.x
- **React** 19.x
- **TypeScript** 5.x

---

## 🚀 Features

- **Item Selection**
  - Only in-stock items can be selected.
  - Out-of-stock items are visually marked and disabled.
- **Payment Methods**
  - Cash: Enter paid amount, auto-calculates change (with available coin stock check).
  - Card: Simulated authorization and decline handling.
- **Timeouts**
  - 10-second inactivity reset after item selection.
  - 5-second inactivity reset after card decline.
  - 5-second auto-dismiss for confirmation prompts.
- **Exception Handling**
  - Payment cancellation (by user).
  - No change available (cash only).
  - Payment declines with retry/cancel.
  - Hardware errors (e.g., dispenser jam).

---

## 🖥️ Requirements

- **Node.js** ≥ 18
- **npm** ≥ 9  
  (Or use **pnpm**/**yarn** if preferred.)

---

## 📂 Installation

Clone the repository:

```bash
git clone https://github.com/your-username/suyon-vending-machine.git
cd suyon-vending-machine
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
