import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const raizProyecto = path.resolve(__dirname, "..");

test("Estructura de ficheros obligatorios del proyecto", () => {
  const ficherosSite = [
    "site/index.html",
    "site/proyectos.html",
    "site/css/estilos.css",
    "site/js/main.js",
    "site/img/avatar.svg"
  ];

  for (const fichero of ficherosSite) {
    const rutaFichero = path.resolve(raizProyecto, fichero);
    assert.ok(
      fs.existsSync(rutaFichero),
      `Falta el fichero obligatorio en site/: ${fichero}`
    );
  }

  const rutaWorkflow = path.resolve(raizProyecto, ".github/workflows/pages.yml");
  assert.ok(
    fs.existsSync(rutaWorkflow),
    "Falta el fichero de workflow obligatorio en .github/workflows/pages.yml"
  );
});

test(".gitignore excluye node_modules", () => {
  const rutaGitignore = path.resolve(raizProyecto, ".gitignore");
  assert.ok(fs.existsSync(rutaGitignore), "Falta el fichero .gitignore en la raíz");

  const contenido = fs.readFileSync(rutaGitignore, "utf8");
  const lineas = contenido.split(/\r?\n/).map(l => l.trim());
  const excluyeNodeModules = lineas.some(l => l === "node_modules" || l === "node_modules/");

  assert.ok(
    excluyeNodeModules,
    "El fichero .gitignore debe excluir 'node_modules' o 'node_modules/'"
  );
});
