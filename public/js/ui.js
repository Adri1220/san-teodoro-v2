/**
 * @module ui.js
 * @description Responsable de toda la lógica de interfaz global:
 *   - Efecto de scroll en el header (clase --scrolled)
 *   - Scroll Spy: resalta el enlace de navegación activo
 */

/**
 * Inicializa el comportamiento del header al hacer scroll.
 * Añade/quita la clase `.header--scrolled` para el efecto glassmorphism comprimido.
 * @param {HTMLElement} header
 */
function initHeaderScroll(header) {
  if (!header) return;

  const SCROLL_THRESHOLD = 50;

  const onScroll = () => {
    header.classList.toggle('header--scrolled', window.scrollY > SCROLL_THRESHOLD);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/**
 * Inicializa el Scroll Spy usando IntersectionObserver.
 * Resalta el enlace `.nav__link` correspondiente a la sección visible.
 * @param {NodeList} secciones
 * @param {NodeList} enlacesMenu
 */
function initScrollSpy(secciones, enlacesMenu) {
  if (!secciones.length || !enlacesMenu.length) return;

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;

        const idVisible = entrada.target.getAttribute('id');
        enlacesMenu.forEach((enlace) => enlace.classList.remove('nav__link--active'));

        const enlaceActivo = document.querySelector(`.nav__link[href="#${idVisible}"]`);
        if (enlaceActivo) enlaceActivo.classList.add('nav__link--active');
      });
    },
    { rootMargin: '-20% 0px -60% 0px' }
  );

  secciones.forEach((seccion) => observador.observe(seccion));
}

/**
 * Punto de entrada del módulo UI.
 * Llama a todas las inicializaciones de interfaz global.
 */
export function initUI() {
  const header = document.querySelector('.header');
  const secciones = document.querySelectorAll('section[id]');
  const enlacesMenu = document.querySelectorAll('.nav__link');

  initHeaderScroll(header);
  initScrollSpy(secciones, enlacesMenu);
}
