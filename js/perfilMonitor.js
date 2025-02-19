document.addEventListener('DOMContentLoaded', function() {
    // Función para verificar la sesión
    function checkSession() {
        fetch('login.php', {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            console.log('Datos de la sesión:', data);
            if (data.error) {
                console.error('Error:', data.error);
                // Si no hay sesión, redirige al login
                if (data.error === "No hay sesión iniciada") {
                    window.location.href = '../html/login.html';
                }
            }
        })
        .catch(error => {
            console.error('Error al verificar la sesión:', error);
        });
    }

    // Verificar sesión al cargar la página
    checkSession();

    // Obtener los elementos
    const btnCargarDatos = document.getElementById('cargarDatos');
    const contenedorDatos = document.getElementById('datosContainer');

    if (btnCargarDatos && contenedorDatos) {
        btnCargarDatos.addEventListener('click', function() {
            // Llamada AJAX para traer los datos
            fetch('get_data.php')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error en la respuesta');
                    }
                    return response.json();
                })
                .then(data => {
                    // Borra el contenido anterior
                    contenedorDatos.innerHTML = '';
                    
                    if (data.error) {
                        contenedorDatos.innerHTML = `<p class="error">${data.error}</p>`;
                        return;
                    }

                    // Crea la tabla
                    const table = document.createElement('table');
                    const thead = document.createElement('thead');
                    const tbody = document.createElement('tbody');

                    // Encabezados de la tabla
                    const headers = Object.keys(data[0]);
                    const headerRow = document.createElement('tr');
                    headers.forEach(header => {
                        const th = document.createElement('th');
                        th.textContent = header;
                        headerRow.appendChild(th);
                    });
                    thead.appendChild(headerRow);

                    // Filas de la tabla
                    data.forEach(row => {
                        const rowTr = document.createElement('tr');
                        headers.forEach(header => {
                            const td = document.createElement('td');
                            td.textContent = row[header];
                            rowTr.appendChild(td);
                        });
                        tbody.appendChild(rowTr);
                    });

                    table.appendChild(thead);
                    table.appendChild(tbody);
                    contenedorDatos.appendChild(table);
                })
                .catch(error => {
                    contenedorDatos.innerHTML = `<p class="error">Error al cargar los datos: ${error.message}</p>`;
                });
        });
    } else {
        console.error('Uno o más elementos no existen en el DOM');
    }
});