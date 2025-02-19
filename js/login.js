document.addEventListener("DOMContentLoaded", function () {
    console.log("DOMContentLoaded");
    var form_inserta = document.getElementById("formulario");

    // Elementos del formulario
    var rol = document.getElementById("rol");
    var identificacion = document.getElementById("identificacion");
    var contrasena = document.getElementById("password");

    // Mensajes de error
    var rolError = document.getElementById("rolError");
    var identificacionError = document.getElementById("identificacionError");
    var passwordError = document.getElementById("passwordError");

    // Función de validación para rol
    function validateRol() {
        if (rol.value.trim() === "") {
            rolError.classList.remove("hidden");
            return false;
        } else {
            rolError.classList.add("hidden");
            return true;
        }
    }

    // Función de validación para identificación
    function validateIdentificacion() {
        if (identificacion.value.trim() === "" || identificacion.value.length < 4) {
            identificacionError.classList.remove("hidden");
            return false;
        } else {
            //identificacionError.classList.add("hidden");
            return true;
        }
    }

    // Función de validación para contraseña
    function validatePassword() {
        if (contrasena.value.trim() === "" || contrasena.value.length < 6) {
            passwordError.classList.remove("hidden");
            return false;
        } else {
            passwordError.classList.add("hidden");
            return true;
        }
    }

    // Event listeners
    rol.addEventListener("focusout", validateRol);
    identificacion.addEventListener("focusout", validateIdentificacion);
    contrasena.addEventListener("focusout", validatePassword);

    // Submit del formulario
    form_inserta.addEventListener("submit", function (event) {
        event.preventDefault();

        var isRolValid = validateRol();
        var isIdentificacionValid = validateIdentificacion();
        var isPasswordValid = validatePassword();

        if (isRolValid && isIdentificacionValid && isPasswordValid) {
            insertarDatos(rol.value, identificacion.value, contrasena.value);
        }
    });

    // Función insertarDatos
    function insertarDatos(rol, identificacion, password) {
        fetch('../php/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'rol': rol,
                'identificacion': identificacion,
                'password': password
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                if (data.rol === 'monitor') {
                    window.location.href = `../html/interfaz_monitor.html?identificacion=${data.identificacion}`;
                } else if (data.rol === 'coordinador') {
                    window.location.href = `../html/interfaz_coordinador.html?identificacion=${data.identificacion}`;
                }
            } else {
                alert(data.message || 'Error al iniciar sesión');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Error al iniciar sesión. Por favor, inténtalo de nuevo.");
        });
    }
});