document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const nombrePadre = document.getElementById('nombre-padre');
    const email = document.getElementById('email');
    const telefono = document.getElementById('telefono');
    // const comentario = document.getElementById('comentario');

    const nombreError = document.getElementById('nombre-error');
    const emailError = document.getElementById('email-error');
    const telefonoError = document.getElementById('telefono-error');

    const modalConfirmacion = document.getElementById('modal-confirmacion'); // Elemento del modal

    // Funciones de validación (igual que antes)
    function validarNombre() {
        if (nombrePadre.value.trim() === '') {
            nombreError.textContent = '❌ Por favor, ingrese su nombre.';
            nombreError.style.display = 'block';
            return false;
        } else {
            nombreError.style.display = 'none';
            return true;
        }
    }

    function validarEmail() {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.value)) {
            emailError.textContent = '❌ Por favor, ingrese un email válido.';
            emailError.style.display = 'block';
            return false;
        } else {
            emailError.style.display = 'none';
            return true;
        }
    }

    function validarTelefono() {
        const telefonoPattern = /^\d{9}$/;
        if (!telefonoPattern.test(telefono.value)) {
            telefonoError.textContent = '❌ Por favor, ingrese un número de teléfono válido (9 dígitos).';
            telefonoError.style.display = 'block';
            return false;
        } else {
            telefonoError.style.display = 'none';
            return true;
        }
    }

    // Validación al cambiar de foco (blur)
    nombrePadre.addEventListener('blur', validarNombre);
    email.addEventListener('blur', validarEmail);
    telefono.addEventListener('blur', validarTelefono);

    // Validación al enviar el formulario
    form.addEventListener('submit', function (event) {
        const isNombreValid = validarNombre();
        const isEmailValid = validarEmail();
        const isTelefonoValid = validarTelefono();
        // const isComentarioValid = validarComentario();

        if (!isNombreValid || !isEmailValid || !isTelefonoValid) {
            event.preventDefault(); // Evita que el formulario se envíe si hay errores
        } else {
            event.preventDefault(); // Evita el envío real del formulario (simulación)
            modalConfirmacion.classList.add('mostrar'); // Muestra el modal

            // Opcional: Limpiar el formulario después de enviar
            form.reset();

            // Ocultar el modal después de unos segundos
            setTimeout(() => {
                modalConfirmacion.classList.remove('mostrar');
            }, 3000); // 3000 ms = 3 segundos
        }
    });
});
