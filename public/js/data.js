const obras = {
   "virgen-llorosa": {
      tipo: "escultura",
      titulo: "Virgen Llorosa",
      categoria: "ARQUITECTURA FUNERARIA",
      descripcion:
         "Estructura emblemática de estilo neoclásico en San Teodoro, destacada por sus detalles en mármol y su gran valor histórico para la región.",

      // --- DATOS BÁSICOS ---
      anio: "ca. 1880",
      autor: "Taller italiano de Génova",
      material: "Mármol de Carrara",
      ubicacion: "Cuartel San Teodoro - Sector Principal",
      conservacion: "CONSERVACIÓN: REGULAR · REQUIERE MANTENIMIENTO",

      // --- NUEVOS CAMPOS ARCA ---
      codigo: "CST-ESC-001",
      dimensiones: "2.10m alto x 1.50m ancho",
      estilo: "Neoclásico Republicano",
      caracteristicas: "Escultura de bulto redondo sobre pedestal escalonado.",
      imagen_plano: "img/historia/plano-ejemplo.jpg", // Foto del croquis que pide Mariana

      modelo3d:
         "https://sketchfab.com/models/c68bea66be5a405fb76e4771cf04b8c1/embed?autostart=1&ui_controls=1&ui_infos=0&ui_watermark=0",
      imagen: "img/estatua-1.jpg",
   },

   "angel-del-silencio": {
      tipo: "escultura", // <-- NUEVO
      titulo: "El Ángel del Silencio",
      categoria: "ARQUITECTURA FUNERARIA",
      descripcion:
         "Obra representativa de la paz y el duelo. Digitalizada en alta resolución para su estudio.",
      anio: "ca. 1905",
      material: "Bronce",
      autor: "Anónimo",
      conservacion: "CONSERVACIÓN: BUENO · INTERVENCIONES MENORES",
      modelo3d:
         "https://sketchfab.com/models/AQUI_VA_EL_OTRO_ID/embed?autostart=1&ui_controls=1&ui_infos=0&ui_watermark=0",
      imagen: "img/estatua-2.jpg", // <-- NUEVO
   },

   "tumba-frida-kahlo": {
      tipo: "nicho",
      titulo: "Tumba de Frida Kahlo",
      categoria: "NICHO HISTÓRICO",

      // --- DATOS BÁSICOS ---
      anio: "Siglo XIX",
      autor: "Anónimo",
      material: "Piedra caliza local y cedro tallado",
      ubicacion: "Cuartel San Teodoro - Sector B",
      conservacion: "CONSERVACIÓN: BUENO · INTERVENCIONES MENORES",

      // --- NUEVOS CAMPOS ARCA ---
      codigo: "CST-NIC-042",
      dimensiones: "0.80m alto x 0.60m ancho x 0.40m profundidad",
      estilo: "Ecléctico / Arte Popular",
      caracteristicas:
         "Nicho rectangular tipo altar con puertas de madera y relicario de hojalata repujada.",
      imagen_plano: "img/historia/plano-ejemplo.jpg", // Usa el nombre de la foto de plano que tengas

      // La descripción larguísima se mantiene igual:
      descripcion: `Lápida esculpida en piedra caliza local, un claro ejemplo de las técnicas de grabado importadas a la ciudad. El objeto reposa sobre un pedestal de madera... (texto largo omitido por brevedad, mantén tu texto actual aquí)`,

      imagen: "img/nicho1.webp",
   },

   "mausoleo-eguiguren": {
      tipo: "escultura",
      titulo: "Mausoleo Eguiguren",
      categoria: "ARQUITECTURA FUNERARIA",
      descripcion:
         "El Mausoleo Eguiguren constituye una de las piezas arquitectónicas más representativas del Cementerio San Teodoro. De composición neoclásica, su frontón triangular sostenido por columnas jónicas evidencia la influencia europea.",
      anio: "ca. 1880",
      material: "Mármol de Carrara y piedra caliza local",
      autor: "Atribuido a taller italiano de Génova",
      conservacion: "CONSERVACIÓN: BUENO · INTERVENCIONES MENORES",
      modelo3d:
         "https://sketchfab.com/models/c68bea66be5a405fb76e4771cf04b8c1/embed?autostart=1&ui_controls=1&ui_infos=0&ui_watermark=0",
      imagen: "img/estatua-3.jpg",
   },
};
