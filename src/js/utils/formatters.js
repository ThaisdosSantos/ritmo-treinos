/** @file Formatação de valores de apresentação do Ritmo. */
/**
 * Converte milissegundos em duração HH:MM:SS.
 * @param {number} ms Duração não negativa em milissegundos.
 * @returns {string} Duração formatada.
 */
export function formatDuration(ms) {
  const seconds = Number.isFinite(ms) ? Math.max(0, Math.floor(ms / 1000)) : 0;
  return [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60]
    .map((value) => String(value).padStart(2, '0'))
    .join(':');
}
