document.addEventListener("DOMContentLoaded", function () {
    // Obtener el ID de la URL
    const params = new URLSearchParams(window.location.search);
    const idCampista = params.get("id");
    const identificacionMonitor = params.get('identificacion');

    if (!idCampista) {
        alert("No se proporcionó un ID de campista.");
        return;
    }

    if (!identificacionMonitor) {
        alert("No se proporcionó la identificación del monitor.");
        return;
    }

    // Llamar al PHP con el ID usando POST
    fetch("../php/mostrarcampista.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            idCampista: idCampista,
            identificacionMonitor: identificacionMonitor
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
            return;
        }

        // Rellenar los datos en la página
        document.getElementById("nombre").textContent = data.nombre;
        document.getElementById("fechaNacimiento").textContent = data.fechaNacimiento;
        document.getElementById("direccion").textContent = data.direccion;
        document.getElementById("historialMedicoRelevante").textContent = data.historialMedicoRelevante;
        document.getElementById("necesidadesEspeciales").textContent = data.necesidadesEspeciales;
        document.getElementById("nombreEmergencia").textContent = data.nombreEmergencia;
        document.getElementById("telefonoEmergencia").textContent = data.telefonoEmergencia;
    })
    .catch(error => console.error("Error al obtener datos del campista:", error));

    // Funcionalidad para el botón "Atrás"
    document.querySelector(".button").addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = `pasarlista.html?identificacion=${encodeURIComponent(identificacionMonitor)}`;
    });

    const botonSalir = document.querySelector('.circulo-salir');

    // Funcionalidad del botón de salir
    if (botonSalir) {
        botonSalir.addEventListener('click', function () {
            window.location.href = '../html/login.html';
        });
    } else {
        console.error("El botón 'Salir' no fue encontrado en el DOM.");
    }

    const perfilMonitor = document.querySelector('.circulo');
    if (perfilMonitor) {
        perfilMonitor.addEventListener('click', function (event) {
            event.preventDefault();
            console.log("Redirigiendo a perfil monitor con identificacion:", identificacionMonitor);
            window.location.href = `../html/perfilMonitor.html?identificacion=${encodeURIComponent(identificacionMonitor)}`;
        });
    } else {
        console.error("El botón 'Perfil' no fue encontrado en el DOM.");
    }
});