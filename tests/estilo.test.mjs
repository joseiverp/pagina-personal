import test from "node:test";
import assert from "node:assert/strict";
import { PERFIL } from "./perfil.mjs";
import { leerFicheroSite } from "./utilidades.mjs";

test("Comprobaciones de variables y diseño en estilos.css", () => {
  const css = leerFicheroSite("css/estilos.css");

  const matchRoot = css.match(/:root\s*\{([^}]*)\}/i);
  assert.ok(matchRoot, "Falta el bloque :root en estilos.css");
  const bloqueRoot = matchRoot[1];

  for (const [variable, valor] of Object.entries(PERFIL.paleta)) {
    const regexVar = new RegExp(`${variable}\\s*:\\s*${valor}`, "i");
    assert.ok(
      regexVar.test(bloqueRoot),
      `En :root falta definir la variable ${variable} con el valor exacto ${valor}`
    );
  }

  const cssSinRoot = css.replace(/:root\s*\{[^}]*\}/gi, "");
  for (const [variable, valor] of Object.entries(PERFIL.paleta)) {
    const valorLimpio = valor.replace("#", "");
    const regexHex = new RegExp(`#${valorLimpio}\\b`, "i");
    assert.ok(
      !regexHex.test(cssSinRoot),
      `El valor hexadecimal ${valor} de la paleta no debe repetirse fuera de :root (variable: ${variable})`
    );
  }

  assert.ok(
    /var\(--color-primario\)/.test(css),
    "Se debe utilizar 'var(--color-primario)' en las reglas CSS"
  );

  assert.ok(
    css.includes(PERFIL.fuenteTitulos),
    `Falta la tipografía para títulos '${PERFIL.fuenteTitulos}' en estilos.css`
  );

  assert.ok(
    css.includes(PERFIL.fuenteTexto),
    `Falta la tipografía para texto '${PERFIL.fuenteTexto}' en estilos.css`
  );

  const regexMediaPuntoRuptura = new RegExp(`@media\\s*\\([^)]*max-width\\s*:\\s*${PERFIL.puntoRuptura}[^)]*\\)`, "i");
  assert.ok(
    regexMediaPuntoRuptura.test(css),
    `Falta una regla @media con el punto de ruptura ${PERFIL.puntoRuptura} en estilos.css`
  );

  if (PERFIL.modoOscuro) {
    assert.ok(
      /@media\s*\(\s*prefers-color-scheme\s*:\s*dark\s*\)/i.test(css),
      "Falta la regla @media (prefers-color-scheme: dark) para el modo oscuro en estilos.css"
    );
  }
});
