<script>
  // Selecciona la imagen del pincel
  const pincel = document.getElementById("pincel");

  // Selecciona todos los trazos de pincel
  const trazosPincel = document.querySelectorAll(
    ".trazo-pincel-1, .trazo-pincel-2, .trazo-pincel-3, .trazo-pincel-4, .trazo-pincel-5, .trazo-pincel-6"
  );

  // Función para mover el pincel verticalmente
  function moverPincel(event) {
    // Obtén la posición vertical del ratón dentro del trazo de pincel
    const rect = event.target.getBoundingClientRect();
    const mouseY = event.clientY - rect.top;

    // Mueve el pincel a la posición del ratón
    pincel.style.top = `${rect.top + mouseY - pincel.offsetHeight / 2}px`;
    pincel.style.left = `${rect.left}px`; // Mantén la posición horizontal fija
    pincel.style.display = "block"; // Muestra el pincel
  }

  // Función para ocultar el pincel
  function ocultarPincel() {
    pincel.style.display = "none";
  }

  // Añade eventos a los trazos de pincel
  trazosPincel.forEach((trazo) => {
    trazo.addEventListener("mousemove", moverPincel);
    trazo.addEventListener("mouseleave", ocultarPincel);
  });
</script>