document.addEventListener('DOMContentLoaded', function () {
    let calendarEl = document.getElementById('calendario');
    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridWeek',
        locale: 'es',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: function (fetchInfo, successCallback, failureCallback) {
            fetch("http://localhost/Proyecto-Integrador-Campamento/php/horario.php", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'get_actividades' })
            })
            .then(response => response.json())
            .then(data => {
                let events = data.map(evento => ({
                    id: evento.id,
                    title: evento.descripcion, 
                    start: evento.fecha + 'T' + evento.hora,
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
            if (confirm('¿Deseas eliminar esta actividad?')) {
                fetch("http://localhost/Proyecto-Integrador-Campamento/php/horario.php", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'borrar_actividad', id: info.event.id })
                })
                .then(response => response.json())
                .then(() => info.event.remove());
            }
        }
    });
    calendar.render();

    document.getElementById('form-actividad').addEventListener('submit', function (event) {
        event.preventDefault();
        let nombre = document.getElementById('nombre').value;
        let fecha = document.getElementById('fecha').value;
        let hora = document.getElementById('hora').value;
        let descripcion = document.getElementById('descripcion').value;

        fetch("http://localhost/Proyecto-Integrador-Campamento/php/horario.php", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'agregar_actividad', nombre, fecha, hora, descripcion })
        })
        .then(response => response.json())
        .then(() => {
            calendar.refetchEvents();
            closePopup();
        });
    });

    function openPopup(fecha = '') {
        document.getElementById('popup').style.display = 'block';
        document.getElementById('fecha').value = fecha;
    }

    function closePopup() {
        document.getElementById('popup').style.display = 'none';
    }
});
