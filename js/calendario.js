document.addEventListener("DOMContentLoaded", function () {
    let diasSeleccionados = [];
    const precioPorDia = 18;
    const totalPriceElement = document.getElementById("totalPrice");
    const botonReservar = document.querySelector(".botonreservar");
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
        initialView: 'dayGridMonth',
        timeZone: 'local',
        selectable: true,
        selectMirror: true,
        validRange: {
            start: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
            end: '2025-03-01'
        },
        buttonText: {
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día',
            list: 'Lista'
        },
        // Aplica un color gris a los días deshabilitados
        dayCellDidMount: function (info) {
            let fechaStr = formatearFecha(info.date);
            if (fullDays.includes(fechaStr)) {
                // Aplica el color gris a los días no permitidos
                info.el.style.backgroundColor = '#f0f0f0';  // Gris claro
                info.el.style.color = '#d1d1d1';  // Gris para el texto
                info.el.style.cursor = 'not-allowed';  // Cursor deshabilitado
                info.el.style.opacity = '0.6';  // Baja opacidad
            }
        },
        locale: 'es',
        firstDay: 1,

        // Maneja la selección de un rango de fechas
        select: function (info) {
            // Si la selección es de un solo día, ignorarla
            if (info.end - info.start === 86400000) {
                return;
            }
            let actual = new Date(info.start);
            let selectedDates = [];

            while (actual < info.end) {
                let fechaStr = formatearFecha(actual);
                if (fullDays.includes(fechaStr)) {
                    // alert(`El día ${fechaStr} está completo. No puedes seleccionarlo.`);
                } else {
                    selectedDates.push(fechaStr);
                }
                actual.setDate(actual.getDate() + 1);
            }

            selectedDates.forEach(fechaStr => {
                agregarFecha(fechaStr);
            });
            actualizarVisualizacion();
        },

        // Maneja el clic en una fecha para alternar su selección
        dateClick: function (info) {
            let fechaStr = info.dateStr;
            if (fullDays.includes(fechaStr)) {
                // alert(`El día ${fechaStr} está completo. No puedes seleccionarlo.`);
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
                alert("Reserva guardada correctamente.");
            } else {
                alert("Error al guardar la reserva.");
            }
        })
        .catch(error => console.error("Error:", error));
    });
});
