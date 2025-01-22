document.addEventListener("DOMContentLoaded", function () {
    console.log("DOMContentLoadedd");
    var form_inserta = document.getElementById("formulario");

    // Elementos del formulario
    var rol = document.getElementById("rol");
    var nombre = document.getElementById("nombre");
    var contrasena = document.getElementById("password");

    // Mensajes de error
    var rolError = document.getElementById("rolError");
    var nameError = document.getElementById("nameError");
    var passwordError = document.getElementById("passwordError");

    // Función de validación para rol
    function validateRol() {
        console.log("validateRol");
        if (rol.value.trim() === "") {
            rolError.classList.remove("hidden");
            return false;
        } else {
            rolError.classList.add("hidden");
            return true;
        }
    }

    // Función de validación para nombre
    function validateNombre() {
        console.log("validateNombre");
        if (nombre.value.trim() === "" || nombre.value.length < 4) {
            nameError.classList.remove("hidden");
            return false;
        } else {
            nameError.classList.add("hidden");
            return true;
        }
    }

    // Función de validación para la contraseña
    function validatePassword() {
        console.log("validatePassword");
        if (contrasena.value.trim() === "" || contrasena.value.length < 6) {
            passwordError.classList.remove("hidden");
            return false;
        } else {
            passwordError.classList.add("hidden");
            return true;
        }
    }

    // Event listeners para validación en tiempo real con focusout
    rol.addEventListener("focusout", validateRol);
    nombre.addEventListener("focusout", validateNombre);
    contrasena.addEventListener("focusout", validatePassword);

    // Validación final del formulario al enviarlo
    form_inserta.addEventListener("submit", function (event) {
        event.preventDefault();

        // Ejecuta las validaciones
        var isRolValid = validateRol();
        var isNombreValid = validateNombre();
        var isPasswordValid = validatePassword();
        console.log(isRolValid, isNombreValid, isPasswordValid);

        // Si todos los campos son válidos, enviar los datos con fetch
        if (isRolValid && isNombreValid && isPasswordValid) {
            console.log("Enviando datos...");
            insertarDatos(rol.value, nombre.value, contrasena.value); // Envía los datos usando fetch
        } else {
            console.log("El formulario no pasó las validaciones.");
        }
    });

    function insertarDatos(rol, nombre, contrasena) {
        let formData = new FormData();
        formData.append("funcion", "insertaUsuario");
        formData.append("rol", rol);
        formData.append("nombre", nombre);
        formData.append("password", contrasena);

        let data = {
            "funcion": "insertaUsuario",
            "rol": rol,
            "nombre": nombre,
            "password": contrasena
        }
    
        console.log(formData);  
    
        fetch("../php/login.php", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(function(response) {
            if (!response.ok) {
                throw new Error("Error en la solicitud: " + response.statusText);
            }
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            if (data.status === "success") {
              //  alert("Usuario insertado correctamente");
                
                // Redirigir según el rol del usuario
                if (rol.toLowerCase() === "coordinador") {
                    window.location.href = "../html/interfaz_coordinador.html";
                } else if (rol.toLowerCase() === "monitor") {
                    window.location.href = "../html/interfaz_monitor.html";
                } else {
                    alert("Rol desconocido. No se puede redirigir.");
                }
            } else {
                alert("Error al insertar el usuario: " + data.message);
            }
        })
        .catch(function(error) {
            console.error("Error en la solicitud:", error);
            alert("Error en la solicitud. Consulta la consola para más detalles.");
        });
    }
    
});
