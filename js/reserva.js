document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const inputs = form.querySelectorAll("input, textarea");
  const submitButton = form.querySelector(".btn-submit");
  const checkboxOtros = document.getElementById('otros');
  const otrosContainer = document.getElementById('otros-container');
  const agregarBtn = document.getElementById('agregar-btn');
  const medicamentosAdicionales = document.getElementById('medicamentos-adicionales');
  const radioNo = document.getElementById("radio-no");
  const radioSi = document.getElementById("radio-si");
  const containerOtros = document.getElementById("container-otros");
  const campoRestricciones = document.getElementById("campo-restricciones");
  const fechaNacimiento = document.getElementById("fecha-nacimiento");

  // Función para validar un campo y mostrar mensaje de error e íconos separados
  const camposObligatorios = [
    document.getElementById("nombre"),
    fechaNacimiento,
    document.getElementById("direccion"),
    document.getElementById("terminos"),
    document.getElementById("contacto-emergencia"),
    document.getElementById("nombre-emergencia"),
  ];

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

  // Función para validar la fecha de nacimiento
  const validateFechaNacimiento = () => {
    const fechaNacimientoValue = fechaNacimiento.value.trim();
    const errorContainer = fechaNacimiento.nextElementSibling;
    const validoIcon = fechaNacimiento.parentElement.querySelector(".valido");
    const invalidoIcon = fechaNacimiento.parentElement.querySelector(".invalido");

    // Comprobar si el campo está vacío
    if (!fechaNacimientoValue) {
        fechaNacimiento.classList.add("error");
        errorContainer.textContent = "Este campo es obligatorio";
        validoIcon.style.display = "none";
        invalidoIcon.style.display = "inline-block";
        return false;
    }

    const fechaNacimientoDate = new Date(fechaNacimientoValue);
    const fechaMinima = new Date("2018-01-01");
    const fechaActual = new Date();

    // Validación de rango de fecha
    if (fechaNacimientoDate < fechaMinima || fechaNacimientoDate > fechaActual) {
        fechaNacimiento.classList.add("error");
        errorContainer.textContent = "Debe tener 6-7 años y no puede ser una fecha futura.";
        validoIcon.style.display = "none";
        invalidoIcon.style.display = "inline-block";
        return false;
    } else {
        fechaNacimiento.classList.remove("error");
        errorContainer.textContent = ""; 
        validoIcon.style.display = "inline-block";
        invalidoIcon.style.display = "none";
        return true;
    }
};

  // Validación en tiempo real (evento 'input' y 'blur') solo para los campos obligatorios
  camposObligatorios.forEach((input) => {
      // Crear contenedores de error e íconos si no existen
      if (!input.nextElementSibling || !input.nextElementSibling.classList.contains("error-message")) {
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

  // Validación en tiempo real de la fecha de nacimiento
  fechaNacimiento.addEventListener("input", validateFechaNacimiento);
  fechaNacimiento.addEventListener("blur", validateFechaNacimiento);

  // Validación al enviar el formulario
  submitButton.addEventListener("click", (event) => {
      event.preventDefault();
      let isFormValid = true;

      // Validar solo los campos obligatorios
      camposObligatorios.forEach((input) => {
          if (!validateField(input)) {
              isFormValid = false;
          }
      });

      // Validar la fecha de nacimiento
      if (!validateFechaNacimiento()) {
          isFormValid = false;
      }

      if (isFormValid) {
          alert("Formulario válido. Enviando datos...");
          form.submit();
      }
  });

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
});