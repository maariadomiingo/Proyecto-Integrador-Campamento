document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formActividad");
    const actividadSelect = document.getElementById("actividad");
    const descripcionInput = document.getElementById("descripcion");
    const urlParams = new URLSearchParams(window.location.search);
    const identificacionMonitor = urlParams.get('identificacion'); // Se obtiene la identificación correctamente
    const mensajeContainer = document.getElementById("mensaje");

    console.log("Identificación obtenida:", identificacionMonitor); // Depuración

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
        fetch(`../php/reporteActividad.php?identificacion=${identificacionMonitor}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    mostrarMensaje(data.error, "error");
                    return;
                }

                // Limpiar opciones actuales
                actividadSelect.innerHTML = '<option value="">Seleccione una actividad...</option>';

                // Agregar opciones con las actividades
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

        if (!actividad || !descripcion) {
            mostrarMensaje("Por favor, complete todos los campos.", "error");
            return;
        }

        const formData = new FormData();
        formData.append("actividad", actividad);
        formData.append("descripcion", descripcion);
        formData.append("identificacion", identificacionMonitor);

        fetch("../php/reporteActividad.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                mostrarMensaje(data.mensaje || "Reporte enviado con éxito");
                form.reset();
                cargarActividades();
            } else {
                mostrarMensaje(data.error || "Error al enviar el reporte", "error");
            }
        })
        .catch(error => {
            console.error("Error en la petición:", error);
            mostrarMensaje("Error al enviar el reporte", "error");
        });
    });

    // Botón de cancelar
    document.querySelector(".cancelar-btn").addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = `verActividades.html?identificacion=${encodeURIComponent(identificacionMonitor)}`;
    });

    // Funcionalidad del botón de salir
    const botonSalir = document.querySelector('.circulo-salir');
    if (botonSalir) {
        botonSalir.addEventListener('click', function () {
            window.location.href = '../html/login.html';
        });
    } else {
        console.error("El botón 'Salir' no fue encontrado en el DOM.");
    }

    // Funcionalidad del botón de atrás
    const botonAtras = document.querySelector('.buttonatras');
    if (botonAtras) {
        botonAtras.addEventListener('click', function (event) {
            event.preventDefault();
            console.log("Redirigiendo a verActividades con identificacion:", identificacionMonitor);
            window.location.href = `../html/verActividades.html?identificacion=${encodeURIComponent(identificacionMonitor)}`;
        });
    } else {
        console.error("El botón 'Atrás' no fue encontrado en el DOM.");
    }

    const perfilMonitor = document.querySelector('.circulo');
    if (perfilMonitor) {
        perfilMonitor.addEventListener('click', function (event) {
            event.preventDefault();
            console.log("Redirigiendo a perfil monitor con identificacion:", identificacionMonitor);
            window.location.href = `../html/perfilMonitor.html?identificacion=${encodeURIComponent(identificacionMonitor)}`;
        });
    } else {
        console.error("El botón 'Atrás' no fue encontrado en el DOM.");
    }
});
