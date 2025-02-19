document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.querySelector('form'); // Select the form element
    const button = document.querySelector('.primary-buttons');
    const errorDiv = document.querySelector('.error');

    // Function to display error messages
    function mostrarError(mensaje) {
        errorDiv.innerHTML += `<li style="color: red; margin: 5px 0;">${mensaje}</li>`;
    }

    // Function to clear error messages
    function ocultarError() {
        errorDiv.innerHTML = '';
    }

    // Validate fields on blur
    document.querySelectorAll('.nombre, .mail, .telefono, .identificacion').forEach(campo => {
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

    // Validate email on input
    document.querySelector('.mail').addEventListener('input', function() {
        if (!this.checkValidity()) {
            mostrarError('El correo electrónico no es válido');
        } else {
            ocultarError();
        }
    });

    // Function to validate the form
    function validarFormulario() {
        let formularioValido = true;
        ocultarError();

        // Validate name
        const nombre = document.querySelector('.nombre');
        if (nombre.value.trim() === '') {
            mostrarError('Por favor ingresa tu nombre');
            formularioValido = false;
        }

        // Validate email
        const mail = document.querySelector('.mail');
        if (mail.value.trim() === '') {
            mostrarError('Por favor ingresa tu correo electrónico');
            formularioValido = false;
        } else if (!mail.checkValidity()) {
            mostrarError('El correo electrónico no es válido');
            formularioValido = false;
        }

        // Validate phone
        const telefono = document.querySelector('.telefono');
        if (telefono.value.trim() === '') {
            mostrarError('Por favor ingresa tu teléfono');
            formularioValido = false;
        }

        // Validate identification
        const identificacion = document.querySelector('.identificacion');
        if (identificacion.value.trim() === '') {
            mostrarError('Por favor ingresa tu identificación');
            formularioValido = false;
        }

        if (formularioValido) {
            // Collect form data
            const datos = {
                nombre: nombre.value,
                mail: mail.value,
                telefono: telefono.value,
                identificacion: identificacion.value
            };

            // Convert data to JSON
            const datosJSON = JSON.stringify(datos);

            // Send data to the server
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
                    formulario.reset(); // Reset the form
                    window.location.reload(); // Optional: Reload the page
                }
            })
            .catch(error => {
                console.error('Error:', error);
                mostrarError('Error al agregar monitor: ' + error.message);
            });
        }

        return formularioValido;
    }

    // Button event listener
    button.addEventListener('click', function(e) {
        e.preventDefault();
        validarFormulario();
    });
});
