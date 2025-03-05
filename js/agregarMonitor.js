document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('formMonitor');
    const button = document.querySelector('.button');
    const botonSalir = document.querySelector('.circulo-salir');
    const botonAtras = document.querySelector('.buttonatras');

    function mostrarError(input, mensaje) {
        const errorDiv = document.getElementById(`error${input.id.charAt(0).toUpperCase() + input.id.slice(1)}`);
        if (errorDiv) errorDiv.textContent = mensaje;
    }

    function ocultarError(input) {
        const errorDiv = document.getElementById(`error${input.id.charAt(0).toUpperCase() + input.id.slice(1)}`);
        if (errorDiv) errorDiv.textContent = '';
    }

    function validarCampo(campo) {
        switch(campo.id) {
            case 'nombre':
                campo.value.trim() === '' ? mostrarError(campo, 'Por favor ingresa tu nombre') :
                campo.value.length < 3 ? mostrarError(campo, 'El nombre debe tener al menos 3 caracteres') :
                ocultarError(campo);
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                campo.value.trim() === '' ? mostrarError(campo, 'Por favor ingresa tu correo electrónico') :
                !emailRegex.test(campo.value) ? mostrarError(campo, 'Formato incorrecto (ejemplo@dominio.com)') :
                ocultarError(campo);
                break;
            case 'telefono':
                !/^\d{9}$/.test(campo.value) ? mostrarError(campo, 'Debe ser un número de 9 dígitos') : ocultarError(campo);
                break;
            case 'usuario':
                !/^[A-Za-z0-9]{6,15}$/.test(campo.value) ? mostrarError(campo, 'Debe tener entre 6 y 15 caracteres (letras y números)') : ocultarError(campo);
                break;
        }
    }

    const campos = document.querySelectorAll('.nombre, .mail, .telefono, .identificacion');
    campos.forEach(campo => {
        campo.addEventListener('input', () => validarCampo(campo));
        campo.addEventListener('blur', () => validarCampo(campo));
    });

    function validarFormulario() {
        let valido = true;
        campos.forEach(campo => {
            validarCampo(campo);
            if (campo.nextElementSibling && campo.nextElementSibling.textContent !== '') {
                valido = false;
            }
        });
        return valido;
    }

    function mostrarPopupExito(mensaje) {
        let popup = document.getElementById("popupExito");
        
        if (!popup) {
            popup = document.createElement("div");
            popup.id = "popupExito";
            popup.className = "popup";
            document.body.appendChild(popup);
        }
        
        popup.textContent = mensaje;
        popup.style.display = "block";
    
        setTimeout(() => {
            popup.style.display = "none";
            location.reload();
        }, 2000);
    }

    if (button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            if (validarFormulario()) {
                const datos = {
                    nombre: document.getElementById('nombre').value,
                    mail: document.getElementById('email').value,
                    telefono: document.getElementById('telefono').value,
                    identificacion: document.getElementById('usuario').value
                };
                fetch('../php/agregarMonitor.php', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(datos)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.exito) {
                        mostrarPopupExito(`Monitor ${datos.nombre} agregado con éxito`);
                        formulario.reset();
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    mostrarError(button, 'Error al agregar monitor: ' + error.message);
                });
            }
        });
    }

    if (botonSalir) botonSalir.addEventListener('click', () => window.location.href = '../html/login.html');
    if (botonAtras) botonAtras.addEventListener('click', () => window.location.href = '../html/interfaz_coordinador.html');
});
