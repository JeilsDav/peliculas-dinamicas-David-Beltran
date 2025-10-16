// Carga de películas y lógica de renta
$(function () {
  const $select = $("#pelicula");
  const $dias = $("#dias");
  const $total = $("#total");
  const $ayudaPrecio = $("#ayudaPrecio");

  // guardaremos aquí el catálogo para consultas rápidas por id
  let catalogo = [];
  const MS_DIA = 24 * 60 * 60 * 1000;

  // 1) Cargar el JSON 
  $.getJSON("../data/peliculas.json")
    .done(function (peliculas) {
      catalogo = peliculas;
      // llenar el select
      peliculas.forEach(p => {
        $select.append(
          `<option value="${p.id}">${p.titulo}</option>`
        );
      });
    })
    .fail(function () {
      alert("No se pudo cargar el catálogo de películas.");
    });

  // 2) Precio unitario actual según si es estreno
  function precioActual(peli) {
    const hoy = new Date();
    const fe = new Date(peli.estreno);
    const esEstreno = (hoy - fe) < (7 * MS_DIA);
    return esEstreno ? peli.precios.estreno : peli.precios.normal;
  }

  // 3) Recalcular total cuando cambia película o días
  function recalcular() {
    const id = parseInt($select.val(), 10);
    const dias = parseInt($dias.val(), 10);

    if (!id || !dias) {
      $total.text("$0.00");
      $ayudaPrecio.text("Precio unitario: —");
      return;
    }

    const peli = catalogo.find(p => p.id === id);
    const unit = precioActual(peli);
    const total = unit * dias;

    $ayudaPrecio.text(`Precio unitario: $${unit.toFixed(2)}`);
    $total.text(`$${total.toFixed(2)}`);
  }

  $select.on("change", recalcular);
  $dias.on("input", function () {
    // limitar de 1 a 7
    let v = parseInt(this.value || "1", 10);
    if (v < 1) v = 1;
    if (v > 7) v = 7;
    this.value = v;
    recalcular();
  });

  // 4) Validación Bootstrap + mostrar modal resumen
  const form = document.getElementById("formRenta");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    // datos para resumen
    const id = parseInt($select.val(), 10);
    const peli = catalogo.find(p => p.id === id);
    const unit = precioActual(peli);
    const dias = parseInt($dias.value || $dias.val(), 10);
    const total = unit * dias;
    const pago = $('input[name="pago"]:checked').val();

    $("#rCliente").text($("#nombre").val());
    $("#rCorreo").text($("#email").val());
    $("#rPelicula").text(peli.titulo);
    $("#rUnitario").text(`$${unit.toFixed(2)}`);
    $("#rDias").text(dias);
    $("#rPago").text(pago);
    $("#rTotal").text(`$${total.toFixed(2)}`);

    const modal = new bootstrap.Modal(document.getElementById("resumenModal"));
    modal.show();
  });

  // 5) Botón “Confirmar” del modal (puedes guardar historial si quieres)
  $("#btnConfirmado").on("click", function () {
    // Ejemplo: guardar la última renta en localStorage
    const registro = {
      cliente: $("#nombre").val(),
      correo: $("#email").val(),
      pelicula: $("#rPelicula").text(),
      total: $("#rTotal").text(),
      fecha: new Date().toISOString()
    };
    localStorage.setItem("ultimaRenta", JSON.stringify(registro));
    // feedback rápido
    alert("✅ ¡Renta registrada! Disfruta la película.");
  });
});
