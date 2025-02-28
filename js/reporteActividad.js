document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formActividad");
    const actividadSelect = document.getElementById("actividad");
    const descripcionInput = document.getElementById("descripcion");

    // Función para cargar actividades
    function cargarActividades() {
        const params = new URLSearchParams(window.location.search);
        const identificacion = params.get('identificacion');

        fetch(`../php/reporteActividad.php?identificacion=${identificacion}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error("Error:", data.error);
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
            .catch(error => console.error("Error en la petición:", error));
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
            alert("Por favor, complete todos los campos.");
            return;
        }
        
        const formData = new FormData();
        formData.append("actividad", actividad);
        formData.append("descripcion", descripcion);
        formData.append("identificacion", identificacion); // Agregamos la identificación
        
        fetch("../php/reporteActividad.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Reporte enviado con éxito.");
                form.reset();
                cargarActividades(); // Refresh activities after submission
            } else {
                alert("Error al enviar el reporte: " + (data.error || 'Unknown error'));
            }
        })
        .catch(error => console.error("Error en la petición:", error));
    });

    // Cancel button handler
    document.querySelector(".cancelar-btn").addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = "verActividades.html";
    });
});