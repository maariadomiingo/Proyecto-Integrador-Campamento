const urlParams = new URLSearchParams(window.location.search);
const identificacionURL = urlParams.get('identificacion');

document.addEventListener('DOMContentLoaded', function() {
    const iconoUsuario = document.querySelector('.circulo');
    const botonSalir = document.querySelector('.circulo-salir');
    const contenedorDatos = document.querySelector('.datos-monitor');

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
                mostrarDatosSesion(data);
            } else {
                window.location.href = '../html/login.html';
            }
        })
        .catch(error => {
            console.error('Error:', error);
           // window.location.href = '../html/login.html';
        });
    }

    function mostrarDatosSesion(datos) {
        const identificacionElement = document.getElementById('identificacion');
        const nombreElement = document.getElementById('nombre');

        identificacionElement.textContent = datos.identificacion || 'No disponible';
        nombreElement.textContent = datos.nombre || 'No disponible';
    }

    iconoUsuario.addEventListener('click', function() {
        window.location.href = '../html/perfilMonitor.html';
    });

    botonSalir.addEventListener('click', function() {
        window.location.href = '../html/login.html';
    });

    checkSession();
});