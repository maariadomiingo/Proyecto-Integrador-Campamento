const urlParams = new URLSearchParams(window.location.search);
const identificacionURL = urlParams.get('identificacion');

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
    document.getElementById("volverinicio").addEventListener("click", function() {
        window.location.href = "home.html";
    });
    function checkSession() {
        if (!identificacionURL) {
            window.location.href = '../html/login.html';
            return;
        }

        fetch('../php/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                rol: 'monitor', 
                identificacion: identificacionURL,
                password: '12345678' 
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                console.log('Sesión válida');
            } else {
                window.location.href = '../html/login.html';
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function redirect(url) {
        console.log('Redirigiendo a:', url);
        window.location.href = url;
    }

    // Asignar eventos
    if (botonSalir) {
        botonSalir.addEventListener('click', function() {
            redirect('../html/login.html');
        });
    }

    if (gestionarHorarios) {
        gestionarHorarios.addEventListener('click', function() {
            redirect('../html/coordinador/calendariocoordinador.html');
        });
    }

    if (gestionarActividades) {
        gestionarActividades.addEventListener('click', function() {
            redirect('../html/gestionarActividades.html');
        });
    }

    if (estadoActividades) {
        estadoActividades.addEventListener('click', function() {
            redirect('../html/estadoActividades.html');
        });
    }

    if (añadirMonitor) {
        añadirMonitor.addEventListener('click', function() {
            redirect('../html/agregarMonitor.html');
        });
    }

    if (gestionarGrupos) {
        gestionarGrupos.addEventListener('click', function() {
            redirect('../html/gestionarGrupos.html');
        });
    }

    if (editarCampistas) {
        editarCampistas.addEventListener('click', function() {
            redirect('../html/editarCampistas.html');
        });
    }

    checkSession();
});