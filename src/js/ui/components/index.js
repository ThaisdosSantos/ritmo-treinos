/** @file Utilitários de acesso à interface; componentes ainda estão no core legado. */
/**
 * Consulta um elemento no documento atual.
 * @param {string} selector Seletor CSS.
 * @returns {Element|null} Elemento encontrado ou null.
 */
export const getElement = (selector) => document.querySelector(selector);
