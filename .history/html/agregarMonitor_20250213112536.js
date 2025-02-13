// Función para validar el formulario
function validarFormulario() {
    // Obtener todos los campos
    const nombre = document.querySelector('.nombre');
    const apellido = document.querySelector('.apellido');
    const mail = document.querySelector('.mail');
    const telefono = document.querySelector('.telefono');
    const identificacion = document.querySelector('.identificacion');

    // Validar que todos los campos estén llenos
    if (nombre.value.trim() === '') {
        alert('Por favor ingresa tu nombre');
        return false;
    }

    if (apellido.value.trim() === '') {
        alert('Por favor ingresa tu apellido');
        return false;
    }

    if (mail.value.trim() === '') {
        alert('Por favor ingresa tu correo electrónico');
        return false;
    }

    if (telefono.value.trim() === '') {
        alert('Por favor ingresa tu teléfono');
        return false;
    }

    if (identificacion.value.trim() === '') {
        alert('Por favor ingresa tu identificación');
        return false;
    }

    if (!mail.checkValidity()) {
        alert('Por favor ingresa un correo electrónico válido');
        return false;
    }

    // Si todos los campos están llenos, crear el JSON
    const datos = {
        nombre: nombre.value,
        apellido: apellido.value,
        mail: mail.value,
        telefono: telefono.value,
        identificacion: identificacion.value
    };

    // Convertir el objeto a JSON
    const datosJSON = JSON.stringify(datos);

    // Aquí puedes enviar el JSON al servidor PHP
    // Usando fetch como ejemplo
    fetch('../php/aguilar.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: datosJSON
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));

    return true;
}

// Evento del botón
document.querySelector('.primary-buttons').addEventListener('click', function(e) {
    e.preventDefault();
    validarFormulario();
});

// Validar campos al salir de ellos
document.querySelectorAll('.nombre, .apellido, .mail, .telefono, .identificacion').forEach(campo => {
    campo.addEventListener('blur', function() {
        if (this.value.trim() === '') {
            alert(`Por favor ingresa tu ${this.placeholder}`);
        }
    });
});

// Validar email al escribir
document.querySelector('.mail').addEventListener('input', function() {
    if (!this.checkValidity()) {
        alert('El correo electrónico no es válido');
    }
});