/**
 * Remove máscara do CPF (ex: "000.000.000-00" -> "00000000000")
 */
function removeCpfMask(cpf) {
  if (!cpf) return '';
  return String(cpf).replace(/\D/g, '');
}

/**
 * Formata CPF com máscara (ex: "00000000000" -> "000.000.000-00")
 */
function formatCpf(cpf) {
  const clean = removeCpfMask(cpf);
  if (clean.length !== 11) return clean;
  return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Valida CPF usando o algoritmo oficial dos dígitos verificadores
 * Retorna true se válido, false caso contrário
 */
function isValidCpf(cpf) {
  const clean = removeCpfMask(cpf);

  // Deve ter exatamente 11 dígitos
  if (clean.length !== 11 || /^\d+$/.test(clean) === false) {
    return false;
  }

  // Rejeita CPFs com todos os dígitos iguais
  if (/^(\d)\1{10}$/.test(clean)) {
    return false;
  }

  // Calcula primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += Number(clean[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== Number(clean[9])) {
    return false;
  }

  // Calcula segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += Number(clean[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== Number(clean[10])) {
    return false;
  }

  return true;
}

module.exports = { isValidCpf, formatCpf, removeCpfMask };
