document.addEventListener("DOMContentLoaded", function () {
    // Obtener el ID de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const identificacion = urlParams.get('identificacion');

    if (!identificacion) {
        alert("No se proporcionó una identificacion.");
        return;
    }

    // Llamar al PHP con el identificador usando POST
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
        document.getElementById("mail").textContent = data.Mail;
        document.getElementById("telefono").textContent = data.telefono;
        
    })
    .catch(error => console.error("Error al obtener datos del monitor:", error));
});
