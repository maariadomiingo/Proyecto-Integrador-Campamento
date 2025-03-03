document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const identificacionMonitor = urlParams.get('identificacion');

    const listaCampistas = document.getElementById("listaCampistas");
    const guardarAsistenciaBtn = document.getElementById("guardarAsistencia");
    

     // Cargar la lista de campistas con asistencia registrada
     fetch("../php/pasarlista.php")
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

             const checked = campista.estado === "presente" ? "checked" : "";

             div.innerHTML = `
                 <label>
                     <a href="mostrarcampista.html?id=${campista.id}&identificacion=${identificacionMonitor}" class="campista-link">
                         ${campista.nombre}
                     </a>
                     <input type="checkbox" name="asistencia" data-id="${campista.id}" ${checked}>
                 </label>
             `;

             listaCampistas.appendChild(div);
         });
     })
     .catch(error => {
         console.error("Error:", error);
         alert("No se pudo cargar la lista de campistas");
     });
     
    guardarAsistenciaBtn.addEventListener("click", (event) => {
        event.preventDefault();
        
        const checkboxes = document.querySelectorAll('input[name="asistencia"]');
        const asistencias = Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.getAttribute("data-id"));

        fetch("../php/guardarasistencia.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ asistencias }) 
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
    if (perfilMonitor) {
        perfilMonitor.addEventListener('click', function (event) {
            event.preventDefault();
            console.log("Redirigiendo a perfil monitor con identificacion:", identificacionMonitor);
            window.location.href = `../html/perfilMonitor.html?identificacion=${encodeURIComponent(identificacionMonitor)}`;
        });
    } else {
        console.error("El botón 'Atrás' no fue encontrado en el DOM.");
    }

    
    document.querySelector(".buttonatras").addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = `interfaz_monitor.html?identificacion=${identificacionMonitor}`;
    });
});
