document.addEventListener("DOMContentLoaded", function () {
    // Obtener la identificación del monitor desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const identificacion = urlParams.get('identificacion');

    if (!identificacion) {
        alert("No se proporcionó una identificación.");
        window.location.href = '../html/login.html';
        return;
    }

    // Obtener elementos del DOM
    const botonAtras = document.getElementById('botonAtras');  // Usar el ID correcto del botón

    // Funcionalidad del botón "Atrás"
    botonAtras.addEventListener('click', function () {
        window.location.href = `../html/perfilMonitor.html?identificacion=${encodeURIComponent(identificacion)}`;
    });

      // Obtener elementos del DOM
      const botonSalir = document.querySelector('.circulo-salir');
  
      // Funcionalidad del botón de salir
      botonSalir.addEventListener('click', function () {
          window.location.href = '../html/login.html';
      });

    // Obtener datos del monitor
    fetch("../php/editarMonitor.php", {
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

        // Rellenar los campos del formulario con los datos obtenidos
        document.getElementById("nombre").value = data.nombre || "";
        document.getElementById("identificacion").value = data.identificacion || "";
        document.getElementById("email").value = data.email || "";
        document.getElementById("telefono").value = data.telefono || "";
    })
    .catch(error => {
        console.error("Error al obtener datos del monitor:", error);
        alert("Ocurrió un error al cargar los datos. Por favor, inténtalo de nuevo.");
    });

    // Función para guardar los cambios
    document.querySelector('.basico').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const datos = {
            nombre: document.getElementById("nombre").value,
            email: document.getElementById("email").value,
            telefono: document.getElementById("telefono").value
        };

        fetch("../php/guardardatosMonitor.php", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                identificacion: identificacion,
                ...datos 
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // alert("Datos actualizados correctamente.");
                window.location.href = `../html/perfilMonitor.html?identificacion=${encodeURIComponent(identificacion)}`;
            } else {
                alert("Error al actualizar: " + data.error);
            }
        })
        .catch(error => {
            console.error("Error al guardar datos:", error);
            alert("Ocurrió un error al guardar los datos. Por favor, inténtalo de nuevo.");
        });
    });
});
