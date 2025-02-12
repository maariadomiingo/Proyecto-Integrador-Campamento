document.addEventListener("DOMContentLoaded", function () {
    let diasSeleccionados = [];
    
    // Formatea una fecha en el formato YYYY-MM-DD
    function formatearFecha(fecha) {
        const anio = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const dia = String(fecha.getDate()).padStart(2, '0');
        return `${anio}-${mes}-${dia}`;
    }

    // Actualiza la visualización de los días seleccionados
    function actualizarVisualizacion() {
        document.getElementById('selected_days_display').textContent = diasSeleccionados.sort().join(', ');
    }

    // Agrega una fecha al calendario si no está seleccionada
    function agregarFecha(fechaStr) {
        if (!diasSeleccionados.includes(fechaStr)) {
            diasSeleccionados.push(fechaStr);
            calendario.addEvent({
                title: '✔',
                start: fechaStr,
                allDay: true,
                classNames: ['selected-day']
            });
        }
    }

    const calendarioElemento = document.getElementById('calendar');
    const calendario = new FullCalendar.Calendar(calendarioElemento, {
        initialView: 'dayGridMonth',
        timeZone: 'local',
        selectable: true,
        selectMirror: true,
        validRange: {
            start: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
            end: '2025-03-01'
        },
        
        // Maneja la selección de un rango de fechas
        select: function seleccionarRango(info) {
            if (info.end - info.start === 86400000) return;
            
            let actual = new Date(info.start);
            while (actual < info.end) {
                let fechaStr = formatearFecha(actual);
                agregarFecha(fechaStr);
                actual.setDate(actual.getDate() + 1);
            }
            actualizarVisualizacion();
        },
        
        // Maneja el clic en una fecha para alternar su selección
        dateClick: function alternarSeleccion(info) {
            let fechaStr = info.dateStr;
            if (diasSeleccionados.includes(fechaStr)) {
                diasSeleccionados = diasSeleccionados.filter(dia => dia !== fechaStr);
                calendario.getEvents().forEach(function (evento) {
                    if (evento.startStr === fechaStr) evento.remove();
                });
            } else {
                agregarFecha(fechaStr);
            }
            actualizarVisualizacion();
        },
        
        eventColor: 'rgba(0, 255, 76, 0.5)',
        events: []
    });
    
    calendario.render();
});