document.addEventListener("DOMContentLoaded", function () {
    // Obtener la identificación del monitor desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const identificacion = urlParams.get('identificacion');

    // Verificar si existe la identificación
    if (!identificacion) {
        alert("No se proporcionó una identificación.");
        window.location.href = '../html/login.html';
        return;
    }

    // Obtener elementos del DOM
    const buttonAtras = document.querySelector('.button');
    const botonSalir = document.querySelector('.circulo-salir');

    // Funcionalidad del botón "Atrás"
    buttonAtras.addEventListener('click', function () {
        window.location.href = `../html/interfaz_monitor.html?identificacion=${encodeURIComponent(identificacion)}`;
    });

    // Funcionalidad del botón de salir
    botonSalir.addEventListener('click', function () {
        window.location.href = '../html/login.html';
    });

    // Función para obtener los datos del monitor
    function obtenerDatosDelMonitor() {
        fetch("../php/perfilMonitor.php", {
            method: "POST",
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({ 
                identificacion: identificacion 
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
                return;
            }

            // Actualizar los datos en la vista
            document.getElementById("nombre").textContent = data.nombre || "No disponible";
            document.getElementById("identificacion").textContent = data.identificacion || "No disponible";
            document.getElementById("mail").textContent = data.mail || "No disponible";
            document.getElementById("telefono").textContent = data.telefono || "No disponible";
        })
        .catch(error => {
            console.error("Error al obtener datos del monitor:", error);
            alert("Ocurrió un error al cargar los datos. Por favor, inténtalo de nuevo.");
        });
    }

    // Llamar a la función para obtener los datos
    obtenerDatosDelMonitor();

    // Función para editar el perfil
    document.querySelector('.editar-perfil').addEventListener('click', function (event) {
        event.preventDefault();
        window.location.href = `../html/editarMonitor.html?identificacion=${encodeURIComponent(identificacion)}`;
    });
});
