document.addEventListener("DOMContentLoaded", function () {
    // Obtener la identificación del monitor desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const identificacion = urlParams.get('identificacion');

    // Verificar si existe la identificación
    if (!identificacion) {
        console.warn("No se proporcionó una identificación.");
        window.location.href = '../html/login.html';
        return;
    }

    const botonSalir = document.querySelector('.circulo-salir');

    // Funcionalidad del botón de salir
    if (botonSalir) {
        botonSalir.addEventListener('click', function () {
            window.location.href = '../html/login.html';
        });
    } else {
        console.error("El botón 'Salir' no fue encontrado en el DOM.");
    }

    // Función para obtener los datos del monitor
    function obtenerDatosDelMonitor() {
        fetch("../php/perfilMonitor.php", {
            method: "POST",
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({ identificacion: identificacion })
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
    const botonEditar = document.querySelector('.editar-perfil');
    if (botonEditar) {
        botonEditar.addEventListener('click', function (event) {
            event.preventDefault();
            window.location.href = `../html/editarMonitor.html?identificacion=${encodeURIComponent(identificacion)}`;
        });
    } else {
        console.error("El botón 'Editar perfil' no fue encontrado en el DOM.");
    }

    const botonAtras = document.querySelector('.button');
    if (botonAtras) {
        botonAtras.addEventListener('click', function (event) {
            event.preventDefault();
            window.location.href = `../html/interfaz_monitor.html?identificacion=${encodeURIComponent(identificacion)}`;
        });
    } else {
        console.error("El botón 'atras' no fue encontrado en el DOM.");
    }
});
