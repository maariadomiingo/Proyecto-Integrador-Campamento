document.addEventListener("DOMContentLoaded", function () {
    const pathSegments = window.location.pathname.split('/');
    const identificacion = pathSegments[pathSegments.length - 1];

    if (!identificacion) {
        alert("No se proporcionó una identificación.");
        return;
    }

    fetch("../php/perfilMonitor.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ identificacion: identificacion })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
            return;
        }

        // Corregir "Mail" a "mail":
        document.getElementById("nombre").textContent = data.nombre || "No disponible";
        document.getElementById("identificacion").textContent = data.identificacion || "No disponible";
        document.getElementById("mail").textContent = data.mail || "No disponible"; // ✅
        document.getElementById("telefono").textContent = data.telefono || "No disponible";
    })
    .catch(error => console.error("Error al obtener datos del monitor:", error));
});