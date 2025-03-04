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
            nombreError.textContent = "❌ Por favor, introduce un nombre";
            nombreError.classList.remove("hidden");
        } else {
            nombreError.textContent = "";
            nombreError.classList.add("hidden");
        }
    });

    // Validación con focusout para el campo relación
    relacion.addEventListener("focusout", function() {
        if (relacion.value.trim() === "") {
            relacionError.textContent = "❌ Ingrese la relación con el participante";
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
        telefonoError.textContent = "❌ No puedes introducir letras en el número telefónico";
        telefonoError.classList.remove("hidden");
    } else if (!telefonoNumerosRegex.test(telefono.value)) {
        telefonoError.textContent = "❌ Debes introducir un número telefónico válido (9 dígitos, solo números)";
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
            emailError.textContent = "❌ Debes introducir un correo electrónico válido";
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
            nombreError.textContent = "❌ Por favor, introduce un nombre";
            nombreError.classList.remove("hidden");
            valid = false;
        }

        if (relacion.value.trim() === "") {
            relacionError.textContent = "❌ Ingrese la relación con el participante";
            relacionError.classList.remove("hidden");
            valid = false;
        }

        const telefonoRegex = /^[0-9]{9}$/;
        if (!telefonoRegex.test(telefono.value)) {
            telefonoError.textContent = "❌ Debes introducir un número telefónico válido";
            telefonoError.classList.remove("hidden");
            valid = false;
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email.value)) {
            emailError.textContent = "❌ Debes introducir un correo electrónico válido";
            emailError.classList.remove("hidden");
            valid = false;
        }

        event.preventDefault(); 

        console.log(valid);
        if (valid) {
            insertarDatos(nombre, relacion, telefono, email, direccion);
        } 
    });
    
    function insertarDatos(nombre, relacion, telefono, email, direccion) {
        const datosFormulario = {
            funcion: "datosPadre",
            nombre: nombre.value,
            relacion: relacion.value,
            telefono: telefono.value,
            email: email.value,
            direccion: direccion.value
        };
    console.log("datos a enviar", datosFormulario);

        fetch("../php/reserva-padres.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body:   JSON.stringify(datosFormulario)
        })
        .then(function(response) {
            if (!response.ok) {
                throw new Error("Error en la solicitud: " + response.statusText);
            }
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            if (data.success) {
                window.location.href = `../html/inscrito.html`;
            } else {
                alert("Ha fallado: " + data.message);
            }
        })
        .catch(function(error) {
            console.error("Error en la solicitud:", error);
            // alert("Error en la solicitud. Consulta la consola para más detalles.");
        });
    }
});
