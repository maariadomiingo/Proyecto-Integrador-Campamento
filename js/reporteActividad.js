document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formActividad");
    const actividadSelect = document.getElementById("actividad");
    const descripcionInput = document.getElementById("descripcion");
    
    // Cargar actividades dinámicamente desde PHP
    fetch("../php/reporteActividad.php")
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error("Error al obtener actividades:", data.error);
                return;
            }
            data.actividades.forEach(actividad => {
                const option = document.createElement("option");
                option.value = actividad.id_actividad;
                option.textContent = actividad.nombre;
                actividadSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Error en la petición:", error));

    // Manejar el envío del formulario
    form.addEventListener("submit", (event) => {
        event.preventDefault(); 
        
        const actividad = actividadSelect.value;
        const descripcion = descripcionInput.value.trim();
        
        if (!actividad || !descripcion) {
            alert("Por favor, completa todos los campos.");
            return;
        }
        
        const formData = new FormData();
        formData.append("actividad", actividad);
        formData.append("descripcion", descripcion);
        
        fetch("../php/reporteActividad.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Reporte enviado con éxito.");
                form.reset();
            } else {
                alert("Error al enviar el reporte: " + data.error);
            }
        })
        .catch(error => console.error("Error en la petición:", error));
    });

    // Botón de cancelar
    document.querySelector(".cancelar-btn").addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = "verActividades.html";
    });
});




/* function fillSelect(selectElement, data, valueKey, textKey) {
    selectElement.innerHTML = `<option value="">${selectElement.name}</option>`; // Resetear opciones
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item[valueKey];
        option.textContent = item[textKey];
        selectElement.appendChild(option);
    });
} */