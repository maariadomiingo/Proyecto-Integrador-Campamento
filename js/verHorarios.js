document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const identificacion = params.get("identificacion");

    if (!identificacion) {
        alert("No se proporcionó un ID de monitor.");
        return;
    }

    fetch(`../php/verHorarios.php?identificacion=${encodeURIComponent(identificacion)}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
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
                    <p><strong>Nombre:</strong>${actividad.actividad_nombre}</p>
                    <p><strong>Hora:</strong> ${actividad.hora_actividad}</p>
                    <p><strong>Fecha:</strong> ${actividad.fecha}</p>
                `;

                    actividadesContainer.appendChild(actividadDiv);
                });
            }
        })
        .catch(error => console.error("Error al obtener datos del monitor:", error));



    const botonAtras = document.querySelector('.buttonatras');
    if (botonAtras) {
        botonAtras.addEventListener('click', function (event) {
            event.preventDefault();
            window.location.href = `../html/interfaz_monitor.html?identificacion=${encodeURIComponent(identificacion)}`;
        });
    } else {
        console.error("El botón 'atras' no fue encontrado en el DOM.");
    }

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
    // Funcionalidad del botón de salir
    if (perfilMonitor) {
        perfilMonitor.addEventListener('click', function () {
            window.location.href = `../html/perfilMonitor.html?identificacion=${encodeURIComponent(identificacion)}`;
        });
    } else {
        console.error("El botón 'Salir' no fue encontrado en el DOM.");
    }
});
