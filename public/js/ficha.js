/**
 * @module ficha.js
 * @description Responsable de la inyección de datos ARCA en las páginas de detalle:
 *   - `obra.astro` — Ficha técnica de escultura/mausoleo
 *   - `nicho.astro` — Ficha narrativa de nicho histórico
 *   - Monta el spinner/loader elegante para los iframes 3D de Sketchfab
 */

const API_URL = '/data/obras.json';

/** Campos del estándar ARCA a inyectar en los elementos `#meta-*` */
const CAMPOS_ARCA = ['anio', 'material', 'autor', 'ubicacion', 'codigo', 'dimensiones', 'estilo', 'caracteristicas'];

/**
 * Construye el HTML del visor 3D de Sketchfab con spinner de carga.
 * El loader desaparece y el iframe hace fade-in cuando termina de cargar.
 * @param {string} modeloUrl - URL del embed de Sketchfab
 * @param {string} titulo - Título de la obra para el atributo `title` del iframe
 * @returns {string} HTML completo del visor
 */
function crearVisor3DHTML(modeloUrl, titulo) {
  return `
    <div class="visor3d-wrapper">
      <div class="visor3d-loader" id="loader-3d" aria-label="Cargando modelo 3D" role="status">
        <div class="visor3d-spinner"></div>
        <span class="visor3d-loader__text">Cargando modelo...</span>
      </div>
      <iframe
        title="Modelo 3D de ${titulo}"
        class="visor3d-iframe"
        frameborder="0"
        allow="autoplay; fullscreen; xr-spatial-tracking; gyroscope; accelerometer"
        src="${modeloUrl}"
        onload="
          const loader = document.getElementById('loader-3d');
          if (loader) loader.style.display = 'none';
          this.style.opacity = '1';
        "
      ></iframe>
    </div>
    <span class="artwork__media-caption">MODELO FOTOGRAMÉTRICO INTERACTIVO · ARRASTRA PARA ROTAR</span>
  `;
}

/**
 * Inyecta los metadatos ARCA en los elementos del DOM.
 * @param {Object} datos - Datos de la obra desde obras.json
 */
function inyectarCamposARCA(datos) {
  CAMPOS_ARCA.forEach((campo) => {
    const el = document.getElementById(`meta-${campo}`);
    if (el) el.innerText = datos[campo] || '—';
  });
}

/**
 * Inyecta todos los datos en una página de tipo `obra.astro`.
 * @param {Object} datos - Datos de la obra desde obras.json
 */
function inyectarEnObra(datos) {
  const titulo = document.querySelector('.artwork__title');
  const categoria = document.querySelector('.artwork__category');
  const estado = document.querySelector('.artwork__status');
  const resena = document.getElementById('texto-resena');

  if (titulo) titulo.innerText = datos.titulo || 'Sin título';
  if (categoria) categoria.innerText = datos.categoria || '';
  if (estado && datos.conservacion) {
    estado.innerHTML = `<span class="status-dot"></span> ${datos.conservacion}`;
  }
  if (resena) {
    resena.innerHTML = `<p>${datos.descripcion || 'Información en proceso de investigación.'}</p>`;
  }

  inyectarCamposARCA(datos);

  // Visor 3D de Sketchfab con spinner
  const visorContainer = document.getElementById('visor3d-container');
  if (visorContainer && datos.modelo3d) {
    visorContainer.innerHTML = crearVisor3DHTML(datos.modelo3d, datos.titulo);
  }

  // Plano de ubicación (si existe)
  if (datos.imagen_plano) {
    const mapaContainer = document.getElementById('mapa-container');
    const imagenMapa = document.getElementById('imagen-mapa');
    if (imagenMapa && mapaContainer) {
      imagenMapa.src = datos.imagen_plano;
      imagenMapa.alt = `Plano de ubicación de ${datos.titulo}`;
      mapaContainer.style.display = 'block';
    }
  }
}

/**
 * Inyecta todos los datos en una página de tipo `nicho.astro`.
 * @param {Object} datos - Datos del nicho desde obras.json
 */
function inyectarEnNicho(datos) {
  const titulo = document.querySelector('.narrative__title');
  const categoria = document.getElementById('narrative-category');
  const estado = document.querySelector('.artwork__status');
  const resena = document.getElementById('texto-resena');

  if (titulo) titulo.innerText = datos.titulo || 'Sin título';
  if (categoria) categoria.innerText = datos.categoria || '';
  if (estado && datos.conservacion) {
    estado.innerHTML = `<span class="status-dot"></span> ${datos.conservacion}`;
  }
  if (resena) {
    resena.innerHTML = `<p>${datos.descripcion || 'Información en proceso de investigación.'}</p>`;
  }

  inyectarCamposARCA(datos);

  // Imagen principal del nicho
  const imgContainer = document.getElementById('narrative-img-container');
  if (imgContainer && datos.imagen) {
    imgContainer.innerHTML = `<img src="${datos.imagen}" alt="Fotografía de ${datos.titulo}" class="narrative__img" />`;
  }

  // Plano de ubicación (si existe)
  if (datos.imagen_plano) {
    const mapaContainer = document.getElementById('mapa-container');
    const imagenMapa = document.getElementById('imagen-mapa');
    if (imagenMapa && mapaContainer) {
      imagenMapa.src = datos.imagen_plano;
      imagenMapa.alt = `Plano de ubicación de ${datos.titulo}`;
      mapaContainer.style.display = 'block';
    }
  }
}

/**
 * Renderiza el estado de "Registro no encontrado" en el contenedor principal.
 * @param {HTMLElement} container - El contenedor principal de la página
 */
function mostrarRegistroNoEncontrado(container) {
  container.innerHTML = `
    <div class="ficha-not-found">
      <h1 class="ficha-not-found__title">Registro no encontrado</h1>
      <p class="ficha-not-found__text">
        Lo sentimos, la obra que intentas visualizar no existe en la base de datos.
      </p>
      <a href="/colecciones" class="btn btn--primary">Volver a Colecciones</a>
    </div>
  `;
}

/**
 * Punto de entrada del módulo Ficha.
 * Solo actúa si se encuentra un contenedor de ficha en el DOM.
 */
export async function initFicha() {
  const pageContainer =
    document.querySelector('.artwork__container') ||
    document.querySelector('.narrative__container');

  if (!pageContainer) return;

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  try {
    const respuesta = await fetch(API_URL);
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
    const obras = await respuesta.json();

    if (id && obras[id]) {
      const datos = obras[id];
      const esObra = document.querySelector('.artwork__title') !== null;
      const esNicho = document.querySelector('.narrative__title') !== null;

      if (esObra) inyectarEnObra(datos);
      else if (esNicho) inyectarEnNicho(datos);

      // Actualiza el título de la pestaña del navegador
      document.title = `${datos.titulo} — Archivo San Teodoro`;
    } else {
      mostrarRegistroNoEncontrado(pageContainer);
    }
  } catch (error) {
    console.error('[Ficha] Error al cargar obras.json:', error);
    mostrarRegistroNoEncontrado(pageContainer);
  }
}
