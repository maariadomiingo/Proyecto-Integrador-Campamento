document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const identificacionMonitor = urlParams.get('identificacion');

    // Función para obtener los datos de la actividad
    function obtenerActividad() {
        fetch(`../php/verActividades.php?identificacion=${identificacionMonitor}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error("Error al obtener la actividad:", data.error);
                return;
            }

            // Crea un contenedor para cada actividad adicional
            if (data.actividades.length > 1) {
                data.actividades.forEach((actividad, index) => {
                    if (index > 0) {
                        const actividadDiv = document.createElement("div");
                        actividadDiv.className = "actividad-container";
                        actividadDiv.innerHTML = `
                            <div class="actividad-data">
                                <h3>${actividad.actividad_nombre}</h3>
                                <p><strong>Descripción:</strong> ${actividad.descripcion}</p>
                                <p><strong>Recursos:</strong> ${actividad.recursos}</p>
                                <p><strong>Hora:</strong> ${actividad.hora_actividad}</p>
                                <p><strong>Fecha:</strong> ${actividad.fecha}</p>
                            </div>
                        `;
                        document.getElementById("actividadesContainer").appendChild(actividadDiv);
                    }
                });
            }
        })
        .catch(error => console.error("Error en la petición:", error));
    }

    // Llamar a la función al cargar la página
    obtenerActividad();

    // Funcionalidad para el botón "Atrás"
    document.querySelector(".buttonatras").addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = `interfaz_monitor.html?identificacion=${identificacionMonitor}`;
    });

    document.getElementById("new-btn").addEventListener('click', function() {
        window.location.href = `reporteActividad.html?identificacion=${identificacionMonitor}`;
    });
});