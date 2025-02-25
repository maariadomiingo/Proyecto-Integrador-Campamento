document.addEventListener("DOMContentLoaded", function () {
    // Obtener el ID de la URL
    const params = new URLSearchParams(window.location.search);
    const identificacion = params.get("identificacion");

    if (!identificacion) {
        alert("No se proporcionó una identificacion.");
        return;
    }

    // Llamar al PHP con el ID usando POST
    fetch("../php/perfilMonitor.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            identificacion: identificacion 
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
        document.getElementById("identificacion").textContent = data.identificacion;
        document.getElementById("mail").textContent = data.mail;
        document.getElementById("historialMedicoRelevante").textContent = data.historialMedicoRelevante;
        document.getElementById("necesidadesEspeciales").textContent = data.necesidadesEspeciales;
        document.getElementById("nombreEmergencia").textContent = data.nombreEmergencia;
        document.getElementById("telefonoEmergencia").textContent = data.telefonoEmergencia;
    })
    .catch(error => console.error("Error al obtener datos del campista:", error));
});
