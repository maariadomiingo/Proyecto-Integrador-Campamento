document.addEventListener('DOMContentLoaded', function () {
    // Cargar grupos al cargar la página
    cargarGrupos();
    cargarCampistas(); // Cargar todos los campistas al inicio

    // Cargar campistas cuando se selecciona un grupo
    document.getElementById('grupo').addEventListener('change', function () {
        const grupoId = this.value;
        console.log("Grupo seleccionado:", grupoId);
        cargarCampistas(grupoId); // Cargar campistas no asignados al grupo seleccionado
        cargarCampistasAsignados(grupoId); // Cargar campistas asignados al grupo
    });

    // Asignar campistas al grupo seleccionado
    document.getElementById('asignar').addEventListener('click', function () {
        const grupoId = document.getElementById('grupo').value;
        const campistasSeleccionados = Array.from(document.querySelectorAll('input[name="campista"]:checked'))
            .map(input => input.value);

        if (campistasSeleccionados.length > 0) {
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
            .then(response => response.text())
            .then(data => {
                alert('Campistas asignados correctamente');
                location.reload(); // Recargar la página para ver los cambios
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al asignar campistas');
            });
        } else {
            alert('Selecciona al menos un campista');
        }
    });
});

function cargarGrupos() {
    fetch('../php/cargarGrupos.php')
        .then(response => response.text())
        .then(data => {
            document.getElementById('grupo').innerHTML = data;
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

    console.log("URL de carga de campistas:", url); // <-- Agrega este console.log

    fetch(url)
        .then(response => response.text())
        .then(data => {
            console.log("Respuesta del servidor:", data); // <-- Agrega este console.log
            document.getElementById('lista-campistas').innerHTML = data;
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