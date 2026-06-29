// Agregamos 'async' para poder usar promesas al consumir nuestra base de datos
document.addEventListener("astro:page-load", async () => {
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
   // 2. CONEXIÓN ASÍNCRONA A LA BASE DE DATOS PURA (FETCH API)
   // ==========================================================================
   let obras = {};
   try {
      const respuesta = await fetch("/data/obras.json");
      if (!respuesta.ok) throw new Error("Error HTTP al cargar JSON");
      obras = await respuesta.json(); // Parsea el JSON a un objeto manipulable
   } catch (error) {
      console.error(
         "Fallo crítico: No se pudo cargar la base de datos.",
         error,
      );
      return; // Detiene la ejecución para no lanzar errores en pantalla si el servidor falla
   }

   // ==========================================================================
   // 3. GENERADOR DE CATÁLOGO, FILTROS Y BUSCADOR
   // ==========================================================================
   const catalogGrid = document.querySelector(".catalog__grid");

   if (catalogGrid && Object.keys(obras).length > 0) {
      const obrasArray = Object.entries(obras);

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

      const renderizarCatalogo = () => {
         const obrasFiltradas = obrasArray.filter(([slug, datos]) => {
            // Lógica de Filtros Categóricos
            let coincideCategoria = false;
            if (filtroActual === "todos") coincideCategoria = true;
            else if (filtroActual === "escultura")
               coincideCategoria = datos.tipo === "escultura";
            else if (filtroActual === "sigloxix")
               coincideCategoria =
                  (datos.anio || "").toUpperCase().includes("XIX") ||
                  (datos.anio || "").includes("18");
            else if (filtroActual === "lapidas")
               coincideCategoria = (
                  (datos.descripcion || "") +
                  " " +
                  (datos.caracteristicas || "")
               )
                  .toLowerCase()
                  .includes("lápida");
            else if (filtroActual === "neoclasico") {
               const textoEstilo = (
                  (datos.estilo || "") +
                  " " +
                  (datos.descripcion || "")
               ).toLowerCase();
               coincideCategoria =
                  textoEstilo.includes("neoclásico") ||
                  textoEstilo.includes("neoclasico");
            } else coincideCategoria = datos.tipo === filtroActual;

            // Lógica de Buscador de Texto (Optimizada en una sola línea de evaluación)
            const termino = textoBusqueda.toLowerCase().trim();
            const textoPlano =
               `${datos.titulo} ${datos.autor} ${datos.material} ${datos.ubicacion}`.toLowerCase();
            const coincideTexto = textoPlano.includes(termino);

            return coincideCategoria && coincideTexto;
         });

         const totalPaginas = Math.ceil(
            obrasFiltradas.length / elementosPorPagina,
         );
         if (paginaActual > totalPaginas && totalPaginas > 0)
            paginaActual = totalPaginas;

         const indiceInicio = (paginaActual - 1) * elementosPorPagina;
         const obrasPagina = obrasFiltradas.slice(
            indiceInicio,
            indiceInicio + elementosPorPagina,
         );

         let tarjetasHTML = "";
         obrasPagina.forEach(([slug, datos]) => {
            // Astro necesita rutas relativas a la raíz, por eso agregamos "/" al inicio del enlace
            const enlaceBase = datos.tipo === "nicho" ? "nicho" : "obra";
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
                     <a href="/${enlaceBase}?id=${slug}" class="card__link">Conoce más →</a>
                  </div>
               </article>
            `;
         });

         catalogGrid.innerHTML =
            tarjetasHTML ||
            `<p style="grid-column: 1/-1; text-align:center; color: var(--color-text-muted); font-family: var(--font-sans); padding: 40px;">No se encontraron resultados para "${textoBusqueda}".</p>`;

         let paginacionHTML = "";
         if (totalPaginas > 1) {
            for (let i = 1; i <= totalPaginas; i++) {
               paginacionHTML += `<button class="page-btn ${i === paginaActual ? "page-btn--active" : ""}" data-page="${i}">${i}</button>`;
            }
         }
         paginationContainer.innerHTML = paginacionHTML;

         document.querySelectorAll(".page-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
               paginaActual = parseInt(e.target.getAttribute("data-page"));
               renderizarCatalogo();
               document
                  .querySelector("#catalogo-seccion")
                  ?.scrollIntoView({ behavior: "smooth" }) ||
                  document
                     .querySelector("#catalogo")
                     ?.scrollIntoView({ behavior: "smooth" });
            });
         });
      };

      renderizarCatalogo();

      const searchInput = document.getElementById("searchInput");
      if (searchInput) {
         searchInput.addEventListener("input", (e) => {
            textoBusqueda = e.target.value;
            paginaActual = 1;
            renderizarCatalogo();
         });
      }

      const filterBtns = document.querySelectorAll(".filter-btn");
      filterBtns.forEach((btn) => {
         btn.addEventListener("click", () => {
            filterBtns.forEach((b) => b.classList.remove("filter-btn--active"));
            btn.classList.add("filter-btn--active");
            filtroActual = btn.getAttribute("data-filter");
            paginaActual = 1;
            textoBusqueda = "";
            if (searchInput) searchInput.value = "";
            renderizarCatalogo();
         });
      });
   }

   // ==========================================================================
   // 4. INYECTOR DE PÁGINAS INTERNAS (Fichas Técnicas unificadas)
   // ==========================================================================
   const urlParams = new URLSearchParams(window.location.search);
   const id = urlParams.get("id");
   const pageContainer =
      document.querySelector(".artwork__container") ||
      document.querySelector(".narrative__container");

   if (pageContainer && id && obras[id]) {
      const datos = obras[id];
      const isObra = document.querySelector(".artwork__title") !== null;
      const isNicho = document.querySelector(".narrative__title") !== null;

      if (isObra || isNicho) {
         const titleSelector = isObra ? ".artwork__title" : ".narrative__title";
         const categorySelector = isObra
            ? ".artwork__category"
            : "#narrative-category";

         document.querySelector(titleSelector).innerText =
            datos.titulo || "Sin título";
         document.querySelector(categorySelector).innerText =
            datos.categoria || "";
         document.querySelector("#texto-resena").innerHTML =
            `<p>${datos.descripcion || "Información en proceso de investigación."}</p>`;

         if (datos.conservacion)
            document.querySelector(".artwork__status").innerHTML =
               `<span class="status-dot"></span> ${datos.conservacion}`;

         // Inyección ARCA Universal para ambos tipos
         const camposARCA = [
            "anio",
            "material",
            "autor",
            "ubicacion",
            "codigo",
            "dimensiones",
            "estilo",
            "caracteristicas",
         ];
         camposARCA.forEach((campo) => {
            const el = document.getElementById(`meta-${campo}`);
            if (el) el.innerText = datos[campo] || "-";
         });

         // Inyección específica por tipo visual
         if (isObra && datos.modelo3d) {
            document.getElementById("visor3d-container").innerHTML = `
               <iframe title="Modelo 3D de ${datos.titulo}" frameborder="0" allow="autoplay; fullscreen; xr-spatial-tracking; gyroscope; accelerometer" style="width: 100%; aspect-ratio: 4/3; border: 1px solid var(--color-border-marble);" src="${datos.modelo3d}"></iframe>
               <span class="artwork__media-caption" style="display:block; margin-top:8px;">MODELO FOTOGRAMÉTRICO INTERACTIVO · ARRASTRA PARA ROTAR</span>
            `;
         } else if (isNicho && datos.imagen) {
            document.getElementById("narrative-img-container").innerHTML =
               `<img src="${datos.imagen}" alt="Fotografía de ${datos.titulo}" class="narrative__img">`;
         }

         if (datos.imagen_plano) {
            const mapaContainer = document.getElementById("mapa-container");
            document.getElementById("imagen-mapa").src = datos.imagen_plano;
            mapaContainer.style.display = "block";
         }
      }
      document.title = `${datos.titulo} - Archivo San Teodoro`;
   } else if (pageContainer) {
      // Pantalla de estado nulo (Error 404 visual)
      pageContainer.innerHTML = `
         <div style="text-align: center; padding: 100px 20px; display: flex; flex-direction: column; align-items: center; gap: 24px;">
            <h1 style="font-family: var(--font-serif); font-size: 48px; color: var(--color-text-main);">Registro no encontrado</h1>
            <p style="font-family: var(--font-sans); font-size: 16px; color: var(--color-text-muted); max-width: 500px; line-height: 1.6;">Lo sentimos, la obra que intentas visualizar no existe en la base de datos o el enlace fue modificado.</p>
            <a href="/catalogo" class="btn btn--primary" style="margin-top: 16px;">Volver al Catálogo 3D</a>
         </div>
      `;
   }
});
