document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const inputs = form.querySelectorAll("input, textarea");
    const submitButton = form.querySelector(".btn-submit");

    // Función para validar un campo y mostrar mensaje de error e íconos separados
    const validateField = (field) => {
        const errorContainer = field.nextElementSibling;
        const validoIcon = field.parentElement.querySelector(".valido");
        const invalidoIcon = field.parentElement.querySelector(".invalido");
        const isValid = field.type === "checkbox" ? field.checked : field.value.trim() !== "";

        if (isValid) {
            field.classList.remove("error");
            errorContainer.textContent = ""; // Limpiar mensaje de error

            // Mostrar ícono de válido y ocultar el de inválido
            validoIcon.style.display = "inline-block";
            invalidoIcon.style.display = "none";
        } else {
            field.classList.add("error");
            errorContainer.textContent = "Este campo es obligatorio";

            // Mostrar ícono de inválido y ocultar el de válido
            validoIcon.style.display = "none";
            invalidoIcon.style.display = "inline-block";
        }

        return isValid;
    };

    // Validación en tiempo real (evento 'input' y 'blur')
    inputs.forEach((input) => {
        // Crear contenedores de error e íconos si no existen
        if (!input.nextElementSibling || !input.nextElementSibling.classList.contains("error-message")) {
            const errorContainer = document.createElement("div");
            errorContainer.className = "error-message";
            input.after(errorContainer);
        }
        if (!input.parentElement.querySelector(".valido")) {
            const validoIcon = document.createElement("span");
            validoIcon.className = "valido";
            validoIcon.innerHTML = `../img/<img src="mingcute--check-circle-line.png" alt="Válido" class="icon">`;
            validoIcon.style.display = "none"; // Ocultar inicialmente
            input.parentElement.appendChild(validoIcon);
        }
        if (!input.parentElement.querySelector(".invalido")) {
            const invalidoIcon = document.createElement("span");
            invalidoIcon.className = "invalido";
            invalidoIcon.innerHTML = `<img src="mingcute--close-circle-line.png" alt="Inválido" class="icon">`;
            invalidoIcon.style.display = "none"; // Ocultar inicialmente
            input.parentElement.appendChild(invalidoIcon);
        }

        input.addEventListener("input", () => validateField(input));
        input.addEventListener("blur", () => validateField(input));
    });

    // Validación al enviar el formulario
    submitButton.addEventListener("click", (event) => {
        event.preventDefault();
        let isFormValid = true;

        inputs.forEach((input) => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            alert("Formulario válido. Enviando datos...");
            form.submit();
        }
    });
});
