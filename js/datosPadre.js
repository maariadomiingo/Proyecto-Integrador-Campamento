document.addEventListener("DOMContentLoaded", function() {
    const form_inserta = document.getElementById("formulario-padres");

    // Elementos del formulario
    const nombre = document.getElementById("nombre-padre");
    const relacion = document.getElementById("relacion");
    const telefono = document.getElementById("telefono");
    const email = document.getElementById("email");
    const direccion = document.getElementById("direccion-padre");  // Dirección es opcional

    // Mensajes de error
    const nombreError = document.getElementById("nameError");
    const relacionError = document.getElementById("relacionError");
    const telefonoError = document.getElementById("telefonoError");
    const emailError = document.getElementById("emailError");

    // Validación con focusout para el campo nombre
    nombre.addEventListener("focusout", function() {
        if (nombre.value.trim() === "") {
            nombreError.textContent = "Por favor, introduce un nombre";
            nombreError.classList.remove("hidden");
        } else {
            nombreError.textContent = "";
            nombreError.classList.add("hidden");
        }
    });

    // Validación con focusout para el campo relación
    relacion.addEventListener("focusout", function() {
        if (relacion.value.trim() === "") {
            relacionError.textContent = "Ingrese la relación con el participante";
            relacionError.classList.remove("hidden");
        } else {
            relacionError.textContent = "";
            relacionError.classList.add("hidden");
        }
    });

    // Validación con focusout para el campo teléfono
telefono.addEventListener("focusout", function() {
    const telefonoNumerosRegex = /^[0-9]{9}$/; // 9 dígitos numéricos
    const telefonoLetrasRegex = /[a-zA-Z]/; // Verifica si hay letras

    if (telefonoLetrasRegex.test(telefono.value)) {
        telefonoError.textContent = "No puedes introducir letras en el número telefónico";
        telefonoError.classList.remove("hidden");
    } else if (!telefonoNumerosRegex.test(telefono.value)) {
        telefonoError.textContent = "Debes introducir un número telefónico válido (9 dígitos, solo números)";
        telefonoError.classList.remove("hidden");
    } else {
        telefonoError.textContent = "";
        telefonoError.classList.add("hidden");
    }
});

    // Validación con focusout para el campo correo electrónico
    email.addEventListener("focusout", function() {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email.value)) {
            emailError.textContent = "Debes introducir un correo electrónico válido";
            emailError.classList.remove("hidden");
        } else {
            emailError.textContent = "";
            emailError.classList.add("hidden");
        }
    });

    // Si algún campo no es válido, evitar el envío del formulario
    form_inserta.addEventListener("submit", function(event) {
        let valid = true;

        // Validación final al enviar el formulario para evitar que se envíe si hay errores
        if (nombre.value.trim() === "") {
            nombreError.textContent = "Por favor, introduce un nombre";
            nombreError.classList.remove("hidden");
            valid = false;
        }

        if (relacion.value.trim() === "") {
            relacionError.textContent = "Ingrese la relación con el participante";
            relacionError.classList.remove("hidden");
            valid = false;
        }

        const telefonoRegex = /^[0-9]{9}$/;
        if (!telefonoRegex.test(telefono.value)) {
            telefonoError.textContent = "Debes introducir un número telefónico válido";
            telefonoError.classList.remove("hidden");
            valid = false;
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email.value)) {
            emailError.textContent = "Debes introducir un correo electrónico válido";
            emailError.classList.remove("hidden");
            valid = false;
        }

        // Si algún campo no es válido, evitar el envío del formulario
        if (valid) {
            event.preventDefault();  // Prevenir el envío normal del formulario

            // Crear el objeto JSON
            const formData = {
                nombre: nombre.value.trim(),
                relacion: relacion.value.trim(),
                telefono: telefono.value.trim(),
                email: email.value.trim(),
                direccion: direccion.value.trim() // Puede ser opcional
            };

            // Enviar los datos JSON a PHP usando fetch
            fetch('../php/reserva-padres.php', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData) // Convertir los datos a formato JSON
            })
            .then(response => response.json()) // Respuesta en formato JSON
            .then(data => {
                if (data.success) {
                    alert("Datos insertados correctamente");
                    form_inserta.reset();
                } else {
                    alert("Hubo un error al insertar los datos");
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Hubo un problema al enviar los datos.');
            });
        } else {
            event.preventDefault();  
        }
    });
});
