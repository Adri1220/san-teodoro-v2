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
      tipo: "nicho", // <-- NUEVO
      titulo: "Tumba de Frida Kahlo",
      subtitulo: "Nicho histórico del siglo XIX.",
      descripcion: `Lápida esculpida en piedra caliza local, un claro ejemplo de las técnicas de grabado importadas a la ciudad</p><p>
         Lorem ipsum, dolor sit amet consectetur adipisicing elit. Qui magni quas alias esse officia 
         consectetur voluptatibus deleniti modi.lorem El objeto reposa sobre un pedestal de madera de 
         mezquite oscurecida por el paso de las décadas, una estructura tipo nicho cuya arquitectura evoca 
         la rigidez de los altares virreinales fundida con la exuberancia orgánica del México prehispánico. 
         El cuerpo del nicho está compuesto por cedro tallado que emite un tenue aroma a resina antigua, recubierto 
         parcialmente por placas de hojalata oxidada y latón repujado que, al contacto con la luz, generan destellos 
         irregulares sobre las paredes circundantes. En la parte superior, una corona de corazones de metal martillado 
         se entrelaza con una red de flores de filigrana, mientras que los laterales están flanqueados por columnas 
         salomónicas cuyos capiteles sostienen pequeñas aves de madera policromada, cuyas alas parecen suspendidas en 
         pleno aleteo perpetuo. Al interior del nicho, la figura de Frida Kahlo emerge en un relieve de tridimensionalidad 
         hipnótica. Su rostro ha sido esculpido con tal maestría que la anatomía de sus pómulos y la tensión de sus mandíbulas 
         transmiten una vitalidad inquietante, como si la materia inerte estuviera conteniendo un suspiro. Sus ojos, 
         ejecutados con una técnica de óleo sobre gesso que utiliza capas de barniz para dotarlos de una humedad realista, 
         escrutan el entorno con una fijeza que parece alterarse según la posición del observador. Viste un huipil cuya 
         textura ha sido lograda mediante el tallado minucioso de vetas que imitan el bordado tradicional, pintado en tonos 
         de añil, escarlata y amarillo cadmio, colores que mantienen una intensidad cromática desafiante para su antigüedad. 
         El espacio que rodea a la figura está densamente poblado por una iconografía personal. En su hombro izquierdo, 
         un mono araña de pelaje finamente cincelado mantiene una garra posada sobre el escote de la túnica, mientras 
         que en la base, un xoloitzcuintle descansa en posición de vigilia sobre una paleta de pintor que parece manchada 
         con pigmentos reales, frescos y brillantes. El fondo del nicho es un abismo de azul profundo, salpicado por 
         minúsculas estrellas de plata que, al ser examinadas de cerca, revelan ser pequeñas incrustaciones de mica natural. 
         La base del nicho se encuentra atestada de ofrendas en miniatura: pequeñas figuras de barro que representan corazones exvotos, 
         pequeñas calaveras de azúcar que no se descomponen y diminutos pinceles dispuestos en un tarro de cerámica vidriada,
         todo dispuesto con la precisión geométrica de un altar destinado a la persistencia eterna.En el dintel inferior, 
         integrado en la propia madera, aparece la leyenda "VIVA LA VIDA" tallada en letras de relieve irregular, con la 
         pintura dorada descascarada en los bordes. La pieza completa no presenta signos de desgaste por manipulación, 
         sino una pátina uniforme de polvo fino y cera de vela que cubre las esquinas, sugiriendo que el nicho ha permanecido en un estado de reposo absoluto durante largo tiempo. Es un repositorio de recuerdos materiales, una estructura donde la frontera entre la efigie y el espíritu de la pintora se desdibuja, creando una sensación persistente de que la figura central, a pesar de su condición de madera, pintura y metal, sigue habitando el espacio con una consciencia oculta, esperando que el observador se retire para retomar sus pinceles y continuar su obra inacabada.`,
      ubicacion: "Cuartel San Teodoro",
      material: "Piedra caliza local",
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
