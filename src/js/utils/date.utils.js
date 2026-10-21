/** @file Formatação de datas exibidas na interface pt-BR. */
/**
 * Formata um valor de data conforme a localidade brasileira.
 * @param {string|number|Date} value Data interpretável por Date.
 * @param {Intl.DateTimeFormatOptions} [options] Opções de exibição.
 * @returns {string} Data formatada em pt-BR.
 */
export function formatDate(value, options = { day: 'numeric', month: 'long' }) {
  return new Date(value).toLocaleDateString('pt-BR', options);
}
