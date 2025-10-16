$(document).ready(function() {
  // Mostrar spinner de carga
  $("#spinner").show();

  // Simular carga con retraso de 5 segundos
  setTimeout(function() {
    $.ajax({
      url: "data/peliculas.json",
      dataType: "json",
      success: function(peliculas) {
        $("#spinner").hide();
        mostrarPeliculas(peliculas);
      },
      error: function() {
        $("#spinner").hide();
        alert("Error al cargar las películas.");
      }
    });
  }, 5000);
});

$(document).on("click", ".ver-trailer", function() {
  const url = $(this).data("trailer");
  $("#videoTrailer").attr("src", url);
});

$("#trailerModal").on("hidden.bs.modal", function() {
  $("#videoTrailer").attr("src", ""); // Detiene el video al cerrar
});

function mostrarPeliculas(peliculas) {
  const hoy = new Date();
  let html = "";

  peliculas.forEach(pelicula => {
    const fechaEstreno = new Date(pelicula.estreno);
    const esEstreno = hoy - fechaEstreno < 7 * 24 * 60 * 60 * 1000;
    const precio = esEstreno ? pelicula.precios.estreno : pelicula.precios.normal;

    const badge = esEstreno
      ? '<span class="badge bg-danger">Estreno</span>'
      : '<span class="badge bg-success">En cartelera</span>';

    html += `
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <img src="${pelicula.imagen}" class="card-img-top" alt="${pelicula.titulo}">
          <div class="card-body">
            <h5 class="card-title">${pelicula.titulo} ${badge}</h5>
            <p class="card-text">${pelicula.sinopsis}</p>
            <p><strong>Precio actual:</strong> $${precio.toFixed(2)}</p>
            <button class="btn btn-primary ver-trailer" data-bs-toggle="modal" data-bs-target="#trailerModal" data-trailer="${pelicula.trailer}">
              Ver tráiler
            </button>
          </div>
        </div>
      </div>
    `;
  });

  $("#peliculas").html(html);
}
