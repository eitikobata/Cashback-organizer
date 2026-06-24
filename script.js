function brl(value) {
  return 'R$ ' + Math.abs(value).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function getField(text, key) {
  var regex = new RegExp(key + '\\s*=\\s*(-?[\\d.]+)');
  var match = text.match(regex);
  return match ? parseFloat(match[1]) : 0;
}

function parse() {
  var raw = document.getElementById('raw-input').value.trim();
  var errorEl = document.getElementById('error');
  errorEl.style.display = 'none';

  if (!raw) {
    errorEl.textContent = 'Please paste the raw cashback data before calculating.';
    errorEl.style.display = 'block';
    document.getElementById('result').style.display = 'none';
    return;
  }

  var rateMatch = raw.match(/^([\d.]+)/);
  var rate = rateMatch ? parseFloat(rateMatch[1]) : 0;

  var realBet        = getField(raw, 'real_bet');
  var realWon        = getField(raw, 'real_won');
  var lastCashback   = getField(raw, 'last_week_cashback');
  var freeSpins      = getField(raw, 'softswiss_free_spins_amount');
  var cashbackReward = getField(raw, 'cashback_reward_amount');
  var rakebackReward = getField(raw, 'rakeback_reward_amount');
  var rakeback       = getField(raw, 'daily_rakeback_amount');
  var amount         = getField(raw, 'amount');

  if (realBet === 0 && realWon === 0) {
    errorEl.textContent = 'Could not read the data. Make sure the full raw text is pasted correctly.';
    errorEl.style.display = 'block';
    document.getElementById('result').style.display = 'none';
    return;
  }

  var totalWon = realWon + lastCashback + freeSpins + cashbackReward + rakebackReward + rakeback;
  var diff = realBet - totalWon;
  var cashbackResult = amount;

  var pct = rate > 0 ? (rate * 100).toFixed(0) + '%' : '?%';

  document.getElementById('o-bet').textContent       = brl(realBet);
  document.getElementById('o-won').textContent       = brl(realWon);
  document.getElementById('o-cashback').textContent  = brl(lastCashback);
  document.getElementById('o-freespins').textContent = brl(freeSpins);
  document.getElementById('o-rewards').textContent   = brl(cashbackReward + rakebackReward);
  document.getElementById('o-bonus').textContent     = brl(0);
  document.getElementById('o-rakeback').textContent  = brl(rakeback);
  document.getElementById('o-total-won').textContent = brl(totalWon);

  var diffEl = document.getElementById('o-diff');
  diffEl.textContent = (diff >= 0 ? '-' : '+') + brl(diff);
  diffEl.style.color = diff > 0 ? '#f87171' : '#86efac';

  document.getElementById('cb-label').textContent = 'Seu cashback (' + pct + ')';

  var cbEl = document.getElementById('o-result');
  cbEl.textContent = brl(cashbackResult);
  cbEl.className = 'cb-value' + (cashbackResult > 0 ? ' positive' : ' zero');

  document.getElementById('result').style.display = 'block';
}

function clearAll() {
  document.getElementById('raw-input').value = '';
  document.getElementById('result').style.display = 'none';
  document.getElementById('error').style.display = 'none';
}
