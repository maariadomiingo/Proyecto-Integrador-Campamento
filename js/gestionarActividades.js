function mostrarFormularioActualizar() {
    // Muestra el formulario de actualizar actividad
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

function abrirFormularioActualizar() {
    document.getElementById("formActualizarActividad").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

document.getElementById("overlay").addEventListener("click", cerrarFormularioActualizar);

document.addEventListener("DOMContentLoaded", function () {
    const selectActividad = document.getElementById("actividad");
    const selectMonitor = document.getElementById("asignarMonitor");
    const selectGrupo = document.getElementById("selectGrupo");
    const formActividad = document.getElementById("formActividad");

    // Función para obtener datos desde el servidor
    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error al obtener datos: ${response.statusText}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error en fetchData:', error);
            return null;
        }
    }

    // Función para rellenar un <select> con opciones
    function fillSelect(selectElement, data, valueKey, textKey) {
        selectElement.innerHTML = `<option value="">${selectElement.name}</option>`; // Resetear opciones
        data.forEach(item => {
            const option = document.createElement("option");
            option.value = item[valueKey];
            option.textContent = item[textKey];
            selectElement.appendChild(option);
        });
    }

    // Obtener y rellenar actividades
    fetchData("../php/getActividades.php") // Endpoint para obtener actividades
        .then(data => {
            fillSelect(selectActividad, data, "id_actividad", "nombre");
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
                console.log("Respuesta del servidor:", data);
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

    // Función para actualizar la tabla de actividades
    function updateActivityTable() {
        fetch("../php/getActividadesAsignadas.php")
            .then(response => response.json())
            .then(data => {
                console.log("Datos obtenidos:", data); // 👈 Agregar esto
    
                const tableBody = document.querySelector(".MostrarDatos table tbody");
                tableBody.innerHTML = ""; // Limpiar la tabla antes de actualizar
    
                if (data.length === 0) {
                    tableBody.innerHTML = "<tr><td colspan='3'>No hay actividades asignadas.</td></tr>";
                    return;
                }
    
                data.forEach(item => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${item.nombre_actividad}</td>
                        <td>${item.nombre_monitor}</td>
                        <td>${item.nombre_grupo}</td>
                    `;
                    row.dataset.idActividad = item.id_actividad;
                    row.dataset.idMonitor = item.id_monitor;
                    row.dataset.idGrupo = item.id_grupo;
    
                    // Agregar evento de clic a la fila
                    row.addEventListener("click", function () {
                        seleccionarActividadParaEditar(this);
                    });
    
                    tableBody.appendChild(row);
                });
            })
            .catch(error => console.error("Error al actualizar la tabla:", error));
    }
    

    function seleccionarActividadParaEditar(fila) {
        // Obtener datos de la fila seleccionada
        const idActividad = fila.dataset.idActividad;
        const idMonitor = fila.dataset.idMonitor;
        const idGrupo = fila.dataset.idGrupo;

        // Llenar los selects del formulario de actualización
        document.getElementById("actividadActualizar").value = idActividad;
        document.getElementById("asignarMonitorActualizar").value = idMonitor;
        document.getElementById("selectGrupoActualizar").value = idGrupo;

        // Mostrar el formulario de edición
        mostrarFormularioActualizar();
    }

    function cargarDatosEnSelect(url, selectId, placeholderText) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const selectElement = document.getElementById(selectId);
                selectElement.innerHTML = `<option value="">${placeholderText}</option>`;
    
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
    cargarDatosEnSelect("../php/getActividades.php", "actividadActualizar", "Elegir Actividad");
    cargarDatosEnSelect("../php/getMonitores.php", "asignarMonitorActualizar", "Asignar Monitor");
    cargarDatosEnSelect("../php/getGrupos.php", "selectGrupoActualizar", "Escoger grupo");
    
   

    // Manejar el envío del formulario de actualización
    document.getElementById("formActualizarActividad").addEventListener("submit", function (event) {
        event.preventDefault(); // Evita que la página se recargue
    
        const idActividad = document.getElementById("actividadActualizar").value;
        const idMonitor = document.getElementById("asignarMonitorActualizar").value;
        const idGrupo = document.getElementById("selectGrupoActualizar").value;
    
        if (!idActividad || !idMonitor || !idGrupo) {
            alert("Por favor, selecciona una actividad, un monitor y un grupo.");
            return;
        }
    
        // Enviar la actualización al servidor
        fetch("../php/actualizarActividad.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                idActividad,
                idMonitor,
                idGrupo,
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Actividad actualizada correctamente.");
                    cerrarFormularioActualizar();
                    updateActivityTable(); // Recargar la tabla con los nuevos datos
                } else {
                    alert("Error al actualizar la actividad.");
                }
            })
            .catch(error => console.error(error));
    });

    // Cargar la tabla al inicio
    updateActivityTable();
});