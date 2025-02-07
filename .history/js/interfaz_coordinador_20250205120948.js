// Selecciona la imagen del pincel
const pincel = document.getElementById("pincel");

// Selecciona todos los trazos de pincel
const trazosPincel = document.querySelectorAll(".trazo-pincel-1, .trazo-pincel-2, .trazo-pincel-3, .trazo-pincel-4, .trazo-pincel-5, .trazo-pincel-6");

// Mantén el tamaño original del pincel
pincel.style.width = "50px"; // Ajusta según el tamaño original en CSS
pincel
pincel.style.height = "auto"; // Mantiene la proporción

// Función para mover el pincel al centro del trazo
function moverPincel(event) {
  const rect = event.target.getBoundingClientRect();

  // Alinear pincel al centro del trazo
  pincel.style.top = `${rect.top + rect.height / 2 - pincel.offsetHeight / 2}px`;
  pincel.style.left = `${rect.left - pincel.offsetWidth}px`; // Ajusta la posición horizontal
  pincel.style.display = "block";
}

// Función para ocultar el pincel
function ocultarPincel() {
  pincel.style.display = "none";
}

// Añade eventos a los trazos de pincel
trazosPincel.forEach((trazo) => {
  trazo.addEventListener("mouseenter", moverPincel);
  trazo.addEventListener("mouseleave", ocultarPincel);
});
