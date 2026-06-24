#Cashback Calculator

A lightweight web tool that calculates weekly cashback based on raw betting data input.

This tool was designed for the Brazilian market, where cashback rules and reporting are based on specific internal platform metrics.

---

## ⚙️ How it works

The calculator parses a raw text input containing betting data fields and computes:

- Total losses
- Adjusted deductions
- Final cashback value

### Formula (simplified)


losses = real_bet - real_won - adjustments
cashback = max(losses × rate, 0)


The final cashback value is truncated to 2 decimal places (no rounding up).

---

## 🌐 Output language

Although the interface is in English, the final client message is generated in Portuguese (PT-BR), as the tool is intended for internal Brazilian operations.

---

## 🧪 Test mode

You can use a sample input string to test the calculator:


rate=0.05
real_bet=1000
real_won=700
sell_amount=50
transfer_amount=0
last_week_cashback=20
cashback_reward_amount=10
rakeback_reward_amount=5


---

## 🧠 Notes

- Missing or invalid values are treated as 0
- The system assumes structured internal platform data
- Cashback is never rounded up, only truncated
