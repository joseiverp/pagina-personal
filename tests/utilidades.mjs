import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const raizProyecto = path.resolve(__dirname, "..");
const directorioSite = path.resolve(raizProyecto, "site");

/**
 * Lee el contenido UTF-8 de un fichero situado dentro de site/.
 * @param {string} rutaRelativaSite Ruta relativa al directorio site/
 * @returns {string} Contenido del fichero
 */
export function leerFicheroSite(rutaRelativaSite) {
  const rutaCompleta = path.resolve(directorioSite, rutaRelativaSite);
  return fs.readFileSync(rutaCompleta, "utf8");
}

/**
 * Extrae los valores de un atributo dado para todas las apariciones de una etiqueta HTML.
 * @param {string} html Contenido HTML
 * @param {string} etiqueta Nombre de la etiqueta HTML (ej. "img", "a", "meta")
 * @param {string} atributo Nombre del atributo a extraer (ej. "src", "href", "alt")
 * @returns {string[]} Lista de valores encontrados
 */
export function extraerAtributos(html, etiqueta, atributo) {
  const valores = [];
  const regex = new RegExp(`<${etiqueta}\\b[^>]*?\\b${atributo}=["']([^"']*)["'][^>]*>`, "gi");
  let coincidencia;
  while ((coincidencia = regex.exec(html)) !== null) {
    valores.push(coincidencia[1]);
  }
  return valores;
}

/**
 * Comprueba si existe el fichero de destino para un enlace relativo dado desde un fichero HTML de origen.
 * Excluye enlaces externos (http/https), mailto, tel y anclas locales (#).
 * @param {string} enlace Valor del href del enlace
 * @param {string} ficheroOrigen Ruta relativa dentro de site/ del fichero que contiene el enlace
 * @returns {boolean} True si el fichero existe o si el enlace está excluido de comprobación
 */
export function existeDestinoEnlace(enlace, ficheroOrigen) {
  if (!enlace) return false;
  if (/^(https?:|mailto:|tel:|javascript:)/i.test(enlace)) return true;
  if (enlace.startsWith("#")) return true;

  const rutaLimpia = enlace.split("#")[0].split("?")[0];
  if (rutaLimpia === "") return true;

  const dirOrigen = path.dirname(path.resolve(directorioSite, ficheroOrigen));
  const rutaDestino = path.resolve(dirOrigen, rutaLimpia);

  return fs.existsSync(rutaDestino);
}
