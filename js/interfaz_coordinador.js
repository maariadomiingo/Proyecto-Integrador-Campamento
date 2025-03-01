
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado correctamente');

    const iconoUsuario = document.querySelector('.circulo');
    const botonSalir = document.querySelector('.circulo-salir');
    const gestionarHorarios = document.querySelector('.gestionarhorarios');
    const gestionarActividades = document.querySelector('.gestionaractividades');
    const estadoActividades = document.querySelector('.estadoactividades');
    const añadirMonitor = document.querySelector('.añadirmonitor');
    const gestionarGrupos = document.querySelector('.gestionargrupo');
    const editarCampistas = document.querySelector('.editarcampistas');
    

    // Asignar eventos
    if (botonSalir) {
        botonSalir.addEventListener('click', function() {
            window.location.href = '../html/login.html';
        });
    }

    if (gestionarHorarios) {
        gestionarHorarios.addEventListener('click', function() {
            window.location.href = '../html/coordinador/calendariocoordinador.html';
        });
    }

    if (gestionarActividades) {
        gestionarActividades.addEventListener('click', function() {
            window.location.href = '../html/gestionarActividades.html';
        });
    }

    if (estadoActividades) {
        estadoActividades.addEventListener('click', function() {
            window.location.href = '../html/estadoActividades.html';
        });
    }

    if (añadirMonitor) {
        añadirMonitor.addEventListener('click', function() {
            window.location.href = '../html/agregarMonitor.html';
        });
    }

    if (gestionarGrupos) {
        gestionarGrupos.addEventListener('click', function() {
            window.location.href = '../html/gestionarGrupos.html';
        });
    }

    if (editarCampistas) {
        editarCampistas.addEventListener('click', function() {
            window.location.href = '../html/editarCampistas.html';
        });
    }
});