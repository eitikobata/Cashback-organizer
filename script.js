function brl(value) {
  return 'R$ ' + Math.abs(value).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function getField(text, key) {
  var regex = new RegExp(key + '\\s*=\\s*(-?[\\d.]+)');
  var match = text.match(regex);
  return match ? parseFloat(match[1]) : 0;
}

function buildClientMessage(fields, pct, cashbackResult) {
  var lines = [];
  lines.push('O cashback semanal é calculado com base na diferença entre seus ganhos e perdas durante o período, e não sobre o total apostado.');
  lines.push('');
  lines.push('Vamos aos seus valores:');
  lines.push('• Total apostado: ' + brl(fields.realBet));
  lines.push('• Total ganho: ' + brl(fields.realWon));
  lines.push('');
  lines.push('Deduções aplicadas:');
  lines.push('• Recompensas vendidas/resgatadas: ' + brl(fields.sellAmount));
  lines.push('• Bônus convertidos em reais: ' + brl(fields.transferAmount));
  lines.push('• Cashback anterior: ' + brl(fields.lastCashback));
  lines.push('• Recompensa de reembolso: ' + brl(fields.cashbackReward));
  lines.push('• Recompensa Rakeback: ' + brl(fields.rakebackReward));
  lines.push('');
  lines.push('Perdas líquidas: ' + brl(fields.losses));
  lines.push('Seu cashback (' + pct + '): ' + brl(cashbackResult));
  lines.push('');
  lines.push('Esse é o valor final disponível para você nesta semana.');
  lines.push('');
  lines.push('Para mais detalhes sobre o cálculo:');
  lines.push('https://support.blaze-help.com/hc/pt-br/articles/360007716017-Como-funciona-o-cashback-reembolso');
  return lines.join('\n');
}

function parse() {
  var raw = document.getElementById('raw-input').value.trim();
  var errorEl = document.getElementById('error');
  errorEl.style.display = 'none';

  if (!raw) {
    errorEl.textContent = 'Please paste the raw cashback data before calculating.';
    errorEl.style.display = 'block';
    document.getElementById('result').style.display = 'none';
    document.getElementById('copy-section').style.display = 'none';
    return;
  }

  var rateMatch = raw.match(/^([\d.]+)/);
  var rate = rateMatch ? parseFloat(rateMatch[1]) : 0;

  var realBet        = getField(raw, 'real_bet');
  var realWon        = getField(raw, 'real_won');
  var sellAmount     = getField(raw, 'sell_amount');
  var transferAmount = getField(raw, 'transfer_amount');
  var lastCashback   = getField(raw, 'last_week_cashback');
  var cashbackReward = getField(raw, 'cashback_reward_amount');
  var rakebackReward = getField(raw, 'rakeback_reward_amount');
  var freeSpins      = getField(raw, 'softswiss_free_spins_amount');
  var rakeback       = getField(raw, 'daily_rakeback_amount');

  if (realBet === 0 && realWon === 0) {
    errorEl.textContent = 'Could not read the data. Make sure the full raw text is pasted correctly.';
    errorEl.style.display = 'block';
    document.getElementById('result').style.display = 'none';
    document.getElementById('copy-section').style.display = 'none';
    return;
  }

  // Correct formula:
  // Losses = real_bet - real_won - sell_amount - transfer_amount - last_week_cashback - cashback_reward_amount - rakeback_reward_amount
  var losses = realBet - realWon - sellAmount - transferAmount - lastCashback - cashbackReward - rakebackReward;
  var cashbackResult = losses > 0 ? losses * rate : 0;

  var pct = rate > 0 ? (rate * 100).toFixed(0) + '%' : '?%';

  // Populate breakdown table
  document.getElementById('o-bet').textContent           = brl(realBet);
  document.getElementById('o-won').textContent           = brl(realWon);
  document.getElementById('o-sell').textContent          = brl(sellAmount);
  document.getElementById('o-transfer').textContent      = brl(transferAmount);
  document.getElementById('o-cashback').textContent      = brl(lastCashback);
  document.getElementById('o-cashback-reward').textContent = brl(cashbackReward);
  document.getElementById('o-rakeback-reward').textContent = brl(rakebackReward);
  document.getElementById('o-freespins').textContent     = brl(freeSpins);
  document.getElementById('o-rakeback').textContent      = brl(rakeback);

  var lossesEl = document.getElementById('o-losses');
  lossesEl.textContent = losses > 0 ? brl(losses) : 'R$ 0,00 (sem perdas)';
  lossesEl.style.color = losses > 0 ? '#f87171' : '#86efac';

  document.getElementById('cb-label').textContent = 'Seu cashback (' + pct + ')';

  var cbEl = document.getElementById('o-result');
  cbEl.textContent = brl(cashbackResult);
  cbEl.className = 'cb-value' + (cashbackResult > 0 ? ' positive' : ' zero');

  // Build and show copy message
  var fields = { realBet: realBet, realWon: realWon, sellAmount: sellAmount, transferAmount: transferAmount, lastCashback: lastCashback, cashbackReward: cashbackReward, rakebackReward: rakebackReward, losses: losses > 0 ? losses : 0 };
  document.getElementById('client-message').value = buildClientMessage(fields, pct, cashbackResult);

  document.getElementById('result').style.display = 'block';
  document.getElementById('copy-section').style.display = 'block';
  document.getElementById('copy-feedback').style.display = 'none';
}

function copyMessage() {
  var ta = document.getElementById('client-message');
  ta.select();
  ta.setSelectionRange(0, 99999);
  document.execCommand('copy');
  var fb = document.getElementById('copy-feedback');
  fb.style.display = 'block';
  setTimeout(function () { fb.style.display = 'none'; }, 2000);
}

function clearAll() {
  document.getElementById('raw-input').value = '';
  document.getElementById('result').style.display = 'none';
  document.getElementById('copy-section').style.display = 'none';
  document.getElementById('error').style.display = 'none';
}
