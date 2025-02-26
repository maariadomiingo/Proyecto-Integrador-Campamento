document.addEventListener('DOMContentLoaded', function () {
    // Cargar grupos al cargar la página
    cargarGrupos();

    // Cargar campistas cuando se selecciona un grupo
    document.getElementById('grupo').addEventListener('change', function () {
        const grupoId = this.value;
        cargarCampistas(grupoId);
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

function cargarCampistas(grupoId) {
    fetch(`../php/cargarCampista.php?grupoId=${grupoId}`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('lista-campistas').innerHTML = data;
        })
        .catch(error => {
            console.error('Error al cargar campistas:', error);
        });
}