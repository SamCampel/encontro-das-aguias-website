/**
 * Trunca um texto para um limite de caracteres
 * @param {string} text - Texto a ser truncado
 * @param {number} limit - Limite de caracteres (padrão: 150)
 * @returns {string} Texto truncado com "..." se exceder o limite
 */
export function truncateText(text, limit = 150) {
  if (!text) return '';
  if (text.length <= limit) return text;
  return text.substring(0, limit).trim() + '...';
}

/**
 * Verifica se o texto precisa de truncamento
 * @param {string} text - Texto a verificar
 * @param {number} limit - Limite de caracteres
 * @returns {boolean}
 */
export function shouldTruncate(text, limit = 150) {
  return text && text.length > limit;
}
