document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const submitButton = form.querySelector(".btn-submit");
    const inputs = form.querySelectorAll("input, textarea");
    const checkboxOtros = document.getElementById('otros');
    const otrosContainer = document.getElementById('otros-container');
    const agregarBtn = document.getElementById('agregar-btn');
    const medicamentosAdicionales = document.getElementById('medicamentos-adicionales');
    const radioNo = document.getElementById("radio-no");
    const radioSi = document.getElementById("radio-si");
    const containerOtros = document.getElementById("container-otros");
    const campoRestricciones = document.getElementById("campo-restricciones");
    const fechaNacimiento = document.getElementById("fecha-nacimiento");

    // Función para desplegable de consentimiento medicamentos
    checkboxOtros.addEventListener('change', () => {
        if (checkboxOtros.checked) {
            otrosContainer.style.display = 'block';
            agregarBtn.style.display = 'inline-block';
        } else {
            otrosContainer.style.display = 'none';
            agregarBtn.style.display = 'none';
            medicamentosAdicionales.innerHTML = '';
        }
    });

    // Agregar campos adicionales para medicamentos
    agregarBtn.addEventListener('click', () => {
        const nuevoMedicamentoDiv = document.createElement('div');
        nuevoMedicamentoDiv.classList.add('medicamento-extra');

        const nuevoInput = document.createElement('input');
        nuevoInput.type = 'text';
        nuevoInput.name = 'otros-medicamentos';
        nuevoInput.placeholder = 'Nombre del medicamento adicional';

        nuevoMedicamentoDiv.appendChild(nuevoInput);
        medicamentosAdicionales.appendChild(nuevoMedicamentoDiv);
    });

    // Función restricciones dietéticas
    radioSi.addEventListener("change", function () {
        containerOtros.style.display = "block";
    });

    radioNo.addEventListener("change", function () {
        containerOtros.style.display = "none";
        campoRestricciones.value = "";
    });

    // Redirigir al inicio al hacer clic en el logo
    function redirectHome() {
        window.location.href = "home.html";
    }

    const logo = document.querySelector(".logo img");
    if (logo) {
        logo.addEventListener("click", redirectHome);
    }

    // Campos obligatorios y elementos de validación
    const camposObligatorios = [
        document.getElementById("nombre"),
        document.getElementById("fecha-nacimiento"),
        document.getElementById("direccion"),
        document.getElementById("terminos"),
        document.getElementById("contacto-emergencia"),
        document.getElementById("nombre-emergencia"),
    ];

    // Función de validación general
    const validateField = (field) => {
        const errorContainer = field.nextElementSibling;
        const validoIcon = field.parentElement.querySelector(".valido");
        const invalidoIcon = field.parentElement.querySelector(".invalido");
        const isValid = field.type === "checkbox" ? field.checked : field.value.trim() !== "";

        if (isValid) {
            field.classList.remove("error");
            errorContainer.textContent = "";
            validoIcon.style.display = "inline-block";
            invalidoIcon.style.display = "none";
        } else {
            field.classList.add("error");
            errorContainer.textContent = "Este campo es obligatorio";
            validoIcon.style.display = "none";
            invalidoIcon.style.display = "inline-block";
        }
        return isValid;
    };

    // Validación específica para fecha de nacimiento
    const validateFechaNacimiento = () => {
        const fechaNacimientoValue = document.getElementById("fecha-nacimiento").value.trim();
        const errorContainer = document.getElementById("fecha-nacimiento").nextElementSibling;
        const validoIcon = document.getElementById("fecha-nacimiento").parentElement.querySelector(".valido");
        const invalidoIcon = document.getElementById("fecha-nacimiento").parentElement.querySelector(".invalido");

        if (!fechaNacimientoValue) {
            document.getElementById("fecha-nacimiento").classList.add("error");
            errorContainer.textContent = "Este campo es obligatorio";
            validoIcon.style.display = "none";
            invalidoIcon.style.display = "inline-block";
            return false;
        }

        const fechaNacimientoDate = new Date(fechaNacimientoValue);
        const fechaActual = new Date();
        const edad = fechaActual.getFullYear() - fechaNacimientoDate.getFullYear();
        const mes = fechaActual.getMonth() - fechaNacimientoDate.getMonth();

        if (edad < 6 || (edad === 6 && mes < 0)) {
            document.getElementById("fecha-nacimiento").classList.add("error");
            errorContainer.textContent = "El participante debe tener entre 6 y 7 años.";
            validoIcon.style.display = "none";
            invalidoIcon.style.display = "inline-block";
            return false;
        }

        document.getElementById("fecha-nacimiento").classList.remove("error");
        errorContainer.textContent = "";
        validoIcon.style.display = "inline-block";
        invalidoIcon.style.display = "none";
        return true;
    };

    // Configurar validación en tiempo real
    camposObligatorios.forEach((input) => {
        if (!input) return;

        // Crear elementos de validación si no existen
        if (!input.nextElementSibling?.classList.contains("error-message")) {
            const errorContainer = document.createElement("div");
            errorContainer.className = "error-message";
            input.after(errorContainer);
        }

        if (!input.parentElement.querySelector(".valido")) {
            const validoIcon = document.createElement("span");
            validoIcon.className = "valido";
            validoIcon.innerHTML = `<img src="../img/mingcute--check-circle-line.png" alt="Válido" class="icon">`;
            validoIcon.style.display = "none";
            input.parentElement.appendChild(validoIcon);
        }

        if (!input.parentElement.querySelector(".invalido")) {
            const invalidoIcon = document.createElement("span");
            invalidoIcon.className = "invalido";
            invalidoIcon.innerHTML = `<img src="../img/mingcute--close-circle-line.png" alt="Inválido" class="icon">`;
            invalidoIcon.style.display = "none";
            input.parentElement.appendChild(invalidoIcon);
        }

        input.addEventListener("input", () => validateField(input));
        input.addEventListener("blur", () => validateField(input));
    });

    // Eventos para validación de fecha
    document.getElementById("fecha-nacimiento").addEventListener("input", validateFechaNacimiento);
    document.getElementById("fecha-nacimiento").addEventListener("blur", validateFechaNacimiento);

    // Manejo de envío del formulario
    submitButton.addEventListener("click", (event) => {
        event.preventDefault();
        let isFormValid = true;

        // Validar campos obligatorios
        camposObligatorios.forEach((input) => {
            if (!validateField(input)) isFormValid = false;
        });

        // Validación adicional de fecha
        if (!validateFechaNacimiento()) isFormValid = false;

        // Verificar términos y condiciones
        if (!document.getElementById("terminos").checked) {
            isFormValid = false;
            // alert("Debes aceptar los términos y condiciones.");
            return;
        }

        if (!isFormValid) return;

        // Recoger datos del formulario
        const formData = {
            nombre: document.getElementById("nombre").value,
            fechaNacimiento: document.getElementById("fecha-nacimiento").value,
            direccion: document.getElementById("direccion").value,
            historialMedico: document.getElementById("historial-medico")?.value || "",
            restricciones: document.querySelector('input[name="restricciones"]:checked')?.value || "No",
            restriccionesDetalles: document.getElementById("campo-restricciones")?.value || "",
            necesidades: document.getElementById("necesidades")?.value || "",
            medicamentos: Array.from(document.querySelectorAll('input[name="medicamentos"]:checked')).map(med => med.value),
            otrosMedicamentos: document.getElementById("otros-medicamentos")?.value || "",
            contactoEmergencia: {
                nombre: document.getElementById("nombre-emergencia").value,
                telefono: document.getElementById("contacto-emergencia").value
            }
        };

        console.log('Datos a enviar:', formData);

        // Enviar datos al servidor
        fetch("../php/reserva.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Respuesta del servidor:', data);
            if (data.success) {
                form.reset();
                window.location.href = '../html/datosPadre.html';
            } else {
                // alert("Error al enviar la reserva: " + (data.error || "Error desconocido"));
            }
        })
        .catch(error => {
            console.error("Error en la solicitud:", error);
            // alert("Ocurrió un error al enviar el formulario");
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const nombrePadre = document.getElementById('nombre-padre');
    const email = document.getElementById('email');
    const telefono = document.getElementById('telefono');
    // const comentario = document.getElementById('comentario');
    const terminos = document.getElementById('terminos');

    const nombreError = document.getElementById('nombre-error');
    const emailError = document.getElementById('email-error');
    const telefonoError = document.getElementById('telefono-error');
    // const comentarioError = document.getElementById('comentario-error');
    const terminosError = document.getElementById('terminos-error');

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


    function validarTerminos() {
        if (!terminos.checked) {
            terminosError.textContent = '❌ Debe aceptar los términos y condiciones.';
            terminosError.style.display = 'block';
            return false;
        } else {
            terminosError.style.display = 'none';
            return true;
        }
    }

    // Validación al enviar el formulario
    form.addEventListener('submit', function (event) {
        const isNombreValid = validarNombre();
        const isEmailValid = validarEmail();
        const isTelefonoValid = validarTelefono();
        // const isComentarioValid = validarComentario();
        const isTerminosValid = validarTerminos();

        if (!isNombreValid || !isEmailValid || !isTelefonoValid || !isTerminosValid) {
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