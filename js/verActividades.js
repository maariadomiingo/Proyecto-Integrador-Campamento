document.addEventListener("DOMContentLoaded", () => {
    const identificacionMonitor = "qwertyuio"; // Se puede obtener dinámicamente de la URL
    const nombreActividad = document.getElementById("nombreActividad");
    const descripcion = document.getElementById("descripcion");
    const hora = document.getElementById("hora");
    const fecha = document.getElementById("fecha");
    const grupo = document.getElementById("grupo");
    const recursos = document.getElementById("recursos");

    // Función para obtener los datos de la actividad
    function obtenerActividad() {
        fetch(`../php/verActividades.php?identificacion=${identificacionMonitor}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error("Error al obtener la actividad:", data.error);
                return;
            }

            // Insertar datos en la página
            grupo.textContent = data.grupo;
            nombreActividad.textContent = data.actividad.nombre;
            descripcion.textContent = data.actividad.descripcion;
            hora.textContent = data.actividad.hora;
            fecha.textContent = data.actividad.fecha;
            recursos.textContent = data.actividad.recursos;
        })
        .catch(error => console.error("Error en la petición:", error));
    }

    // Llamar a la función al cargar la página
    obtenerActividad();
});
