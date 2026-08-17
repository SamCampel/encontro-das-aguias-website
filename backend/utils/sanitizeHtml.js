// Mantém apenas a formatação produzida pelo editor e remove conteúdo executável.
// Para um CMS público, esta lista restritiva é mais segura que renderizar HTML bruto.
const allowedTags = new Set(['p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'a']);

function sanitizeHtml(value = '') {
  return String(value)
    .replace(/<!--[^]*?-->/g, '')
    .replace(/<\/?([a-z0-9]+)([^>]*)>/gi, (full, tag, attrs) => {
      const normalized = tag.toLowerCase();
      if (!allowedTags.has(normalized)) return '';
      if (full.startsWith('</')) return `</${normalized}>`;
      if (normalized !== 'a') return `<${normalized}>`;
      const href = /href\s*=\s*["']([^"']+)["']/i.exec(attrs)?.[1] || '';
      return /^https?:\/\//i.test(href) || href.startsWith('/') || href.startsWith('#')
        ? `<a href="${href.replace(/["<>]/g, '')}" rel="noopener noreferrer">`
        : '<a>';
    });
}

module.exports = { sanitizeHtml };
