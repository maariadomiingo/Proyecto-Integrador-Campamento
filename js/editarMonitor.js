document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const identificacion = params.get("identificacion");

    if (!identificacion) {
        alert("No se proporcionó una identificacion.");
        return;
    }

    fetch("../php/editarMonitor.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `identificacion=${encodeURIComponent(identificacion)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error("Error:", data.error);
        } else {
            document.getElementById("nombre").value = data.nombre || "";
            document.getElementById("identificacion").value = data.identificacion || "";
            document.getElementById("mail").value = data.mail || "";
            document.getElementById("telefono").value = data.telefono || "";
        }
    })
    .catch(error => console.error("Error en la solicitud:", error));
});

function guardarCambios() {
    const idCampista = new URLSearchParams(window.location.search).get("id");
    const datos = {
        nombre: document.getElementById("nombre").value,
        identificacion: document.getElementById("identificacion").value,
        mail: document.getElementById("mail").value,
        telefono: document.getElementById("telefono").value
    };

    fetch("../php/guardardatosMonitor.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Datos actualizados correctamente.");
        } else {
            console.error("Error:", data.error);
        }
    })
    .catch(error => console.error("Error en la solicitud:", error));
}
