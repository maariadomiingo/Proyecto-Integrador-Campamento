document.addEventListener("DOMContentLoaded", function () {
  // Obtener el ID de la URL usando parámetros GET (ej: .../editarMonitor.html?identificacion=123)
const urlParams = new URLSearchParams(window.location.search);
const identificacion = urlParams.get('identificacion');

if (!identificacion) {
    const pathSegments = window.location.pathname.split('/');
    identificacion = pathSegments.find(segment => !isNaN(segment)); 
}
    if (!identificacion) {
        alert("No se proporcionó una identificación.");
        return;
    }

    console.log("ID a enviar:", identificacion);

    fetch("../php/editarMonitor.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ identificacion: identificacion })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
            return;
        }

        // Corregir "Mail" a "mail":
       // Usa .value si son inputs
document.getElementById("nombre").value = data.nombre || "No disponible";
document.getElementById("identificacion").value = data.identificacion || "No disponible";
document.getElementById("email").value = data.email || "No disponible";
document.getElementById("telefono").value = data.telefono || "No disponible";
    })
    .catch(error => console.error("Error al obtener datos del monitor:", error));
});


function guardarCambios() {
    const identificacion = document.getElementById("identificacion").value;
    const datos = {
        nombre: document.getElementById("nombre").value,
        email: document.getElementById("email").value,
        telefono: document.getElementById("telefono").value
    };

    console.log("Enviando datos:", { identificacion, datos }); // <--- Depuración

    fetch("../php/guardardatosMonitor.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identificacion, ...datos })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Datos actualizados correctamente.");
            // window.location.href = "../perfilMonitor.html"; // Descomenta si es necesario
        } else {
            alert("Error al actualizar: " + data.error);
        }
    })
    .catch(error => console.error("Error:", error));
}