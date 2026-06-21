document.addEventListener("DOMContentLoaded", () => {
   // ==========================================================================
   // 1. HEADER MÁGICO Y SCROLL SPY
   // ==========================================================================
   const header = document.querySelector(".header");
   const secciones = document.querySelectorAll("section[id]");
   const enlacesMenu = document.querySelectorAll(".nav__link");

   window.addEventListener("scroll", () => {
      window.scrollY > 50
         ? header.classList.add("header--scrolled")
         : header.classList.remove("header--scrolled");
   });

   const observadorDeSecciones = new IntersectionObserver(
      (entradas) => {
         entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
               const idVisible = entrada.target.getAttribute("id");
               enlacesMenu.forEach((enlace) =>
                  enlace.classList.remove("nav__link--active"),
               );
               const enlaceActivo = document.querySelector(
                  `.nav__link[href="#${idVisible}"]`,
               );
               if (enlaceActivo)
                  enlaceActivo.classList.add("nav__link--active");
            }
         });
      },
      { rootMargin: "-20% 0px -60% 0px" },
   );

   secciones.forEach((seccion) => observadorDeSecciones.observe(seccion));

   // ==========================================================================
   // 2 & 3. GENERADOR DE CATÁLOGO, FILTROS Y BUSCADOR
   // ==========================================================================
   const catalogGrid = document.querySelector(".catalog__grid");

   if (catalogGrid && typeof obras !== "undefined") {
      const obrasArray = Object.entries(obras);

      // Estado de la aplicación
      let filtroActual = "todos";
      let textoBusqueda = "";
      let paginaActual = 1;
      const elementosPorPagina = 6;

      const paginationContainer = document.createElement("div");
      paginationContainer.classList.add("catalog__pagination");
      catalogGrid.parentNode.insertBefore(
         paginationContainer,
         catalogGrid.nextSibling,
      );

      // Función Maestra de Renderizado
      const renderizarCatalogo = () => {
         // 1. Filtrar por Botón Y por Texto
         const obrasFiltradas = obrasArray.filter(([slug, datos]) => {
            // A. Filtro de botones
            const coincideCategoria =
               filtroActual === "todos" || datos.tipo === filtroActual;

            // B. Filtro de buscador (Restringido solo a Metadatos Clave)
            const termino = textoBusqueda.toLowerCase().trim();

            // Extraemos solo los datos principales, ignorando la "descripcion"
            const titulo = (datos.titulo || "").toLowerCase();
            const autor = (datos.autor || "").toLowerCase();
            const material = (datos.material || "").toLowerCase();
            const ubicacion = (datos.ubicacion || "").toLowerCase(); // Añadimos ubicación para los nichos

            // El algoritmo ya no busca en la descripción
            const coincideTexto =
               titulo.includes(termino) ||
               autor.includes(termino) ||
               material.includes(termino) ||
               ubicacion.includes(termino);

            return coincideCategoria && coincideTexto;
         });

         // 2. Calcular Paginación
         const totalPaginas = Math.ceil(
            obrasFiltradas.length / elementosPorPagina,
         );
         if (paginaActual > totalPaginas && totalPaginas > 0)
            paginaActual = totalPaginas;

         // 3. Slicing Matemático
         const indiceInicio = (paginaActual - 1) * elementosPorPagina;
         const indiceFin = indiceInicio + elementosPorPagina;
         const obrasPagina = obrasFiltradas.slice(indiceInicio, indiceFin);

         // 4. Dibujar Tarjetas
         let tarjetasHTML = "";
         obrasPagina.forEach(([slug, datos]) => {
            const enlaceBase =
               datos.tipo === "nicho" ? "nicho.html" : "obra.html";
            const categoriaVisual =
               datos.tipo === "nicho"
                  ? "NICHO HISTÓRICO"
                  : "ARQUITECTURA FUNERARIA";

            tarjetasHTML += `
               <article class="card" data-category="${datos.tipo}">
                  <div class="card__image-wrapper">
                     <img src="${datos.imagen}" alt="${datos.titulo}" class="card__img" loading="lazy" />
                  </div>
                  <div class="card__content">
                     <span class="card__category">${categoriaVisual}</span>
                     <h3 class="card__name">${datos.titulo}</h3>
                     <p class="card__description">${datos.descripcion.substring(0, 120)}...</p>
                     <a href="${enlaceBase}?id=${slug}" class="card__link">Conoce más →</a>
                  </div>
               </article>
            `;
         });

         // Si no hay resultados, mostramos el mensaje de error elegante
         catalogGrid.innerHTML =
            tarjetasHTML ||
            `<p style="grid-column: 1/-1; text-align:center; color: var(--color-text-muted); font-family: var(--font-sans); padding: 40px;">No se encontraron resultados para "${textoBusqueda}".</p>`;

         // 5. Dibujar Botones Numéricos
         let paginacionHTML = "";
         if (totalPaginas > 1) {
            for (let i = 1; i <= totalPaginas; i++) {
               paginacionHTML += `<button class="page-btn ${i === paginaActual ? "page-btn--active" : ""}" data-page="${i}">${i}</button>`;
            }
         }
         paginationContainer.innerHTML = paginacionHTML;

         // 6. Asignar interactividad a la paginación
         document.querySelectorAll(".page-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
               paginaActual = parseInt(e.target.getAttribute("data-page"));
               renderizarCatalogo();
               document
                  .querySelector("#catalogo")
                  .scrollIntoView({ behavior: "smooth" });
            });
         });
      };

      // Inicialización por primera vez
      renderizarCatalogo();

      // =====================================================
      // CONTROLADORES DE EVENTOS (Listeners)
      // =====================================================

      // A. Controlador del Buscador de Texto
      const searchInput = document.getElementById("searchInput");
      if (searchInput) {
         searchInput.addEventListener("input", (e) => {
            textoBusqueda = e.target.value;
            paginaActual = 1;
            renderizarCatalogo();
         });
      }

      // B. Controladores de los Botones de Filtro
      const filterBtns = document.querySelectorAll(".filter-btn");
      filterBtns.forEach((btn) => {
         btn.addEventListener("click", () => {
            filterBtns.forEach((b) => b.classList.remove("filter-btn--active"));
            btn.classList.add("filter-btn--active");

            filtroActual = btn.getAttribute("data-filter");
            paginaActual = 1;
            textoBusqueda = ""; // Limpiamos el buscador al cambiar de categoría
            if (searchInput) searchInput.value = "";

            renderizarCatalogo();
         });
      });
   }

   // ==========================================================================
   // 4. INYECTOR DE PÁGINAS INTERNAS (obra.html y nicho.html)
   // ==========================================================================
   const urlParams = new URLSearchParams(window.location.search);
   const id = urlParams.get("id");

   const pageContainer =
      document.querySelector(".artwork__container") ||
      document.querySelector(".narrative__container");

   if (pageContainer) {
      if (id && typeof obras !== "undefined" && obras[id]) {
         const datos = obras[id];

         if (document.querySelector(".artwork__title")) {
            document.querySelector(".artwork__title").innerText = datos.titulo;
            document.querySelector(".artwork__category").innerText =
               datos.categoria;
            document.querySelector(".artwork__description p").innerHTML =
               datos.descripcion;

            if (datos.conservacion) {
               document.querySelector(".artwork__status").innerHTML =
                  `<span class="status-dot"></span> ${datos.conservacion}`;
            }

            const metaValues = document.querySelectorAll(".meta-value");
            if (metaValues.length >= 3) {
               metaValues[0].innerText = datos.anio;
               metaValues[1].innerText = datos.material;
               metaValues[2].innerText = datos.autor;
            }

            if (datos.modelo3d) {
               document.querySelector(".artwork__media").innerHTML = `
                  <iframe title="Modelo 3D de ${datos.titulo}" frameborder="0" allow="autoplay; fullscreen; xr-spatial-tracking; gyroscope; accelerometer" style="width: 100%; aspect-ratio: 4/3; border: 1px solid var(--color-border-marble);" src="${datos.modelo3d}"></iframe>
                  <span class="artwork__media-caption">MODELO FOTOGRAMÉTRICO INTERACTIVO · ARRASTRA PARA ROTAR</span>
               `;
            }
         }

         if (document.querySelector(".narrative__title")) {
            document.querySelector(".narrative__title").innerText =
               datos.titulo;
            document.querySelector(".narrative__subtitle").innerText =
               datos.subtitulo;
            document.querySelector(".narrative__story").innerHTML =
               `<p>${datos.descripcion}</p>`;

            document.querySelector(".narrative__brief").innerHTML = `
               <p><strong>Ubicación:</strong> ${datos.ubicacion}</p>
               <p><strong>Material:</strong> ${datos.material}</p>
            `;

            if (datos.imagen) {
               document.querySelector(".narrative__media").innerHTML =
                  `<img src="${datos.imagen}" alt="Fotografía de ${datos.titulo}" class="narrative__img">`;
            }
         }

         document.title = `${datos.titulo} - Archivo San Teodoro`;
      } else {
         pageContainer.innerHTML = `
            <div style="text-align: center; padding: 100px 20px; display: flex; flex-direction: column; align-items: center; gap: 24px;">
               <h1 style="font-family: var(--font-serif); font-size: 48px; color: var(--color-text-main);">Registro no encontrado</h1>
               <p style="font-family: var(--font-sans); font-size: 16px; color: var(--color-text-muted); max-width: 500px; line-height: 1.6;">
                  Lo sentimos, la obra o nicho que intentas visualizar no existe en la base de datos actual o el enlace fue modificado.
               </p>
               <a href="index.html#catalogo" class="btn btn--primary" style="margin-top: 16px;">Volver al Catálogo 3D</a>
            </div>
         `;
         document.title = "No encontrado - Archivo San Teodoro";
      }
   }
});
