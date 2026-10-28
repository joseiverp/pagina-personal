document.addEventListener("DOMContentLoaded", () => {
  const anioSpan = document.getElementById("anio-actual");
  if (anioSpan) {
    anioSpan.textContent = new Date().getFullYear();
  }

  const btnSubir = document.getElementById("btn-subir");
  if (btnSubir) {
    btnSubir.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }
});
