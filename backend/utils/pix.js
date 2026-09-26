function field(id, value) {
  const text = String(value);
  const length = Buffer.byteLength(text, 'utf8');
  if (length > 99) throw new Error(`Campo Pix ${id} excede o limite de 99 bytes`);
  return `${id}${String(length).padStart(2, '0')}${text}`;
}

function crc16(payload) {
  let crc = 0xFFFF;
  for (let i = 0; i < payload.length; i += 1) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) & 0xFFFF : (crc << 1) & 0xFFFF;
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function normalizeMerchantText(value, fallback, maxLength) {
  const normalized = String(value || fallback)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);

  return normalized || fallback;
}

function buildPixPayload({ key, name, city, amount, txid = '***' }) {
  const value = Number(amount);
  const pixKey = String(key || '').trim();
  if (!pixKey || !Number.isFinite(value) || value <= 0) throw new Error('Dados Pix inválidos');

  const merchantName = normalizeMerchantText(name, 'AGUIAS', 25);
  const merchantCity = normalizeMerchantText(city, 'SAO PAULO', 15);
  const transactionId = String(txid || '***').replace(/[^A-Za-z0-9.*-]/g, '').slice(0, 25) || '***';
  const merchantAccount = field('00', 'BR.GOV.BCB.PIX') + field('01', pixKey);
  const payload = [
    field('00', '01'), field('01', '12'), field('26', merchantAccount), field('52', '0000'),
    field('53', '986'), field('54', value.toFixed(2)), field('58', 'BR'),
    field('59', merchantName), field('60', merchantCity),
    field('62', field('05', transactionId)), '6304',
  ].join('');
  return payload + crc16(payload);
}

module.exports = { buildPixPayload };
