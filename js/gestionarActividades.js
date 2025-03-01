function mostrarFormularioActualizar() {
    document.getElementById('formActualizarActividad').classList.remove('hidden');
    document.getElementById("overlay").style.display = "block";
}

function cerrarFormularioActualizar() {
    document.getElementById('formActualizarActividad').classList.add('hidden');
    document.getElementById("overlay").style.display = "none";
    document.getElementById('formActividad').classList.remove('hidden');

    // Limpiar los campos del formulario de actualización
    document.getElementById("actividadActualizar").value = "";
    document.getElementById("asignarMonitorActualizar").value = "";
    document.getElementById("selectGrupoActualizar").value = "";
}

document.getElementById("overlay").addEventListener("click", cerrarFormularioActualizar);

document.addEventListener("DOMContentLoaded", function () {
    const selectActividad = document.getElementById("actividad");
    const selectMonitor = document.getElementById("asignarMonitor");
    const selectGrupo = document.getElementById("selectGrupo");
    const formActividad = document.getElementById("formActividad");

    // Función para obtener datos desde el servidor
    async function fetchData(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error al obtener datos: ${response.statusText}`);
        }
        return response.json();
    }

    // Función para rellenar un <select> con opciones
    function fillSelect(selectElement, data, valueKey, textKey, fechaKey = null) {
        const placeholders = {
            "actividad": "-- ACTIVIDAD --",
            "asignarMonitor": "-- ASIGNAR MONITOR --",
            "selectGrupo": "-- SELECCIONAR GRUPO --"
        };
        selectElement.innerHTML = `<option value="" disabled selected>${placeholders[selectElement.id] || "-- SELECCIONAR --"}</option>`;
        
        data.forEach(item => {
            const option = document.createElement("option");
            option.value = item[valueKey];
            option.textContent = item[textKey] + (fechaKey ? ` | ${item[fechaKey]}` : '');
            selectElement.appendChild(option);
        });
    }

    // Obtener y rellenar actividades
    fetchData("../php/getActividades.php") // Endpoint para obtener actividades
        .then(data => {
            fillSelect(selectActividad, data, "id_actividad", "nombre", "fecha");
        })
        .catch(error => console.error(error));

    // Obtener y rellenar monitores
    fetchData("../php/getMonitores.php") // Endpoint para obtener monitores
        .then(data => {
            fillSelect(selectMonitor, data, "identificacion", "nombre");
        })
        .catch(error => console.error(error));

    // Obtener y rellenar grupos
    fetchData("../php/getGrupos.php") // Endpoint para obtener grupos
        .then(data => {
            fillSelect(selectGrupo, data, "id_grupo", "nombre");
        })
        .catch(error => console.error(error));

    // Manejar el envío del formulario
    formActividad.addEventListener("submit", function (event) {
        event.preventDefault(); // Evitar envío tradicional del formulario

        const actividadId = selectActividad.value;
        const monitorId = selectMonitor.value;
        const grupoId = selectGrupo.value;

        if (!actividadId || !monitorId || !grupoId) {
            alert("Por favor, selecciona una actividad, un monitor y un grupo.");
            return;
        }

        // Enviar datos al servidor
        fetch("../php/asignarActividad.php", { // Endpoint para asignar actividad
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                actividadId,
                monitorId,
                grupoId,
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Actividad asignada correctamente.");
                    // Actualizar la tabla de actividades
                    updateActivityTable();
                } else {
                    alert("Error al asignar la actividad.");
                }
            })
            .catch(error => console.error(error));
    });

    document.getElementById("guardarCambios").addEventListener("click", function () {
        const idActividad = document.getElementById("actividadActualizar").value;
        const idMonitor = document.getElementById("asignarMonitorActualizar").value;
        const idGrupo = document.getElementById("selectGrupoActualizar").value;
    
        console.log(document.getElementById("actividadActualizar").value);
        console.log(document.getElementById("asignarMonitorActualizar").value);
        console.log(document.getElementById("selectGrupoActualizar").value);


        if (!idActividad || !idMonitor || !idGrupo) {
            alert("Por favor, selecciona una actividad, un monitor y un grupo.");
            return;
        }

        const payload = { idActividad, idMonitor, idGrupo };
        console.log("Enviando datos:", payload);
    
        fetch("../php/actualizarActividad.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idActividad, idMonitor, idGrupo }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Actividad actualizada correctamente.");
                cerrarFormularioActualizar(); // Cierra el formulario
                updateActivityTable(); // Refresca la tabla
            } else {
                alert("Error al actualizar: " + data.error);
            }
        })
        .catch(error => console.error("Error en la solicitud:", error));
    });
    

    // Función para actualizar la tabla de actividades
    function updateActivityTable() {
        fetchData("../php/getActividadesAsignadas.php")
            .then(data => {
                console.log("Datos recibidos:", data); // Verifica la respuesta del servidor
                const tableBody = document.querySelector(".MostrarDatos table tbody");
                tableBody.innerHTML = ""; // Limpiar tabla
    
                if (data.length === 0) {
                    tableBody.innerHTML = "<tr><td colspan='3'>No hay actividades asignadas.</td></tr>";
                    return;
                }
    
                data.forEach(item => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${item.nombre_actividad}   |   </td>
                        <td>${item.nombre_monitor}   |   </td>
                        <td>${item.nombre_grupo}</td>
                    `;
                    row.dataset.idActividad = item.id_actividad;
                    row.dataset.idMonitor = item.id_monitor;
                    row.dataset.idGrupo = item.id_grupo;
    
                    row.addEventListener("click", function () {
                        seleccionarActividadParaEditar(this);
                    });
    
                    tableBody.appendChild(row);
                });
            })
            .catch(error => {
                console.error("Error al cargar los datos:", error);
                document.getElementById("mensaje").innerText = "Error al cargar los datos. Por favor, inténtalo de nuevo.";
            });
    }    

    function seleccionarActividadParaEditar(fila) {
        // Obtener datos de la fila seleccionada
        const idActividad = fila.dataset.idActividad;
        const idMonitor = fila.dataset.idMonitor;
        const idGrupo = fila.dataset.idGrupo;

        console.log("Datos de la fila seleccionada:", { idActividad, idMonitor, idGrupo });

        // Llenar los selects del formulario de actualización
        document.getElementById("actividadActualizar").value = idActividad;
        document.getElementById("asignarMonitorActualizar").value = idMonitor;
        document.getElementById("selectGrupoActualizar").value = idGrupo;

        console.log("Valores asignados a los selects:", {
            actividad: document.getElementById("actividadActualizar").value,
            monitor: document.getElementById("asignarMonitorActualizar").value,
            grupo: document.getElementById("selectGrupoActualizar").value,
        });
        // Mostrar el formulario de edición
        mostrarFormularioActualizar();
    }

    function cargarDatosEnSelect(url, selectId, placeholderText) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(`Datos obtenidos para ${selectId}:`, data);

                const selectElement = document.getElementById(selectId);
                const placeholders = {
                    "actividadActualizar": "-- ELEGIR ACTIVIDAD --",
                    "asignarMonitorActualizar": "-- ASIGNAR MONITOR --",
                    "selectGrupoActualizar": "-- ESCOGER GRUPO --"
                };
                selectElement.innerHTML = `<option value="" disabled selected>${placeholders[selectId] || "-- SELECCIONAR --"}</option>`;
                
    
                data.forEach(item => {
                    const option = document.createElement("option");
                    option.value = item.id; // Asegúrate de que el campo sea correcto
                    option.textContent = item.nombre; // Asegúrate de que el campo sea correcto
                    selectElement.appendChild(option);
                });
            })
            .catch(error => console.error(error));
    }
    
    // Llamar a las funciones al cargar la página
    cargarDatosEnSelect("../php/getActividades.php", "actividadActualizar", "-- ELEGIR ACTIVIDAD --");
    cargarDatosEnSelect("../php/getMonitores.php", "asignarMonitorActualizar", "-- ASIGNAR MONITOR --");
    cargarDatosEnSelect("../php/getGrupos.php", "selectGrupoActualizar", "-- ESCOGER GRUPO --");

    // Cargar la tabla al inicio
    updateActivityTable();


    const botonSalir = document.querySelector('.circulo-salir');

    // Funcionalidad del botón de salir
    if (botonSalir) {
        botonSalir.addEventListener('click', function () {
            window.location.href = '../html/login.html';
        });
    } else {
        console.error("El botón 'Salir' no fue encontrado en el DOM.");
    }

    // Funcionalidad del botón de atrás
    const botonAtras = document.getElementById('buttonatras');

    if (botonAtras) {
        botonAtras.addEventListener('click', function () {
            // Redirección directa a la interfaz de coordinador sin verificar sesión
            window.location.href = '../html/interfaz_coordinador.html';
        });
    } else {
        console.error("El botón 'atras' no fue encontrado en el DOM.");
    }
});