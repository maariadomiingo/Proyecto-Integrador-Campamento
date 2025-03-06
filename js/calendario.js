document.addEventListener("DOMContentLoaded", function () {
    let diasSeleccionados = [];
    const precioPorDia = 18;
    const totalPriceElement = document.getElementById("totalPrice");
    const botonReservar = document.getElementById("botonreservar");  // Cambié esto para usar el ID

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
        totalPriceElement.textContent = diasSeleccionados.length * precioPorDia;
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

    // Días completos que no pueden ser seleccionados
    const fullDays = ['2025-02-19', '2025-02-20', '2025-02-21'];

    const calendarioElemento = document.getElementById('calendar');
    const calendario = new FullCalendar.Calendar(calendarioElemento, {
        initialView: "dayGridMonth",
        timeZone: "local",
        selectable: true,
        selectMirror: true,
        locale: "es",
        firstDay: 1,
        headerToolbar: {
            left: "prev,next",
            center: "title",
            right: "today"
        },
        validRange: {
            start: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split("T")[0],
        },
        buttonText: {
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
            list: "Lista"
        },
        dayCellDidMount: function (info) {
            let fechaStr = formatearFecha(info.date);
            if (fullDays.includes(fechaStr)) {
                info.el.style.backgroundColor = '#f0f0f0'; 
                info.el.style.color = '#d1d1d1';  
                info.el.style.cursor = 'not-allowed';  
                info.el.style.opacity = '0.6';  
            }
        },
        select: function (info) {
            if (info.end - info.start === 86400000) {
                return;
            }
        
            let actual = new Date(info.start);
            let selectedDates = [];
        
            while (actual < info.end) {
                let fechaStr = formatearFecha(actual);
                if (!fullDays.includes(fechaStr)) {
                    selectedDates.push(fechaStr);
                }
                actual.setDate(actual.getDate() + 1);
            }
        
            const todosSeleccionados = selectedDates.every(fecha => diasSeleccionados.includes(fecha));
        
            if (todosSeleccionados) {
                diasSeleccionados = diasSeleccionados.filter(dia => !selectedDates.includes(dia));
                calendario.getEvents().forEach(evento => {
                    if (selectedDates.includes(evento.startStr)) {
                        evento.remove();
                    }
                });
            } else {
                selectedDates.forEach(fechaStr => {
                    if (!diasSeleccionados.includes(fechaStr)) {
                        agregarFecha(fechaStr);
                    }
                });
            }
        
            actualizarVisualizacion();
        },

        dateClick: function (info) {
            let fechaStr = info.dateStr;
            if (fullDays.includes(fechaStr)) {
                return;
            }

            if (!diasSeleccionados.includes(fechaStr)) {
                agregarFecha(fechaStr);
            } else {
                diasSeleccionados = diasSeleccionados.filter(dia => dia !== fechaStr);
                calendario.getEvents().forEach(function (evento) {
                    if (evento.startStr === fechaStr) {
                        evento.remove();
                    }
                });
            }
            actualizarVisualizacion();
        },

        eventColor: 'rgba(0, 255, 76, 0.5)',
        events: []
    });

    calendario.render();

    botonReservar.addEventListener("click", function () {
        if (diasSeleccionados.length === 0) {
            return;
        }
        const datosReserva = {
            dias: diasSeleccionados,
            precio_total: diasSeleccionados.length * precioPorDia
        };
        fetch("../php/guardar_reserva.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosReserva)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = "../html/reserva.html";
            } else {
                console.log("Error al guardar la reserva.");
            }
        })
        .catch(error => console.error("Error:", error));
    });
});
