document.addEventListener("DOMContentLoaded", function () {
    const selectActividad = document.getElementById("actividad-select");
    const tablaReportes = document.getElementById("tabla-reportes").getElementsByTagName("tbody")[0];
    // Seleccionar el elemento del select y el contenedor del mensaje
    const mensaje = document.getElementById('mensaje');
    const mensajeIcon = document.getElementById('mensaje-icon');
    const mensajeText = document.getElementById('mensaje-text');

    // Función de validación
selectActividad.addEventListener('change', function() {
    // Comprobar si se ha seleccionado una opción
    if (selectActividad.value === "") {
        // Si no se seleccionó nada, mostrar el mensaje
        mensajeText.textContent = "Por favor, selecciona una actividad.";
        mensajeIcon.textContent = "❌"; // Icono de X
        mensaje.style.visibility = 'visible'; // Mostrar el mensaje
    } else {
        // Si se seleccionó una opción, limpiar el mensaje
        mensaje.style.visibility = 'hidden'; // Ocultar el mensaje
    }
});


    // Cargar actividades al cargar la página
    cargarActividades();

    // Evento para cargar reportes cuando se selecciona una actividad
    selectActividad.addEventListener("change", function () {
        const idActividad = selectActividad.value;
        if (idActividad) {
            cargarReportes(idActividad);
        } else {
            tablaReportes.innerHTML = ""; // Limpiar tabla si no hay actividad seleccionada
        }
    });

    // Función para cargar actividades desde el servidor
    async function cargarActividades() {
        try {
            const response = await fetch("../php/obtener_actividades.php");
            const actividades = await response.json();

            // Limpiar y llenar el select de actividades
            selectActividad.innerHTML = '<option value="">Seleccione una actividad</option>';
            actividades.forEach(actividad => {
                const option = document.createElement("option");
                option.value = actividad.id_actividad;
                option.textContent = actividad.nombre;
                selectActividad.appendChild(option);
            });
        } catch (error) {
            console.error("Error al cargar actividades:", error);
        }
    }

    // Función para cargar reportes y descripción de la actividad
    async function cargarReportes(idActividad) {
        try {
            // Obtener la descripción de la actividad
            const responseActividad = await fetch(`../php/obtenerDescripcionActividad.php?id_actividad=${idActividad}`);
            const actividad = await responseActividad.json();

            // Obtener los reportes de la actividad
            const responseReportes = await fetch(`../php/obtenerReportes.php?id_actividad=${idActividad}`);
            const reportes = await responseReportes.json();

            // Limpiar la tabla
            tablaReportes.innerHTML = "";

            // Mostrar la actividad con su descripción y los reportes en la misma fila
            const rowActividad = document.createElement("tr");
            rowActividad.innerHTML = `
            <td>${actividad.descripcion}</td> <!-- Descripción de la actividad -->
            <td>${reportes.length > 0 ? reportes.map(reporte => reporte.descripcion).join("<br>") : "No hay reportes"}</td>
            `;

tablaReportes.appendChild(rowActividad);

        } catch (error) {
            console.error("Error al cargar reportes:", error);
        }
    }
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
         botonAtras.addEventListener('click', function () {
             window.location.href = '../html/gestionarActividades.html';
         });
     } else {
         console.error("El botón 'Atrás' no fue encontrado en el DOM.");
     }
});