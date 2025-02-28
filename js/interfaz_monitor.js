const urlParams = new URLSearchParams(window.location.search);
const identificacionURL = urlParams.get('identificacion');

document.addEventListener('DOMContentLoaded', function() {
    const iconoUsuario = document.querySelector('.circulo');
    const botonSalir = document.querySelector('.circulo-salir');
    const contenedorDatos = document.querySelector('.datos-monitor');

    const verActividades = document.querySelector('.veractividades');
    const verHorarios = document.querySelector('.verhorarios');
    const pasarLista = document.querySelector('.pasarLista');

    function checkSession() {
        if (!identificacionURL) {
            window.location.href = '../html/login.html';
            return;
        }

        // Enviar los datos en formato JSON
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
            } else {
                window.location.href = '../html/login.html';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            //window.location.href = '../html/login.html';
        });
    }
    document.getElementById("volverinicio").addEventListener("click", function() {
        window.location.href = "home.html";
    });
    function mostrarDatosSesion(datos) {
        const identificacionElement = document.getElementById('identificacion');
        identificacionElement.textContent = datos.identificacion || 'No disponible';
       
    }

    iconoUsuario.addEventListener('click', function() {
        window.location.href = `perfilMonitor.html?identificacion=${identificacionURL}`;
    });

    botonSalir.addEventListener('click', function() {
        window.location.href = '../html/login.html';
    });

    
    if (verActividades) {
        verActividades.addEventListener('click', function() {
            window.location.href = `verActividades.html?identificacion=${identificacionURL}`;
        });
    }

    if (verHorarios) {
        verHorarios.addEventListener('click', function() {
            window.location.href = `verHorarios.html?identificacion=${identificacionURL}`;
        });
    }

    if (pasarLista) {
        pasarLista.addEventListener('click', function() {
            window.location.href = `pasarLista.html?identificacion=${identificacionURL}`;
        });
    }
    checkSession();
});