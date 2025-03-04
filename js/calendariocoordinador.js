document.addEventListener('DOMContentLoaded', function () {
    let calendarEl = document.getElementById('calendario');
    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: function (fetchInfo, successCallback, failureCallback) {
            fetch("../../php/horario.php", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'get_actividades' })
            })
            .then(response => response.json())
            .then(data => {
                let events = data.map(evento => ({
                    id: evento.id_actividad,
                    title: evento.nombre, 
                    start: evento.fecha + 'T' + evento.hora_actividad,
                    description: evento.descripcion
                }));
                successCallback(events);
            })
            .catch(error => failureCallback(error));
        },
        selectable: true,
        select: function (info) {
            openPopup(info.startStr);
        },
        eventClick: function (info) {
            openDeletePopup(info.event);
        }
    });
    calendar.render();

    document.getElementById('form-actividad').addEventListener('submit', function (event) {
        event.preventDefault();
        let nombre = document.getElementById('nombre').value;
        let fecha = document.getElementById('fecha').value;
        let hora = document.getElementById('hora').value;
        let descripcion = document.getElementById('descripcion').value;
    
        fetch("../../php/horario.php", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'agregar_actividad', nombre, fecha, hora, descripcion })
        })
        .then(response => response.json())
        .then(data => {
            if (data.exito) {
                calendar.refetchEvents(); 
                closePopup();
            } else {
                alert('Error al agregar actividad: ' + data.error);
            }
        })
        .catch(error => alert('Error en la solicitud: ' + error));
    });

    function openPopup(fecha = '') {
        document.getElementById('popup').style.display = 'block';
        document.getElementById('fecha').value = fecha;
        document.getElementById('overlay').style.display = 'block';
    }

    function closePopup() {
        document.getElementById('popup').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
    }

    document.getElementById('cancelar').addEventListener('click', function() {
        closePopup();
    });

    // Popup de confirmación para eliminar
    function openDeletePopup(event) {
        const deletePopup = document.getElementById('delete-popup');
        deletePopup.style.display = 'block';
        document.getElementById('overlay-delete').style.display = 'block';

        document.getElementById('delete-confirm').onclick = function () {
            fetch("../../php/horario.php", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'borrar_actividad', id: event.id })
            })
            .then(response => response.json())
            .then(() => {
                event.remove();
                closeDeletePopup();
            });
        };

        document.getElementById('delete-cancel').onclick = function () {
            closeDeletePopup();
        };
    }

    function closeDeletePopup() {
        document.getElementById('delete-popup').style.display = 'none';
        document.getElementById('overlay-delete').style.display = 'none';
    }
    const botonSalir = document.querySelector('.circulo-salir');

    // Funcionalidad del botón de salir
    if (botonSalir) {
        botonSalir.addEventListener('click', function () {
            window.location.href = '../../html/login.html';
        });
    } else {
        console.error("El botón 'Salir' no fue encontrado en el DOM.");
    }

    // Funcionalidad del botón de atrás
    const botonAtras = document.getElementById('buttonatras');

    if (botonAtras) {
        botonAtras.addEventListener('click', function () {
            // Redirección directa a la interfaz de coordinador sin verificar sesión
            window.location.href = '../../html/interfaz_coordinador.html';
        });
    } else {
        console.error("El botón 'atras' no fue encontrado en el DOM.");
    }
});
