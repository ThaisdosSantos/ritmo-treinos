/**
 * @file Ponto de entrada da aplicação.
 * @description A ordem de importação preserva as APIs globais usadas pelo core legado.
 * Calendário e treino são inicializados antes do login; Wake Lock depende do core.
 */
import './services/calendar.service.js';
import './core/workout.js';
import './services/auth.service.js';
import './core/timer.js';
