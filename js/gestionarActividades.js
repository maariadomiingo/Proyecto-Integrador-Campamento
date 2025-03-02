document.addEventListener("DOMContentLoaded", function () {
    const selectActividad = document.getElementById("actividad");
    const selectMonitor = document.getElementById("asignarMonitor");
    const selectGrupo = document.getElementById("selectGrupo");
    const formActividad = document.getElementById("formActividad");
    const submitButton = formActividad.querySelector("button[type='submit']");
    const errorMessages = {
        actividad: document.getElementById("error-actividad"),
        monitor: document.getElementById("error-monitor"),
        grupo: document.getElementById("error-grupo"),
    };
    //VALIDACIONES
    // Función para mostrar mensajes de error debajo de un campo específico
    function showError(field, message) {
        errorMessages[field].textContent = message;
        errorMessages[field].style.display = 'block';
    }

    // Función para ocultar mensajes de error
    function hideError(field) {
        errorMessages[field].textContent = '';
        errorMessages[field].style.display = 'none';
    }

    // Función para validar un campo específico
    function validateField(field, value) {
        if (!value) {
            showError(field, `❌ Por favor, selecciona un ${field}.`);
            return false;
        } else {
            hideError(field);
            return true;
        }
    }

    // Función para validar todo el formulario
    function validateForm() {
        const isActividadValid = validateField("actividad", selectActividad.value);
        const isMonitorValid = validateField("monitor", selectMonitor.value);
        const isGrupoValid = validateField("grupo", selectGrupo.value);

        // Habilitar o deshabilitar el botón de enviar
        if (isActividadValid && isMonitorValid && isGrupoValid) {
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
    }

    // Eventos para validar en tiempo real
    selectActividad.addEventListener("change", function () {
        validateField("actividad", selectActividad.value);
        validateForm();
    });

    selectMonitor.addEventListener("change", function () {
        validateField("monitor", selectMonitor.value);
        validateForm();
    });

    selectGrupo.addEventListener("change", function () {
        validateField("grupo", selectGrupo.value);
        validateForm();
    });

    // Variable para almacenar los monitores ya asignados
let asignarMonitor = new Set();

// Función para actualizar las opciones del select de monitores
function updateMonitorOptions() {
    const options = selectMonitor.querySelectorAll("option");
    options.forEach(option => {
        if (asignarMonitor.has(option.value)) {
            option.disabled = true; // Deshabilitar monitores ya asignados
        } else {
            option.disabled = false; // Habilitar monitores disponibles
        }
    });
}

// Evento al seleccionar un monitor
selectMonitor.addEventListener("change", function () {
    const selectedMonitor = selectMonitor.value;
    if (selectedMonitor) {
        asignarMonitor.add(selectedMonitor); // Agregar monitor a la lista de asignados
        updateMonitorOptions(); // Actualizar opciones del select
    }
});

// Evento al cambiar la actividad (resetear monitores asignados)
selectActividad.addEventListener("change", function () {
    asignarMonitor.clear(); // Limpiar la lista de monitores asignados
    updateMonitorOptions(); // Actualizar opciones del select
});

// Función para validar si el monitor ya está asignado a la actividad
function validateMonitorActivity(actividadId, monitorId) {
    return fetch(`../php/checkMonitorActivity.php?actividadId=${actividadId}&monitorId=${monitorId}`)
        .then(response => response.json())
        .then(data => data.exists);
}

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
    fetchData("../php/getActividades.php")
        .then(data => {
            fillSelect(selectActividad, data, "id_actividad", "nombre", "fecha");
        })
        .catch(error => {
            console.error(error);
            showError("actividad", "Error al cargar las actividades. Por favor, inténtalo de nuevo.");
        });

    // Obtener y rellenar monitores
    fetchData("../php/getMonitores.php")
        .then(data => {
            fillSelect(selectMonitor, data, "identificacion", "nombre");
        })
        .catch(error => {
            console.error(error);
            showError("monitor", "Error al cargar los monitores. Por favor, inténtalo de nuevo.");
        });

    // Obtener y rellenar grupos
    fetchData("../php/getGrupos.php")
        .then(data => {
            fillSelect(selectGrupo, data, "id_grupo", "nombre");
        })
        .catch(error => {
            console.error(error);
            showError("grupo", "Error al cargar los grupos. Por favor, inténtalo de nuevo.");
        });

    // Manejar el envío del formulario
    formActividad.addEventListener("submit", function (event) {
        event.preventDefault(); // Evitar envío tradicional del formulario

        const actividadId = selectActividad.value;
        const monitorId = selectMonitor.value;
        const grupoId = selectGrupo.value;

        if (!actividadId || !monitorId || !grupoId) {
            showError("actividad", "❌ Por favor, selecciona una actividad, un monitor y un grupo.");
            return;
        }

        // Enviar datos al servidor
        fetch("../php/asignarActividad.php", {
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
                    // Mostrar mensaje de éxito
                    alert("Actividad asignada correctamente.");
                    // Actualizar la tabla de actividades
                    updateActivityTable();
                } else {
                    showError("actividad", "❌ Error al asignar la actividad.");
                }
            })
            .catch(error => {
                console.error(error);
                showError("actividad", "Error al asignar la actividad. Por favor, inténtalo de nuevo.");
            });
    });

    // Función para actualizar la tabla de actividades
    function updateActivityTable() {
        fetchData("../php/getActividadesAsignadas.php")
            .then(data => {
                console.log("✅ Datos recibidos:", data);
    
                const tableBody = document.querySelector(".MostrarDatos table tbody");
                if (!tableBody) {
                    console.error("❌ Error: No se encontró el tbody en el DOM.");
                    return;
                }

                document.querySelector(".MostrarDatos table tbody").addEventListener("click", function (event) {
                    console.log("🔥 Click detectado en:", event.target);
                });
    
                tableBody.innerHTML = ""; // Limpiar tabla
    
                if (data.length === 0) {
                    tableBody.innerHTML = "<tr><td colspan='3'>No hay actividades asignadas.</td></tr>";
                    return;
                }
    
                data.forEach((item, index) => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${item.nombre_actividad}   |   </td>
                        <td>${item.nombre_monitor}   |   </td>
                        <td>${item.nombre_grupo}</td>
                    `;
    
                    row.dataset.idActividad = item.id_actividad;
                    row.dataset.idMonitor = item.id_monitor;
                    row.dataset.idGrupo = item.id_grupo;
    
                    console.log(`🆗 Fila ${index} creada:`, row.outerHTML);
    
                    // ✅ Aquí agregamos el evento de click inmediatamente después de crear la fila
                    row.addEventListener("click", function () {
                        console.log("🖱️ Click detectado en fila:", this);
                        seleccionarActividadParaEditar(this);
                    });
    
                    tableBody.appendChild(row);
                });
    
                console.log("📌 Estado final del tbody:", tableBody.innerHTML);
            })
            .catch(error => {
                console.error("❌ Error al cargar los datos:", error);
                showError("actividad", "Error al cargar los datos. Por favor, inténtalo de nuevo.");
            });
    }
    
    // Cargar la tabla al inicio
    updateActivityTable();
});