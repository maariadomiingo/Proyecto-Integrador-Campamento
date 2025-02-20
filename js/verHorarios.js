document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const identificacion = params.get("identificacion_monitor");

    if (!identificacion) {
        alert("No se proporcionó un ID de monitor.");
        return;
    }

    fetch("../php/verHorarios.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({ identificacion: identificacion })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
            return;
        }

        const actividadesContainer = document.getElementById('datos');
        actividadesContainer.innerHTML = ""; 

        if (data.actividades.length === 0) {
            actividadesContainer.innerHTML = "<p>No tiene actividades asignadas.</p>";
        } else {
            data.actividades.forEach((actividad, index) => {
                const actividadDiv = document.createElement("div");
                actividadDiv.classList.add("actividad");
                actividadDiv.classList.add(index % 2 === 0 ? "color1" : "color2"); // Alternar colores

                actividadDiv.innerHTML = `
                    <span><strong>Actividad:</strong> ${actividad.nombre}</span>
                    <span><strong>Fecha:</strong> ${actividad.fecha}</span>
                    <span><strong>Hora:</strong> ${actividad.hora}</span>
                `;

                actividadesContainer.appendChild(actividadDiv);
            });
        }
    })
    .catch(error => console.error("Error al obtener datos del monitor:", error));
});
