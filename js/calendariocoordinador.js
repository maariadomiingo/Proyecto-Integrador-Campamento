let actividadId = null;

// Cargar actividades del mes
function cargarActividades() {
  fetch('horario.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action: 'get_actividades' })
  })
  .then(response => response.json())
  .then(data => mostrarCalendario(data))
  .catch(error => console.error('Error:', error));
}

// Mostrar las actividades en el calendario
function mostrarCalendario(actividades) {
  const calendario = document.getElementById("calendario");
  calendario.innerHTML = '';

  actividades.forEach(actividad => {
    let dia = new Date(actividad.fecha);
    let actividadElemento = document.createElement("div");
    actividadElemento.classList.add("dia");
    actividadElemento.innerHTML = `
      <strong>${dia.toLocaleDateString()}</strong>
      <br>
      <span>${actividad.hora}</span>
      <br>
      <span>${actividad.descripcion}</span>
      <br>
      <button onclick="editarActividad(${actividad.id})">Editar</button>
      <button onclick="borrarActividad(${actividad.id})">Borrar</button>
    `;
    calendario.appendChild(actividadElemento);
  });
}

// Abrir el popup para añadir nueva actividad
function openPopup() {
  actividadId = null;  // Resetear ID para nuevas actividades
  document.getElementById("popup").style.display = "block";
  document.getElementById("form-actividad").reset();
}

// Cerrar el popup
function closePopup() {
  document.getElementById("popup").style.display = "none";
}

// Guardar la actividad (añadir o editar)
function guardarActividad(event) {
  event.preventDefault();

  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;
  const descripcion = document.getElementById("descripcion").value;

  const data = {
    action: actividadId ? 'editar_actividad' : 'agregar_actividad',
    id: actividadId,
    fecha: fecha,
    hora: hora,
    descripcion: descripcion
  };

  fetch('horario.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    cargarActividades();
    closePopup();
  })
  .catch(error => console.error('Error:', error));
}

// Editar actividad
function editarActividad(id) {
  actividadId = id;

  fetch('horario.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action: 'get_actividad', id: id })
  })
  .then(response => response.json())
  .then(data => {
    if (data) {
      document.getElementById("fecha").value = data.fecha;
      document.getElementById("hora").value = data.hora;
      document.getElementById("descripcion").value = data.descripcion;
      openPopup();
    }
  })
  .catch(error => console.error('Error:', error));
}

// Borrar actividad
function borrarActividad(id) {
  const confirmacion = confirm('¿Estás seguro de que deseas borrar esta actividad?');
  if (confirmacion) {
    fetch('horario.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'borrar_actividad', id: id })
    })
    .then(response => response.json())
    .then(data => cargarActividades())
    .catch(error => console.error('Error:', error));
  }
}

// Cargar actividades al iniciar
window.onload = cargarActividades;