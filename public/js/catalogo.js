/**
 * @module catalogo.js
 * @description Responsable de toda la lógica del catálogo de obras:
 *   - Carga asíncrona de `obras.json` (única fuente de datos)
 *   - Motor de filtros por categoría y búsqueda por texto
 *   - Paginación del listado
 *   - Renderizado de tarjetas con animación de entrada
 */

const ELEMENTOS_POR_PAGINA = 6;
const API_URL = '/data/obras.json';

/**
 * Obtiene las obras que coinciden con el filtro de categoría y texto de búsqueda.
 * @param {Array} obrasArray - Array de [slug, datos] de todas las obras
 * @param {string} filtroActual - El valor del filtro activo (ej. "todos", "escultura")
 * @param {string} textoBusqueda - El texto ingresado en el buscador
 * @returns {Array} Lista de obras filtradas
 */
function filtrarObras(obrasArray, filtroActual, textoBusqueda) {
  const termino = textoBusqueda.toLowerCase().trim();

  return obrasArray.filter(([, datos]) => {
    const coincideCategoria = evaluarFiltroCategoria(datos, filtroActual);
    const textoPlano = `${datos.titulo} ${datos.autor} ${datos.material} ${datos.ubicacion}`.toLowerCase();
    const coincideTexto = !termino || textoPlano.includes(termino);
    return coincideCategoria && coincideTexto;
  });
}

/**
 * Evalúa si una obra coincide con el filtro de categoría activo.
 * @param {Object} datos - Los datos de una obra individual
 * @param {string} filtro - El filtro activo
 * @returns {boolean}
 */
function evaluarFiltroCategoria(datos, filtro) {
  if (filtro === 'todos') return true;
  if (filtro === 'escultura') return datos.tipo === 'escultura';
  if (filtro === 'nicho') return datos.tipo === 'nicho';
  if (filtro === 'sigloxix') {
    return (
      (datos.anio || '').toUpperCase().includes('XIX') ||
      (datos.anio || '').includes('18')
    );
  }
  if (filtro === 'lapidas') {
    return ((datos.descripcion || '') + ' ' + (datos.caracteristicas || ''))
      .toLowerCase()
      .includes('lápida');
  }
  if (filtro === 'neoclasico') {
    const texto = ((datos.estilo || '') + ' ' + (datos.descripcion || '')).toLowerCase();
    return texto.includes('neoclásico') || texto.includes('neoclasico');
  }
  return datos.tipo === filtro;
}

/**
 * Genera el HTML de una tarjeta de obra individual.
 * @param {string} slug - El identificador único de la obra
 * @param {Object} datos - Los datos de la obra
 * @param {number} index - Índice para escalonar la animación de entrada
 * @returns {string} HTML de la tarjeta
 */
function crearTarjetaHTML(slug, datos, index) {
  const enlaceBase = datos.tipo === 'nicho' ? 'nicho' : 'obra';
  const categoriaVisual = datos.tipo === 'nicho' ? 'NICHO HISTÓRICO' : 'ARQUITECTURA FUNERARIA';
  const descripcionCorta = (datos.descripcion || '').substring(0, 120);

  return `
    <article class="card card--entering" style="animation-delay: ${index * 80}ms;" data-category="${datos.tipo}">
      <div class="card__image-wrapper">
        <img src="${datos.imagen}" alt="${datos.titulo}" class="card__img" loading="lazy" />
      </div>
      <div class="card__content">
        <span class="card__category">${categoriaVisual}</span>
        <h3 class="card__name">${datos.titulo}</h3>
        <p class="card__description">${descripcionCorta}...</p>
        <a href="/${enlaceBase}?id=${slug}" class="card__link">Conoce más →</a>
      </div>
    </article>
  `;
}

/**
 * Genera el HTML de los botones de paginación.
 * @param {number} totalPaginas
 * @param {number} paginaActual
 * @returns {string} HTML de los botones
 */
function crearPaginacionHTML(totalPaginas, paginaActual) {
  if (totalPaginas <= 1) return '';
  return Array.from({ length: totalPaginas }, (_, i) => {
    const num = i + 1;
    const activeClass = num === paginaActual ? 'page-btn--active' : '';
    return `<button class="page-btn ${activeClass}" data-page="${num}" aria-label="Ir a página ${num}">${num}</button>`;
  }).join('');
}

/**
 * Inicializa el catálogo completo: carga datos, monta filtros, búsqueda y paginación.
 * Solo actúa si `.catalog__grid` existe en el DOM.
 * @param {Object} obras - El objeto completo de obras.json
 */
function montarCatalogo(obras) {
  const catalogGrid = document.querySelector('.catalog__grid');
  if (!catalogGrid || Object.keys(obras).length === 0) return;

  const obrasArray = Object.entries(obras);
  let filtroActual = 'todos';
  let textoBusqueda = '';
  let paginaActual = 1;

  // Crear y posicionar el contenedor de paginación
  const paginationContainer = document.createElement('div');
  paginationContainer.classList.add('catalog__pagination');
  catalogGrid.parentNode.insertBefore(paginationContainer, catalogGrid.nextSibling);

  /** Renderiza el catálogo con el estado actual de filtros y página */
  const renderizar = () => {
    const obrasFiltradas = filtrarObras(obrasArray, filtroActual, textoBusqueda);
    const totalPaginas = Math.ceil(obrasFiltradas.length / ELEMENTOS_POR_PAGINA);

    // Ajustar página si el filtro redujo el total
    if (paginaActual > totalPaginas && totalPaginas > 0) paginaActual = totalPaginas;

    const indiceInicio = (paginaActual - 1) * ELEMENTOS_POR_PAGINA;
    const obrasPagina = obrasFiltradas.slice(indiceInicio, indiceInicio + ELEMENTOS_POR_PAGINA);

    // Renderizar tarjetas o mensaje vacío
    catalogGrid.innerHTML = obrasPagina.length
      ? obrasPagina.map(([slug, datos], i) => crearTarjetaHTML(slug, datos, i)).join('')
      : `<p class="catalog__empty">No se encontraron resultados.</p>`;

    // Renderizar paginación y adjuntar eventos
    paginationContainer.innerHTML = crearPaginacionHTML(totalPaginas, paginaActual);
    paginationContainer.querySelectorAll('.page-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        paginaActual = parseInt(e.currentTarget.getAttribute('data-page'), 10);
        renderizar();
        document.querySelector('#catalogo-seccion')?.scrollIntoView({ behavior: 'smooth' });
      });
    });
  };

  // Renderizado inicial
  renderizar();

  // Evento de búsqueda por texto
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      textoBusqueda = e.target.value;
      paginaActual = 1;
      renderizar();
    });
  }

  // Eventos de los botones de filtro
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');
      filtroActual = btn.getAttribute('data-filter');
      paginaActual = 1;
      textoBusqueda = '';
      if (searchInput) searchInput.value = '';
      renderizar();
    });
  });
}

/**
 * Punto de entrada del módulo Catálogo.
 * Realiza el fetch a obras.json e inicializa el catálogo.
 */
export async function initCatalogo() {
  // Solo ejecutar si hay un grid de catálogo en la página
  if (!document.querySelector('.catalog__grid')) return;

  try {
    const respuesta = await fetch(API_URL);
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
    const obras = await respuesta.json();
    montarCatalogo(obras);
  } catch (error) {
    console.error('[Catálogo] Error al cargar obras.json:', error);
    const grid = document.querySelector('.catalog__grid');
    if (grid) {
      grid.innerHTML = `<p class="catalog__empty">Error al cargar el catálogo. Por favor, recarga la página.</p>`;
    }
  }
}
