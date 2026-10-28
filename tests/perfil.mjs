export const PERFIL = {
  nombre: "Jose Peñarrieta",
  titulo: "Jose Peñarrieta · Página personal",
  titular: "Estudiante de DAW",
  usuarioGithub: "joseiverp",
  email: "14499483@alu.murciaeduca.es",
  minimoProyectos: 3,
  minimoHabilidades: 6,
  secciones: ["sobre-mi", "formacion", "habilidades", "contacto"],
  paleta: {
    "--color-primario": "#1D3557",
    "--color-secundario": "#426F8A",
    "--color-fondo": "#F8FAFC",
    "--color-texto": "#172033",
    "--color-acento": "#0F766E"
  },
  fuenteTitulos: "Georgia",
  fuenteTexto: "system-ui",
  puntoRuptura: "768px",
  modoOscuro: true,
  proyectos: [
    {
      titulo: "Granja de animales con CI/CD",
      descripcion: "Aplicación con Node.js y Express que muestra animales y sus sonidos, incluye una API y pruebas automatizadas. También incorpora un proceso de CI/CD y publicación mediante Docker.",
      tecnologias: ["JavaScript", "Node.js", "Express", "Docker", "GitHub Actions"],
      enlace: "https://github.com/joseiverp/practica_cicd"
    },
    {
      titulo: "PHP Words",
      descripcion: "Página estática interactiva para consultar y filtrar palabras reservadas de PHP con pequeñas explicaciones de su utilidad.",
      tecnologias: ["HTML", "CSS", "JavaScript"],
      enlace: "https://github.com/joseiverp/php-words"
    },
    {
      titulo: "Proyecto Intermodular",
      descripcion: "Proyecto en desarrollo para el IES Ramón Arcas Meca que incluye una web pública del centro y una intranet de gestión docente.",
      tecnologias: ["HTML", "CSS", "TypeScript", "PHP"],
      enlace: "https://github.com/DAW2ProyectoIntermodular/ProyectoIntermodular"
    }
  ]
};
