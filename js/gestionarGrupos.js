document.addEventListener('DOMContentLoaded', function () {
    const grupoSelect = document.getElementById('grupo');
    const asignarBtn = document.getElementById('asignar');
    const mensajeDiv = document.getElementById('mensaje');
    const modalConfirmacion = document.getElementById('modal-confirmacion');
    const confirmarSi = document.getElementById('confirmar-si');
    const confirmarNo = document.getElementById('confirmar-no');

    let campistasSeleccionados = [];

    // Cargar grupos y campistas al inicio
    cargarGrupos();
    cargarCampistas();

    // Cargar campistas cuando se selecciona un grupo
    grupoSelect.addEventListener('change', function () {
        const grupoId = this.value;
        if (!grupoId) return;
        cargarCampistas(grupoId);
        cargarCampistasAsignados(grupoId);
    });

    // Manejar el clic en el botón "Asignar"
    asignarBtn.addEventListener('click', function () {
        campistasSeleccionados = Array.from(document.querySelectorAll('input[name="campista"]:checked'))
            .map(input => input.value);

        if (campistasSeleccionados.length === 0) {
            mostrarMensaje('error', 'Selecciona al menos un campista.');
            return;
        }

        // Mostrar modal de confirmación
        modalConfirmacion.style.display = 'flex';
    });

    // Confirmar la asignación
    confirmarSi.addEventListener('click', function () {
        modalConfirmacion.style.display = 'none';
        const grupoId = grupoSelect.value;

        fetch('../php/asignarCampista.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                grupoId: grupoId,
                campistas: campistasSeleccionados
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                mostrarMensaje('success', 'Campistas asignados correctamente.');
                location.reload(); // Recargar la página para ver los cambios
            } else {
                mostrarMensaje('error', data.message || 'Error al asignar campistas.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarMensaje('error', 'Error al asignar campistas. Por favor, inténtalo de nuevo.');
        });
    });

    // Cancelar la asignación
    confirmarNo.addEventListener('click', function () {
        modalConfirmacion.style.display = 'none';
        mostrarMensaje('info', 'Cambio de grupo cancelado.');
    });

    // Función para mostrar mensajes
    function mostrarMensaje(tipo, mensaje) {
        mensajeDiv.textContent = mensaje;
        mensajeDiv.className = `mensaje ${tipo}`;
        mensajeDiv.style.display = 'block';

        // Ocultar el mensaje después de 5 segundos
        setTimeout(() => {
            mensajeDiv.style.display = 'none';
        }, 5000);
    }
});

// Resto de las funciones (cargarGrupos, cargarCampistas, cargarCampistasAsignados, verificarCampistasAsignados)
function cargarGrupos() {
    fetch('../php/cargarGrupos.php')
        .then(response => response.text())
        .then(data => {
            document.getElementById('grupo').innerHTML = `
            <option value="" disabled selected>-- SELECCIONAR GRUPO --</option>
            ${data}
        `;
        })
        .catch(error => {
            console.error('Error al cargar grupos:', error);
        });
}

function cargarCampistas(grupoId = null) {
    let url = '../php/cargarCampista.php';
    if (grupoId) {
        url += `?grupoId=${grupoId}`;
    }

    console.log("URL de carga de campistas:", url);

    fetch(url)
        .then(response => response.text())
        .then(data => {
            console.log("Respuesta del servidor:", data);
            document.getElementById('lista-campistas').innerHTML = data;
            verificarCampistasAsignados(); // Verificar si los campistas ya están en un grupo
        })
        .catch(error => {
            console.error('Error al cargar campistas:', error);
        });
}

function cargarCampistasAsignados(grupoId) {
    fetch(`../php/cargarCampistasAsignados.php?grupoId=${grupoId}`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('campistas-asignados').innerHTML = data;
        })
        .catch(error => {
            console.error('Error al cargar campistas asignados:', error);
        });
}

// Función para verificar si los campistas ya están asignados a un grupo
function verificarCampistasAsignados() {
    const checkboxes = document.querySelectorAll('input[name="campista"]');
    checkboxes.forEach(checkbox => {
        const campistaId = checkbox.value;
        fetch(`../php/verificarCampistaAsignado.php?campistaId=${campistaId}`)
            .then(response => response.json())
            .then(data => {
                if (data.asignado) {
                    // Mostrar mensaje de advertencia
                    const label = checkbox.parentElement;
                    label.innerHTML += ` <span style="color: red;">(Ya está en el grupo: ${data.grupoNombre})</span>`;
                    checkbox.disabled = true; // Deshabilitar el checkbox
                }
            })
            .catch(error => {
                console.error('Error al verificar campista:', error);
            });
    });
}