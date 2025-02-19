function mostrarFormularioActualizar() {
    // Oculta el formulario de añadir actividad
    document.getElementById('formActividad').classList.add('hidden');
    
    // Muestra el formulario de actualizar actividad
    document.getElementById('formActualizarActividad').classList.remove('hidden');
}

function cerrarFormularioActualizar() {
    // Oculta el formulario de actualizar actividad
    document.getElementById('formActualizarActividad').classList.add('hidden');
    
    // Muestra el formulario de añadir actividad
    document.getElementById('formActividad').classList.remove('hidden');
}
document.addEventListener("DOMContentLoaded", function () {
    const selectActividad = document.getElementById("actividad");
    const selectMonitor = document.getElementById("asignarMonitor");
    const selectGrupo = document.getElementById("selectGrupo");
    const formActividad = document.getElementById("formActividad");
    // const formActualizar = document.getElementById("formActualizarActividad");

    // document.getElementById('editarActividadBtn').addEventListener('click', function () {
    //     formActividad.classList.toggle('hidden'); // Alternar visibilidad del formulario
    // });

    // Función para obtener datos desde el servidor
    async function fetchData(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error al obtener datos: ${response.statusText}`);
        }
        return response.json();
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
        fetchData("../php/getActividadesAsignadas.php") // Endpoint para obtener actividades asignadas
            .then(data => {
                const tableBody = document.querySelector(".MostrarDatos table tbody");
                tableBody.innerHTML = ""; // Limpiar la tabla

                data.forEach(item => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${item.nombre_actividad}  -  </td>
                        <td>${item.nombre_monitor}  -  </td>
                        <td>${item.nombre_grupo}</td>
                    `;
                    tableBody.appendChild(row);
                });
            })
            .catch(error => console.error(error));
    }

    // Cargar la tabla al inicio
    updateActivityTable();
});
