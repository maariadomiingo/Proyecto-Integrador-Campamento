document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formActividad");
    const actividadSelect = document.getElementById("actividad");
    const descripcionInput = document.getElementById("descripcion");
    const urlParams = new URLSearchParams(window.location.search);
    const identificacionMonitor = urlParams.get('identificacion');
    const mensajeContainer = document.getElementById("mensaje");

    // Función para mostrar mensajes
    function mostrarMensaje(texto, tipo = "success") {
        mensajeContainer.textContent = texto;
        mensajeContainer.className = `mensaje ${tipo}`;
        setTimeout(() => {
            mensajeContainer.className = "mensaje";
        }, 5000);
    }

    // Función para cargar actividades
    function cargarActividades() {
        const params = new URLSearchParams(window.location.search);
        const identificacion = params.get('identificacion');

        fetch(`../php/reporteActividad.php?identificacion=${identificacion}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    mostrarMensaje(data.error, "error");
                    return;
                }

                // Limpiar opciones actuales
                actividadSelect.innerHTML = '<option value="">Seleccione una actividad...</option>';

                // Populate the select with activities
                data.actividades.forEach(actividad => {
                    const option = document.createElement("option");
                    option.value = actividad.id_actividad;
                    option.textContent = `${actividad.nombre} → Día: ${actividad.fecha} | Hora: ${actividad.hora_actividad} | Grupo: ${actividad.grupo}`;
                    actividadSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error("Error en la petición:", error);
                mostrarMensaje("Error al cargar las actividades", "error");
            });
    }

    // Cargar actividades al cargar la página
    cargarActividades();

    // Form submission handler
    form.addEventListener("submit", (event) => {
        event.preventDefault(); 
        
        const actividad = actividadSelect.value;
        const descripcion = descripcionInput.value.trim();
        const params = new URLSearchParams(window.location.search);
        const identificacion = params.get('identificacion');

        if (!actividad || !descripcion) {
            mostrarMensaje("Por favor, complete todos los campos.", "error");
            return;
        }
        
        const formData = new FormData();
        formData.append("actividad", actividad);
        formData.append("descripcion", descripcion);
        formData.append("identificacion", identificacion);
        
        fetch("../php/reporteActividad.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                mostrarMensaje(data.mensaje || "Reporte enviado con éxito");
                form.reset();
                cargarActividades(); // Actualiza las actividades
            } else {
                mostrarMensaje(data.error || "Error al enviar el reporte", "error");
            }
        })
        .catch(error => {
            console.error("Error en la petición:", error);
            mostrarMensaje("Error al enviar el reporte", "error");
        });
    });

    // Cancel button handler
    document.querySelector(".cancelar-btn").addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = `verActividades.html?identificacion=${identificacionMonitor}`;
    });
});