/**
 * @file main.js
 * @description Orquestador principal. Importa y lanza cada módulo de responsabilidad única.
 *   - ui.js      → Interfaz global (header scroll, scroll spy)
 *   - catalogo.js → Filtros, búsqueda y paginación del catálogo
 *   - ficha.js   → Inyección de datos ARCA en obras y nichos
 *
 * Cada módulo verifica internamente si el DOM relevante existe antes de actuar,
 * por lo que es seguro llamarlos en cualquier página.
 */

import { initUI } from './ui.js';
import { initCatalogo } from './catalogo.js';
import { initFicha } from './ficha.js';

document.addEventListener('DOMContentLoaded', () => {
  initUI();
  initCatalogo();
  initFicha();
});
