document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.querySelector('.main-container');
    const button = document.querySelector('.primary-buttons');
    const errorDiv = document.querySelector('.error');

    // Función para mostrar mensaje de error
    function mostrarError(mensaje) {
        errorDiv.innerHTML += `<li style="color: red; margin: 5px 0;">${mensaje}</li>`;
    }

    // Función para ocultar mensaje de error
    function ocultarError() {
        errorDiv.innerHTML = '';
    }

    // Validar campos al salir de ellos
    document.querySelectorAll('.nombre, .apellido, .mail, .telefono, .identificacion').forEach(campo => {
        campo.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                mostrarError(`Por favor ingresa tu ${this.placeholder}`);
            }
        });

        campo.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                ocultarError();
            }
        });
    });

    // Validar email al escribir
    document.querySelector('.mail').addEventListener('input', function() {
        if (!this.checkValidity()) {
            mostrarError('El correo electrónico no es válido');
        } else {
            ocultarError();
        }
    });

    // Función para validar el formulario
    function validarFormulario() {
        let formularioValido = true;
        ocultarError();

        // Validar nombre
        const nombre = document.querySelector('.nombre');
        if (nombre.value.trim() === '') {
            mostrarError('Por favor ingresa tu nombre');
            formularioValido = false;
        }

        // Validar apellido
        const apellido = document.querySelector('.apellido');
        if (apellido.value.trim() === '') {
            mostrarError('Por favor ingresa tu apellido');
            formularioValido = false;
        }

        // Validar mail
        const mail = document.querySelector('.mail');
        if (mail.value.trim() === '') {
            mostrarError('Por favor ingresa tu correo electrónico');
            formularioValido = false;
        } else if (!mail.checkValidity()) {
            mostrarError('El correo electrónico no es válido');
            formularioValido = false;
        }

        // Validar telefono
        const telefono = document.querySelector('.telefono');
        if (telefono.value.trim() === '') {
            mostrarError('Por favor ingresa tu teléfono');
            formularioValido = false;
        }

        // Validar identificacion
        const identificacion = document.querySelector('.identificacion');
        if (identificacion.value.trim() === '') {
            mostrarError('Por favor ingresa tu identificación');
            formularioValido = false;
        }

        if (formularioValido) {
            // Recoger datos del formulario
            const datos = {
                nombre: nombre.value,
                apellido: apellido.value,
                mail: mail.value,
                telefono: telefono.value,
                identificacion: identificacion.value
            };

            // Convertir el objeto a JSON
            const datosJSON = JSON.stringify(datos);

            // Enviar los datos al servidor
            fetch('../php/aguilar.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: datosJSON
            })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));

            // Limpiar el formulario
            formulario.reset();
        }

        return formularioValido;
    }

    // Evento del botón
    button.addEventListener('click', function(e) {
        e.preventDefault();
        validarFormulario();
    });
});