/** @file Convenções de armazenamento local por conta Google. */
/**
 * Monta a chave de persistência isolada por identificador estável do usuário.
 * @param {string} sub Identificador `sub` recebido do Google UserInfo.
 * @returns {string} Chave de localStorage da conta.
 */
export function accountStorageKey(sub) {
  if (typeof sub !== 'string' || !sub || sub.length > 255) {
    throw new TypeError('Identificador de conta inválido.');
  }
  return `ritmo-account-v1:${sub}`;
}
