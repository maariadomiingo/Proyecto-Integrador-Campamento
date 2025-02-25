document.addEventListener("DOMContentLoaded", function () {
    // Obtener el ID de la URL
    const params = new URLSearchParams(window.location.search);
    const idCampista = params.get("id");

    if (!idCampista) {
        alert("No se proporcionó un ID de campista.");
        return;
    }

    // Llamar al PHP con el ID usando POST
    fetch("http://localhost/Proyecto-Integrador-Campamento/php/perfilMonitor.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            idCampista: idCampista 
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
});
