document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('formMonitor');
    const button = document.querySelector('.button');

    // Función para mostrar mensajes de error
    function mostrarError(input, mensaje) {
        const errorDiv = document.getElementById(`error${input.id.charAt(0).toUpperCase() + input.id.slice(1)}`);
        errorDiv.textContent = mensaje;
    }

    // Función para limpiar mensajes de error
    function ocultarError(input) {
        const errorDiv = document.getElementById(`error${input.id.charAt(0).toUpperCase() + input.id.slice(1)}`);
        if (errorDiv) {
            errorDiv.textContent = '';
        }
    }

    // Función para mostrar mensaje de éxito
    function mostrarExito(mensaje) {
        const exitoDiv = document.getElementById('mensajeExito');
        exitoDiv.textContent = mensaje;
        exitoDiv.style.display = 'block';
        setTimeout(() => {
            exitoDiv.style.display = 'none';
        }, 3000);
    }

    // Validación individual de campos
    const campos = document.querySelectorAll('.nombre, .mail, .telefono, .identificacion');
    campos.forEach(campo => {
        campo.addEventListener('blur', function() {
            ocultarError(this);
            if (this.value.trim() === '') {
                mostrarError(this, `Por favor ingresa tu ${this.placeholder}`);
            } else {
                if (!this.checkValidity()) {
                    mostrarError(this, `El formato del campo ${this.placeholder} es inválido`);
                }
            }
        });

        campo.addEventListener('input', function() {
            ocultarError(this);
        });
    });

    // Validación específica del email
    document.querySelector('.mail').addEventListener('input', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.value)) {
            mostrarError(this, 'El correo electrónico debe tener formato ejemplo@dominio.com');
        }
    });

    // Validación del formulario completo
    function validarFormulario() {
        let formularioValido = true;

        // Validar nombre
        const nombre = document.getElementById('nombre');
        if (nombre.value.trim() === '') {
            mostrarError(nombre, 'Por favor ingresa tu nombre');
            formularioValido = false;
        } else if (nombre.value.length < 3) {
            mostrarError(nombre, 'El nombre debe tener al menos 3 caracteres');
            formularioValido = false;
        }

        // Validar email
        const email = document.getElementById('email');
        if (email.value.trim() === '') {
            mostrarError(email, 'Por favor ingresa tu correo electrónico');
            formularioValido = false;
        } else if (!email.checkValidity()) {
            mostrarError(email, 'El correo electrónico no es válido');
            formularioValido = false;
        }

        // Validar teléfono
        const telefono = document.getElementById('telefono');
        if (telefono.value.trim() === '') {
            mostrarError(telefono, 'Por favor ingresa tu teléfono');
            formularioValido = false;
        } else if (!/^\d{9}$/.test(telefono.value)) {
            mostrarError(telefono, 'El teléfono debe ser un número de 9 dígitos');
            formularioValido = false;
        }

        // Validar usuario
        const usuario = document.getElementById('usuario');
        if (usuario.value.trim() === '') {
            mostrarError(usuario, 'Por favor ingresa tu usuario');
            formularioValido = false;
        } else if (!/^[A-Za-z0-9]{6,15}$/.test(usuario.value)) {
            mostrarError(usuario, 'El usuario debe tener entre 6 y 15 caracteres y solo puede contener letras y números');
            formularioValido = false;
        }

        if (formularioValido) {
            const datos = {
                nombre: nombre.value,
                mail: email.value,
                telefono: telefono.value,
                identificacion: usuario.value
            };

            const datosJSON = JSON.stringify(datos);

            fetch('../php/agregarMonitor.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: datosJSON
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                if (data.exito) {
                    mostrarExito(`Monitor ${nombre.value} agregado con éxito`);
                    formulario.reset();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                mostrarError(document.querySelector('.button'), 'Error al agregar monitor: ' + error.message);
            });
        }

        return formularioValido;
    }

    // Event listener para el botón de submit
    if (button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            validarFormulario();
        });
    }
});