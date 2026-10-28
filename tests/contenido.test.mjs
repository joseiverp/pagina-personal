import test from "node:test";
import assert from "node:assert/strict";
import { PERFIL } from "./perfil.mjs";
import { leerFicheroSite, extraerAtributos, existeDestinoEnlace } from "./utilidades.mjs";

const paginas = ["index.html", "proyectos.html"];

for (const pagina of paginas) {
  test(`Comprobaciones comunes en ${pagina}`, () => {
    const html = leerFicheroSite(pagina);

    assert.ok(
      /<html[^>]*\blang=["']es["']/i.test(html),
      `En ${pagina} falta el atributo lang="es" en la etiqueta <html>`
    );

    assert.ok(
      /<meta[^>]*\bname=["']viewport["'][^>]*>/i.test(html),
      `En ${pagina} falta la etiqueta <meta name="viewport">`
    );

    const metaDescMatch = html.match(/<meta[^>]*\bname=["']description["'][^>]*\bcontent=["']([^"']*)["'][^>]*>/i)
      || html.match(/<meta[^>]*\bcontent=["']([^"']*)["'][^>]*\bname=["']description["'][^>]*>/i);

    assert.ok(
      metaDescMatch && metaDescMatch[1].trim().length > 20,
      `En ${pagina} la meta description debe existir y tener más de 20 caracteres`
    );

    const h1Matches = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi);
    assert.ok(
      h1Matches && h1Matches.length === 1,
      `En ${pagina} debe haber un único encabezado <h1>`
    );
    assert.ok(
      h1Matches[0].includes(PERFIL.nombre),
      `En ${pagina} el <h1> debe contener el nombre ${PERFIL.nombre}`
    );

    const elementosEstructurales = ["header", "nav", "main", "footer"];
    for (const elem of elementosEstructurales) {
      assert.ok(
        new RegExp(`<${elem}\\b[^>]*>`, "i").test(html),
        `En ${pagina} falta la etiqueta semántica <${elem}>`
      );
    }

    const regexImg = /<img\b([^>]*)>/gi;
    let matchImg;
    let tieneImagenes = false;
    while ((matchImg = regexImg.exec(html)) !== null) {
      tieneImagenes = true;
      const atributos = matchImg[1];
      const matchAlt = atributos.match(/\balt=["']([^"']*)["']/i);
      assert.ok(
        matchAlt && matchAlt[1].trim().length >= 3,
        `En ${pagina} toda imagen debe tener un atributo alt de al menos 3 caracteres`
      );
      assert.ok(
        /\bwidth=["']\d+["']/i.test(atributos) && /\bheight=["']\d+["']/i.test(atributos),
        `En ${pagina} las imágenes deben especificar width y height`
      );
    }
    assert.ok(tieneImagenes, `En ${pagina} debe existir al menos una imagen ilustrativa`);

    const todosHref = extraerAtributos(html, "a", "href").concat(extraerAtributos(html, "link", "href"));
    for (const href of todosHref) {
      assert.ok(
        !href.startsWith("/"),
        `En ${pagina} la ruta '${href}' no debe comenzar por '/' (debe ser relativa)`
      );
    }

    const todosSrc = extraerAtributos(html, "img", "src").concat(extraerAtributos(html, "script", "src"));
    for (const src of todosSrc) {
      assert.ok(
        !src.startsWith("/"),
        `En ${pagina} la ruta '${src}' no debe comenzar por '/' (debe ser relativa)`
      );
    }

    const enlacesA = extraerAtributos(html, "a", "href");
    for (const enlace of enlacesA) {
      assert.ok(
        existeDestinoEnlace(enlace, pagina),
        `En ${pagina} el enlace relativo '${enlace}' apunta a un fichero que no existe`
      );
    }

    assert.ok(
      /<button[^>]*>[\s\S]*?Volver arriba[\s\S]*?<\/button>/i.test(html),
      `En ${pagina} debe existir un botón 'Volver arriba'`
    );
  });
}

test("Comprobaciones específicas de index.html", () => {
  const html = leerFicheroSite("index.html");

  const matchTitle = html.match(/<title>([^<]*)<\/title>/i);
  assert.ok(
    matchTitle && matchTitle[1].trim() === PERFIL.titulo,
    `El <title> de index.html debe ser exactamente '${PERFIL.titulo}'`
  );

  for (const seccion of PERFIL.secciones) {
    const regexSeccion = new RegExp(`<section[^>]*\\bid=["']${seccion}["'][\\s\\S]*?<\\/section>`, "i");
    const matchSec = html.match(regexSeccion);
    assert.ok(
      matchSec,
      `En index.html falta la sección con id '${seccion}'`
    );
    assert.ok(
      /<h2\b[^>]*>[\s\S]*?<\/h2>/i.test(matchSec[0]),
      `En index.html la sección con id '${seccion}' debe contener un <h2>`
    );
  }

  const matchHabilidades = html.match(/<section[^>]*\bid=["']habilidades["'][\s\S]*?<\/section>/i);
  assert.ok(matchHabilidades, "Falta la sección habilidades en index.html");
  const itemsHabilidades = matchHabilidades[0].match(/<li\b[^>]*>/gi);
  assert.ok(
    itemsHabilidades && itemsHabilidades.length >= PERFIL.minimoHabilidades,
    `La sección de habilidades debe contener al menos ${PERFIL.minimoHabilidades} elementos <li>`
  );

  const matchContacto = html.match(/<section[^>]*\bid=["']contacto["'][\s\S]*?<\/section>/i);
  assert.ok(matchContacto, "Falta la sección contacto en index.html");
  const contactoHtml = matchContacto[0];

  assert.ok(
    contactoHtml.includes(`mailto:${PERFIL.email}`),
    `En la sección contacto falta el enlace mailto con el correo ${PERFIL.email}`
  );
  assert.ok(
    contactoHtml.includes(`https://github.com/${PERFIL.usuarioGithub}`),
    `En la sección contacto falta el enlace a GitHub https://github.com/${PERFIL.usuarioGithub}`
  );
});

test("Comprobaciones específicas de proyectos.html", () => {
  const html = leerFicheroSite("proyectos.html");

  const articulos = html.match(/<article\b[^>]*\bclass=["'][^"']*proyecto[^"']*["'][\s\S]*?<\/article>/gi);
  assert.ok(
    articulos && articulos.length >= PERFIL.minimoProyectos,
    `En proyectos.html debe haber al menos ${PERFIL.minimoProyectos} artículos con class='proyecto'`
  );

  for (const art of articulos) {
    assert.ok(
      /<h[23]\b[^>]*>[\s\S]*?<\/h[23]>/i.test(art),
      "Cada artículo de proyecto debe contener un <h2> o <h3>"
    );
    assert.ok(
      /<p\b[^>]*>[\s\S]*?<\/p>/i.test(art),
      "Cada artículo de proyecto debe contener una descripción <p>"
    );
    assert.ok(
      /<ul\b[^>]*\bclass=["'][^"']*tecnologias[^"']*["'][\s\S]*?<\/ul>/i.test(art),
      "Cada artículo de proyecto debe contener un elemento <ul class='tecnologias'>"
    );
  }

  const regexEnlacesExt = /<a\b[^>]*\bhref=["']https?:\/\/[^"']+["'][^>]*>/gi;
  let matchExt;
  while ((matchExt = regexEnlacesExt.exec(html)) !== null) {
    const atributos = matchExt[0];
    assert.ok(
      /\btarget=["']_blank["']/i.test(atributos),
      `El enlace externo '${atributos}' debe tener target='_blank'`
    );
    assert.ok(
      /\brel=["'][^"']*noopener[^"']*["']/i.test(atributos),
      `El enlace externo '${atributos}' debe tener rel con noopener`
    );
  }
});
