// Compatibilidade: a persistência atual permanece no módulo core/workout.js.
// Futuras migrações de armazenamento devem preservar a chave ritmo-account-v1:<sub>.
export const accountStorageKey = sub => 'ritmo-account-v1:'+sub;
