document.addEventListener("DOMContentLoaded", function () {
    const pathSegments = window.location.pathname.split('/');
    const identificacion = pathSegments[pathSegments.length - 1];
    const atras = document.querySelector('.flecha');
    const botonSalir = document.querySelector('.icono-salir');

    if (!identificacion) {
        alert("No se proporcionó una identificación.");
        return;
    }

    // Event listeners dentro de DOMContentLoaded
    atras.addEventListener('click', function() {
        window.location.href = '../html/interfaz_monitor.html';
    });

    botonSalir.addEventListener('click', function() {
        window.location.href = '../html/login.html';
    });

    fetch("../php/perfilMonitor.php", {
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

        document.getElementById("nombre").textContent = data.nombre || "No disponible";
        document.getElementById("identificacion").textContent = data.identificacion || "No disponible";
        document.getElementById("mail").textContent = data.mail || "No disponible";
        document.getElementById("telefono").textContent = data.telefono || "No disponible";
    })
    .catch(error => console.error("Error al obtener datos del monitor:", error));
});

// Función editar (si se llama desde un botón en el HTML)
function editar(event) {
    event.preventDefault();
    const identificacion = document.getElementById("identificacion").textContent;
    window.location.href = `../html/editarMonitor.html?identificacion=${encodeURIComponent(identificacion)}`;
}