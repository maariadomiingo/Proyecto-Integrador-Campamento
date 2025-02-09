document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const submitButton = form.querySelector(".btn-submit");

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
    submitButton.addEventListener("click", async (event) => {
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
            alert("Debes aceptar los términos y condiciones.");
        }
  
        if (!isFormValid) return;
  
        // Recoger datos del formulario
        const formData = {
            nombre: document.getElementById("nombre").value,
            fechaNacimiento: document.getElementById("fecha-nacimiento").value,
            direccion: document.getElementById("direccion").value,
            historialMedico: document.getElementById("historial-medico").value || "",
            restricciones: document.querySelector("input[name='restricciones']:checked")?.value || "No",
            restriccionesDetalles: document.getElementById("campo-restricciones").value || "",
            necesidades: document.getElementById("necesidades").value || "",
            medicamentos: Array.from(document.querySelectorAll("input[name='medicamentos']:checked")).map(med => med.value),
            otrosMedicamentos: document.getElementById("otros-medicamentos")?.value || "",
            contactoEmergencia: {
                nombre: document.getElementById("nombre-emergencia").value,
                telefono: document.getElementById("contacto-emergencia").value
            }
        };
  
        // Enviar datos al servidor
        try {
            const response = await fetch("http://localhost/teoriaservidor/Proyecto-Integrador-Campamento/php/reserva.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });            
  
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
  
            const data = await response.json();
            console.log("Respuesta del servidor:", data);
  
            if (data.success) {
                alert("Reserva enviada con éxito");
                form.reset();
            } else {
                alert("Error al enviar la reserva: " + (data.error || "Error desconocido"));
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("Ocurrió un error al enviar el formulario");
        }
    });
  
    // Variables
const radioNo = document.getElementById("radio-no");
const radioSi = document.getElementById("radio-si");
const containerOtros = document.getElementById("container-otros");
const checkboxOtros = document.getElementById("otros");
const otrosContainer = document.getElementById("otros-container");
const agregarBtn = document.getElementById("agregar-btn");
const medicamentosAdicionales = document.getElementById("medicamentos-adicionales");
const campoRestricciones = document.getElementById("campo-restricciones");

// Mostrar campo de restricciones dietéticas
radioSi.addEventListener("change", () => {
  containerOtros.style.display = "block";
});
radioNo.addEventListener("change", () => {
  containerOtros.style.display = "none";
  campoRestricciones.value = ""; // Limpiar el campo si selecciona "No"
});

// Mostrar campo para especificar otros medicamentos
checkboxOtros.addEventListener("change", () => {
  if (checkboxOtros.checked) {
    otrosContainer.style.display = "block";
    agregarBtn.style.display = "inline-block";
  } else {
    otrosContainer.style.display = "none";
    agregarBtn.style.display = "none";
    medicamentosAdicionales.innerHTML = ""; // Limpiar medicamentos adicionales
  }
});

// Agregar nuevos campos para medicamentos adicionales
agregarBtn.addEventListener("click", () => {
  const nuevoCampo = document.createElement("input");
  nuevoCampo.type = "text";
  nuevoCampo.name = "otros-medicamentos-adicionales[]";
  nuevoCampo.placeholder = "Nombre del medicamento";
  nuevoCampo.classList.add("nuevo-medicamento");
  medicamentosAdicionales.appendChild(nuevoCampo);
});

  });