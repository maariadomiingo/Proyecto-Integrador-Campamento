// Selecciona la imagen del pincel
const pincel = document.getElementById("pincel");

// Selecciona todos los trazos de pincel
const trazosPincel = document.querySelectorAll(".trazo-pincel-1, .trazo-pincel-2, .trazo-pincel-3, .trazo-pincel-4, .trazo-pincel-5, .trazo-pincel-6");

// Mantén el tamaño original del pincel
pincel.style.width = "80px"; // Ajusta según el tamaño original en CSS
pincel.style.height = "auto"; // Mantiene la proporción

// Función para mover el pincel al centro del trazo
function moverPincel(event) {
  const rect = event.target.getBoundingClientRect();

  // Alinear pincel al centro del trazo
  pincel.style.top = `${rect.top + rect.height / 2 - pincel.offsetHeight / 2}px`;
  pincel.style.left = `${rect.left + rect.width - 60}px`; // Ajuste para que quede cerca de la imagen
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


/* REDIRIGE A EDITAR CAMPISTA */
document.addEventListener("DOMContentLoaded", function () {
  // Seleccionar el elemento "EDITAR CAMPISTAS"
  const editarCampistas = document.querySelector(".editar-campistas");
  // Seleccionar el trazo-pincel-1
  const trazoPincel1 = document.querySelector(".trazo-pincel-1");
  
  if (editarCampistas && trazoPincel1) {
      editarCampistas.addEventListener("click", function () {
          // Redirigir al hacer clic en "EDITAR CAMPISTAS"
          window.location.href = "editarCampista.html";
      });
      
      trazoPincel1.addEventListener("click", function () {
          // Redirigir al hacer clic en el trazo-pincel-1
          window.location.href = "editarCampista.html";
      });
  }
});
