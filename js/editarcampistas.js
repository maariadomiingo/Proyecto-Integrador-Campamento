document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const idCampista = params.get("id");

    if (!idCampista) {
        alert("No se proporcionó un ID de campista.");
        return;
    }

    fetch("http://localhost/Proyecto-Integrador-Campamento/php/editarcampistas.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `idCampista=${encodeURIComponent(idCampista)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error("Error:", data.error);
        } else {
            document.getElementById("nombre").value = data.nombre || "";
            document.getElementById("fechaNacimiento").value = data.fechaNacimiento || "";
            document.getElementById("direccion").value = data.direccion || "";
            document.getElementById("historialMedicoRelevante").value = data.historialMedicoRelevante || "";
            document.getElementById("necesidadesEspeciales").value = data.necesidadesEspeciales || "";
            document.getElementById("nombreEmergencia").value = data.nombreEmergencia || "";
            document.getElementById("telefonoEmergencia").value = data.telefonoEmergencia || "";
        }
    })
    .catch(error => console.error("Error en la solicitud:", error));
});

function guardarCambios() {
    const idCampista = new URLSearchParams(window.location.search).get("id");
    const datos = {
        idCampista: idCampista,
        nombre: document.getElementById("nombre").value,
        fechaNacimiento: document.getElementById("fechaNacimiento").value,
        direccion: document.getElementById("direccion").value,
        historialMedicoRelevante: document.getElementById("historialMedicoRelevante").value,
        necesidadesEspeciales: document.getElementById("necesidadesEspeciales").value,
        nombreEmergencia: document.getElementById("nombreEmergencia").value,
        telefonoEmergencia: document.getElementById("telefonoEmergencia").value
    };

    fetch("http://localhost/Proyecto-Integrador-Campamento/php/guardardatos.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log("Datos actualizados correctamente.");
        } else {
            console.error("Error:", data.error);
        }
    })
    .catch(error => console.error("Error en la solicitud:", error));
}
