document.addEventListener("DOMContentLoaded", () => {
    const listaCampistas = document.getElementById("listaCampistas");
    const guardarAsistenciaBtn = document.getElementById("guardarAsistencia");
    const actividadId = 1; // Asigna el ID de la actividad actual (esto lo puedes obtener de alguna parte del código)

    // Cargar la lista de campistas
    fetch("http://localhost/Proyecto-Integrador-Campamento/php/pasarlista.php")
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al cargar los campistas");
            }
            return response.json();
        })
        .then(data => {
            listaCampistas.innerHTML = ""; 

            data.forEach(campista => {
                const div = document.createElement("div");
                div.classList.add("campista-item");

                div.innerHTML = `
                    <label>
                        <a href="mostrarcampista.html?id=${campista.id}" class="campista-link">
                            ${campista.nombre}
                        </a>
                        <input type="checkbox" name="asistencia" data-id="${campista.id}">
                    </label>
                `;

                listaCampistas.appendChild(div);
            });
        })
        .catch(error => {
            console.error("Error:", error);
            alert("No se pudo cargar la lista de campistas");
        });

    // Botón para guardar la asistencia
    guardarAsistenciaBtn.addEventListener("click", (event) => {
        event.preventDefault();
        
        const checkboxes = document.querySelectorAll('input[name="asistencia"]:checked');
        const asistencias = Array.from(checkboxes).map(checkbox => checkbox.getAttribute("data-id"));

        if (asistencias.length === 0) {
            alert("No se ha seleccionado ninguna asistencia.");
            return;
        }

        fetch("http://localhost/Proyecto-Integrador-Campamento/php/guardarasistencia.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ asistencias, actividad_id: actividadId }) // Enviar también el ID de la actividad
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Asistencia guardada correctamente");
            } else {
                alert("Error al guardar la asistencia: " + (data.error || "Desconocido"));
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("No se pudo guardar la asistencia");
        });
    });
});