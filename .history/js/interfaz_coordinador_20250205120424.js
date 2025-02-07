// Selecciona la imagen del pincel
const pincel = document.getElementById("pincel");

// Selecciona todos los trazos de pincel
const trazosPincel = document.querySelectorAll(".trazo-pincel-1, .trazo-pincel-2, .trazo-pincel-3, .trazo-pincel-4, .trazo-pincel-5, .trazo-pincel-6");

// Mantén el tamaño original del pincel
pincel.style.width = "50px"; // Ajusta según el tamaño original en CSS
pincel.style.height = "auto"; // Mantiene la proporción

// Función para mover el pincel verticalmente sin cambiar tamaño
function moverPincel(event) {
  const rect = event.target.getBoundingClientRect();
  const mouseY = event.clientY - rect.top;

  // Asegurar que el pincel no cambie de tamaño y se mantiene alineado
  pincel.style.top = `${rect.top + mouseY - pincel.offsetHeight / 2}px`;
  pincel.style.left = `${rect.left}px`;
  pincel.style.display = "block";
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
