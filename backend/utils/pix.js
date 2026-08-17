function field(id, value) {
  const text = String(value);
  return `${id}${String(text.length).padStart(2, '0')}${text}`;
}

function crc16(payload) {
  let crc = 0xFFFF;
  for (let i = 0; i < payload.length; i += 1) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) & 0xFFFF : (crc << 1) & 0xFFFF;
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function buildPixPayload({ key, name, city, amount, txid = '***' }) {
  const value = Number(amount);
  if (!key || !Number.isFinite(value) || value <= 0) throw new Error('Dados Pix inválidos');
  const merchantAccount = field('00', 'BR.GOV.BCB.PIX') + field('01', key);
  const payload = [
    field('00', '01'), field('01', '12'), field('26', merchantAccount), field('52', '0000'),
    field('53', '986'), field('54', value.toFixed(2)), field('58', 'BR'),
    field('59', String(name || 'AGUIAS').slice(0, 25)), field('60', String(city || 'SAO PAULO').slice(0, 15)),
    field('62', field('05', String(txid).slice(0, 25))), '6304',
  ].join('');
  return payload + crc16(payload);
}

module.exports = { buildPixPayload };
